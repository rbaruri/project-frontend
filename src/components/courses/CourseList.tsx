import React from 'react';
import { Link } from 'react-router-dom';

export interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  imageUrl?: string;
}

interface CourseListProps {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
}

const CourseList: React.FC<CourseListProps> = ({ courses, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">No Courses Found</h3>
        <p className="text-gray-500">No learning paths have been generated yet.</p>
        <Link 
          to="/syllabus-upload"
          className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upload a Syllabus
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          {course.imageUrl && (
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {course.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {course.description}
            </p>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round(course.progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {course.completedModules} of {course.totalModules} modules completed
              </div>
            </div>
            <Link
              to={`/courses/${course.id}`}
              className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Course
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseList; 