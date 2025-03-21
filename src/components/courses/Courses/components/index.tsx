import React from 'react';

export const LoadingComponent: React.FC = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div 
      data-testid="loading-spinner"
      className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
    ></div>
  </div>
);

export const ErrorComponent: React.FC<{ error: Error }> = ({ error }) => (
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