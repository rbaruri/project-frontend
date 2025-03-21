import React from 'react';
import { Link } from 'react-router-dom';
import { UserProfileCardProps } from './types';
import { getInitial } from './helper';

const UserProfileCard: React.FC<UserProfileCardProps> = ({ firstName = '', email = '', onLogout }) => {
  if (!firstName || !email) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 h-12 w-12 rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mt-4">
            <div className="h-10 bg-gray-200 rounded w-full sm:w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded w-full sm:w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-100 p-4 rounded-full flex-shrink-0">
            <span className="text-2xl text-indigo-600">{getInitial(firstName)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-800 truncate">{firstName}</h3>
            <p className="text-gray-600 truncate">{email}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <Link
            to="/learning-path"
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            View Learning Path
          </Link>
          <button
            onClick={onLogout}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard; 