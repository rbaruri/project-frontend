import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_MODULES_BY_COURSE } from '../../graphql/queries/modules';

interface Module {
  id: string;
  course_id: string;
  title: string;
  status: string;
  created_at: string;
}

interface ModuleListProps {
  courseId: string;
}

const getStatusColor = (status: string): string => {
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

const ModuleList: React.FC<ModuleListProps> = ({ courseId }) => {
  const { loading, error, data } = useQuery(GET_MODULES_BY_COURSE, {
    variables: { courseId },
  });

  if (loading) return <div className="p-4">Loading modules...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading modules: {error.message}</div>;
  if (!data?.modules || data.modules.length === 0) {
    return <div className="p-4">No modules found for this course.</div>;
  }

  return (
    <div className="space-y-4">
      {data.modules.map((module: Module, index: number) => (
        <div
          key={module.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Module {index + 1}: {module.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Created: {new Date(module.created_at).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${getStatusColor(module.status)}`}
            >
              {module.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModuleList; 