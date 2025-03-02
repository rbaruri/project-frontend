import React from 'react';
import { Link } from 'react-router-dom';
import { UserProfileCardProps } from './types';
import { getInitial, getSkeletonClasses } from './helper';

const UserProfileCard: React.FC<UserProfileCardProps> = ({ firstName = '', email = '', onLogout }) => {
  if (!firstName || !email) {
    return (
      <div className={getSkeletonClasses.container}>
        <h2 className={getSkeletonClasses.title}>Your Profile</h2>
        <div className={getSkeletonClasses.skeletonWrapper}>
          <div className="flex items-center space-x-4">
            <div className={getSkeletonClasses.avatarSkeleton}></div>
            <div className="space-y-2">
              <div className={getSkeletonClasses.nameSkeleton}></div>
              <div className={getSkeletonClasses.emailSkeleton}></div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className={getSkeletonClasses.buttonSkeleton}></div>
            <div className={getSkeletonClasses.buttonSkeleton}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-100 p-4 rounded-full">
            <span className="text-2xl text-indigo-600">{getInitial(firstName)}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{firstName}</h3>
            <p className="text-gray-600">{email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/learning-path"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            View Learning Path
          </Link>
          <button
            onClick={onLogout}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard; 