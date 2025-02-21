import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActiveLink = (path: string) => {
    return location.pathname === path ? 'bg-indigo-700' : '';
  };

  return (
    <nav className="bg-indigo-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">LearnSmart</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors ${isActiveLink('/')}`}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors ${isActiveLink('/courses')}`}
              >
                Courses
              </Link>
              <Link
                to="/syllabus-upload"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors ${isActiveLink('/syllabus-upload')}`}
              >
                Syllabus Upload
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="mobile-menu-button p-2 rounded-md hover:bg-indigo-700 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors ${isActiveLink('/')}`}
          >
            Home
          </Link>
          <Link
            to="/courses"
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors ${isActiveLink('/courses')}`}
          >
            Courses
          </Link>
          <Link
            to="/syllabus-upload"
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors ${isActiveLink('/syllabus-upload')}`}
          >
            Syllabus Upload
          </Link>
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
