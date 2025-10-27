import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';

const Login = ({ isRegister = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, isAuthenticated, loading } = useAuth();
  
  // Determine if this is register page by prop or URL
  const isRegisterPage = isRegister || location.pathname === '/register';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    // Initialize AOS for animations
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      offset: 100,
    });
  }, []);

  // Handle Google OAuth response
  const onSuccess = (credentialResponse) => {
    try {
      // Pass the credential response to the login function
      login(credentialResponse);
      // Note: don't navigate here, let the useEffect handle it
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const onError = () => {
    console.error('Google login failed');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-lg">Loading authentication options...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main background with Upscayl-inspired design */}
      <div className="fixed w-full h-full top-0 left-0 pointer-events-none z-0 overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-darker via-primary to-primary-dark opacity-90"></div>
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}></div>
        
        {/* Particle/Blob elements */}
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-2/3 left-1/3 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Light effect top */}
        <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-accent/10 to-transparent opacity-20"></div>
        
        {/* Glare effect */}
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="min-h-screen flex flex-col">
        {/* Login Section */}
        <section className="flex-grow py-20 md:py-28 overflow-hidden relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="mb-10 text-center" data-aos="fade-down">
              <Link to="/" className="inline-block">
                <img src="/assets/logo/logo.png" alt="Aiyoh" className="h-20 mx-auto" />
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-6">
                {isRegisterPage ? 'Create Your Aiyoh Account' : 'Welcome to Aiyoh'}
              </h1>
              <p className="text-lg text-gray-300 max-w-md mx-auto mt-3">
                {isRegisterPage 
                  ? 'Sign up to start your personalized AI-powered learning journey' 
                  : 'Sign in to access your personalized AI-powered learning experience'}
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-5xl mx-auto">
              {/* Left side - Login Card */}
              <div className="w-full md:w-1/2 md:order-2" data-aos="fade-left">
                {/* Glass card for login */}
                <div className="relative">
                  <div className="absolute -inset-2 bg-white/5 backdrop-blur-sm rounded-xl"></div>
                  <div className="relative backdrop-blur-md bg-white/10 p-8 rounded-xl border border-white/10">
                    <div className="flex flex-col items-center justify-center space-y-6">
                      <p className="text-white text-lg mb-6">Sign in with:</p>
                      <GoogleLogin
                        onSuccess={onSuccess}
                        onError={onError}
                        useOneTap={false}
                        theme="filled_black"
                        shape="pill"
                        size="large"
                        type="standard"
                        text={isRegisterPage ? "signup_with" : "signin_with"}
                        context={isRegisterPage ? "signup" : "signin"}
                        auto_select={false}
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-4">{error}</p>
                      )}
                      <p className="text-gray-400 text-sm mt-6">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Features */}
              <div className="w-full md:w-1/2 md:order-1" data-aos="fade-right">
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {isRegisterPage ? 'Start your learning adventure' : 'Transform your learning journey'}
                  </h2>
                  
                  {/* Feature list */}
                  <div className="space-y-6">
                    {[
                      {
                        title: "Personal AI Tutor",
                        description: "Get instant answers to your questions with our advanced AI tutor.",
                        icon: (
                          <div className="bg-accent/20 p-3 rounded-full">
                            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                            </svg>
                          </div>
                        ),
                      },
                      {
                        title: "Gamified Learning",
                        description: "Earn points and unlock rewards as you progress.",
                        icon: (
                          <div className="bg-purple-500/20 p-3 rounded-full">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
                            </svg>
                          </div>
                        ),
                      },
                      {
                        title: "Progress Tracking",
                        description: "Monitor your improvement with detailed analytics.",
                        icon: (
                          <div className="bg-green-500/20 p-3 rounded-full">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                          </div>
                        ),
                      },
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start space-x-4" data-aos="fade-up" data-aos-delay={100 * index}>
                        {feature.icon}
                        <div>
                          <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                          <p className="text-gray-300">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA - toggle between login/register */}
                  <div className="pt-4">
                    {isRegisterPage ? (
                      <>
                        <p className="text-gray-300 mb-4">Already have an account?</p>
                        <Link
                          to="/login"
                          className="inline-flex items-center bg-accent hover:bg-blue-700 text-black px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                          </svg>
                          Sign In
                        </Link>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-300 mb-4">New to Aiyoh? Create an account to get started.</p>
                        <Link
                          to="/register"
                          className="inline-flex items-center bg-accent hover:bg-blue-700 text-black  px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0 0h6m-6 0H6"></path>
                          </svg>
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 relative z-10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Aiyoh. All Rights Reserved.
              </div>
              <div className="flex space-x-6">
                <p className="text-gray-400 hover:text-white text-sm cursor-pointer">Privacy Policy</p>
                <p className="text-gray-400 hover:text-white text-sm cursor-pointer">Terms of Service</p>
                <p className="text-gray-400 hover:text-white text-sm cursor-pointer">Help Center</p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Keyframes animations */}
      <style jsx="true">{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 25s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
};

export default Login; 