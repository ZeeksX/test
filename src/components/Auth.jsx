import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Safely load initial state from localStorage
  const getInitialAuthState = () => {
    try {
      const token = localStorage.getItem("access_token");
      const userStr = localStorage.getItem("user");
      return {
        token: token || null,
        user: userStr ? JSON.parse(userStr) : null,
        isAuthenticated: Boolean(token && userStr),
      };
    } catch (e) {
      console.error("Error loading initial auth state", e);
      return { token: null, user: null, isAuthenticated: false };
    }
  };

  // Initialize states with values from localStorage to prevent flashing of unauthenticated state
  const initialState = getInitialAuthState();
  const [isAuthenticated, setIsAuthenticated] = useState(
    initialState.isAuthenticated
  );
  const [user, setUser] = useState(initialState.user);
  const [isLoading, setIsLoading] = useState(true);
  const hasRedirected = useRef(false);
  const refreshTimerRef = useRef(null);

  // Function to decode JWT token and extract data
  const decodeToken = (token) => {
    if (!token) return null;
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error("Error decoding token", error);
      return null;
    }
  };

  // Check if token is expired
  const isTokenExpired = (token) => {
    const decodedToken = decodeToken(token);
    if (!decodedToken) return true;

    const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();

    return currentTime >= expiryTime;
  };

  // Function to refresh the access token
  const refreshToken = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) return false;

    try {
      const res = await fetch(
        "https://backend-acad-ai.onrender.com/users/token/refresh/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refresh_token }),
        }
      );

      if (!res.ok) {
        console.error("Token refresh failed with status:", res.status);

        // If refresh token is also expired, logout user
        if (res.status === 401) {
          logout(true);
          return false;
        }
        return false;
      }

      const data = await res.json();

      // Update tokens in localStorage
      localStorage.setItem("access_token", data.access);
      if (data.refresh) {
        localStorage.setItem("refresh_token", data.refresh);
      }

      // Schedule the next token refresh
      scheduleTokenRefresh(data.access);

      return true;
    } catch (err) {
      console.error("Token refresh error:", err);
      return false;
    }
  };

  // Schedule token refresh before it expires
  const scheduleTokenRefresh = (token) => {
    if (!token) return;

    // Clear existing timer if any
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    try {
      const decodedToken = decodeToken(token);
      if (!decodedToken || !decodedToken.exp) return;

      const expiresAt = decodedToken.exp * 1000; // in milliseconds
      const now = Date.now();

      // Refresh 5 minutes before expiry or immediately if less than 5 minutes left
      const timeUntilRefresh = Math.max(0, expiresAt - now - 5 * 60 * 1000);

      refreshTimerRef.current = setTimeout(async () => {
        const success = await refreshToken();
        if (success) {
          console.log("Scheduled token refresh succeeded");
        } else {
          console.error("Scheduled token refresh failed - logging out user");
          logout(true);
        }
      }, timeUntilRefresh);
    } catch (e) {
      console.error("Error scheduling token refresh:", e);
    }
  };

  // Initialize auth on mount and handle page refreshes
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      try {
        const accessToken = localStorage.getItem("access_token");
        const refreshTokenValue = localStorage.getItem("refresh_token");
        const userStr = localStorage.getItem("user");

        let userObj = null;
        try {
          userObj = userStr ? JSON.parse(userStr) : null;
        } catch (e) {
          console.error("Error parsing user data:", e);
          // Clear corrupted user data
          localStorage.removeItem("user");
        }

        // Check if we have both token and user data
        if (accessToken && userObj) {
          // Check if token is expired
          if (!isTokenExpired(accessToken)) {
            setIsAuthenticated(true);
            setUser(userObj);
            scheduleTokenRefresh(accessToken);
          } else if (refreshTokenValue) {
            const refreshed = await refreshToken();
            if (refreshed) {
              setIsAuthenticated(true);
              setUser(userObj);
            } else {
              setIsAuthenticated(false);
              setUser(null);
              // Clear tokens if refresh failed
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              localStorage.removeItem("user");
            }
          } else {
            setIsAuthenticated(false);
            setUser(null);
            // Clear tokens if no refresh token
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
          }
        } else if (refreshTokenValue && userObj) {
          const refreshed = await refreshToken();
          if (refreshed) {
            setIsAuthenticated(true);
            setUser(userObj);
          } else {
            setIsAuthenticated(false);
            setUser(null);
            // Clear all auth data
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          // Clear any remaining auth data
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
        setIsAuthenticated(false);
        setUser(null);
        // Clear auth data on error
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    // Run auth initialization
    initAuth();

    // Cleanup function when component unmounts
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []); // Empty dependencies array = run once on mount

  const login = (userData) => {
    if (!userData) {
      console.error("Cannot login with undefined user data");
      return;
    }

    try {
      // Ensure we have the required tokens
      if (!userData.access || !userData.refresh) {
        console.error("Missing required tokens in user data");
        return;
      }

      // Store user data and tokens
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("access_token", userData.access);
      localStorage.setItem("refresh_token", userData.refresh);

      setUser(userData);
      setIsAuthenticated(true);
      scheduleTokenRefresh(userData.access);
      hasRedirected.current = false;

      console.log("User logged in successfully:", userData.email);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = (redirect = true) => {
    try {
      // Clear all auth-related data from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Clear any stored toast messages
      localStorage.removeItem("toastMessage");

      setUser(null);
      setIsAuthenticated(false);

      // Clear refresh timer
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }

      console.log("User logged out successfully");

      // Redirect to login page if requested and not already redirected
      if (redirect && !hasRedirected.current) {
        hasRedirected.current = true;
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Function to update user data (useful for profile updates)
  const updateUser = (updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      localStorage.setItem("user", JSON.stringify(newUserData));
      setUser(newUserData);
      console.log("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Check if user is a specific type (student/teacher)
  const isStudent = () => hasRole("student");
  const isTeacher = () => hasRole("teacher");

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        user,
        refreshToken,
        updateUser,
        hasRole,
        isStudent,
        isTeacher,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
