import React, { Suspense, lazy } from "react";
import { RouteObject, Navigate, useRoutes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

// Lazy load components
const LandingPage = lazy(() => import("../pages/Landing"));
const Login = lazy(() => import("../pages/Login"));
const SignUp = lazy(() => import("../pages/SignUp"));
const DashboardPage = lazy(() => import("../pages/Dashboard"));
const CourseDetailsPage = lazy(() => import("../pages/CoursesDetails"));
const LearningPathPage = lazy(() => import("../pages/LearningPath"));
const ModuleDetailsPage = lazy(() => import("../pages/ModuleDetails"));
const SyllabusUploadPage = lazy(() => import("../pages/SyllabusUpload"));
const CoursesPage = lazy(() => import('../pages/Courses'));
const QuizPage = lazy(() => import('../pages/Quiz'));
const ProfilePage = lazy(() => import('../pages/Profile'));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const routes: RouteObject[] = [
    // Authentication routes
    {
      path: "authentication",
      children: [
        {
          path: "login",
          element: isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Suspense fallback={<LoadingSpinner />}>
              <Login />
            </Suspense>
          ),
        },
        {
          path: "signup",
          element: isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Suspense fallback={<LoadingSpinner />}>
              <SignUp />
            </Suspense>
          ),
        },
      ],
    },

    // Public route
    {
      path: "/syllabus-upload",
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <SyllabusUploadPage />
        </Suspense>
      ),
    },

    // Protected Routes
    {
      path: "*",
      children: [
        {
          index: true,
          element: isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Suspense fallback={<LoadingSpinner />}>
              <LandingPage />
            </Suspense>
          ),
        },
        {
          path: "dashboard",
          element: (
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <DashboardPage />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "courses",
          element: (
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <CoursesPage />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "courses/:courseId",
          element: (
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <CourseDetailsPage />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "modules/:moduleId",
          element: (
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <ModuleDetailsPage />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "learning-path",
          element: (
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <LearningPathPage />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "quiz/:quizId",
          element: (
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <QuizPage />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <ProfilePage />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "*",
          element: isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/authentication/login" replace />
          ),
        },
      ],
    },
  ];

  return <Suspense fallback={<LoadingSpinner />}>{useRoutes(routes)}</Suspense>;
};

export default AppRoutes;
