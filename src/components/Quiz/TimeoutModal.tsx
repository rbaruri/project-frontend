import React from 'react';

interface TimeoutModalProps {
  isOpen: boolean;
  onRetake: () => void;
}

const TimeoutModal: React.FC<TimeoutModalProps> = ({ isOpen, onRetake }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          aria-hidden="true"
        />

        {/* Modal panel */}
        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <svg 
                className="w-6 h-6 text-red-600"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 
                className="text-2xl font-bold leading-6 text-gray-900"
                id="modal-title"
              >
                Oh No! You Ran Out of Time!
              </h3>
              <div className="mt-4">
                <p className="text-gray-500">
                  Don't worry, you can try again. Take your time to review the questions carefully.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-8">
            <button
              type="button"
              onClick={onRetake}
              className="inline-flex justify-center w-full px-4 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm transform transition-all duration-300 hover:scale-105"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeoutModal; 