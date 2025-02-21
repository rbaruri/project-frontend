import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  firstName: string;
  email: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ firstName, email, onLogout }) => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}! 👋</h1>
        <p className="text-indigo-100">Continue your learning journey today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Courses in Progress</p>
              <h3 className="text-2xl font-bold text-gray-800">3</h3>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed Courses</p>
              <h3 className="text-2xl font-bold text-gray-800">5</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Learning Hours</p>
              <h3 className="text-2xl font-bold text-gray-800">24h</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/courses" className="block">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100 hover:border-indigo-500 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Browse Courses</h3>
                <p className="text-gray-600">Explore our course catalog</p>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/syllabus-upload" className="block">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100 hover:border-indigo-500 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Upload Syllabus</h3>
                <p className="text-gray-600">Get personalized learning paths</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">Email:</span> {email}
          </p>
          <div className="flex items-center space-x-4">
            <Link
              to="/learning-path"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View Learning Path
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
