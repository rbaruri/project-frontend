import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/Login";
import SignUpPage from "../pages/SignUp";
import DashboardPage from "../pages/Dashboard";
import CourseDetailsPage from "../pages/CoursesDetails";
import LearningPathPage from "../pages/LearningPath";
import ModuleDetailsPage from "../pages/ModuleDetails";
import SyllabusUploadPage from "../pages/SyllabusUpload";
import ProtectedRoute from "./ProtectedRoute";
import CoursesPage from '../pages/Courses';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
        <Route path="/modules/:moduleId" element={<ModuleDetailsPage />} />
        <Route path="/learning-path" element={<LearningPathPage />} />
        <Route path="/syllabus-upload" element={<SyllabusUploadPage />} />
      </Route>

      {/* Default Route */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          ) : (
            <ProtectedRoute>
              <LoginPage />
            </ProtectedRoute>
          )
        }
      />

      {/* Catch-all Route */}
      <Route path="*" element={<DashboardPage />} />
    </Routes>
  );
};

export default AppRoutes;
