import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("access_token"); // Check if token exists
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Function to decode JWT token and extract expiration time
  const getTokenExpiryTime = (token) => {
    if (!token) return null;
    try {
      // JWT tokens are split into three parts by dots
      const payload = token.split('.')[1];
      // The middle part needs to be base64 decoded
      const decodedPayload = JSON.parse(atob(payload));
      // exp is the expiration time in seconds
      return decodedPayload.exp * 1000; // Convert to milliseconds
    } catch (error) {
      console.error("Error decoding token", error);
      return null;
    }
  };

  // Function to refresh the access token using the refresh token
  const refreshToken = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) {
      logout();
      return false;
    }
    try {
      const response = await fetch("https://backend-acad-ai.onrender.com/users/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refresh_token }),
      });
      const data = await response.json();
      if (response.ok && data.access) {
        localStorage.setItem("access_token", data.access);
        setupTokenRefresh(data.access); // Setup the next refresh
        return true;
      } else {
        // If refresh fails, log out the user.
        logout();
        return false;
      }
    } catch (error) {
      console.error("Error refreshing token", error);
      logout();
      return false;
    }
  };

  // Setup token refresh timer based on expiration time
  const setupTokenRefresh = (accessToken) => {
    const expiryTime = getTokenExpiryTime(accessToken);
    if (!expiryTime) return;

    // Calculate time until 5 minutes before expiry
    const currentTime = Date.now();
    const timeUntilRefresh = Math.max(0, expiryTime - currentTime - (5 * 60 * 1000));

    // Clear any existing timer
    if (window.refreshTimer) {
      clearTimeout(window.refreshTimer);
    }

    // Set up the new timer
    window.refreshTimer = setTimeout(() => {
      refreshToken();
    }, timeUntilRefresh);

  };

  // Update authentication state on mount and set up token refresh
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    if (accessToken && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      setupTokenRefresh(accessToken);
    }

    // Cleanup function to clear the timer on unmount
    return () => {
      if (window.refreshTimer) {
        clearTimeout(window.refreshTimer);
      }
    };
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", userData.access);
    localStorage.setItem("refresh_token", userData.refresh);

    setUser(userData);
    setIsAuthenticated(true);
    setupTokenRefresh(userData.access);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setUser(null);
    setIsAuthenticated(false);

    if (window.refreshTimer) {
      clearTimeout(window.refreshTimer);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};