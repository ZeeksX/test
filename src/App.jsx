// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./components/Auth";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import ParticlesReact from "./pages/ParticlesReact";
import EnrolledStudents from "./pages/EnrolledStudents";
import Container from "./components/Container";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === null) return null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Method to check if the screen is mobile
  const checkIfMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ParticlesReact />} />
          <Route path="/login" element={<Login isMobile={isMobile} />} />
          <Route
            path="/signup"
            element={<SignUp sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />}
          />
          <Route
            path="/onboarding"
            element={<Onboarding sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />}
          />

          {/* Protected Home Route */}
          <Route
            element={
              <ProtectedRoute>
                <HomePage sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Container />} />
            <Route path="enrolled" element={<EnrolledStudents />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
