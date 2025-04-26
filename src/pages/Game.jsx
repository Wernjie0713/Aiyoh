import React, { useState, useEffect, useCallback } from 'react';
import 'aos/dist/aos.css';
import { usePdf } from '../contexts/PdfContext';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; 
import { getStoryById } from '../utils/supabase'; // <-- Add this import

// --- Helper Function to Parse Story Game ---
const parseStoryGame = (storyString, fileName) => { 
  if (fileName === 'Python Basics with Explanations.pdf') {
    return storyString; 
  }

  if (!storyString) return null;

  const game = { chapters: [] };
  const lines = storyString.trim().split('\n');
  let currentChapter = null;
  let parsingState = 'header'; 
  lines.forEach(line => {
    line = line.trim();
    if (!line) return; 

    if (line.startsWith('Game Title:')) {
      game.title = line.substring('Game Title:'.length).trim();
    } else if (line.startsWith('Game Description:')) {
      game.description = line.substring('Game Description:'.length).trim();
    } else if (line.startsWith('Game Image Prompt:')) {
      game.gameImagePrompt = line.substring('Game Image Prompt:'.length).trim();
    } else if (line.startsWith('Description:')) {
      if (parsingState === 'chapter_header') {
        // Only set chapter description if not already set
        if (currentChapter && !currentChapter.description) {
          currentChapter.description = line.substring('Description:'.length).trim();
        }
        parsingState = 'description'; // Stay in description state to potentially catch Chapter Image Prompt
      }
    } else if (line.startsWith('Theme:')) {
      game.theme = line.substring('Theme:'.length).trim();
    } else if (line.startsWith('Chapter Count:')) {
      game.chapterCount = parseInt(line.substring('Chapter Count:'.length).trim(), 10);
    } else if (line.startsWith('---')) {
       if (parsingState === 'header') parsingState = 'chapter_header';
    } else if (line.startsWith('Chapter Name:')) {
      if (currentChapter) game.chapters.push(currentChapter);
      currentChapter = { name: line.substring('Chapter Name:'.length).trim(), options: [], answers: {} };
      parsingState = 'chapter_header'; 
    } else if (line.startsWith('Chapter Image Prompt:')) { 
      if (currentChapter) {
        currentChapter.chapterImagePrompt = line.substring('Chapter Image Prompt:'.length).trim();
      }
    } else if (line.startsWith('Question:')) {
      if (currentChapter) {
        currentChapter.question = line.substring('Question:'.length).trim();
        parsingState = 'options';
      }
    } else if (parsingState === 'options' && /^\d+\.\s*/.test(line)) {
       if (currentChapter) {
         const match = line.match(/^(\d+)\.\s*(.*)/);
         if (match) {
           currentChapter.options.push({ id: match[1], text: match[2] });
         }
       }
    } else if (line.startsWith('Answers and Explanations:')) {
       parsingState = 'answers';
    } else if (parsingState === 'answers' && line.startsWith('- Option')) {
       if (currentChapter) {
         const match = line.match(/^- Option (\d+):\s*(.*)/);
         if (match) {
           currentChapter.answers[match[1]] = match[2];
         }
       }
    } else if (line.startsWith('Success Message:')) {
       parsingState = 'success';
       if (currentChapter) {
         currentChapter.successMessage = line.substring('Success Message:'.length).trim();
       }
    } else if (parsingState === 'description' && currentChapter && !currentChapter.description) {
        currentChapter.description = (currentChapter.description || '') + line + '\n';
    }
  });

  if (currentChapter) game.chapters.push(currentChapter);

  if (
    game.chapters.length > 0 &&
    game.chapters[0].name === undefined &&
    game.chapters[0].description === game.description
  ) {
    game.chapters.shift();
  }
  return game;
};

