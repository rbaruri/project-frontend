import React from 'react';
import { useQuery } from "@apollo/client";
import { useParams, Navigate } from "react-router-dom";
import { GET_COURSE_WITH_LEARNING_PATH } from '../graphql/queries/courses';

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
  };
  modules: Module[];
  resources: Resource[];
  similar_questions: SimilarQuestion[];
}

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { loading, error, data } = useQuery<CourseData>(
    GET_COURSE_WITH_LEARNING_PATH,
    {
      variables: { id: courseId },
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

  const course = data.courses_by_pk;
  const modules = data.modules || [];
  const allResources = data.resources || [];
  const allQuestions = data.similar_questions || [];

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        <div className="space-y-8">
          {modules.map((module, index) => {
            const moduleResources = allResources.filter(r => r.module_id === module.id);
            const moduleQuestions = allQuestions.filter(q => q.module_id === module.id);

            return (
              <div key={module.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Module {index + 1}: {module.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(module.status)}`}>
                    {module.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Resources Section */}
                {moduleResources.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Resources</h4>
                    <div className="space-y-2">
                      {moduleResources.map((resource) => (
                        <div key={resource.id} className="flex items-center">
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {resource.title}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Similar Questions Section */}
                {moduleQuestions.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Practice Questions</h4>
                    <div className="space-y-3">
                      {moduleQuestions.map((question) => (
                        <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">{question.question}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
