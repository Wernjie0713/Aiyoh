import React, { useState, useEffect, useCallback } from 'react'; // Import useState and useCallback
import 'aos/dist/aos.css';
import { usePdf } from '../contexts/PdfContext';
import { Link, useNavigate } from 'react-router-dom';

// --- Helper Function to Parse MCQs ---
const parseMcqs = (mcqString) => {
  if (!mcqString) return [];

  const questions = [];
  // Split into blocks based on the question number pattern
  const questionBlocks = mcqString.trim().split(/\n(?=\d+\.\s*Question:)/);

  questionBlocks.forEach((block) => {
    const lines = block.trim().split('\n');
    if (lines.length < 6) return; // Basic validation

    const questionMatch = lines[0].match(/^\d+\.\s*Question:\s*(.*)/);
    const optionA = lines[1].startsWith('A.') ? lines[1].substring(3).trim() : null;
    const optionB = lines[2].startsWith('B.') ? lines[2].substring(3).trim() : null;
    const optionC = lines[3].startsWith('C.') ? lines[3].substring(3).trim() : null;
    const optionD = lines[4].startsWith('D.') ? lines[4].substring(3).trim() : null;
    const answerMatch = lines[5].match(/^Answer:\s*([A-D])/);

    if (questionMatch && optionA && optionB && optionC && optionD && answerMatch) {
      questions.push({
        id: questions.length + 1, // Simple ID based on index
        question: questionMatch[1].trim(),
        options: { A: optionA, B: optionB, C: optionC, D: optionD },
        correctAnswer: answerMatch[1],
      });
    } else {
      console.warn("Could not parse MCQ block:", block); // Log parsing issues
    }
  });

  return questions;
};


