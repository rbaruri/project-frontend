import React, { Suspense, lazy } from "react";
import { RouteObject, Navigate, useRoutes } from "react-router-dom";
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
const QuizPage = lazy(() => import('../pages/Quiz'));
const ProfilePage = lazy(() => import('../pages/Profile'));

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const routes: RouteObject[] = [
    // Authentication routes
    {
      path: "authentication",
      children: [
        {
          path: "login",
          element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />,
        },
        {
          path: "signup",
          element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUpPage />,
        },
      ],
    },

    // Public route
    {
      path: "/syllabus-upload",
      element: <SyllabusUploadPage />,
    },

    // Protected Routes
    {
      path: "*",
      children: [
        {
          index: true,
          element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />,
        },
        {
          path: "dashboard",
          element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
        },
        {
          path: "courses",
          element: <ProtectedRoute><CoursesPage /></ProtectedRoute>,
        },
        {
          path: "courses/:courseId",
          element: <ProtectedRoute><CourseDetailsPage /></ProtectedRoute>,
        },
        {
          path: "modules/:moduleId",
          element: <ProtectedRoute><ModuleDetailsPage /></ProtectedRoute>,
        },
        {
          path: "learning-path",
          element: <ProtectedRoute><LearningPathPage /></ProtectedRoute>,
        },
        {
          path: "quiz/:quizId",
          element: <ProtectedRoute><QuizPage /></ProtectedRoute>,
        },
        {
          path: "profile",
          element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
        },

        {
          path: "*",
          element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/authentication/login" replace />,
        },
      ],
    },
  ];

  return <Suspense fallback={<div>Loading...</div>}>{useRoutes(routes)}</Suspense>;
};

export default AppRoutes;
