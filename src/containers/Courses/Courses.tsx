import React from 'react';
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../components/ui/CourseCard";
import { GET_COURSES_WITH_LEARNING_PATHS } from '../../graphql/queries/courses';
import { useAuth } from '../../context/AuthContext';

interface Course {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  learning_paths: Array<{
    id: string;
    generated_path: any;
    created_at: string;
  }>;
  modules: Array<{
    id: string;
    title: string;
    status: string;
  }>;
}

interface GetCoursesData {
  courses: Course[];
}

const CoursesContainer: React.FC = () => {
  const { user } = useAuth();
  const { loading, error, data } = useQuery<GetCoursesData>(GET_COURSES_WITH_LEARNING_PATHS, {
    variables: { userId: parseInt(user?.userId || '0', 10) },
    skip: !user?.userId
  });
  const navigate = useNavigate();

  // Calculate actual course progress based on completed modules
  const calculateCourseProgress = (modules: Course['modules']): number => {
    if (!modules || modules.length === 0) return 0;
    const completedModules = modules.filter(module => module.status === 'completed').length;
    return Math.round((completedModules / modules.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="mb-4 text-red-600">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Error Loading Courses</h3>
          <p>{error.message}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const coursesWithLearningPaths = data?.courses.filter(course => course.learning_paths.length > 0) || [];

  if (coursesWithLearningPaths.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Learning Paths Found</h3>
          <p className="text-gray-500 mb-4">Get started by uploading a syllabus to generate a learning path.</p>
          <button 
            onClick={() => navigate('/syllabus-upload')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Syllabus
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {coursesWithLearningPaths.map((course) => (
        <CourseCard
          key={course.id}
          course={{
            id: course.id,
            course_name: course.name,
            start_date: course.start_date,
            end_date: course.end_date,
            total_duration: calculateWeeksBetweenDates(new Date(course.start_date), new Date(course.end_date)),
            total_hours: calculateTotalHours(course.learning_paths[0]?.generated_path),
            hours_per_week: calculateHoursPerWeek(
              calculateTotalHours(course.learning_paths[0]?.generated_path),
              calculateWeeksBetweenDates(new Date(course.start_date), new Date(course.end_date))
            ),
            progress: calculateCourseProgress(course.modules),
            onClick: () => navigate(`/courses/${course.id}`),
          }}
          userId={parseInt(user?.userId || '0', 10)}
        />
      ))}
    </div>
  );
};

// Helper functions
const calculateWeeksBetweenDates = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.ceil(diffDays / 7);
};

const calculateTotalHours = (generatedPath: any): number => {
  if (!generatedPath) return 0;
  
  // Try to get hours from totalHours field
  if (typeof generatedPath.totalHours === 'number') {
    return generatedPath.totalHours;
  }
  
  // If totalHours is a string (e.g., "120 hours"), parse it
  if (typeof generatedPath.totalHours === 'string') {
    const match = generatedPath.totalHours.match(/(\d+)/);
    if (match) {
      return parseInt(match[0], 10);
    }
  }
  
  // If no totalHours, sum up hours from modules
  if (Array.isArray(generatedPath.modules)) {
    return generatedPath.modules.reduce((total: number, module: any) => {
      if (typeof module.hoursRequired === 'number') {
        return total + module.hoursRequired;
      }
      if (typeof module.hoursRequired === 'string') {
        const match = module.hoursRequired.match(/(\d+)/);
        if (match) {
          return total + parseInt(match[0], 10);
        }
      }
      return total;
    }, 0);
  }
  
  return 0;
};

const calculateHoursPerWeek = (totalHours: number, totalWeeks: number): number => {
  return totalWeeks > 0 ? Math.ceil(totalHours / totalWeeks) : 0;
};

export default CoursesContainer;
