import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('progress');
  const { currentUser } = useAuth();
  const [rewardPoints, setRewardPoints] = useState(0);
  
  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      offset: 100,
    });
  }, []);

  // Load reward points from localStorage
  useEffect(() => {
    const storedPoints = localStorage.getItem('aicademy_reward_points');
    if (storedPoints) {
      setRewardPoints(parseInt(storedPoints));
    }
  }, []);

  // This would normally be fetched from a backend API
  // Using courses from CoursesPage with progress > 0
  const courses = [
    {
      id: 1,
      title: 'Web Development',
      progress: 75,
      image: '/assets/img/web-development.jpg',
      description: 'Build modern web applications with the latest technologies.',
      level: 'Beginner',
      lastAccessed: '2 hours ago',
      estimatedTimeLeft: '2 hours'
    },
    {
      id: 2,
      title: 'Data Structures',
      progress: 45,
      image: '/assets/img/data-structure.jpg',
      description: 'Master essential data structures for efficient problem solving.',
      level: 'Intermediate',
      lastAccessed: '1 day ago',
      estimatedTimeLeft: '7 hours'
    },
    {
      id: 3,
      title: 'Machine Learning',
      progress: 10,
      image: '/assets/img/machine-learning.jpg',
      description: 'Dive deep into ML algorithms and practical applications.',
      level: 'All Levels',
      lastAccessed: '3 days ago',
      estimatedTimeLeft: '15 hours'
    }
  ];

  // Sample earned badges (replace with actual data later)
  const earnedBadges = [
    {
      id: 'badge-web-dev',
      name: 'Web Development Foundation',
      course: 'Web Development',
      authority: 'UTM',
      dateEarned: '2024-07-20',
      icon: (
        <img src="/assets/badge/badge-1.png" alt="Web Development Foundation Badge" className="h-12 w-12 object-contain" />
      ),
    },
    {
      id: 'badge-data-struct',
      name: 'Data Structures Explorer',
      course: 'Data Structures',
      authority: 'UTAR',
      dateEarned: '2024-07-22',
      icon: (
        <img src="/assets/badge/badge-2.png" alt="Data Structures Explorer Badge" className="h-12 w-12 object-contain" />
      ),
    },
  ];

  // Calculate total stats
  const totalProgress = courses.reduce((sum, course) => sum + course.progress, 0) / courses.length;
  const completedModules = 8; // This would come from the API
  const totalLearningHours = 24.5;

  // Weekly activity data
  const weeklyActivity = [
    { day: 'Mon', hours: 1.5 },
    { day: 'Tue', hours: 2.0 },
    { day: 'Wed', hours: 0.5 },
    { day: 'Thu', hours: 3.0 },
    { day: 'Fri', hours: 2.5 },
    { day: 'Sat', hours: 1.0 },
    { day: 'Sun', hours: 0.0 },
  ];

  // Recent achievements
  const achievements = [
    {
      id: 1,
      title: 'Web Development Master',
      description: 'Completed 75% of the Web Development course',
      date: 'April 25, 2025',
      icon: (
        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Consistent Learner',
      description: 'Studied for 5 consecutive days',
      date: 'April 25, 2025',
      icon: (
        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
        </svg>
      )
    },
  ];

  // Reward tiers and thresholds
  const rewardTiers = [
    { name: "Bronze Scholar", threshold: 0, icon: "🥉" },
    { name: "Silver Scholar", threshold: 100, icon: "🥈" },
    { name: "Gold Scholar", threshold: 300, icon: "🥇" },
    { name: "Platinum Scholar", threshold: 600, icon: "💎" },
    { name: "Diamond Scholar", threshold: 1000, icon: "👑" }
  ];

  // Get current reward tier
  const getCurrentTier = () => {
    for (let i = rewardTiers.length - 1; i >= 0; i--) {
      if (rewardPoints >= rewardTiers[i].threshold) {
        return rewardTiers[i];
      }
    }
    return rewardTiers[0];
  };

  // Get next reward tier
  const getNextTier = () => {
    const currentTierIndex = rewardTiers.findIndex(tier => 
      tier.name === getCurrentTier().name
    );
    
    if (currentTierIndex < rewardTiers.length - 1) {
      return rewardTiers[currentTierIndex + 1];
    }
    return null;
  };

  // Calculate progress to next tier
  const getNextTierProgress = () => {
    const nextTier = getNextTier();
    if (!nextTier) return 100; // Already at highest tier
    
    const currentTier = getCurrentTier();
    const pointsNeededForNext = nextTier.threshold - currentTier.threshold;
    const pointsEarned = rewardPoints - currentTier.threshold;
    
    return Math.min(100, Math.round((pointsEarned / pointsNeededForNext) * 100));
  };

  return (
    <div className="pt-24 pb-16 bg-primary-lighter min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary-light to-primary mb-10 rounded-2xl p-6 shadow-lg border border-accent/20" data-aos="fade-up">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome Back, <span className="text-accent">{currentUser?.name || currentUser?.email || 'Learner'}</span></h1>
              <p className="text-gray-300">Your learning journey continues. You've completed <span className="text-accent font-semibold">{Math.round(totalProgress)}%</span> of your courses.</p>
            </div>
            <div className="w-24 h-24">
              <CircularProgressbar
                value={totalProgress}
                text={`${Math.round(totalProgress)}%`}
                styles={buildStyles({
                  pathColor: '#FF6600',
                  textColor: '#FF6600',
                  trailColor: '#333333',
                })}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" data-aos="fade-up" data-aos-delay="100">
          <div className="bg-primary-light rounded-xl p-6 shadow-lg border border-gray-800 hover:border-accent/30 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-accent rounded-full mr-4">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-1 text-white">{courses.length}</h2>
                <p className="text-accent text-sm">Courses in Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-light rounded-xl p-6 shadow-lg border border-gray-800 hover:border-accent/30 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-accent rounded-full mr-4">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-1 text-white">{completedModules}</h2>
                <p className="text-accent text-sm">Completed Modules</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-light rounded-xl p-6 shadow-lg border border-gray-800 hover:border-accent/30 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-accent rounded-full mr-4">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-1 text-white">{totalLearningHours}</h2>
                <p className="text-accent text-sm">Learning Hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="mb-6" data-aos="fade-up" data-aos-delay="200">
          <div className="flex space-x-4 border-b border-gray-800 mb-8">
            <button 
              className={`py-2 px-4 focus:outline-none ${activeTab === 'progress' ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-gray-300'}`} 
              onClick={() => setActiveTab('progress')}
            >
              My Progress
            </button>
            <button 
              className={`py-2 px-4 focus:outline-none ${activeTab === 'achievements' ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-gray-300'}`} 
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </button>
            <button 
              className={`py-2 px-4 focus:outline-none ${activeTab === 'activity' ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-gray-300'}`} 
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
            <button 
              className={`py-2 px-4 focus:outline-none ${activeTab === 'rewards' ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-gray-300'}`} 
              onClick={() => setActiveTab('rewards')}
            >
              Rewards
            </button>
            <button 
              className={`py-2 px-4 focus:outline-none ${activeTab === 'badges' ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-gray-300'}`} 
              onClick={() => setActiveTab('badges')}
            >
              Badges
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {/* Courses Progress Tab */}
            {activeTab === 'progress' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                  <div 
                    key={course.id} 
                    className="bg-primary-light rounded-xl overflow-hidden shadow-xl border border-gray-800 hover:border-accent/30 transition-all hover:-translate-y-2 duration-300" 
                    data-aos="fade-up" 
                    data-aos-delay={index * 100}
                  >
                    <div className="relative">
                      <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                      <div className="absolute top-3 right-3 bg-black/70 text-accent px-3 py-1 rounded-full text-xs font-semibold shadow-md border border-accent/30">
                        {course.level}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-xs">Last accessed: {course.lastAccessed}</span>
                          <span className="text-accent text-xs">{course.progress}% Complete</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-1 text-white">{course.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2 h-10">{course.description}</p>
                      
                      <div className="flex justify-between mb-2 text-xs font-medium">
                        <span className="text-accent">Progress</span>
                        <span className="text-accent">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                        <div 
                          className="h-2 rounded-full bg-accent"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                      </div>
                      
                      <div className="flex justify-between text-gray-400 text-xs mb-4">
                        <span>Estimated time left: {course.estimatedTimeLeft}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link to={course.id === 1 ? '/courses/web-development' : '/courses'} className="flex-1 py-2 text-center rounded-lg font-medium bg-accent text-black hover:bg-opacity-80 transition-colors shadow-md">
                          Continue
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="bg-primary-light rounded-xl p-6 shadow-lg" data-aos="fade-up">
                <h2 className="text-xl font-bold mb-6 text-white border-b border-gray-800 pb-3">Your Learning Achievements</h2>
                <div className="space-y-6">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-start hover:bg-primary-lighter p-4 rounded-lg transition-colors">
                      <div className="p-3 bg-accent rounded-full mr-4 shrink-0">
                        {achievement.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{achievement.title}</h3>
                        <p className="text-gray-400 text-sm mb-1">{achievement.description}</p>
                        <p className="text-accent text-xs">Earned on {achievement.date}</p>
                      </div>
                    </div>
                  ))}

                  <div className="mt-8 text-center p-6 border border-dashed border-accent/30 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-2">Keep Learning to Earn More Achievements!</h3>
                    <p className="text-gray-400 text-sm mb-4">Your next achievement is just around the corner.</p>
                    <Link to="/courses" className="inline-block bg-accent text-black py-2 px-6 rounded-lg font-medium hover:bg-opacity-80 transition-colors shadow-md">
                      Explore Courses
                  </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-aos="fade-up">
                <div className="bg-primary-light rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold mb-6 text-white border-b border-gray-800 pb-3">Weekly Learning Activity</h2>
                  <div className="relative w-full h-48 mt-4">
                    <svg viewBox="0 0 600 200" className="w-full h-full">
                      <polyline
                        fill="none"
                        stroke="#FF6600"
                        strokeWidth="4"
                        points={weeklyActivity.map((day, i) => {
                          const x = i * (600 / (weeklyActivity.length - 1));
                          const y = 200 - (day.hours / 3) * 200;
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                      {weeklyActivity.map((day, i) => {
                        const x = i * (600 / (weeklyActivity.length - 1));
                        const y = 200 - (day.hours / 3) * 200;
                        return (
                          <circle key={i} cx={x} cy={y} r="6" fill="#FF6600" />
                        );
                      })}
                    </svg>
                  </div>
                  {/* Day and hours row (compact, no extra vertical gap) */}
                  <div className="flex justify-between mt-2 text-xs">
                    {weeklyActivity.map((day, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <span className="text-accent font-medium">{day.hours}h</span>
                        <span className="text-gray-400">{day.day}</span>
              </div>
            ))}
                  </div>
                  <div className="text-center mt-6">
                    <p className="text-gray-400 text-sm">Total this week: <span className="text-accent font-medium">10.5 hours</span></p>
                  </div>
                </div>

                <div className="bg-primary-light rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold mb-6 text-white border-b border-gray-800 pb-3">Learning Streak</h2>
                  <div className="flex justify-center items-center h-48">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-accent mb-2">5</div>
                      <p className="text-gray-400">days in a row</p>
                      <p className="text-white mt-4 text-sm">Keep going! Your best streak is 7 days.</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Link to="/courses" className="bg-accent text-black py-2 px-6 rounded-lg font-medium hover:bg-opacity-80 transition-colors shadow-md text-center">
                      Study Today
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {/* Rewards Tab */}
            {activeTab === 'rewards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-aos="fade-up">
                {/* Reward Points Overview */}
                <div className="bg-primary-light rounded-xl p-6 shadow-lg border border-gray-800 hover:border-accent/30 transition-all duration-300">
                  <h2 className="text-xl font-bold mb-6 text-white border-b border-gray-800 pb-3">Your Reward Points</h2>
                  
                  <div className="flex items-center justify-center mb-8">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-accent mb-2">{rewardPoints}</div>
                      <p className="text-gray-400">total points earned</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-primary/60 rounded-xl p-4 mb-6">
                    <div className="text-4xl mr-4">{getCurrentTier().icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{getCurrentTier().name}</h3>
                      <p className="text-gray-400 text-sm">Current Reward Tier</p>
                    </div>
                  </div>
                  
                  {getNextTier() && (
                    <div className="mt-6">
                      <div className="flex justify-between mb-2 text-sm font-medium">
                        <span className="text-accent">Progress to {getNextTier().name}</span>
                        <span className="text-accent">{getNextTierProgress()}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                        <div 
                          className="h-2 rounded-full bg-accent"
                          style={{ width: `${getNextTierProgress()}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-400 text-xs text-right">
                        {getNextTier().threshold - rewardPoints} more points needed
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Reward Activities */}
                <div className="bg-primary-light rounded-xl p-6 shadow-lg border border-gray-800 hover:border-accent/30 transition-all duration-300">
                  <h2 className="text-xl font-bold mb-6 text-white border-b border-gray-800 pb-3">Ways to Earn Points</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start p-3 bg-primary/40 rounded-lg">
                      <div className="p-2 bg-accent/20 rounded-full mr-3">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Complete Course Modules</h3>
                        <p className="text-gray-400 text-sm">Earn 50 points for each module you complete</p>
          </div>
        </div>

                    <div className="flex items-start p-3 bg-primary/40 rounded-lg">
                      <div className="p-2 bg-accent/20 rounded-full mr-3">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
        <div>
                        <h3 className="font-medium text-white">Daily Learning Streak</h3>
                        <p className="text-gray-400 text-sm">Earn 10 points for each consecutive day of learning</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 bg-primary/40 rounded-lg">
                      <div className="p-2 bg-accent/20 rounded-full mr-3">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l.548 1.693a1 1 0 00.95.69h1.778c.969 0 1.371 1.24.588 1.81l-1.438 1.05a1 1 0 00-.364 1.118l.548 1.693c.3.921-.755 1.688-1.54 1.118l-1.438-1.05a1 1 0 00-1.176 0l-1.438 1.05c-.784.57-1.838-.197-1.539-1.118l.548-1.693a1 1 0 00-.364-1.118L2.44 6.12c-.783-.57-.38-1.81.588-1.81h1.778a1 1 0 00.95-.69l.548-1.693z" />
                </svg>
              </div>
              <div>
                        <h3 className="font-medium text-white">AI Engagement Reward</h3>
                        <p className="text-gray-400 text-sm">Earn points when AI detects active engagement with the course material</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 border border-dashed border-accent/30 rounded-lg text-center">
                    <p className="text-white">Keep exploring to find more ways to earn reward points!</p>
                  </div>
                </div>
              </div>
            )}

            {/* Badges Tab Content */}
            {activeTab === 'badges' && (
              <div data-aos="fade-up">
                <h3 className="text-xl font-semibold mb-6 text-white">My Earned Badges</h3>
                {earnedBadges.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {earnedBadges.map(badge => (
                      <div key={badge.id} className="bg-primary-light rounded-xl p-5 shadow-lg border border-gray-800 flex items-center">
                        <div className="mr-4 flex-shrink-0">
                          {badge.icon}
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-lg font-semibold text-white mb-1">{badge.name}</h4>
                          <p className="text-xs text-gray-400 mb-2">Awarded by {badge.authority} for {badge.course}</p>
                          <p className="text-xs text-gray-500">Earned on: {new Date(badge.dateEarned).toLocaleDateString()}</p>
                        </div>
                        <button 
                          className="ml-4 bg-accent/20 hover:bg-accent/40 text-accent text-xs font-medium py-1 px-3 rounded-full transition-colors whitespace-nowrap"
                          onClick={() => alert('Sharing functionality coming soon!')} // Placeholder action
                        >
                          Share
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-primary-light rounded-xl border border-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /> {/* Placeholder icon for no badges */} 
                    </svg>
                    <p className="text-gray-400">You haven't earned any badges yet.</p>
                    <p className="text-gray-500 text-sm mt-1">Complete courses to unlock badges!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recommended Section */}
        <div className="mt-12" data-aos="fade-up" data-aos-delay="300">
          <h2 className="text-2xl font-bold mb-6 text-white">Recommended For You</h2>
          <div className="bg-primary-light rounded-xl p-6 shadow-lg border border-gray-800">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/4 mb-4 md:mb-0 md:mr-6">
                <img 
                  src="/assets/img/ai-fundamentals.jpg" 
                  alt="AI Fundamentals" 
                  className="rounded-lg w-full h-40 object-cover"
                />
              </div>
              <div className="md:flex-1">
                <h3 className="text-xl font-bold text-white mb-2">AI Fundamentals</h3>
                <p className="text-gray-400 mb-4">Learn the basics of artificial intelligence and machine learning concepts. Perfect for beginners looking to enter the field of AI.</p>
                <div className="flex space-x-3">
                  <Link to="/courses" className="py-2 px-4 bg-accent text-black rounded-lg font-medium hover:bg-opacity-80 transition-colors shadow-md">
                    View Course
                  </Link>
                  <button className="py-2 px-4 border border-accent/30 text-accent rounded-lg hover:bg-accent/10 transition-colors">
                    Save for Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 