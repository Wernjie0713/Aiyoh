import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { fetchLearningResources, generateSearchQuery, generateCompleteLearningPath } from '../utils/googleSearchApi';
import { predefinedReasons } from '../utils/predefinedLearningPaths'; // Import predefined reasons
import { Link, useNavigate } from 'react-router-dom';
import { usePdf } from '../contexts/PdfContext'; // Import usePdf

const ChatPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  // pdfName state can now be removed if you get it from context, or keep for local display logic
  // const [pdfName, setPdfName] = useState('');
  const [quizMode, setQuizMode] = useState('quiz');
  const { setUploadedPdf, pdfName: contextPdfName } = usePdf(); // Use the context hook
  const [learningQuery, setLearningQuery] = useState('');
  const [learningResources, setLearningResources] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [learningPath, setLearningPath] = useState(null);
  const [pathGenerationStep, setPathGenerationStep] = useState(''); // 'analyzing', 'generating', 'searching', 'complete'
  const navigate = useNavigate(); // Add navigate hook

  // Memoize suggestion logic to prevent re-randomizing on every render
  const suggestions = useMemo(() => {
    if (!learningPath || !learningPath.steps) return {};
    const suggestionsMap = {};
    learningPath.steps.forEach((_, index) => {
      if (Math.random() > 0.6) { // Adjust probability (e.g., 40% chance)
        suggestionsMap[index] = predefinedReasons[Math.floor(Math.random() * predefinedReasons.length)];
      }
    });
    return suggestionsMap;
  }, [learningPath]); // Recalculate only when learningPath changes

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedPdf(file); // Set the file in context
      setPdfUploaded(true);
      // setPdfName(file.name); // No longer strictly needed if using contextPdfName
    }
  };

  const resetUpload = () => {
    setUploadedPdf(null); // Clear the file in context
    setPdfUploaded(false);
    // setPdfName(''); // No longer strictly needed
    setSelectedOption(null); // Also reset selected option
  };

  const handleLearningPathSubmit = async (e) => {
    e.preventDefault();
    
    if (!learningQuery.trim()) {
      setSearchError('Please enter what you would like to learn.');
      return;
    }
    
    setIsSearching(true);
    setSearchError('');
    setLearningResources([]);
    setLearningPath(null);
    setPathGenerationStep('analyzing');
    
    try {
      // Step 1: Indicate we're analyzing the query
      setSearchError('Analyzing your learning needs...');
      
      // Step 2: Generate complete learning path (predefined or dynamic)
      setPathGenerationStep('generating');
      setSearchError('Generating your personalized learning path...');
      
      const completePath = await generateCompleteLearningPath(learningQuery);
      
      if (!completePath.success) {
        throw new Error(completePath.message || 'Failed to generate learning path');
      }
      
      // Step 3: Store the learning path
      setLearningPath(completePath);
      
      // Step 4: Show success message
      setSearchError('✓ Successfully created your personalized learning path!');
      setTimeout(() => setSearchError(''), 3000);
      
    } catch (error) {
      console.error('Error generating learning path:', error);
      setSearchError(`An unexpected error occurred: ${error.message || 'Please try again later.'}`);
      setLearningPath(null);
    } finally {
      setIsSearching(false);
      setPathGenerationStep('complete');
    }
  };

  const needsPdf = (option) => {
    return option === 'summarize' || option === 'quiz-game';
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-primary/80 to-primary">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Main Header */}
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-center text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Let <span className="text-accent">AiThink</span> Help You Study Smarter
          </motion.h1>
          
          <motion.p 
            className="text-lg text-center text-gray-200 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Choose a tool to enhance your learning experience
          </motion.p>
          
          {/* Main Content Card */}
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-6 md:p-8">
              {/* Option Buttons - Always visible */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
                <button 
                  className={`p-6 rounded-xl transition-all duration-300 flex flex-col items-center ${selectedOption === 'summarize' ? 'bg-accent text-black scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  onClick={() => setSelectedOption('summarize')}
                >
                  <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h3 className="text-xl font-semibold"><span className={`${selectedOption === 'summarize' ? 'text-white' : 'text-accent'}`}>AI</span> Summarize PDF</h3>
                  <p className="text-center text-sm mt-2 opacity-80">Upload notes, get a summary</p>
                </button>
                
                <button 
                  className={`p-6 rounded-xl transition-all duration-300 flex flex-col items-center ${selectedOption === 'quiz-game' ? 'bg-accent text-black scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  onClick={() => setSelectedOption('quiz-game')}
                >
                  <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                  <h3 className="text-xl font-semibold"><span className={`${selectedOption === 'quiz-game' ? 'text-white' : 'text-accent'}`}>AI</span> Generate Quiz/Game</h3>
                  <p className="text-center text-sm mt-2 opacity-80">Create learning challenges</p>
                </button>
                
                <button 
                  className={`p-6 rounded-xl transition-all duration-300 flex flex-col items-center ${selectedOption === 'learning-path' ? 'bg-accent text-black scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  onClick={() => setSelectedOption('learning-path')}
                >
                  <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <h3 className="text-xl font-semibold"><span className={`${selectedOption === 'learning-path' ? 'text-white' : 'text-accent'}`}>AI</span> Generate Learning Path</h3>
                  <p className="text-center text-sm mt-2 opacity-80">Get personalized resources</p>
                </button>
              </div>

              {/* PDF Upload Section - Only shown for features that need it */}
              {selectedOption && needsPdf(selectedOption) && !pdfUploaded && (
                <motion.div 
                  className="flex flex-col items-center bg-white/5 rounded-xl p-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <svg className="w-20 h-20 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Upload Your PDF</h2>
                  <p className="text-gray-300 mb-6 text-center">Upload your notes, slides, or study materials to continue</p>
                  
                  <label className="relative cursor-pointer bg-accent hover:bg-accent/80 text-black font-medium py-3 px-6 rounded-full transition-all duration-300 flex items-center group">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <span>Choose PDF File</span>
                    <span className="absolute -right-2 -top-2 bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">+</span>
                    <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                  </label>
                </motion.div>
              )}

              {/* PDF Display - Show when PDF is uploaded */}
              {pdfUploaded && needsPdf(selectedOption) && (
                <div className="mb-4 w-full">
                  <div className="flex items-center justify-between bg-white/20 p-3 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span className="text-white font-medium truncate max-w-[200px]">{contextPdfName}</span>
                    </div>
                    <button 
                      onClick={resetUpload} 
                      className="text-white hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Feature-specific content */}
              {selectedOption === 'summarize' && pdfUploaded && (
                <motion.div 
                  className="w-full bg-white/10 p-6 rounded-xl mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Summarize Content</h3>
                  <p className="text-gray-300 mb-4">Get a concise summary of your uploaded PDF document</p>
                  
                  <button 
                    onClick={() => navigate('/chat/summarize')}
                    className="w-full bg-accent hover:bg-accent/80 text-black font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    Generate Summary
                  </button>
                </motion.div>
              )}

              {selectedOption === 'quiz-game' && pdfUploaded && (
                <motion.div 
                  className="w-full bg-white/10 p-6 rounded-xl mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Generate Learning Materials</h3>
                  <p className="text-gray-300 mb-4">Choose your preferred learning format</p>
                  
                  <div className="flex justify-center space-x-4 mb-6">
                    <button 
                      className={`px-5 py-2 rounded-full transition-all duration-300 flex items-center ${quizMode === 'quiz' ? 'bg-accent text-black' : 'bg-white/20 text-white'}`}
                      onClick={() => setQuizMode('quiz')}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      Quiz
                    </button>
                    
                    <button 
                      className={`px-5 py-2 rounded-full transition-all duration-300 flex items-center ${quizMode === 'game' ? 'bg-accent text-black' : 'bg-white/20 text-white'}`}
                      onClick={() => setQuizMode('game')}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Game
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => navigate(quizMode === 'quiz' ? '/chat/quiz' : '/chat/game')}
                    className="w-full bg-accent hover:bg-accent/80 text-black font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    Generate {quizMode === 'quiz' ? 'Quiz' : 'Game'}
                  </button>
                </motion.div>
              )}

              {/* Learning Path Option */}
              {selectedOption === 'learning-path' && (
                <motion.div 
                  className="w-full bg-white/10 p-6 rounded-xl mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Generate Learning Path</h3>
                  <p className="text-gray-300 mb-4">Get a step-by-step personalized learning path with curated resources</p>
                  
                  <form onSubmit={handleLearningPathSubmit} className="mb-6">
                    <div className="relative mb-4">
                      <input
                        type="text"
                        className="w-full bg-white/20 text-white border border-white/20 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Enter what you want to learn (e.g., Web Development, Python, Quantum Computing)"
                        value={learningQuery}
                        onChange={(e) => setLearningQuery(e.target.value)}
                        disabled={isSearching}
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-full bg-accent hover:bg-accent/80 text-black font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {pathGenerationStep === 'analyzing' ? 'Analyzing...' : 
                           pathGenerationStep === 'generating' ? 'Generating Path...' : 
                           'Finding Resources...'}
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                          </svg>
                          Generate Learning Path
                        </>
                      )}
                    </button>
                  </form>
                
                  {/* Search Error/Status Message */}
                  {searchError && (
                    <div className={`rounded-lg p-4 mb-4 flex items-center ${
                      searchError.includes('Analyzing') || searchError.includes('Generating') || searchError.includes('Successfully')
                        ? 'bg-blue-500/20 border border-blue-500/30 text-white' 
                        : 'bg-red-500/20 border border-red-500/30 text-white'
                    }`}>
                      {searchError.includes('Analyzing') || searchError.includes('Generating') ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : searchError.includes('Successfully') ? (
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      )}
                      <span>{searchError}</span>
                    </div>
                  )}
                
                  {/* Learning Path Display */}
                  {learningPath && learningPath.steps && (
                    <div className="mt-6">
                      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-5 mb-6">
                        <h4 className="text-white text-xl font-semibold mb-2">
                          {learningPath.title}
                        </h4>
                        <p className="text-gray-200 text-sm mb-4">{learningPath.description}</p>
                        <div className="flex items-center text-xs text-gray-300">
                          <span className="bg-blue-500/30 text-white text-xs px-2 py-1 rounded">
                            {learningPath.pathType === 'predefined' ? 'Curated Learning Path' : 'AI-Generated Path'}
                          </span>
                          <span className="ml-2">·</span>
                          <span className="ml-2">{learningPath.steps.length} Learning Steps</span>
                        </div>
                      </div>
                      
                      <div className="space-y-8">
                        {learningPath.steps.map((step, stepIndex) => {
                          const suggestionReason = suggestions[stepIndex]; // Get memoized suggestion
                          
                          return (
                            <div key={stepIndex} className="bg-white/5 rounded-lg border border-white/10">
                              <div className="p-4 border-b border-white/10 bg-white/5 rounded-t-lg flex items-center flex-wrap">
                                <div className="bg-accent/20 text-accent rounded-full w-8 h-8 flex items-center justify-center font-medium mr-3 flex-shrink-0">
                                  {stepIndex + 1}
                                </div>
                                <div className="flex-grow">
                                  <h5 className="text-white font-medium text-lg flex items-center gap-2">
                                    {step.title}
                                    {suggestionReason && (
                                      <span 
                                        className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full cursor-help whitespace-nowrap"
                                        title={suggestionReason} // Use title attribute for basic tooltip
                                      >
                                        Suggested for you
                                      </span>
                                    )}
                                  </h5>
                                  <p className="text-gray-300 text-sm mt-1">{step.description}</p>
                                </div>
                              </div>
                              
                              <div className="p-4">
                                {step.hasResources ? (
                                  <div className="space-y-3">
                                    {step.resources.map((resource, resourceIndex) => (
                                      <div key={resourceIndex} className="bg-white/5 hover:bg-white/10 rounded p-3 transition-all border border-white/5 hover:border-accent/20">
                                        <h6 className="text-accent font-medium mb-1 text-sm">
                                          <a 
                                            href={resource.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="hover:underline transition-colors hover:text-accent/80"
                                          >
                                            {resource.title}
                                          </a>
                                        </h6>
                                        <p className="text-gray-300 text-xs mb-2 line-clamp-2">{resource.snippet}</p>
                                        <div className="flex items-center text-xs text-gray-400">
                                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                          </svg>
                                          <a href={resource.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{resource.displayLink}</a>
                                          
                                          <a 
                                            href={resource.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="ml-auto bg-accent/20 text-accent px-2 py-1 rounded text-xs hover:bg-accent/30 transition-colors"
                                          >
                                            Visit
                                          </a>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-3">
                                    <p className="text-gray-400 text-sm">No resources found for this step.</p>
                                    <p className="text-gray-500 text-xs mt-1">Try searching manually for "{step.title}"</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <div>
                            <p className="text-white text-sm">
                              This {learningPath.pathType === 'predefined' ? 'curated' : 'AI-generated'} learning path 
                              is designed to help you learn {learningPath.query} in a structured, step-by-step approach.
                            </p>
                            <p className="text-white/70 text-xs mt-1">
                              Follow the steps in sequence for the best learning experience. Each step builds upon the previous one.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Legacy Search Results - we'll keep this for compatibility but it will be hidden when a learning path is active */}
                  {learningResources.length > 0 && !learningPath && (
                    <div className="mt-6">
                      <h4 className="text-white text-lg font-medium mb-4">Your Personalized Learning Resources:</h4>
                      
                      <div className="space-y-4">
                        {learningResources.map((resource, index) => (
                          <div key={index} className="bg-white/10 rounded-lg p-4 transition-all duration-300 hover:bg-white/20 border border-white/10 hover:border-accent/30">
                            <div className="flex items-start">
                              <div className="bg-accent/20 text-accent rounded-full w-7 h-7 flex items-center justify-center font-medium mt-1 mr-3 flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h5 className="text-accent font-medium text-lg mb-2">
                                  <a 
                                    href={resource.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:underline transition-colors hover:text-accent/80"
                                  >
                                    {resource.title}
                                  </a>
                                </h5>
                                <p className="text-gray-300 text-sm mb-3">{resource.snippet}</p>
                                <div className="flex items-center text-xs text-gray-400">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                  </svg>
                                  <a href={resource.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{resource.displayLink}</a>
                                  
                                  <span className="mx-2">•</span>
                                  
                                  <a 
                                    href={resource.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="ml-auto bg-accent/20 text-accent px-2 py-1 rounded text-xs hover:bg-accent/30 transition-colors"
                                  >
                                    Visit Resource
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <div>
                            <p className="text-white text-sm">These resources have been curated based on your learning goals using <span className="font-medium text-accent">GPT-4O</span> technology.</p>
                            <p className="text-white/70 text-xs mt-1">Resources are presented in a recommended learning sequence. Consider starting from the top and working your way down.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t border-white/10 p-4 text-center">
              <p className="text-gray-300 text-sm">
                {needsPdf(selectedOption) 
                  ? "Your learning materials are processed securely and privately"
                  : "Get personalized learning resources tailored to your goals"}
              </p>
            </div>
          </motion.div>
          
          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-accent/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Quick Summaries</h3>
              <p className="text-gray-300">Turn lengthy documents into concise, easy-to-understand summaries</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="bg-accent/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Interactive Quizzes</h3>
              <p className="text-gray-300">Generate custom quizzes based on your study materials to test your knowledge</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="bg-accent/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Structured Learning Paths</h3>
              <p className="text-gray-300">Get personalized step-by-step learning paths with curated resources for any topic</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 