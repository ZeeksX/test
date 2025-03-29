// src/App.jsx
import React, { useState, useEffect, Profiler } from "react";
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
import StudentGroups from "./pages/StudentGroups";
import Container from "./components/Container";
import ExamRooms from "./pages/ExamRooms";
import CourseOverview from "./pages/CourseOverview";
import CourseExamRoom from "./components/courses/CourseExamRoom";
import OTPPage from "./pages/OTPPage";
import EnrolledStudents from "./components/lecturer/EnrolledStudents";
import ProfilleCustomization from "./pages/ProfilleCustomization";
import CoursePublishedExams from "./components/courses/CoursePublishedExams";
import CourseSavedExams from "./components/courses/CourseSavedExams";
import StudentGroup from "./components/students/StudentGroup";
import Lecturers from "./components/students/Lecturers";
import LecturerGroups from "./components/students/LecturerGroups";
import Examinations from "./components/students/Examinations";
import ExaminationResult from "./components/students/ExaminationResult";

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
          <Route
            path="/"
            element={
              <ParticlesReact
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route path="/login" element={<Login isMobile={isMobile} />} />
          <Route path="/users/verify-otp" element={<OTPPage />} />
          <Route
            path="/signup"
            element={
              <SignUp
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
              />
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProfilleCustomization />
            }
          />

          {/* Protected Home Route */}
          <Route
            element={
              <ProtectedRoute>
                <HomePage
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                  isMobile={isMobile}
                />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Container />} />
            <Route path="student-group/:groupId" element={<StudentGroup />} />

            <Route path="examinations">
              <Route index element={<Examinations />} />
              <Route path=":courseCode/result" element={<ExaminationResult />} />
            </Route>

            <Route path="lecturers">
              <Route index element={<Lecturers />} />
              <Route path=":lecturerId/groups" element={<LecturerGroups />} />
            </Route>

            <Route path="student-groups" element={<StudentGroups />} />
            <Route path="student-groups/:groupId" element={<EnrolledStudents />} />
            <Route path="course/:courseId" element={<CourseOverview />}>
              <Route path="published" element={<CoursePublishedExams />} />
              <Route path="saved" element={<CourseSavedExams />} />
            </Route>
            <Route path="rooms" element={<ExamRooms />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
