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
import ParticlesReact from "./pages/ParticlesReact";
import StudentGroups from "./pages/StudentGroups";
import Container from "./components/Container";
import ExamRooms from "./pages/ExamRooms";
import CourseOverview from "./pages/CourseOverview";
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
import ExamDetails from "./components/lecturer/ExamDetails";
import StudentResultPage from "./components/lecturer/StudentResultPage";
import ExaminationInstructions from "./components/students/ExaminationInstructions";
import ExaminationQuestions from "./components/students/ExaminationQuestions";
import ExaminationReview from "./components/students/ExaminationReview";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import JoinStudentGroup from "./pages/JoinStudentGroup";

// ProtectedRoute ensures that the children are rendered only if the user is authenticated.
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
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <ParticlesReact
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="exams/groups/join/:invite_code"
            element={<JoinStudentGroup />}
          />

          {/* Catch-all route to redirect to the landing page */}
          <Route path="*" element={<Navigate to="/" />} />

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
          <Route path="/onboarding" element={<ProfilleCustomization />} />

          {/* Protected Routes */}
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
              <Route
                path=":courseId/instructions"
                element={<ExaminationInstructions />}
              />
              <Route
                path=":courseId/questions"
                element={<ExaminationQuestions />}
              />
              {/* <Route path=":courseId/result" element={<ExaminationResult />} /> */}
              <Route path=":examId/review" element={<ExaminationReview />} />
              <Route path=":examId/result" element={<ExaminationResult />} />
              {/* <Route path=":courseId/review" element={<ExaminationReview />} /> */}
            </Route>
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="lecturers">
              <Route index element={<Lecturers />} />
              <Route path=":lecturerId/groups" element={<LecturerGroups />} />
            </Route>

            <Route path="student-groups" element={<StudentGroups />} />
            <Route
              path="course/:courseId/published/:examId/detail"
              element={<ExamDetails />}
            />
            <Route
              path="course/:courseId/published/:examId/detail/student/:studentId"
              element={<StudentResultPage />}
            />
            <Route
              path="student-groups/:groupId"
              element={<EnrolledStudents />}
            />
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