const GamePage = () => {
  const {
    pdfFile,
    pdfName,
    storyGame,
    generateStoryGame: fetchStoryGame,
    isLoadingStoryGame,
    storyGameError,
    // OCR
    ocrProgress,
    ocrStatus,
    // Image Generation 
    generatedImageUrl,
    isImageLoading,
    imageError,
    generateImage,
  } = usePdf();
  const navigate = useNavigate();

  // --- State Variables ---
  const [parsedStoryGame, setParsedStoryGame] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [selectedStoryOption, setSelectedStoryOption] = useState(null);
  const [showStoryFeedback, setShowStoryFeedback] = useState(false);
  const [showDescriptionPage, setShowDescriptionPage] = useState(true);

  const generateStoryGame = useCallback(() => {
      setParsedStoryGame(null);
      setCurrentChapterIndex(0);
      setSelectedStoryOption(null);
      setShowStoryFeedback(false);
      fetchStoryGame();
  }, [fetchStoryGame]);

  // --- Effects ---
  useEffect(() => {
    if (!pdfFile) {
      console.warn("No PDF file found in context. Redirecting to chat page.");
      navigate('/chat');
    } else {
      // Simplify generation logic: Only generate story if needed
      if (!storyGame && !isLoadingStoryGame && !storyGameError && !parsedStoryGame) {
         generateStoryGame();
      }

      // Simplify parsing logic: Only parse story game
      if (storyGame && !parsedStoryGame) {
        if (pdfName && pdfName === 'Python Basics with Explanations.pdf') {
          // Fetch from Supabase and parse
          (async () => {
            const supabaseStory = await getStoryById(1); 
            if (supabaseStory) {
              setParsedStoryGame(parseStoryGame(supabaseStory, pdfName));
            } else {
              setParsedStoryGame(null);
            }
            setShowDescriptionPage(true); 
            setCurrentChapterIndex(0);
            setSelectedStoryOption(null);
            setShowStoryFeedback(false);
          })();
        } else {
          // Default logic for other files
          setParsedStoryGame(parseStoryGame(storyGame, pdfName));
          setShowDescriptionPage(true); 
          setCurrentChapterIndex(0);
          setSelectedStoryOption(null);
          setShowStoryFeedback(false);
        }
      }
    }
  }, [ 
      pdfFile, navigate, pdfName, 
      storyGame, isLoadingStoryGame, storyGameError, generateStoryGame, parsedStoryGame
  ]);

  // --- Effects ---
  useEffect(() => {
    if (!pdfFile) {
      console.warn("No PDF file found in context. Redirecting to chat page.");
      navigate('/chat');
    } else {
      if (!storyGame && !isLoadingStoryGame && !storyGameError && !parsedStoryGame) {
         generateStoryGame();
      }
      if (storyGame && !parsedStoryGame) {
        // Pass pdfName to the parser
        const parsed = parseStoryGame(storyGame, pdfName); // <-- Pass pdfName here
        setParsedStoryGame(parsed);
        setShowDescriptionPage(true);
        setCurrentChapterIndex(0);
        setSelectedStoryOption(null);
        setShowStoryFeedback(false);
        // --- END REMOVAL ---
      }
    }
  }, [pdfFile, navigate, pdfName, storyGame, isLoadingStoryGame, storyGameError, generateStoryGame, parsedStoryGame]); // Removed generateImage, Added pdfName

  useEffect(() => {
    if (!parsedStoryGame) return;

    let prompt = "";
    if (showDescriptionPage) {
        prompt = parsedStoryGame.gameImagePrompt || parsedStoryGame.description;
    } else {
        const chapter = parsedStoryGame.chapters?.[currentChapterIndex];
        prompt = chapter?.chapterImagePrompt || chapter?.description; 
    }

    if (prompt) {
        generateImage(prompt, pdfName, currentChapterIndex); 
    }
    // Keep generateImage dependency here as this effect calls it.
  }, [showDescriptionPage, currentChapterIndex, parsedStoryGame, generateImage]); 

  // --- Story Game Event Handlers ---
   const handleStoryOptionSelect = (optionId) => {
     setSelectedStoryOption(optionId);
     setShowStoryFeedback(true);
   };

   const handleNextChapter = () => {
     if (parsedStoryGame && currentChapterIndex < parsedStoryGame.chapters.length - 1) {
       setCurrentChapterIndex(prev => prev + 1);
       setSelectedStoryOption(null);
       setShowStoryFeedback(false);
     }
   };

   const handleRestartStory = () => {
      setCurrentChapterIndex(0);
      setSelectedStoryOption(null);
      setShowStoryFeedback(false);
   };


  // --- Loading/Error States ---
  const isLoading = isLoadingStoryGame;
  const error = storyGameError;

  if (!pdfFile) {
    return null;
  }

  const getStoryButtonText = () => {
      if (isLoadingStoryGame) return 'Generating Story...';
      if (parsedStoryGame) return 'Regenerate Story';
      return 'Generate Story';
  }

  // --- Markdown Components for Story ---
  const storyMarkdownComponents = {
    p: ({node, ...props}) => <p className="mb-3" {...props} />,
  };

  // --- Current Chapter Data ---
  const currentChapter = parsedStoryGame?.chapters?.[currentChapterIndex];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-primary/80 to-primary text-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Main content wrapper - Removed max-w-6xl and mx-auto */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8 border border-white/20 md:flex md:space-x-8">

          {/* --- Left Column: Image --- */}
          <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center justify-center bg-black/20 rounded-lg p-4 min-h-[300px]">
            {/* Use context state variables */}
            {isImageLoading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4"></div>
                <p>Generating image...</p>
              </div>
            ) : imageError ? (
              <div className="text-center text-red-400">
                <p>{imageError}</p>
                <button
                  onClick={() => {
                    let prompt = ""; // <-- Define prompt variable
                    if (showDescriptionPage) {
                      prompt = parsedStoryGame?.gameImagePrompt || parsedStoryGame?.description; // <-- Use game prompt or fallback
                    } else {
                      const chapter = parsedStoryGame?.chapters?.[currentChapterIndex];
                      prompt = chapter?.chapterImagePrompt || chapter?.description; // <-- Use chapter prompt or fallback
                    }
                    if (prompt) generateImage(prompt); // <-- Use context function
                  }}
                  className="mt-2 px-3 py-1 bg-accent text-black rounded text-sm"
                >
                  Retry
                </button>
              </div>
            ) : generatedImageUrl ? (
              <img
                src={generatedImageUrl}
                alt={showDescriptionPage ? "Game illustration" : `Chapter ${currentChapterIndex + 1} illustration`}
                className="w-full h-auto object-contain rounded-lg" // Adjust max-h as needed
              />
            ) : (
              <p className="text-gray-400">Image will appear here</p> // Placeholder
            )}
          </div>

          {/* --- Right Column: Story Content --- */}
          <div className="md:w-2/3">
            <Link to="/chat" className="text-accent hover:underline mb-4 inline-block">&larr; Back to Upload</Link>
            {/* Adjust title if needed, or keep generic */}
            <h1 className="text-3xl font-bold mb-2">Interactive Story Game</h1>
            <p className="mb-6">File: <span className="font-medium">{pdfName}</span></p>

            {/* Remove Mode Toggle Buttons */}
            {/* <div className="flex space-x-4 mb-6"> ... </div> */}

            {/* --- Shared Loading/Error Display --- */}
            {error && <p className="text-red-400 mb-4">{error}</p>}

            {isLoading && (
               <div className="text-center my-6">
                 <p className="mb-2">{ocrStatus || 'Processing your document...'}</p>
                 <div className="w-full bg-gray-700 rounded-full h-2.5">
                   <div
                     className="bg-accent h-2.5 rounded-full transition-all duration-300"
                     style={{ width: `${ocrProgress}%` }}
                   ></div>
                 </div>
                 <p className="text-sm text-gray-400 mt-1">
                   {ocrProgress > 0 && ocrProgress < 100
                     ? `OCR Progress: ${ocrProgress}%`
                     : ocrProgress === 100 && ocrStatus.includes('AI')
                     ? `Generating Story...` // Simplified message
                     : ocrProgress === 100
                     ? `Processing Complete, Preparing Story...` // Simplified message
                     : 'Initializing...'}
                 </p>
               </div>
            )}

            {/* --- Story Game View (Now inside the right column) --- */}
            {!isLoading && (
            <div>
              <button
                onClick={generateStoryGame}
                disabled={isLoadingStoryGame}
                className="bg-accent hover:bg-accent/80 text-black font-medium py-2 px-5 rounded-lg transition-all duration-300 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getStoryButtonText()}
              </button>

              {parsedStoryGame && (
                <>
                  {showDescriptionPage ? (
                    <div className="bg-white/5 p-4 md:p-6 rounded-lg border border-white/10">
                      <h2 className="text-2xl font-bold mb-2 text-accent">{parsedStoryGame.title}</h2>
                      <p className="text-sm italic text-gray-400 mb-4">{parsedStoryGame.theme}</p>
                      {/* Render the description here */}
                      <div className="mb-6 text-gray-200">
                        <ReactMarkdown components={storyMarkdownComponents}>
                          {parsedStoryGame.description || ''}
                        </ReactMarkdown>
                      </div>
                      <button
                        onClick={() => setShowDescriptionPage(false)}
                        className="bg-accent hover:bg-accent/80 text-black font-medium py-2 px-5 rounded-lg transition-all duration-300"
                      >
                        Start Story
                      </button>
                    </div>
                  ) : (
                    parsedStoryGame.chapters &&
                    parsedStoryGame.chapters.length > 0 &&
                    currentChapter && (
                      <div className="bg-white/5 p-4 md:p-6 rounded-lg border border-white/10">
                        <h3 className="text-xl font-semibold mb-2">{currentChapter.name} (Chapter {currentChapterIndex + 1}/{parsedStoryGame.chapters.length})</h3>
                        <div className="prose prose-invert text-gray-300 mb-4">
                          <ReactMarkdown components={storyMarkdownComponents}>{currentChapter.description || ''}</ReactMarkdown>
                        </div>
                        <p className="font-semibold mb-3">{currentChapter.question}</p>
                        <div className="space-y-3 mb-4">
                          {currentChapter.options.map(option => (
                            <button
                              key={option.id}
                              onClick={() => handleStoryOptionSelect(option.id)}
                              // Only disable options if feedback is shown AND the selected answer was correct
                              disabled={showStoryFeedback && currentChapter.answers[selectedStoryOption]?.trim().toLowerCase().startsWith('correct')}
                              className={`w-full text-left p-3 rounded border transition-colors duration-200 ${
                                showStoryFeedback && selectedStoryOption === option.id
                                  ? currentChapter.answers[selectedStoryOption]?.trim().toLowerCase().startsWith('correct')
                                    ? 'bg-green-500/30 border-green-500' // Correct answer style
                                    : 'bg-red-500/30 border-red-500'   // Incorrect answer style
                                  : showStoryFeedback && currentChapter.answers[selectedStoryOption]?.trim().toLowerCase().startsWith('correct')
                                  ? 'bg-white/5 border-transparent opacity-60 cursor-not-allowed' // Dim other options if correct answer selected
                                  : 'bg-white/10 border-white/10 hover:bg-white/20' // Default/Hover style when active
                              } disabled:opacity-60 disabled:cursor-not-allowed`} // General disabled style (applied when correct answer is chosen)
                            >
                              {option.id}. {option.text}
                            </button>
                          ))}
                        </div>
                        {showStoryFeedback && selectedStoryOption && (
                          <div className="mt-4 p-3 bg-black/20 rounded border border-white/15">
                            <h4 className="font-semibold mb-2">Feedback:</h4>
                            <p className="text-sm text-gray-300">{currentChapter.answers[selectedStoryOption] || "No feedback available for this option."}</p>
                            {/* Check if feedback starts with 'correct' for success message */}
                            {currentChapter.answers[selectedStoryOption]?.trim().toLowerCase().startsWith('correct') && currentChapter.successMessage && (
                              <p className="text-sm text-green-300 mt-2">{currentChapter.successMessage}</p>
                            )}
                            {/* Check if feedback does NOT start with 'correct' for incorrect message */}
                            {!currentChapter.answers[selectedStoryOption]?.trim().toLowerCase().startsWith('correct') && (
                              <p className="text-sm text-red-300 mt-2">Incorrect. Please select the correct answer to proceed.</p>
                            )}
                          </div>
                        )}
                        <div className="mt-6 flex justify-between items-center">
                          <button
                            onClick={() => {
                              setShowDescriptionPage(true);
                              setCurrentChapterIndex(0);
                              setSelectedStoryOption(null);
                              setShowStoryFeedback(false);
                            }}
                            className="text-sm text-gray-400 hover:text-accent"
                          >
                            Back to Description
                          </button>
                          {/* Stricter check: Only show Next Chapter if feedback starts with 'correct' */}
                          {showStoryFeedback &&
                            currentChapter.answers[selectedStoryOption]?.trim().toLowerCase().startsWith('correct') &&
                            currentChapterIndex < parsedStoryGame.chapters.length - 1 && (
                              <button
                                onClick={handleNextChapter}
                                className="bg-accent hover:bg-accent/80 text-black font-medium py-2 px-4 rounded-lg transition-all duration-300"
                              >
                                Next Chapter &rarr;
                              </button>
                            )}
                          {/* Stricter check for story completion message */}
                          {showStoryFeedback &&
                            currentChapter.answers[selectedStoryOption]?.trim().toLowerCase().startsWith('correct') &&
                            currentChapterIndex === parsedStoryGame.chapters.length - 1 && (
                              <p className="text-green-400 font-semibold">Story Complete!</p>
                            )}
                        </div>
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          )}
          </div> {/* End Right Column */}
        </div> {/* End Main Content Wrapper */}
      </div>
    </div>
  );
};

// Keep export name
export default GamePage;
