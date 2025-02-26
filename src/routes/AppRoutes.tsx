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
    // Public routes
    {
      path: "/",
      children: [
        {
          index: true,
          element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />,
        },
        {
          path: "login",
          element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />,
        },
        {
          path: "signup",
          element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUpPage />,
        },
        {
          path: "syllabus-upload",
          element: <SyllabusUploadPage />,
        },
      ],
    },

    // Protected Routes
    {
      path: "/",
      children: [
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
          path: "learning-path",
          element: <ProtectedRoute><LearningPathPage /></ProtectedRoute>,
        },
        {
          path: "modules/:moduleId",
          element: <ProtectedRoute><ModuleDetailsPage /></ProtectedRoute>,
        },
        {
          path: "quiz/:quizId",
          element: <ProtectedRoute><QuizPage /></ProtectedRoute>,
        },
        {
          path: "profile",
          element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
        },
      ],
    },

    // Catch all route
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ];

  const element = useRoutes(routes);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {element}
    </Suspense>
  );
};

export default AppRoutes;
