import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

// Lazy load components
const LandingPage = lazy(() => import("../pages/Landing"));
const LoginPage = lazy(() => import("../pages/Login"));
const SignUpPage = lazy(() => import("../pages/SignUp"));
const DashboardPage = lazy(() => import("../pages/Dashboard"));
const CourseDetailsPage = lazy(() => import("../pages/CoursesDetails"));
const LearningPathPage = lazy(() => import("../pages/LearningPath"));
const ModuleDetailsPage = lazy(() => import("../pages/ModuleDetails"));
const SyllabusUploadPage = lazy(() => import("../pages/SyllabusUpload"));
const CoursesPage = lazy(() => import('../pages/Courses'));

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
    </Suspense>
  );
};

export default AppRoutes;
