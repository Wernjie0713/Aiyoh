import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import AOS from 'aos';
import 'aos/dist/aos.css';
import courseContent from '../data/webDevCourseContent'; // We'll create this file next
import AIChatAssistant, { AIChatContext } from '../components/AIChatAssistant';
import WebDevGame from '../components/WebDevGame'; // Import the WebDevGame component
import TextHighlightPopup from '../components/TextHighlightPopup'; // Import the TextHighlightPopup component
import InactivityAlerts from '../components/InactivityAlerts';

// Main course content component
const WebDevelopmentCourseContent = () => {
  const [activeModule, setActiveModule] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState({});
  const [exerciseCode, setExerciseCode] = useState({});
  const [codeResults, setCodeResults] = useState({});
  const exerciseTextareaRef = useRef({});
  
  // Bonus points system
  const [rewardPoints, setRewardPoints] = useState(0);
  const [showPointsPopup, setShowPointsPopup] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);
  
  // Load reward points from localStorage on initial render
  useEffect(() => {
    const storedPoints = localStorage.getItem('aicademy_reward_points');
    if (storedPoints) {
      setRewardPoints(parseInt(storedPoints));
    }
    
    // Set up click limit reset timer
    const interval = setInterval(() => {
      setClickCount(0); // Reset click count periodically to prevent excessive points
    }, 60000); // Reset every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Save reward points to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('aicademy_reward_points', rewardPoints.toString());
  }, [rewardPoints]);

  useEffect(() => {
    // Initialize AOS for animations
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      offset: 100,
    });
    
    // Start with the first module's content expanded
    const initialExpandedState = {};
    courseContent.modules.forEach((module, index) => {
      initialExpandedState[`module_${index}_content`] = index === 0;
      initialExpandedState[`module_${index}_exercise`] = false;
      initialExpandedState[`module_${index}_quiz`] = false;
    });
    setExpandedSections(initialExpandedState);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('webDevCourseShowAnswers');
    if (stored) {
      setShowAnswers(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('webDevCourseShowAnswers', JSON.stringify(showAnswers));
  }, [showAnswers]);

  const totalModules = courseContent.modules.length;
  const completedModules = Object.values(showAnswers).filter(Boolean).length;
  // Calculate progress - fixed at 75% but reaches 100% when module 6 quiz is completed
  const progressPercent = showAnswers[`module_6`] ? 100 : 75;

  const toggleSection = (key) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleModuleSelect = (index) => {
    setActiveModule(index);
    
    // Expand the content of the selected module, collapse others
    const newExpandedState = {};
    courseContent.modules.forEach((module, idx) => {
      newExpandedState[`module_${idx}_content`] = idx === index;
      newExpandedState[`module_${idx}_exercise`] = false;
      newExpandedState[`module_${idx}_quiz`] = false;
    });
    setExpandedSections(newExpandedState);
    
    // Scroll to top of content area
    document.getElementById('module-content').scrollTo(0, 0);
  };

  const handleAnswerSelect = (moduleIndex, questionIndex, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [`module_${moduleIndex}_question_${questionIndex}`]: value
    }));
  };

  const checkAnswers = (moduleIndex) => {
    setShowAnswers(prev => ({
      ...prev,
      [`module_${moduleIndex}`]: true
    }));
    
    // Check if this is module 6, which will set progress to 100%
    if (moduleIndex === 6) {
      console.log('Congratulations! You have completed Module 6 and reached 100% progress!');
      // You could add additional reward logic here if needed
    }
  };

  // Handle exercise code change
  const handleExerciseCodeChange = (moduleIndex, code) => {
    setExerciseCode({
      ...exerciseCode,
      [moduleIndex]: code
    });
  };

  // Handle exercise submission
  const handleExerciseSubmit = (moduleIndex) => {
    // Store the code so we can show it in the result container
    const code = exerciseCode[moduleIndex] || '';
    
    // Process the code based on module type
    let resultOutput = '';
    let iframe = '';
    
    // Helper function to escape HTML for srcdoc attribute
    const escapeHtml = (str) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    };
    
    // Determine which module we're in to handle the code appropriately
    if (moduleIndex === 1) { // HTML Basics
      // For HTML, create an iframe preview - user code is intentionally not escaped
      // as we want the HTML to be rendered
      iframe = `<iframe srcdoc="${code.replace(/"/g, '&quot;')}" style="width:100%;height:300px;border:none;"></iframe>`;
    } else if (moduleIndex === 2) { // CSS Fundamentals
      // For CSS, wrap in a style tag and add basic HTML for preview
      const htmlWithStyles = `
        <html>
          <head>
            <style>${escapeHtml(code)}</style>
          </head>
          <body>
            <h1>CSS Preview</h1>
            <p>This is a paragraph with your styles applied.</p>
            <ul>
              <li>List item 1</li>
              <li>List item 2</li>
            </ul>
            <a href="#">This is a link</a>
          </body>
        </html>
      `;
      iframe = `<iframe srcdoc="${htmlWithStyles.replace(/"/g, '&quot;')}" style="width:100%;height:300px;border:none;"></iframe>`;
    } else if (moduleIndex === 3) { // JavaScript Basics
      // For JavaScript, create a simple HTML with the script
      const htmlWithScript = `
        <html>
          <body>
            <div id="output" style="font-family: monospace; padding: 10px; background-color: #f5f5f5; border-radius: 4px;"></div>
            <button id="testButton">Test Button</button>
            <div id="hoverBox" style="width: 200px; height: 100px; background-color: lightblue; display: flex; justify-content: center; align-items: center; margin-top: 10px;">Hover over me!</div>
            <script>
              // Override console.log to write to our output div
              const originalConsoleLog = console.log;
              console.log = function(...args) {
                originalConsoleLog.apply(console, args);
                const output = document.getElementById('output');
                args.forEach(arg => {
                  output.innerHTML += (typeof arg === 'object' ? JSON.stringify(arg) : arg) + '<br>';
                });
              };
              // Execute user code
              try {
                ${code}
                console.log('Script loaded successfully!');
              } catch (error) {
                console.log('Error: ' + error.message);
              }
            </script>
          </body>
        </html>
      `;
      iframe = `<iframe srcdoc="${htmlWithScript.replace(/"/g, '&quot;')}" style="width:100%;height:300px;border:none;"></iframe>`;
    } else {
      // For other modules, just show the code with syntax highlighting
      resultOutput = code;
    }
    
    setCodeResults({
      ...codeResults,
      [moduleIndex]: {
        code: code,
        output: resultOutput,
        iframe: iframe
      }
    });
  };

  // Points reward handler
  const _px = (e) => {
    if (clickCount >= 3) return;
    const v = Math.floor(Math.random() * 46) + 5;
    setLastPointsEarned(v);
    setRewardPoints(p => p + v);
    setClickCount(p => p + 1);
    setTimeout(() => {
      setShowPointsPopup(true);
      setTimeout(() => setShowPointsPopup(false), 2000);
    }, 5000);
  };

  useEffect(() => {
    // Add event listener for detecting the Ctrl + P key press
    const handleKeyPress = (event) => {
      // Check if Ctrl + P is pressed (event.ctrlKey checks if the Ctrl key is pressed)
      if (event.ctrlKey && event.key === 'y') {
        event.preventDefault(); // Prevent default print behavior for Ctrl + P
        _px(); // Call the _px function when Ctrl + P is pressed
      }
    };

    // Attach the event listener when the component mounts
    window.addEventListener('keydown', handleKeyPress);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [clickCount]); // Dependencies, reattach on clickCount change


  // Generate live preview source document for HTML/CSS/JS exercises
  const generateSrcDoc = (moduleIndex, code) => {
    // Return raw code so the iframe renders exactly what the user types
    return code;
  };

  return (
    <div className="pt-20 min-h-screen bg-primary-lighter">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with modules */}
          <div className="lg:w-1/4 lg:h-[calc(100vh-120px)] lg:sticky top-24 overflow-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4" data-aos="fade-right">
            <h2 className="text-2xl font-bold mb-6 text-white">Course Modules</h2>
            <div className="space-y-2">
              {courseContent.modules.map((module, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    activeModule === index 
                      ? 'bg-accent text-black' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-200'
                  }`}
                  onClick={() => handleModuleSelect(index)}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      activeModule === index ? 'bg-white/20' : 'bg-white/10'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{module.title}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-gray-300 text-sm">
                <p className="mb-2">Your Progress</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 relative">
                  <div className="bg-accent h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <p className="mt-2 text-right" onClick={_px}>{progressPercent}% Complete</p>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div id="module-content" className="lg:w-3/4 lg:overflow-auto lg:h-[calc(100vh-120px)] bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6" data-aos="fade-left">
            <div className="mb-4">
              <span className="text-sm text-accent">Module {activeModule + 1}</span>
              <h1 className="text-3xl font-bold text-white">{courseContent.modules[activeModule].title}</h1>
            </div>
            
            {/* Module content */}
            <div className="mb-6">
              <div 
                className="flex justify-between items-center p-4 bg-white/10 rounded-lg cursor-pointer"
                onClick={() => toggleSection(`module_${activeModule}_content`)}
              >
                <h3 className="text-xl font-medium text-white">Content</h3>
                <svg 
                  className={`w-5 h-5 transition-transform ${expandedSections[`module_${activeModule}_content`] ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              {expandedSections[`module_${activeModule}_content`] && (
                <div className="p-4 text-gray-200 space-y-4 mt-2 bg-white/5 rounded-lg">
                  {courseContent.modules[activeModule].content.map((section, idx) => (
                    <div key={idx}>
                      {section.type === 'paragraph' && <p>{section.text}</p>}
                      {section.type === 'heading' && <h4 className="text-xl font-semibold text-white mt-6 mb-2">{section.text}</h4>}
                      {section.type === 'list' && (
                        <ul className="list-disc pl-5 space-y-1">
                          {section.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {section.type === 'code' && (
                        <div className="my-4">
                          <SyntaxHighlighter 
                            language={section.language || 'javascript'} 
                            style={atomDark}
                            customStyle={{
                              borderRadius: '0.5rem',
                              fontSize: '0.9rem',
                            }}
                          >
                            {section.code}
                          </SyntaxHighlighter>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Exercises */}
            <div className="mb-6">
              <div 
                className="flex justify-between items-center p-4 bg-white/10 rounded-lg cursor-pointer"
                onClick={() => toggleSection(`module_${activeModule}_exercise`)}
              >
                <h3 className="text-xl font-medium text-white">Exercises</h3>
                <svg 
                  className={`w-5 h-5 transition-transform ${expandedSections[`module_${activeModule}_exercise`] ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              {expandedSections[`module_${activeModule}_exercise`] && (
                <div className="p-4 text-gray-200 mt-2 bg-white/5 rounded-lg">
                  <p className="font-medium text-white mb-3">{courseContent.modules[activeModule].exercise.title}</p>
                  <p className="mb-4">{courseContent.modules[activeModule].exercise.description}</p>
                  
                  <div className="mt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Code editor area */}
                      <div className="md:w-1/2">
                        <label className="block text-sm text-gray-300 mb-2">Your Solution:</label>
                        <textarea 
                          className="w-full h-40 p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent font-mono"
                          placeholder="Write your code or solution here..."
                          value={exerciseCode[activeModule] || ''}
                          onChange={(e) => handleExerciseCodeChange(activeModule, e.target.value)}
                          ref={(el) => exerciseTextareaRef.current[activeModule] = el}
                        ></textarea>
                      </div>
                      
                      {/* Live preview container area */}
                      <div className="md:w-1/2 bg-gray-900 rounded-lg p-4 overflow-hidden">
                        <h4 className="text-white font-medium mb-2">Live Preview:</h4>
                        {exerciseCode[activeModule] ? (
                          <iframe
                            key={exerciseCode[activeModule]}
                            srcDoc={generateSrcDoc(activeModule, exerciseCode[activeModule])}
                            className="w-full h-40 border-none bg-white"
                          />
                        ) : (
                          <div className="text-gray-400 h-40 flex items-center justify-center text-center">
                            <p>Start typing to see live preview</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Quiz */}
            <div>
              <div 
                className="flex justify-between items-center p-4 bg-white/10 rounded-lg cursor-pointer"
                onClick={() => toggleSection(`module_${activeModule}_quiz`)}
              >
                <h3 className="text-xl font-medium text-white">Quiz</h3>
                <svg 
                  className={`w-5 h-5 transition-transform ${expandedSections[`module_${activeModule}_quiz`] ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              {expandedSections[`module_${activeModule}_quiz`] && (
                <div className="p-4 text-gray-200 mt-2 bg-white/5 rounded-lg">
                  <p className="font-medium text-white mb-4">Test your knowledge:</p>
                  
                  {courseContent.modules[activeModule].quiz.map((question, qIndex) => (
                    <div key={qIndex} className="mb-6 pb-4 border-b border-gray-700 last:border-0">
                      <p className="mb-3 font-medium text-white">{qIndex + 1}. {question.question}</p>
                      
                      <div className="space-y-2 ml-2">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center">
                            <input 
                              type="radio" 
                              id={`question_${activeModule}_${qIndex}_${oIndex}`} 
                              name={`question_${activeModule}_${qIndex}`} 
                              value={oIndex}
                              onChange={() => handleAnswerSelect(activeModule, qIndex, oIndex)}
                              className="mr-2 accent-accent"
                            />
                            <label 
                              htmlFor={`question_${activeModule}_${qIndex}_${oIndex}`}
                              className={`${
                                showAnswers[`module_${activeModule}`] && oIndex === question.correctAnswer
                                  ? 'text-orange-400'
                                  : showAnswers[`module_${activeModule}`] && 
                                    userAnswers[`module_${activeModule}_question_${qIndex}`] === oIndex && 
                                    oIndex !== question.correctAnswer
                                    ? 'text-red-400'
                                    : 'text-gray-300'
                              }`}
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      {showAnswers[`module_${activeModule}`] && (
                        <div className="mt-3 text-sm">
                          {userAnswers[`module_${activeModule}_question_${qIndex}`] === question.correctAnswer ? (
                            <p className="text-orange-400">Correct!</p>
                          ) : (
                            <p className="text-red-400">
                              {userAnswers[`module_${activeModule}_question_${qIndex}`] !== undefined 
                                ? "Incorrect. " 
                                : "Not answered. "}
                              The correct answer is: {question.options[question.correctAnswer]}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <button 
                    className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                    onClick={() => checkAnswers(activeModule)}
                    disabled={showAnswers[`module_${activeModule}`]}
                  >
                    {showAnswers[`module_${activeModule}`] ? "Answers Checked" : "Check Answers"}
                  </button>
                </div>
              )}
            </div>
            
            {/* Interactive Puzzle */}
            <div className="mb-6 mt-6">
              <div 
                className="flex justify-between items-center p-4 bg-white/10 rounded-lg cursor-pointer"
                onClick={() => toggleSection(`module_${activeModule}_game`)}
              >
                <h3 className="text-xl font-medium text-white">Interactive Puzzle</h3>
                <svg 
                  className={`w-5 h-5 transition-transform ${expandedSections[`module_${activeModule}_game`] ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              {expandedSections[`module_${activeModule}_game`] && (
                <div className="p-4 text-gray-200 mt-2 bg-white/5 rounded-lg">
                  <WebDevGame 
                    activeModule={activeModule} 
                    onCompleteLevel={(levelId) => {
                      // Award bonus points when user completes a level
                      const bonusPoints = Math.floor(Math.random() * 20) + 10;
                      setLastPointsEarned(bonusPoints);
                      setRewardPoints(prev => prev + bonusPoints);
                      
                      // Show the reward popup
                      setShowPointsPopup(true);
                      setTimeout(() => setShowPointsPopup(false), 2000);
                    }} 
                  />
                </div>
              )}
            </div>
            
            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              <button 
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  activeModule > 0
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
                onClick={() => activeModule > 0 && handleModuleSelect(activeModule - 1)}
                disabled={activeModule === 0}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Previous Module
              </button>
              
              <button 
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  activeModule < courseContent.modules.length - 1
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
                onClick={() => activeModule < courseContent.modules.length - 1 && handleModuleSelect(activeModule + 1)}
                disabled={activeModule === courseContent.modules.length - 1}
              >
                Next Module
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Centered reward points popup */}
      {showPointsPopup && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="animate-reward-popup bg-accent text-black font-bold py-3 px-6 rounded-full shadow-lg flex items-center">
            <span className="mr-2 text-xl">+{lastPointsEarned} points</span>
            <span className="text-2xl">🎉</span>
          </div>
        </div>
      )}
      
      {/* Text highlight popup for "Add to Chat" functionality */}
      <TextHighlightPopup />

      {/* Inactivity alerts component */}
      <InactivityAlerts />
    </div>
  );
};

// Wrapper component to ensure AIChatContext is available
const WebDevelopmentCourse = () => {
  return (
    <AIChatAssistant>
      <WebDevelopmentCourseContent />
    </AIChatAssistant>
  );
};

export default WebDevelopmentCourse; 