import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GET_COURSES_WITH_LEARNING_PATHS } from '@/graphql/queries/courses';
import { DashboardProps } from './types';
import { calculateOverallProgress, getCompletedCoursesCount, getCoursesInProgressCount, isInProgress } from './helper';
import { Course } from '@/types/courseTypes';

const Dashboard: React.FC<DashboardProps> = ({ firstName, email, userId }) => {
  const [coursesInProgress, setCoursesInProgress] = useState<number>(0);
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  
  const { loading, error, data } = useQuery<{ courses: Course[] }>(GET_COURSES_WITH_LEARNING_PATHS, {
    variables: { userId: parseInt(userId, 10) },
    skip: !userId,
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (data?.courses) {
      const inProgressCount = getCoursesInProgressCount(data.courses);
      setCoursesInProgress(inProgressCount);

      // Filter out completed courses and get only in-progress ones
      const inProgressCourses = data.courses
        .filter(course => isInProgress(course))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setRecentCourses(inProgressCourses);
    }
  }, [data]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <motion.div 
      className="space-y-6 relative z-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-xl shadow-lg p-8 text-white relative z-10 overflow-hidden"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3">
            {getGreeting()} {firstName ? `, ${firstName}` : ''} 
            {new Date().getHours() < 12 ? ' ☀️' : new Date().getHours() < 17 ? ' 🌤️' : ' 🌙'}
          </h1>
          <p className="text-xl text-indigo-100 font-light">Welcome back to your learning journey</p>
          {loading && <p className="text-indigo-200 mt-2">Loading your progress...</p>}
          {error && <p className="text-red-300 mt-2">Error loading data. Please try again later.</p>}
        </div>
      </motion.div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Syllabus Card */}
        <Link to="/syllabus-upload">
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg p-6 text-white cursor-pointer h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="relative z-10">
              <div className="p-3 bg-purple-400 bg-opacity-30 rounded-full w-fit mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Syllabus</h3>
              <p className="text-purple-100">Generate a personalized learning path from your course syllabus</p>
            </div>
          </motion.div>
        </Link>

        {/* Browse Courses Card */}
        <Link to="/courses">
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 text-white cursor-pointer h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="relative z-10">
              <div className="p-3 bg-blue-400 bg-opacity-30 rounded-full w-fit mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Courses</h3>
              <p className="text-blue-100">Explore your courses and track your progress</p>
            </div>
          </motion.div>
        </Link>

        {/* Stats Card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-emerald-100 text-sm">In Progress</p>
                <p className="text-2xl font-bold">{loading ? '...' : coursesInProgress}</p>
              </div>
              <div>
                <p className="text-emerald-100 text-sm">Completed</p>
                <p className="text-2xl font-bold">{loading ? '...' : data?.courses ? getCompletedCoursesCount(data.courses) : 0}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-emerald-100">Overall Progress</span>
                <span className="text-emerald-100">{data?.courses ? calculateOverallProgress(data.courses) : 0}%</span>
              </div>
              <div className="w-full bg-emerald-200 bg-opacity-30 rounded-full h-2">
                <motion.div 
                  className="bg-white h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${data?.courses ? calculateOverallProgress(data.courses) : 0}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Courses in Progress */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800">Courses in Progress</h2>
          <p className="text-gray-500 mt-1">Track and continue your ongoing courses</p>
        </div>
        {recentCourses.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {recentCourses.map((course) => {
              const progress = calculateOverallProgress([course]);
              const completedModules = course.modules.filter(m => m.status === 'completed').length;
              const totalModules = course.modules.length;
              const progressColor = progress < 30 ? 'bg-red-500' : progress < 70 ? 'bg-yellow-500' : 'bg-green-500';
              
              return (
                <li key={course.id}>
                  <Link 
                    to={`/courses/${course.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{course.name}</h3>
                        <span className="text-sm font-medium text-blue-600">{progress}%</span>
                      </div>
                      <div className="mt-1 relative">
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <motion.div
                            className={`${progressColor} h-1.5 rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                        <span className="mt-1 text-xs text-gray-500">
                          {completedModules} of {totalModules} modules completed
                        </span>
                      </div>
                    </div>
                    <svg 
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-8 text-center">
            {data?.courses && getCompletedCoursesCount(data.courses) > 0 ? (
              <>
                <svg 
                  className="w-12 h-12 mx-auto text-green-500 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">All Courses Completed!</h3>
                <p className="text-gray-500">Great job! Check your completed courses in the Courses section.</p>
              </>
            ) : (
              <>
                <svg 
                  className="w-12 h-12 mx-auto text-gray-300 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Courses in Progress</h3>
                <p className="text-gray-500">You don't have any courses in progress at the moment</p>
              </>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard; 