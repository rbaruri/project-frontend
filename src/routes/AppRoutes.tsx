import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import CoursesDetails from "../pages/CoursesDetails";
import LearningPath from "../pages/LearningPath";
import ModuleDetails from "../pages/ModuleDetails";
import SyllabusUpload from "../pages/SyllabusUpload";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId"
        element={
          <ProtectedRoute>
            <CoursesDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learning-path"
        element={
          <ProtectedRoute>
            <LearningPath />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId/modules/:moduleId"
        element={
          <ProtectedRoute>
            <ModuleDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/syllabus-upload"
        element={
          <ProtectedRoute>
            <SyllabusUpload />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
