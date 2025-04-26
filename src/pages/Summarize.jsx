import React, { useEffect } from 'react';
import 'aos/dist/aos.css';
import { usePdf } from '../contexts/PdfContext';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const SummarizePage = () => {
  const {
    pdfFile,
    pdfName,
    pdfSummary,
    generateSummary,
    isLoadingSummary,
    summaryError,
    ocrProgress,
    ocrStatus, 
  } = usePdf(); 
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if no PDF file is found in context
    if (!pdfFile) {
      console.warn("No PDF file found in context. Redirecting to chat page.");
      navigate('/chat');
    } else {
      if (!pdfSummary && !isLoadingSummary && !summaryError) {
        generateSummary();
      }
    }
  }, [pdfFile, navigate]); 

  if (!pdfFile) {
    return null;
  }

  // Define custom renderers for Markdown elements using Tailwind
  const markdownComponents = {
    // eslint-disable-next-line jsx-a11y/heading-has-content
    h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4" {...props} />,
    // eslint-disable-next-line jsx-a11y/heading-has-content
    h2: ({node, ...props}) => <h2 className="text-xl font-semibold mb-3" {...props} />,
    // eslint-disable-next-line jsx-a11y/heading-has-content
    h3: ({node, ...props}) => <h3 className="text-lg font-semibold mb-2" {...props} />,
    // eslint-disable-next-line jsx-a11y/heading-has-content
    h4: ({node, ...props}) => <h4 className="text-md font-semibold mb-1.5" {...props} />,
    // eslint-disable-next-line jsx-a11y/heading-has-content
    h5: ({node, ...props}) => <h5 className="text-sm font-semibold mb-1" {...props} />,
    // eslint-disable-next-line jsx-a11y/heading-has-content
    h6: ({node, ...props}) => <h6 className="text-xs font-semibold mb-1" {...props} />,
    // eslint-disable-next-line jsx-a11y/heading-has-content
    p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />, 
    // eslint-disable-next-line jsx-a11y/heading-has-content
    ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-3" {...props} />, 
    // eslint-disable-next-line jsx-a11y/heading-has-content
    ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-3" {...props} />,    
    li: ({node, ...props}) => <li className="mb-1" {...props} />,                   
    strong: ({node, ...props}) => <strong className="font-semibold" {...props} />, 
  };

  // Extract the "User Weaknesses Personalize Advice:" section from pdfSummary
  let adviceSection = '';
  if (pdfSummary) {
    const match = pdfSummary.match(/User Weaknesses Personalize Advice:([\s\S]*)/i);
    adviceSection = match ? match[1].trim() : '';
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-primary/80 to-primary text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8 border border-white/20">
          <Link to="/chat" className="text-accent hover:underline mb-4 inline-block">&larr; Back to Upload</Link>
          <h1 className="text-3xl font-bold mb-4">PDF Summary</h1>
          <p className="mb-6">File: <span className="font-medium">{pdfName}</span></p>

          {/* Button to re-generate summary if needed, or just show status */}
          <button
            onClick={generateSummary} 
            disabled={isLoadingSummary}
            className="bg-accent hover:bg-accent/80 text-black font-medium py-2 px-5 rounded-lg transition-all duration-300 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingSummary ? 'Generating...' : pdfSummary ? 'Regenerate Summary' : 'Generate Summary'}
          </button>

          {/* Display Error from Context */}
          {summaryError && <p className="text-red-400 mb-4">{summaryError}</p>}

          {/* Display Loading State and Progress/Status from Context */}
          {isLoadingSummary && (
            <div className="text-center my-6">
              {/* Display detailed status message */}
              <p className="mb-2">{ocrStatus || 'Processing your document...'}</p>
              {/* Progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-accent h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${ocrProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-1">{ocrProgress > 0 && ocrProgress < 100 ? `OCR Progress: ${ocrProgress}%` : ocrProgress === 100 ? 'Generating Summary...' : 'Initializing...'}</p>
            </div>
          )}

          {/* Display Summary from Context using ReactMarkdown with custom components */}
          {pdfSummary && !isLoadingSummary && (
            <div>
              <h2 className="text-2xl font-semibold mb-3">Summary:</h2>
              <div className="bg-white/5 p-4 rounded-lg text-gray-200">
                <ReactMarkdown components={markdownComponents}>
                  {pdfSummary}
                </ReactMarkdown>
              </div>
              {/* New container for the extracted advice section */}
              {adviceSection && (
                <div className="mt-8 bg-accent/10 border border-accent rounded-lg p-4">
                  <h3 className="text-xl font-bold text-accent mb-2">User Weaknesses Personalize Advice</h3>
                  <ReactMarkdown components={markdownComponents}>
                    {adviceSection}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummarizePage;