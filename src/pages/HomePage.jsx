import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import About from '../components/About';
import ScrollReveal from '../blocks/TextAnimations/ScrollReveal/ScrollReveal';
import ScrollFloat from '../blocks/TextAnimations/ScrollFloat/ScrollFloat';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      offset: 100,
    });
  }, []);

  return (
    <>
      {/* Abstract floating elements that appear throughout the page */}
      <div className="fixed w-full h-full top-0 left-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/3 left-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-blob"></div>
        <div className="absolute top-2/3 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl animate-blob animation-delay-3000"></div>
      </div>

      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary-dark to-primary-darker overflow-hidden relative">
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-0 right-0 bg-accent rounded-full w-64 h-64 -mt-20 -mr-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 bg-orange-400 rounded-full w-80 h-80 -mb-32 -ml-16 blur-3xl"></div>
          
          {/* Add geometric patterns */}
          <div className="absolute top-1/4 left-1/4 w-24 h-24 border-2 border-accent/20 rounded-lg rotate-12"></div>
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 border-2 border-blue-300/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border-2 border-purple-300/20 rotate-45"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-10 mb-10 md:mb-0">
              <div className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6"
                   data-aos="fade-right" data-aos-delay="100">
                Stop Procrastinating. Start Learning.
              </div>
              <div data-aos="fade-up" data-aos-delay="200">
                <ScrollReveal>
                  Transform Your Study Habits With AI
                </ScrollReveal>
              </div>
              <p className="text-xl text-gray-300 mb-8 max-w-lg" data-aos="fade-up" data-aos-delay="300">
              Aiyoh helps you overcome procrastination with personalized AI assistance, gamified rewards, and adaptive learning paths.
              </p>
              <div className="flex flex-wrap gap-4" data-aos="fade-up" data-aos-delay="400">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  className="bg-white text-primary hover:bg-gray-200 px-8 py-3 rounded-full font-medium transition-colors duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                  Get Started Free
                </Link>
                <Link
                  to="/chat"
                  className="bg-accent hover:bg-blue-700 text-black px-8 py-3 rounded-full font-medium transition-colors duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  Try AI Tutor
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap mt-10 gap-x-10 gap-y-4 text-center md:text-left">
                <div data-aos="fade-up" data-aos-delay="500">
                  <p className="text-accent text-3xl font-bold">85%</p>
                  <p className="text-gray-300 text-sm">Improved Focus</p>
                </div>
                <div data-aos="fade-up" data-aos-delay="600">
                  <p className="text-accent text-3xl font-bold">25K+</p>
                  <p className="text-gray-300 text-sm">Active Students</p>
                </div>
                <div data-aos="fade-up" data-aos-delay="700">
                  <p className="text-accent text-3xl font-bold">92%</p>
                  <p className="text-gray-300 text-sm">Satisfaction Rate</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center" data-aos="zoom-in" data-aos-delay="300">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-accent/30 rounded-2xl blur-xl"></div>
                <div className="relative">
                  <img
                    src="/assets/img/hero-img.png"
                    alt="Aiyoh"
                    className="w-full max-w-md relative z-10 rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-primary-lighter relative">        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <ScrollFloat containerClassName="mb-2">
              Features You'll Love
            </ScrollFloat>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Tools designed to help you stay motivated and focused on your learning journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:-translate-y-2 relative overflow-hidden" data-aos="fade-up" data-aos-delay="100">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full -mt-4 -mr-4 opacity-50"></div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 relative z-10">
                <img src="/assets/img/chatbot.png" alt="AI Tutor" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Personal AI Tutor</h3>
              <p className="text-gray-600">
                Get instant answers to your questions with our advanced AI tutor. Available 24/7 to help with any subject.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:-translate-y-2 relative overflow-hidden" data-aos="fade-up" data-aos-delay="200">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-bl-full -mt-4 -mr-4 opacity-50"></div>
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4 relative z-10">
                <img src="/assets/img/trophy.png" alt="Rewards" className="w-6 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Gamified Rewards</h3>
              <p className="text-gray-600">
                Earn points, unlock achievements, and discover bonus points that make learning addictively fun.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:-translate-y-2 relative overflow-hidden" data-aos="fade-up" data-aos-delay="300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-full -mt-4 -mr-4 opacity-50"></div>
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4 relative z-10">
                <img src="/assets/img/learning_progress.png" alt="Adaptive Learning" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Adaptive Learning</h3>
              <p className="text-gray-600">
                Our system adapts to your learning style and pace, focusing on areas where you need the most help.
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-primary"></path>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <About />

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-10 space-y-20 relative">
        
        {/* Tools Section */}
        <div className="text-center space-y-6 relative z-10" data-aos="fade-up">
          <div className="mb-8">
            <ScrollReveal containerClassName="mb-2">
              Master Essential Skills
            </ScrollReveal>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Our platform offers the latest industry-standard tools and technologies to prepare you for real-world success.
            </p>
          </div>
          <div className="mt-10 rounded-2xl shadow-xl relative" data-aos="zoom-in">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl blur-lg opacity-30"></div>
            <div className="relative rounded-2xl overflow-hidden">
              <img src="/assets/img/skills.png" alt="Best Tools" className="w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Tutorials Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10" data-aos="fade-right">
          <div className="space-y-6 order-2 md:order-1">
            <ScrollFloat containerClassName="mb-2 text-left">
              Learning Paths
            </ScrollFloat>
            <p className="text-lg text-gray-300 text-center md:text-left">
              Follow structured, step-by-step learning paths tailored to your goals. Our guides keep you on track and motivated throughout your learning journey.
            </p>
            <ul className="space-y-3">
              {['Personalized learning recommendations', 'Interactive quizzes and challenges', 'Real-world projects to build your portfolio'].map((item, index) => (
                <li key={index} className="flex items-center" data-aos="fade-up" data-aos-delay={100 * index}>
                  <svg className="w-5 h-5 text-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/guides" className="inline-block text-accent font-medium hover:underline mt-2 group">
              Explore our learning paths 
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="order-1 md:order-2" data-aos="zoom-in">
            <div className="relative">
              <div className="absolute -inset-2 bg-accent/10 rounded-xl blur-lg"></div>
              <img src="/assets/img/Guides.png" alt="Guides" className="w-full rounded-lg shadow-xl relative" />
              {/* Decorative elements */}
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-accent/20 rounded-lg rotate-12 z-[-1]"></div>
              <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-accent/20 rounded-full z-[-1]"></div>
            </div>
          </div>
        </div>

        {/* Progress Tracking Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10" data-aos="fade-left">
          <div data-aos="zoom-in">
            <div className="relative">
              <div className="absolute -inset-2 bg-accent/10 rounded-xl blur-lg"></div>
              <img src="/assets/img/Score Card.png" alt="Progress Tracking" className="w-full rounded-lg shadow-xl relative" />
              {/* Decorative elements */}
              <div className="absolute -top-3 -left-3 w-16 h-16 bg-accent/20 rounded-lg rotate-12 z-[-1]"></div>
              <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-accent/20 rounded-full z-[-1]"></div>
            </div>
          </div>
          <div className="space-y-6">
            <ScrollFloat containerClassName="mb-2 text-left">
              Track Your Progress
            </ScrollFloat>
            <p className="text-lg text-gray-300 text-center md:text-left">
              Monitor your learning journey with detailed analytics and progress reports. Visualize your improvement and identify areas that need attention.
            </p>
            <ul className="space-y-3">
              {['Comprehensive progress dashboards', 'Achievement certificates for completed courses', 'Performance insights and improvement suggestions'].map((item, index) => (
                <li key={index} className="flex items-center" data-aos="fade-up" data-aos-delay={100 * index}>
                  <svg className="w-5 h-5 text-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/dashboard" className="inline-block text-accent font-medium hover:underline mt-2 group">
              View your dashboard 
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div className="text-center space-y-6 relative z-10" data-aos="fade-up">
          <ScrollReveal containerClassName="mb-2">
            What Our Students Say
          </ScrollReveal>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied students who have transformed their study habits with Aiyoh
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              {
                name: "Sarah Johnson",
                role: "Computer Science Student",
                image: "/assets/img/Profile.png",
                quote: "Aiyoh helped me overcome my procrastination issues. The AI tutor is like having a personal teacher available 24/7."
              },
              {
                name: "Michael Chen",
                role: "Engineering Major",
                image: "/assets/img/Profile.png",
                quote: "The gamified system keeps me motivated. I've improved my grades significantly since I started using Aiyoh."
              },
              {
                name: "Jessica Patel",
                role: "Business Student",
                image: "/assets/img/Profile.png",
                quote: "I love how the platform adapts to my learning style. It's intuitive and makes studying enjoyable rather than a chore."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-primary-light p-6 rounded-xl relative overflow-hidden" 
                   data-aos="fade-up" data-aos-delay={100 * index}>
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-bl-3xl"></div>
                <div className="flex items-center mb-4 relative z-10">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-accent/20 rounded-full blur-sm"></div>
                    <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 relative" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-left relative z-10">{testimonial.quote}</p>
                <div className="flex mt-4 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="relative rounded-2xl overflow-hidden" data-aos="zoom-in">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-accent to-blue-700"></div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mt-10 -mr-10"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full -mb-20 -ml-20"></div>
          <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-white/10 rounded-full"></div>
          
          <div className="relative p-10 text-white text-center">
            <ScrollReveal containerClassName="mb-4" textClassName="text-white">
              Ready to Transform Your Learning?
            </ScrollReveal>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join Aiyoh today and experience the future of education with our AI-powered learning platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                data-aos="fade-up" data-aos-delay="100"
              >
                Create Free Account
              </Link>
              <Link
                to="/demo"
                className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                data-aos="fade-up" data-aos-delay="200"
              >
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Need to add keyframes animations for blob animation */}
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
          animation: blob 7s infinite;
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

export default HomePage; 