// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/HomePage';
import Login from "./pages/Login";
import { AuthProvider, useAuth } from './components/Auth';
import SignUp from './pages/SignUp';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar visibility

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <HomePage sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={
              <SignUp sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;