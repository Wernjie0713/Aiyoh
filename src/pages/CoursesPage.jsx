import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const CoursesPage = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    // Initialize AOS for animations
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="pt-20 bg-primary-lighter min-h-screen">
      <div className="container mx-auto px-6 lg:px-12 py-12">
        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-4xl font-bold mb-4">Your Learning Journey</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Explore our curriculum and interactive courses designed to boost your learning experience.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {/* Example Course Cards */}
          {[
            {
              title: "Web Development",
              level: "Beginner",
              description: "Build modern web applications with the latest technologies.",
              image: "/assets/img/web-development.jpg",
              progress: 75,
              color: "from-accent to-green-400",
              authority: "UTM"
            },
            {
              title: "Data Structures",
              level: "Intermediate",
              description: "Master essential data structures for efficient problem solving.",
              image: "/assets/img/data-structure.jpg",
              progress: 45,
              color: "from-accent to-green-400",
              authority: "UTAR"
            },
            {
              title: "Machine Learning",
              level: "All Levels",
              description: "Dive deep into ML algorithms and practical applications.",
              image: "/assets/img/machine-learning.jpg",
              progress: 10,
              color: "from-accent to-green-400",
              authority: "UTHM"
            },
            {
              title: "AI Fundamentals",
              level: "Beginner",
              description: "Learn the basics of artificial intelligence and machine learning concepts.",
              image: "/assets/img/ai-fundamentals.jpg",
              progress: 0,
              color: "from-accent to-green-400",
              authority: "CISCO"
            },
            {
              title: "Mobile App Development",
              level: "Intermediate",
              description: "Create cross-platform mobile apps using React Native.",
              image: "/assets/img/mobile-application-development.jpg",
              progress: 0,
              color: "from-accent to-green-400",
              authority: "AWS"
            },
            {
              title: "Cloud Computing",
              level: "Intermediate",
              description: "Master cloud platforms and deployment strategies.",
              image: "/assets/img/cloud-computing.jpg",
              progress: 0,
              color: "from-accent to-green-400",
              authority: "USM"
            }
          ].map((course, index) => (
            <div 
              key={index} 
              className="bg-primary-light backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-800 hover:border-accent/30 transition-all hover:-translate-y-2 duration-300" 
              data-aos="fade-up" 
              data-aos-delay={index * 100}
            >
              <div className="relative">
                {/* Render course image if available, otherwise show gradient placeholder */}
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className={`h-48 bg-gradient-to-r ${course.color} flex items-center justify-center`}>
                    <span className="text-black text-xl font-bold">{course.title}</span>
                  </div>
                )}
                
                {/* Level badge */}
                <div className="absolute top-3 right-3 bg-black/70 text-accent px-3 py-1 rounded-full text-xs font-semibold shadow-md border border-accent/30">
                  {course.level}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white flex items-center gap-2 flex-wrap">
                  <span>{course.title}</span>
                  {/* Badge Icon and Tooltip replaced by Label */}
                  {/* 
                  <span 
                    className="cursor-help" 
                    title="This course will provide you a badge by Aiyoh Academy"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent hover:text-yellow-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                   */}
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                    Verified by {course.authority}
                  </span>
                </h3>
                <p className="text-gray-300 text-sm mb-4 h-10">{course.description}</p>
                
                {/* Progress bar */}
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-xs font-medium text-accent">
                    {course.progress > 0 ? 'In Progress' : 'Not Started'}
                  </span>
                  <span className="text-xs font-medium text-accent">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-accent"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                
                {/* Action button */}
                <Link 
                  to={course.title === "Web Development" ? "/courses/web-development" : "#"}
                  className={`mt-6 w-full py-2 rounded-lg font-medium text-center block ${
                    course.progress > 0 
                      ? 'bg-accent text-black hover:bg-opacity-80' 
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  } transition-colors shadow-md hover:shadow-lg`}
                >
                  {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage; 