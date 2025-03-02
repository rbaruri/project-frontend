import React from 'react';

export const LoadingState: React.FC = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="text-center p-4">
    <div className="bg-red-50 border-l-4 border-red-500 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            Error loading modules: {error}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const EmptyState: React.FC = () => (
  <div className="text-center p-8">
    <div className="text-gray-500">No modules available</div>
  </div>
); 