const QuizPage = () => {
  const {
    pdfFile,
    pdfName,
    mcqs, 
    generateMcqs: fetchMcqs, 
    isLoadingMcqs,
    mcqError,
    ocrProgress,
    ocrStatus,
    getAdviceForWrongQuestion,
    generateMcqsFromWrong,
  } = usePdf();
  const navigate = useNavigate();

  // --- New State Variables ---
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [adviceMap, setAdviceMap] = useState({});
  const [isGettingAdvice, setIsGettingAdvice] = useState(false);
  const [isRegeneratingFromWrong, setIsRegeneratingFromWrong] = useState(false);

  // Use useCallback for generateMcqs to stabilize its identity
  const generateMcqs = useCallback(() => {
      setShowResults(false); 
      setUserAnswers({});
      setParsedQuestions([]);
      setAdviceMap({});
      fetchMcqs();
  }, [fetchMcqs]);

  // New: Regenerate quiz from wrong questions
  const regenerateFromWrong = async () => {
    setIsRegeneratingFromWrong(true);
    setAdviceMap({});
    // Gather wrong question blocks in MCQ format
    const wrongBlocks = parsedQuestions
      .filter(q => userAnswers[q.id] && userAnswers[q.id] !== q.correctAnswer)
      .map(q => {
        // Reconstruct the MCQ block as in the original format
        return `${q.id}. Question: ${q.question}
A. ${q.options.A}
B. ${q.options.B}
C. ${q.options.C}
D. ${q.options.D}
Answer: ${q.correctAnswer}`;
      });
    const mergedText = wrongBlocks.join('\n\n');
    await generateMcqsFromWrong(mergedText);
    setShowResults(false);
    setUserAnswers({});
    setParsedQuestions([]);
    setScore(0);
    setIsRegeneratingFromWrong(false);
  };

  useEffect(() => {
    if (!pdfFile) {
      console.warn("No PDF file found in context. Redirecting to chat page.");
      navigate('/chat');
    } else {
      // Generate MCQs if not already loaded, loading, or errored
      if (!mcqs && !isLoadingMcqs && !mcqError && parsedQuestions.length === 0) {
         generateMcqs();
      } else if (mcqs && parsedQuestions.length === 0) {
        // Parse MCQs when the raw string is available and not yet parsed
        setParsedQuestions(parseMcqs(mcqs));
      }
    }
    // Dependencies: Include all external variables used
  }, [pdfFile, navigate, mcqs, isLoadingMcqs, mcqError, generateMcqs, parsedQuestions.length]);

  // --- Event Handlers ---
  const handleAnswerChange = (questionId, selectedOption) => {
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
    setShowResults(false); // Hide results if user changes an answer
  };

  // New: Get advice for wrong questions after submit
  const fetchAdviceForWrongs = async (wrongQuestions) => {
    setIsGettingAdvice(true);
    const newAdviceMap = {};
    for (const q of wrongQuestions) {
      // Reconstruct the MCQ block as in the original format
      const block = `${q.id}. Question: ${q.question}
A. ${q.options.A}
B. ${q.options.B}
C. ${q.options.C}
D. ${q.options.D}
Answer: ${q.correctAnswer}
Your Answer: ${userAnswers[q.id]}`;
      try {
        const advice = await getAdviceForWrongQuestion(block);
        newAdviceMap[q.id] = advice;
      } catch (e) {
        newAdviceMap[q.id] = "Could not fetch advice.";
      }
    }
    setAdviceMap(newAdviceMap);
    setIsGettingAdvice(false);
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    parsedQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);

    // Find wrong questions and fetch advice
    const wrongQuestions = parsedQuestions.filter(q => userAnswers[q.id] && userAnswers[q.id] !== q.correctAnswer);
    if (wrongQuestions.length > 0) {
      await fetchAdviceForWrongs(wrongQuestions);
    }
  };

  if (!pdfFile) {
    return null;
  }

  // --- Helper to determine button state/text ---
  const getButtonText = () => {
      if (isLoadingMcqs) return 'Generating Quiz...';
      if (parsedQuestions.length > 0) return 'Regenerate Quiz';
      return 'Generate Quiz';
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-primary/80 to-primary text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8 border border-white/20">
          <Link to="/chat" className="text-accent hover:underline mb-4 inline-block">&larr; Back to Upload</Link>
          <h1 className="text-3xl font-bold mb-4">PDF Quiz</h1>
          <p className="mb-6">File: <span className="font-medium">{pdfName}</span></p>

          <button
            onClick={generateMcqs} // Use the memoized generator
            disabled={isLoadingMcqs}
            className="bg-accent hover:bg-accent/80 text-black font-medium py-2 px-5 rounded-lg transition-all duration-300 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {getButtonText()}
          </button>

          {mcqError && <p className="text-red-400 mb-4">{mcqError}</p>}

          {isLoadingMcqs && (
             <div className="text-center my-6">
               {/* ... (loading indicator code remains the same) ... */}
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
                   ? 'Generating Quiz...'
                   : ocrProgress === 100
                   ? 'Processing Complete, Preparing Quiz...'
                   : 'Initializing...'}
               </p>
             </div>
          )}

          {/* --- Render Parsed Questions --- */}
          {!isLoadingMcqs && parsedQuestions.length > 0 && (
            <div className="space-y-6">
              {parsedQuestions.map((q, index) => (
                <div key={q.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <p className="font-semibold mb-3">{index + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {Object.entries(q.options).map(([key, value]) => (
                      <label
                        key={key}
                        className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors duration-200 ${
                          showResults
                            ? q.correctAnswer === key
                              ? 'bg-green-500/30 border border-green-400' // Correct answer style
                              : userAnswers[q.id] === key
                              ? 'bg-red-500/30 border border-red-400' // Incorrect selected answer style
                              : 'border border-transparent hover:bg-white/10'
                            : userAnswers[q.id] === key
                            ? 'bg-accent/20 border border-accent' // Selected answer style before submit
                            : 'border border-transparent hover:bg-white/10' // Default style
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={key}
                          checked={userAnswers[q.id] === key}
                          onChange={() => handleAnswerChange(q.id, key)}
                          disabled={showResults} // Disable after submitting
                          className="form-radio h-4 w-4 text-accent bg-gray-700 border-gray-600 focus:ring-accent"
                        />
                        <span>{key}. {value}</span>
                        {showResults && q.correctAnswer === key && (
                           <span className="text-xs text-green-300 ml-auto">(Correct)</span>
                        )}
                         {showResults && userAnswers[q.id] === key && q.correctAnswer !== key && (
                           <span className="text-xs text-red-300 ml-auto">(Your Answer)</span>
                        )}
                      </label>
                    ))}
                  </div>
                  {/* Optionally show the correct answer after submission if the user got it wrong */}
                  {showResults && userAnswers[q.id] !== q.correctAnswer && (
                    <>
                      <p className="text-sm text-green-300 mt-2">Correct Answer: {q.correctAnswer}. {q.options[q.correctAnswer]}</p>
                      <p className="text-sm text-yellow-300 mt-2">
                        {isGettingAdvice
                          ? "Getting advice..."
                          : adviceMap[q.id]
                          ? `Advice: ${adviceMap[q.id]}`
                          : ""}
                      </p>
                    </>
                  )}
                </div>
              ))}

              {/* --- Submit Button and Results --- */}
              {!showResults && (
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(userAnswers).length !== parsedQuestions.length} // Disable if not all questions answered
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-lg transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              )}

              {showResults && (
                <div className="mt-6 p-4 bg-white/10 rounded-lg text-center border border-white/20">
                  <h3 className="text-xl font-semibold mb-2">Quiz Results</h3>
                  <p className="text-lg">You scored {score} out of {parsedQuestions.length}!</p>
                  <button
                     onClick={generateMcqs} // Allow regenerating
                     className="mt-4 bg-accent hover:bg-accent/80 text-black font-medium py-2 px-5 rounded-lg transition-all duration-300"
                   >
                     Try Again with New Questions
                   </button>
                  {/* New: Regenerate from wrong questions */}
                  {Object.keys(userAnswers).length === parsedQuestions.length &&
                    parsedQuestions.some(q => userAnswers[q.id] !== q.correctAnswer) && (
                    <button
                      onClick={regenerateFromWrong}
                      disabled={isRegeneratingFromWrong}
                      className="mt-4 ml-4 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-5 rounded-lg transition-all duration-300"
                    >
                      {isRegeneratingFromWrong ? "Regenerating from Wrong Questions..." : "Regenerate Quiz from Wrong Questions"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;