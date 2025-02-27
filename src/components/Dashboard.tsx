import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
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

const Dashboard: React.FC<DashboardProps> = ({  userId }) => { //firstName, email, onLogout,
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [coursesInProgress, setCoursesInProgress] = useState<number>(0);
  
  const { loading, error, data } = useQuery<{ courses: Course[] }>(GET_COURSES_WITH_LEARNING_PATHS, {
    variables: { userId: parseInt(userId, 10) },
    skip: !userId,
    fetchPolicy: 'network-only'
  });

  // const isInProgress = (course: Course): boolean => {
  //   if (!course.modules || course.modules.length === 0) return false;

  //   const hasInProgressModules = course.modules.some(m => m.status === 'in_progress');
  //   const completedCount = course.modules.filter(m => m.status === 'completed').length;
  //   const notStartedCount = course.modules.filter(m => m.status === 'not_started').length;
  //   const totalModules = course.modules.length;

  //   // A course is in progress if:
  //   // 1. It has any modules marked as 'in_progress' OR
  //   // 2. It has some completed modules AND some not started modules (partially completed)
  //   return hasInProgressModules || (completedCount > 0 && completedCount < totalModules && notStartedCount > 0);
  // };

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

  // const getTotalLearningHours = () => {
  //   if (!data?.courses) return 0;
  //   return data.courses.reduce((acc: number, course: Course) => {
  //     return acc + (course.learning_paths[0]?.generated_path?.totalHours || 0);
  //   }, 0);
  // };

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

  return (
    <motion.div 
      className="space-y-6 relative z-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg shadow-lg p-6 text-white relative z-10"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h1 className="text-3xl font-bold mb-2">
          {new Date().getHours() < 12 ? 'Good Morning ☀️' : 'Good Evening 🌙'} 
          {/* {firstName.toUpperCase()}! 👋 */}
        </h1>
        <p className="text-indigo-100">Continue your learning journey today.</p>
        {loading && <p className="text-indigo-200 mt-2">Loading your progress...</p>}
        {error && <p className="text-red-300 mt-2">Error loading data. Please try again later.</p>}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <motion.div variants={itemVariants}>
          <Link to="/courses" className="block relative">
            <motion.div 
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="bg-white/20 p-3 rounded-full"
                  whileHover={{ x: [0, -5, 5, -5, 5, 0] }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold">Browse Courses</h3>
                  <p className="text-blue-100">Explore our course catalog</p>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link to="/syllabus-upload" className="block relative">
            <motion.div 
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="bg-white/20 p-3 rounded-full"
                  whileHover={{ x: [0, -5, 5, -5, 5, 0] }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold">Upload Syllabus</h3>
                  <p className="text-purple-100">Get personalized learning paths</p>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-lg shadow p-6 border border-gray-100 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Courses in Progress</p>
              <motion.h3 
                className="text-2xl font-bold text-gray-800"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {loading ? '...' : coursesInProgress}
              </motion.h3>
            </div>
            <motion.div 
              className="bg-indigo-100 p-3 rounded-full"
              whileHover={{ x: [0, -5, 5, -5, 5, 0] }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </motion.div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="bg-indigo-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${calculateOverallProgress()}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">{calculateOverallProgress()}% Overall Progress</p>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-lg shadow p-6 border border-gray-100 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed Courses</p>
              <motion.h3 
                className="text-2xl font-bold text-gray-800"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {loading ? '...' : data?.courses?.filter(c => 
                  c.modules.every(m => m.status === 'completed')
                ).length || 0}
              </motion.h3>
            </div>
            <motion.div 
              className="bg-green-100 p-3 rounded-full"
              whileHover={{ x: [0, -5, 5, -5, 5, 0] }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Keep up the great work!</p>
        </motion.div>
      </div>

      {/* Current Courses */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-lg shadow-lg overflow-hidden relative z-10"
      >
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Current Courses</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="animate-pulse space-y-4 p-6">
              {[1, 2, 3].map(i => (
                <motion.div 
                  key={i} 
                  className="h-24 bg-gray-200 rounded"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
          ) : data?.courses?.length ? (
            data.courses.map((course, index) => (
              <motion.div
                key={course.id}
                className={`p-6 transition-all ${
                  selectedCourseId === course.id
                    ? 'bg-indigo-50 border-l-4 border-indigo-500'
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                }`}
                onClick={() => setSelectedCourseId(course.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 10 }}
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
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-indigo-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(course.modules.filter(m => m.status === 'completed').length / course.modules.length) * 100}%` 
                      }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="mt-4 text-gray-500">No courses yet. Start by exploring our catalog!</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
