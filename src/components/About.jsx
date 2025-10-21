import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-16 bg-primary text-white">
      <div className="container mx-auto px-6 lg:px-12" data-aos="fade-up">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Beat Procrastination, Ace Your Studies</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">AI-powered solutions designed to transform how you learn and stay motivated</p>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
            <p className="mb-4 text-lg font-semibold text-accent">
              How AiThink benefits you:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-accent mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span><strong>AI Chatbot Tutor</strong> - Get personalized study assistance 24/7</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-accent mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span><strong>Gamified Experience</strong> - Discover points that reward consistent learning</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-accent mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span><strong>Interactive Learning</strong> - Engage with content in a way that fights academic burnout</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-accent mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span><strong>User-Friendly Interface</strong> - Intuitive design that makes learning accessible</span>
              </li>
            </ul>
          </div>
          <div className="md:w-1/2">
            <p className="mb-6">
            AiThink is revolutionizing education by addressing one of the biggest challenges students face: <strong className="text-accent">procrastination</strong>. Our platform combines advanced AI technology with proven engagement techniques to help you stay motivated and focused on your academic goals.
            </p>
            <p className="mb-6">
              Whether you're struggling with difficult concepts, need help organizing your study schedule, or simply want to make learning more engaging, AiThink's intelligent systems adapt to your unique learning style and needs.
            </p>
            <div className="space-y-2 mb-6">
              <a href="#" className="text-accent hover:text-blue-400 block flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                How our AI tutoring works
              </a>
              <a href="#" className="text-accent hover:text-blue-400 block flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Our approach to engagement
              </a>
              <a href="#" className="text-accent hover:text-blue-400 block flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Student success stories
              </a>
            </div>
            <a
              href="#"
              className="inline-block px-6 py-3 border-2 text-[#FF6600] border-accent hover:bg-accent hover:text-black transition-colors duration-300 rounded-lg font-medium"
            >
              Start Learning
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 