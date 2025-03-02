import { Link } from 'react-router-dom';
import React from 'react';

export const getLoadingComponent = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export const getErrorComponent = (error: string) => (
  <div className="text-center p-4 text-red-600 bg-red-50 rounded-lg">
    {error}
  </div>
);

export const getEmptyStateComponent = () => (
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