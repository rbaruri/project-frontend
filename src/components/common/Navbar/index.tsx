import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isActiveLink = (path: string) => {
    if (isAuthenticated && path === '/' && location.pathname === '/dashboard') {
      return 'bg-indigo-700';
    }
    return location.pathname === path ? 'bg-indigo-700' : '';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/authentication/login');
  };

  const handleUnauthenticatedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/authentication/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'auto';
  };

  return (
    <>
      <nav className="fixed w-full top-0 left-0 bg-indigo-800 text-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center">
              <Link 
                to={isAuthenticated ? "/dashboard" : "/"} 
                className="flex items-center space-x-2 group"
              >
                <span className="text-xl font-bold transform transition-transform duration-300 group-hover:scale-105">NerdNest</span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/"}
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 ${isActiveLink('/')}`}
                >
                  Home
                </Link>
                <Link
                  to={isAuthenticated ? "/courses" : "#"}
                  onClick={!isAuthenticated ? handleUnauthenticatedClick : undefined}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 ${
                    isAuthenticated ? 'hover:bg-indigo-700' : 'opacity-50 cursor-not-allowed'
                  } ${isActiveLink('/courses')}`}
                >
                  Courses
                </Link>
                <Link
                  to="/syllabus-upload"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 ${isActiveLink('/syllabus-upload')}`}
                >
                  Syllabus Upload
                </Link>
                {isAuthenticated && (
                  <div className="relative group">
                    <button
                      className="flex items-center space-x-2 text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform group-hover:-translate-y-0.5"
                    >
                      <span>{user?.first_name}</span>
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
                        onClick={handleLogout}
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
                onClick={toggleMobileMenu}
                className="mobile-menu-button p-2 rounded-md hover:bg-indigo-700 focus:outline-none transition-all duration-300 ease-in-out"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6 relative">
                  <span className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 top-3' : 'rotate-0 top-1'}`}></span>
                  <span className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out top-3 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 top-3' : 'rotate-0 top-5'}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden ${
            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleMobileMenu}
        ></div>

        {/* Mobile menu */}
        <div 
          className={`fixed top-14 right-0 w-64 h-[calc(100vh-3.5rem)] bg-indigo-800 transform transition-transform duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 overflow-y-auto h-full">
            <Link
              to={isAuthenticated ? "/dashboard" : "/"}
              onClick={toggleMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-all duration-300 ease-in-out ${isActiveLink('/')}`}
            >
              Home
            </Link>
            <Link
              to={isAuthenticated ? "/courses" : "#"}
              onClick={(e) => {
                toggleMobileMenu();
                if (!isAuthenticated) handleUnauthenticatedClick(e);
              }}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out ${
                isAuthenticated ? 'hover:bg-indigo-700' : 'opacity-50 cursor-not-allowed'
              } ${isActiveLink('/courses')}`}
            >
              Courses
            </Link>
            <Link
              to="/syllabus-upload"
              onClick={toggleMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-all duration-300 ease-in-out ${isActiveLink('/syllabus-upload')}`}
            >
              Syllabus Upload
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  onClick={toggleMobileMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-all duration-300 ease-in-out ${isActiveLink('/profile')}`}
                >
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    toggleMobileMenu();
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-all duration-300 ease-in-out"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please log in or sign up to access this feature.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAuthModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <Link
                to="/authentication/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setShowAuthModal(false)}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar; 