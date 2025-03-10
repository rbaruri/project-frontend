import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthModalProps } from '@/components/common/AuthModal/types/index';
import { getModalClasses, getOverlayClasses, getModalPanelClasses } from '@/components/common/AuthModal/helper/index';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <div 
      className={getModalClasses(isOpen)}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className={getOverlayClasses(isOpen)}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gray-500"></div>
        </div>

        {/* Modal panel */}
        <div className={getModalPanelClasses(isOpen)}>
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <svg 
                className="h-6 w-6 text-blue-600 transform transition-transform duration-300 ease-in-out hover:scale-110" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 
                className="text-lg leading-6 font-medium text-gray-900 transition-all duration-300 ease-in-out"
                id="modal-title"
              >
                Authentication Required
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  To upload and process your syllabus, you need to sign in or create an account. This helps us save your learning path and provide personalized recommendations.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/authentication/signup');
              }}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm transform transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-0.5"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/authentication/login');
              }}
              className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-1 sm:text-sm transform transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-0.5"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 