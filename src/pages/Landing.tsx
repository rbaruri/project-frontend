import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-600 to-indigo-900 px-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">NerdNest</h1>
        <p className="text-lg text-indigo-200">Your Personalized Learning Journey Starts Here</p>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Welcome</h2>
            <p className="mt-1 text-gray-600">Choose how you want to get started</p>
          </div>

          <div className="space-y-3">
            <Link
              to="/authentication/login"
              className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login to Your Account
            </Link>
            <Link
              to="/authentication/signup"
              className="w-full flex items-center justify-center px-4 py-2.5 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Account
            </Link>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-600">
              By continuing, you agree to our{' '}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-indigo-200">
        <p>© 2024 NerdNest. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LandingPage; 