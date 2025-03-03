import React from 'react';
import { useQuery } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import CourseCard from "@/components/common/CourseCard";
import { GET_COURSES_WITH_LEARNING_PATHS } from '@/graphql/queries/courses';
import { useAuth } from '@/context/AuthContext';
import { GetCoursesData } from './types';
import { calculateCourseProgress, calculateDurationBetweenDates, calculateTotalHours, calculateHoursPerWeek } from './helper';
import { LoadingComponent, ErrorComponent } from './components';

const CoursesContainer: React.FC = () => {
  const { user } = useAuth();
  const { loading, error, data } = useQuery<GetCoursesData>(GET_COURSES_WITH_LEARNING_PATHS, {
    variables: { userId: parseInt(user?.userId || '0', 10) },
    skip: !user?.userId
  });
  const navigate = useNavigate();

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  const coursesWithLearningPaths = data?.courses.filter(course => course.learning_paths.length > 0) || [];

  if (coursesWithLearningPaths.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">No Courses Found</h3>
        <p className="mt-2 text-gray-500">Get started by uploading a syllabus to generate your learning path.</p>
        <Link 
          to="/syllabus-upload"
          className="inline-block mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Upload a Syllabus
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {coursesWithLearningPaths.map((course) => {
          const duration = calculateDurationBetweenDates(new Date(course.start_date), new Date(course.end_date));
          const totalHours = calculateTotalHours(course.learning_paths[0]?.generated_path);
          const hoursPerWeek = calculateHoursPerWeek(totalHours, duration);
          const progress = calculateCourseProgress(course.modules);
          
          return (
            <CourseCard
              key={course.id}
              course={{
                id: course.id,
                course_name: course.name,
                start_date: course.start_date,
                end_date: course.end_date,
                total_duration: duration,
                total_hours: totalHours,
                hours_per_week: hoursPerWeek,
                progress: progress
              }}
              userId={parseInt(user?.userId || '0', 10)}
              onClick={() => navigate(`/courses/${course.id}`)}
              onViewModules={() => navigate(`/courses/${course.id}`)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CoursesContainer; 