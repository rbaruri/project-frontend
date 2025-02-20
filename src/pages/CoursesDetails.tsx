import React from 'react';
import { useQuery } from "@apollo/client";
import { useParams, Navigate } from "react-router-dom";
import { GET_COURSE_WITH_LEARNING_PATH } from '../graphql/queries/courses';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: number;
}

interface CourseWithLearningPath {
  courses_by_pk: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    learning_paths: Array<{
      id: string;
      syllabus_text: string;
      generated_path: {
        modules: Module[];
      };
      created_at: string;
    }>;
  };
}

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery<CourseWithLearningPath>(
    GET_COURSE_WITH_LEARNING_PATH,
    {
      variables: { id },
    }
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <h3 className="text-xl font-semibold mb-2">Error Loading Course</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data?.courses_by_pk || !data.courses_by_pk.learning_paths?.[0]) {
    return <Navigate to="/not-found" replace />;
  }

  const course = data.courses_by_pk;
  const learningPath = course.learning_paths[0];
  const modules = learningPath.generated_path.modules || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.name}</h1>
        <div className="flex gap-4 text-gray-600">
          <span>Start Date: {new Date(course.start_date).toLocaleDateString()}</span>
          <span>End Date: {new Date(course.end_date).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Course Syllabus</h2>
        <p className="whitespace-pre-wrap text-gray-600">{learningPath.syllabus_text}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Modules</h2>
        <div className="space-y-4">
          {modules.map((module, index) => (
            <div key={module.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Module {index + 1}: {module.title}
                </h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {module.duration} hours
                </span>
              </div>
              <p className="text-gray-600">{module.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
