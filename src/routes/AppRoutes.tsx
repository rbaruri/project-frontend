import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Navbar from "@/components/common/Navbar";

// Lazy load components
const LandingPage = lazy(() => import("@/pages/Landing"));
const Login = lazy(() => import("@/pages/Login"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const CourseDetailsPage = lazy(() => import("@/pages/CoursesDetails"));
const LearningPathPage = lazy(() => import("@/pages/LearningPath"));
const ModuleDetailsPage = lazy(() => import("@/pages/ModuleDetails"));
const SyllabusUploadPage = lazy(() => import("@/pages/SyllabusUpload"));
const CoursesPage = lazy(() => import('@/pages/Courses'));
const QuizPage = lazy(() => import('@/pages/Quiz'));
const ProfilePage = lazy(() => import('@/pages/Profile'));
const TermsAndPrivacy = lazy(() => import('@/pages/TermsAndPrivacy'));
const QuizSummaryPage = lazy(() => import('@/pages/QuizSummary'));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Layout with Navbar for authenticated pages
const AuthenticatedLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// Layout with Navbar for public pages (landing, login, signup)
const LandingLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

const AuthGuard = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export const router = createBrowserRouter([
  // Public routes with navbar (landing, login, signup)
  {
    element: <LandingLayout />,
    children: [
      {
        element: <AuthGuard />,
        children: [
          {
            path: "/",
            index: true,
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <LandingPage />
              </Suspense>
            ),
          },
          {
            path: "authentication",
            children: [
              {
                path: "login",
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <Login />
                  </Suspense>
                ),
              },
              {
                path: "signup",
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <SignUp />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "terms-and-privacy",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <TermsAndPrivacy />
          </Suspense>
        ),
      },
      {
        path: "syllabus-upload",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SyllabusUploadPage />
          </Suspense>
        ),
      },
    ],
  },

  // Protected routes (auth required)
  {
    element: <AuthenticatedLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: "courses",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <CoursesPage />
              </Suspense>
            ),
          },
          {
            path: "courses/:courseId",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <CourseDetailsPage />
              </Suspense>
            ),
          },
          {
            path: "courses/:courseId/modules",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <ModuleDetailsPage />
              </Suspense>
            ),
          },
          {
            path: "modules/:moduleId",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <ModuleDetailsPage />
              </Suspense>
            ),
          },
          {
            path: "learning-path",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <LearningPathPage />
              </Suspense>
            ),
          },
          {
            path: "quiz/:quizId",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <QuizPage />
              </Suspense>
            ),
          },
          {
            path: "quiz-summary/:moduleId",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <QuizSummaryPage />
              </Suspense>
            ),
          },
          {
            path: "profile",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <ProfilePage />
              </Suspense>
            ),
          }
        ],
      },
    ],
  },

  // Catch-all route
  {
    path: "*",
    element: <Navigate to="/authentication/login" replace />,
  },
]);
