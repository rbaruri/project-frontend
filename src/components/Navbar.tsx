import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveLink = (path: string) => {
    return location.pathname === path ? 'bg-indigo-700' : '';
  };

  return (
    <nav className="bg-indigo-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-xl font-bold transform transition-transform duration-300 group-hover:scale-105">NerdNest</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 ${isActiveLink('/')}`}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 ${isActiveLink('/courses')}`}
              >
                Courses
              </Link>
              <Link
                to="/syllabus-upload"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 ${isActiveLink('/syllabus-upload')}`}
              >
                Syllabus Upload
              </Link>
              {user && (
                <div className="relative group">
                  <button
                    className="flex items-center space-x-2 text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform group-hover:-translate-y-0.5"
                  >
                    {/* <span>{user?.firstName}</span> */}
                    <svg className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform origin-top-right scale-95 group-hover:scale-100">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-button p-2 rounded-md hover:bg-indigo-700 focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <svg className={`h-6 w-6 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out transform ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:translate-x-1 ${isActiveLink('/')}`}
          >
            Home
          </Link>
          <Link
            to="/courses"
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:translate-x-1 ${isActiveLink('/courses')}`}
          >
            Courses
          </Link>
          <Link
            to="/syllabus-upload"
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:translate-x-1 ${isActiveLink('/syllabus-upload')}`}
          >
            Syllabus Upload
          </Link>
          {user && (
            <div className="relative group">
              <button
                className="flex items-center w-full space-x-2 text-white hover:text-gray-200 px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out"
              >
                <span>{user?.firstName}</span>
                <svg className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="absolute left-0 right-0 mt-1 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform origin-top scale-95 group-hover:scale-100">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
