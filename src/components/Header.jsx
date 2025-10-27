import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header id="header" className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-primary shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 lg:px-12 py-3 flex items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center mr-6">
          <img src="/assets/logo/logo.png" alt="Aiyoh" className="h-12" />
        </Link>
        {/* Centered Navigation */}
        <nav className="hidden md:flex flex-1 justify-center items-center space-x-6">
          <Link to="/" className={`nav-link text-white hover:text-accent font-medium ${location.pathname === '/' ? 'text-accent font-bold' : ''}`}>Home</Link>
          <HashLink smooth to="/#about" className="nav-link text-white hover:text-accent font-medium">About</HashLink>
          {isAuthenticated && (
            <>  
              <Link to="/courses" className={`nav-link text-white hover:text-accent font-medium ${location.pathname === '/courses' ? 'text-accent font-bold' : ''}`}>Courses</Link>
              <Link to="/dashboard" className={`nav-link text-white hover:text-accent font-medium ${location.pathname === '/dashboard' ? 'text-accent font-bold' : ''}`}>Dashboard</Link>
              <Link to="/chat" className={`nav-link text-white hover:text-accent font-medium ${location.pathname === '/chat' ? 'text-accent font-bold' : ''}`}>Aiyoh Assistant</Link>
            </>
          )}
        </nav>
        {/* Right-Side Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="px-4 py-2 bg-accent text-black rounded-lg font-medium hover:bg-opacity-80 transition-colors">Logout</button>
          ) : (
            <Link to="/login" className="px-4 py-2 bg-accent text-black rounded-lg font-medium hover:bg-opacity-80 transition-colors">Login</Link>
          )}
        </div>
        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary px-4 py-2">
          <div className="flex flex-col space-y-4 pb-4">
            <Link
              to="/"
              className="text-white font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <HashLink
              smooth
              to="/#about"
              className="text-white font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </HashLink>

            {/* Authenticated Links for Mobile */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/courses"
                  className="text-white hover:text-accent font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-accent font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/chat"
                  className="text-black bg-accent hover:bg-opacity-80 px-4 py-2 rounded font-medium inline-block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  AI Assistant
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="text-white hover:text-accent font-medium py-2 text-left w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-black bg-accent hover:bg-opacity-80 px-4 py-2 rounded font-medium inline-block"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 