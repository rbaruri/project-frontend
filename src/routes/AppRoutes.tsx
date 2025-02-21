import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LandingPage from "../pages/Landing";
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
      {/* Public Routes - Only accessible when not authenticated */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUpPage />}
      />

      {/* Protected Routes - Only accessible when authenticated */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
        <Route path="/modules/:moduleId" element={<ModuleDetailsPage />} />
        <Route path="/learning-path" element={<LearningPathPage />} />
        <Route path="/syllabus-upload" element={<SyllabusUploadPage />} />
      </Route>

      {/* Catch-all Route - Redirect to appropriate page based on auth status */}
      <Route 
        path="*" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />} 
      />
    </Routes>
  );
};

export default AppRoutes;
