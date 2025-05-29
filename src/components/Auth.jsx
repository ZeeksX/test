import React, { createContext, useContext, useState, useEffect, useRef } from "react";

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
        isAuthenticated: Boolean(token && userStr)
      };
    } catch (e) {
      console.error("Error loading initial auth state", e);
      return { token: null, user: null, isAuthenticated: false };
    }
  };

  // Initialize states with values from localStorage to prevent flashing of unauthenticated state
  const initialState = getInitialAuthState();
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
  const [user, setUser] = useState(initialState.user);
  const [isLoading, setIsLoading] = useState(true);
  const hasRedirected = useRef(false);
  const refreshTimerRef = useRef(null);

  // Function to decode JWT token and extract data
  const decodeToken = (token) => {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
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
      const timeUntilRefresh = Math.max(0, expiresAt - now - (5 * 60 * 1000));

      refreshTimerRef.current = setTimeout(() => {
        refreshToken().then(success => {
          if (success) {
            console.log("Scheduled token refresh succeeded");
          } else {
            console.error("Scheduled token refresh failed");
          }
        });
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
              // Don't clear localStorage here
            }
          } else {
            setIsAuthenticated(false);
            // Don't clear localStorage here
          }
        } else if (refreshTokenValue && userObj) {
          const refreshed = await refreshToken();
          if (refreshed) {
            setIsAuthenticated(true);
            setUser(userObj);
          } else {
            setIsAuthenticated(false);
            // Don't clear localStorage here
          }
        } else {
          setIsAuthenticated(false);
          // Don't clear localStorage here
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
        setIsAuthenticated(false);
        // Don't clear localStorage on error
      } finally {
        setIsLoading(false);
      }
    };

    // Run auth initialization
    initAuth();

    // This function happens when the component is unmounted
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
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("access_token", userData.access);
      localStorage.setItem("refresh_token", userData.refresh);

      setUser(userData);
      setIsAuthenticated(true);
      scheduleTokenRefresh(userData.access);
      hasRedirected.current = false;
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = (redirect = true) => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      setUser(null);
      setIsAuthenticated(false);

      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }

      if (redirect && !hasRedirected.current) {
        hasRedirected.current = true;
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        user,
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};