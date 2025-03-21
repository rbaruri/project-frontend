import React from 'react';
import { useQuery } from "@apollo/client";
import { useParams, Navigate } from "react-router-dom";
import { GET_COURSE_WITH_LEARNING_PATH } from '@/graphql/queries/courses';
import ModuleList from '@/components/modules/ModuleList';
import { useAuth } from '@/context/AuthContext';

interface Resource {
  id: string;
  module_id: string;
  title: string;
  url: string;
  created_at: string;
}

interface SimilarQuestion {
  id: string;
  module_id: string;
  question: string;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  status: string;
  created_at: string;
}

interface CourseData {
  courses_by_pk: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    user_id: string;
  };
  modules: Module[];
  resources: Resource[];
  similar_questions: SimilarQuestion[];
}

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();

  if (!courseId) {
    return <Navigate to="/courses" />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const { loading, error, data } = useQuery<CourseData>(
    GET_COURSE_WITH_LEARNING_PATH,
    {
      variables: { id: courseId },
      skip: !courseId
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

  if (!data?.courses_by_pk) {
    return <Navigate to="/not-found" replace />;
  }

  // Check if the course belongs to the current user
  if (parseInt(data.courses_by_pk.user_id, 10) !== parseInt(user.userId, 10)) {
    return <Navigate to="/courses" replace />;
  }

  const course = data.courses_by_pk;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.name}</h1>
        <div className="flex gap-4 text-gray-600">
          <span>Start Date: {new Date(course.start_date).toLocaleDateString()}</span>
          <span>End Date: {new Date(course.end_date).toLocaleDateString()}</span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Modules</h2>
        <ModuleList courseId={courseId} />
      </div>
    </div>
  );
};

export default CourseDetails;
