import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_COURSES_WITH_LEARNING_PATHS } from '../graphql/queries/courses';

interface Module {
  id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface Course {
  id: string;
  name: string;
  modules: Module[];
  learning_paths: Array<{
    id: string;
    generated_path: {
      totalHours: number;
    };
  }>;
}

interface DashboardProps {
  firstName: string;
  email: string;
  onLogout: () => void;
  userId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ firstName, email, onLogout, userId }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [coursesInProgress, setCoursesInProgress] = useState<number>(0);
  
  const { loading, error, data } = useQuery<{ courses: Course[] }>(GET_COURSES_WITH_LEARNING_PATHS, {
    variables: { userId: parseInt(userId, 10) },
    skip: !userId,
    fetchPolicy: 'network-only'
  });

  const isInProgress = (course: Course): boolean => {
    if (!course.modules || course.modules.length === 0) return false;

    const hasInProgressModules = course.modules.some(m => m.status === 'in_progress');
    const completedCount = course.modules.filter(m => m.status === 'completed').length;
    const notStartedCount = course.modules.filter(m => m.status === 'not_started').length;
    const totalModules = course.modules.length;

    // A course is in progress if:
    // 1. It has any modules marked as 'in_progress' OR
    // 2. It has some completed modules AND some not started modules (partially completed)
    return hasInProgressModules || (completedCount > 0 && completedCount < totalModules && notStartedCount > 0);
  };

  useEffect(() => {
    if (data?.courses) {
      console.log('All courses data:', data.courses.map(course => ({
        name: course.name,
        modules: course.modules.map(m => ({ title: m.title, status: m.status }))
      })));

      const inProgressCount = data.courses.filter(course => {
        const hasInProgressModules = course.modules.some(m => m.status === 'in_progress');
        const completedCount = course.modules.filter(m => m.status === 'completed').length;
        const notStartedCount = course.modules.filter(m => m.status === 'not_started').length;
        const totalModules = course.modules.length;
        const isInProgressStatus = hasInProgressModules || (completedCount > 0 && completedCount < totalModules && notStartedCount > 0);

        console.log(`Course "${course.name}" status:`, {
          hasInProgressModules,
          completedCount,
          notStartedCount,
          totalModules,
          isInProgress: isInProgressStatus
        });

        return isInProgressStatus;
      }).length;
      
      setCoursesInProgress(inProgressCount);
      console.log('Total courses in progress:', inProgressCount);
    }
  }, [data]);

  const calculateOverallProgress = () => {
    if (!data?.courses || data.courses.length === 0) return 0;
    const totalProgress = data.courses.reduce((acc: number, course: Course) => {
      const completedModules = course.modules.filter(module => module.status === 'completed').length;
      const totalModules = course.modules.length;
      return acc + (completedModules / totalModules) * 100;
    }, 0);
    return Math.round(totalProgress / data.courses.length);
  };

  const getTotalLearningHours = () => {
    if (!data?.courses) return 0;
    return data.courses.reduce((acc: number, course: Course) => {
      return acc + (course.learning_paths[0]?.generated_path?.totalHours || 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back ! 👋</h1>
        <p className="text-indigo-100">Continue your learning journey today.</p>
        {loading && <p className="text-indigo-200 mt-2">Loading your progress...</p>}
        {error && <p className="text-red-300 mt-2">Error loading data. Please try again later.</p>}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/courses" className="block">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Browse Courses</h3>
                <p className="text-blue-100">Explore our course catalog</p>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/syllabus-upload" className="block">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Upload Syllabus</h3>
                <p className="text-purple-100">Get personalized learning paths</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100 transform hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Courses in Progress</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {loading ? '...' : coursesInProgress}
              </h3>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${calculateOverallProgress()}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">{calculateOverallProgress()}% Overall Progress</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-100 transform hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed Courses</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {loading ? '...' : data?.courses?.filter(c => 
                  c.modules.every(m => m.status === 'completed')
                ).length || 0}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Keep up the great work!
          </p>
        </div>
      </div>

      {/* Current Courses */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Current Courses</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="animate-pulse space-y-4 p-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded" />
              ))}
            </div>
          ) : data?.courses?.length ? (
            data.courses.map(course => (
              <div
                key={course.id}
                className={`p-6 transition-all ${
                  selectedCourseId === course.id
                    ? 'bg-indigo-50 border-l-4 border-indigo-500'
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                }`}
                onClick={() => setSelectedCourseId(course.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {course.modules.filter(m => m.status === 'completed').length} of {course.modules.length} modules completed
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <span className="text-sm text-gray-500">
                          {Math.round((course.modules.filter(m => m.status === 'completed').length / course.modules.length) * 100)}% Complete
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(course.modules.filter(m => m.status === 'completed').length / course.modules.length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by browsing our courses or uploading a syllabus.</p>
              <div className="mt-6">
                <Link
                  to="/courses"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Browse Courses
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
