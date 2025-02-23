import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MODULES_BY_COURSE } from '../../graphql/queries/modules';

interface Resource {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  status: string;
  created_at: string;
  resources: Resource[];
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
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const { loading, error, data } = useQuery(GET_MODULES_BY_COURSE, {
    variables: { courseId },
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  if (loading) return <div className="p-4">Loading modules...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading modules: {error.message}</div>;
  if (!data?.modules || data.modules.length === 0) {
    return <div className="p-4">No modules found for this course.</div>;
  }

  return (
    <div className="space-y-4">
      {data.modules.map((module: Module, index: number) => {
        const isExpanded = expandedModules.has(module.id);
        
        return (
          <div
            key={module.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleModule(module.id)}
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Module {index + 1}: {module.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Created: {new Date(module.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(module.status)}`}
                >
                  {module.status.replace(/_/g, ' ')}
                </span>
                <svg
                  className={`w-6 h-6 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Resources Section */}
            {isExpanded && (
              <div className="mt-6 border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Resources</h4>
                {module.resources && module.resources.length > 0 ? (
                  <div className="space-y-2">
                    {module.resources.map((resource) => (
                      <div key={resource.id} className="flex items-center group">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center group-hover:translate-x-1 transition-transform"
                        >
                          <svg
                            className="w-4 h-4 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          {resource.title}
                        </a>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(resource.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No resources available for this module.</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ModuleList; 