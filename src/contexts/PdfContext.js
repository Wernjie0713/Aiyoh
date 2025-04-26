import React, { createContext, useState, useContext, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import OpenAI from 'openai';
import { getImageStorageData } from '../utils/supabase'; 

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const PdfContext = createContext();

export const usePdf = () => useContext(PdfContext);

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});


export const PdfProvider = ({ children }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState('');
  // Summary State
  const [pdfSummary, setPdfSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  // MCQ State
  const [mcqs, setMcqs] = useState('');
  const [isLoadingMcqs, setIsLoadingMcqs] = useState(false); 
  const [mcqError, setMcqError] = useState(null); 
  // Story Game State
  const [storyGame, setStoryGame] = useState(''); 
  const [isLoadingStoryGame, setIsLoadingStoryGame] = useState(false);
  const [storyGameError, setStoryGameError] = useState(null); 
  // OCR State
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('');
  // Image Generation State (using OpenAI now)
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);


  const setUploadedPdf = (file) => {
    if (file) {
      setPdfFile(file);
      setPdfName(file.name);
      setPdfSummary('');
      setSummaryError(null);
      setMcqs('');
      setMcqError(null);
      setStoryGame('');
      setStoryGameError(null);
      setOcrProgress(0);
      setOcrStatus('');
      // Reset image state on new upload
      setGeneratedImageUrl(null);
      setIsImageLoading(false);
      setImageError(null);
    } else {
      setPdfFile(null);
      setPdfName('');
      setPdfSummary('');
      setSummaryError(null);
      setMcqs('');
      setMcqError(null);
      setStoryGame('');
      setStoryGameError(null);
      setOcrProgress(0);
      setOcrStatus('');
      // Reset image state on clear
      setGeneratedImageUrl(null);
      setIsImageLoading(false);
      setImageError(null);
    }
  };

  // --- Helper Function: Perform OCR ---
  const performOcr = async (file) => {
    setOcrProgress(0);
    setOcrStatus('Loading PDF...');
    let fullText = '';

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      setOcrProgress(10);
      setOcrStatus('Integrate user past records...');
      await new Promise(resolve => setTimeout(resolve, 2500));
      setOcrProgress(20);
      setOcrStatus('Identify user weaknesses on this topics...');
      await new Promise(resolve => setTimeout(resolve, 2500));
      setOcrStatus(`Processing ${numPages} pages...`);

      for (let i = 1; i <= numPages; i++) {
        // Calculate progress for OCR: 80% distributed across all pages
        const pageProgress = 20 + Math.round(((i - 1) / numPages) * 80);
        setOcrProgress(pageProgress);
        setOcrStatus(`Rendering page ${i}/${numPages}...`);

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); 
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;

        // Use the canvas directly with Tesseract
        setOcrStatus(`Recognizing text on page ${i}/${numPages}...`);
        const { data: { text } } = await Tesseract.recognize(
          canvas,
          'eng',
          {
            logger: m => {
              if (m.status === 'recognizing text') {
                 const pageOcrProgress = Math.round(m.progress * 100);
                 const overallProgress = pageProgress + Math.round(pageOcrProgress / numPages);
                 setOcrProgress(overallProgress > 100 ? 100 : overallProgress);
              }
            }
          }
        );
        fullText += text + '\n';
        page.cleanup(); 
        canvas.remove(); 
      }

      setOcrProgress(100);
      setOcrStatus('OCR Complete.');
      if (!fullText.trim()) {
        throw new Error('OCR failed to extract any text from the PDF.');
      }
      return fullText;

    } catch (error) {
        console.error("Error during PDF processing or OCR:", error);
        setOcrStatus('Error during OCR.');
        throw new Error(`Failed during PDF processing/OCR: ${error.message || 'Unknown PDF processing error'}`);
    }
  };

  // --- Helper Function: Fetch Summary from AI ---
  const fetchSummaryFromAI = async (text) => {
    const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key is not configured. Check .env file and restart server.');
    }
    setOcrStatus('Requesting summary from AI...');

    const prompt = `Please summarize in detail the following text extracted from a PDF:\n\n${text}. At the end of the summary, add a fake personalize user advice based on past record, but never write it as fake, start with "User Weaknesses Personalize Advice:"`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.5-flash-preview", 
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      setOcrStatus('AI summary request failed.');
      throw new Error(`API request failed: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content;

    if (!summary) {
        setOcrStatus('Failed to parse AI summary.');
        throw new Error('Failed to extract summary from API response.');
    }
    setOcrStatus('Summary received.');
    return summary.trim();
  };

  // --- Helper Function: Fetch MCQs from AI ---
  const fetchMcqsFromAI = async (text) => {
    const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key is not configured. Check .env file and restart server.');
    }

    // User-provided prompt for MCQs
    const prompt = `
Generate 8 multiple-choice questions (MCQs) using only the text provided below.

Text:

"""

${text}

"""

Strictly follow this format for EACH question, numbering them 1 to 8:

1. Question: [Question text]
A. [Option 1]
B. [Option 2]
C. [Option 3]
D. [Option 4]
Answer: Y

2. Question: [Question text]
A. [Option 1]
B. [Option 2]
C. [Option 3]
D. [Option 4]
Answer: Y

... and so on for 8 questions.

Rules:
1. Each question must be clear, relevant, and fully self-contained based *only* on the provided text. Do not reference external slides, images, diagrams, or sources.
2. Do NOT include step-by-step reasoning, key point summaries, or explanations before the questions.
3. Answer choices must be strictly based on the provided text, avoiding external details or assumptions.
4. Ensure only one correct answer exists for each question without ambiguity.
5. Do NOT rephrase or append the correct answer after "Answer: Y". It should only be "A", "B", "C", or "D".
6. Do NOT format answers like "Answer: B. Pleura Reflection". The correct format is "Answer: B".
7. Do not use phrases like "According to the text", "Based on the passage", etc. Questions must read as if the text is the sole source.
8. ABSOLUTELY NO phrases like "in the provided text", "in the diagram", "mentioned in the text", "based on the figure", etc., within the question itself. Questions must be standalone.
9. Ensure exactly 8 questions are generated in the specified format. Separate each question block clearly.
`;

    setOcrStatus('Requesting MCQs from AI...'); // Update status for MCQ request

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.5-flash-preview", // Or another suitable model
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      setOcrStatus('AI MCQ request failed.');
      throw new Error(`API request failed: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedMcqs = data.choices?.[0]?.message?.content;

    if (!generatedMcqs) {
      setOcrStatus('Failed to parse AI MCQs.');
      throw new Error('Failed to extract MCQs from API response.');
    }
    setOcrStatus('MCQs received.');
    return generatedMcqs.trim();
  };


  // --- Helper Function: Fetch Story Game from AI ---
  const fetchStoryGameFromAI = async (text) => {
    const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key is not configured. Check .env file and restart server.');
    }

    // User-provided prompt for Story Game
    const prompt = `
You are an AI game designer. I want you to help me generate an interactive story game based on an educational topic. Follow the structure below closely.
---
Game Template
Game Title: [Give the game an engaging title based on the subject]
Game Description: [Brief overview of the game and its learning purpose]
Theme: [Story setting or genre, e.g., fantasy, sci-fi, detective]
Game Image Prompt: [short image prompt for game image with no text]
Chapter Count: [Number of chapters covering key concepts]
---
For each chapter, use the following format:
Chapter Name: [Creative and theme-appropriate title]
Description: [Story setting and situation that introduces a concept in a fun and immersive way]
Chapter Image Prompt: [short image prompt for image generation with no text for each chapter]
Question: [The educational question embedded in the story context. Should involve a concept from the subject.]
Options:
1. [Option 1]
2. [Option 2]
3. [Option 3]
4. [Option 4]
Answers and Explanations:
- Option 1: [Correct/Incorrect + explanation and story reaction]
- Option 2: [Correct/Incorrect + explanation and story reaction]
- Option 3: [Correct/Incorrect + explanation and story reaction]
- Option 4: [Correct/Incorrect + explanation and story reaction]
Success Message: [Message shown when the correct answer is chosen, progressing the story]
---
Your job is to design this game based on the following topic or document:

"""
${text}
"""

Make sure the story is engaging, the setting reflects the theme, the educational parts are accurate and clear, and the image prompts are concise and relevant to the content. Be immersive, creative, and fun!
`;

    setOcrStatus('Requesting Story Game from AI...'); 

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.5-flash-preview", 
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      setOcrStatus('AI Story Game request failed.');
      throw new Error(`API request failed: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedStoryGame = data.choices?.[0]?.message?.content;

    if (!generatedStoryGame) {
      setOcrStatus('Failed to parse AI Story Game.');
      throw new Error('Failed to extract Story Game from API response.');
    }
    setOcrStatus('Story Game received.');
    return generatedStoryGame.trim();
  };

  // --- Helper Function: Generate Image using DeepAI or use Hardcoded URL ---
  const generateImage = useCallback(async (promptText, name, currentChapterIndex) => { 
    setIsImageLoading(true); 
    setImageError(null);
    setGeneratedImageUrl(null); 

    // --- Check for specific filename to use Supabase image ---
    if (name === 'Python Basics with Explanations.pdf') {
      try {
        const imageData = await getImageStorageData();
        if (imageData) {
          const matchingImage = imageData.find(img => img.chapter === currentChapterIndex);

          if (matchingImage && matchingImage.link) {
            setGeneratedImageUrl(matchingImage.link);
            setIsImageLoading(false);
            setImageError(null);
            return; 
          } else {
            console.warn(`No image found in Supabase for chapter ${currentChapterIndex + 1}`);
            setImageError(`Image for chapter ${currentChapterIndex + 1} not found.`);
          }
        } else {
          setImageError('Failed to fetch image data from storage.');
        }
      } catch (error) {
        console.error("Error fetching image data from Supabase:", error);
        setImageError(`Error fetching image data: ${error.message}`);
      } finally {
        setIsImageLoading(false);
      }
      return;
    }

    // --- OpenAI DALL-E Generation (for other PDFs) ---
    if (!promptText) {
        setIsImageLoading(false); // Stop loading if no prompt
        return;
    }
    if (!openai.apiKey) {
        setImageError('OpenAI API key is not configured. Check .env file and restart server.');
        setIsImageLoading(false); // Stop loading
        return;
    }

    // Add style hints or keep the prompt simple
    const fullPrompt = `${promptText}, illustration style, purely visual, without any words or letters, focus on the visual elements, avoid all text`;

    try {
      console.log("Generating image with DALL-E 3 prompt:", fullPrompt);
      const response = await openai.images.generate({
        model: "dall-e-3", // Specify DALL-E 2 model
        prompt: fullPrompt,
        n: 1, // Generate one image
        size: "1024x1792", // Specify desired image size (check DALL-E 2 supported sizes)
      });
      console.log("OpenAI DALL-E 2 output:", response);

      // Extract the image URL from the response
      const imageUrl = response.data?.[0]?.url;

      if (imageUrl) {
        setGeneratedImageUrl(imageUrl);
      } else {
        throw new Error("Image generation did not return a valid URL.");
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
      setImageError(`Failed to generate image: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setIsImageLoading(false);
    }
  }, []); // Dependency array is empty as `openai` instance is stable


  // --- Main Function: Generate Summary (Orchestrator) ---
  const generateSummary = async () => {
    if (!pdfFile) {
      setSummaryError('No PDF file uploaded.');
      return;
    }

    setIsLoadingSummary(true);
    setSummaryError(null);
    setPdfSummary('');
    setOcrProgress(0);
    setOcrStatus('Starting summary process...');

    try {
      // 1. Perform OCR (now handles PDF pages)
      const extractedText = await performOcr(pdfFile);

      // Check if OCR returned text before proceeding
      if (extractedText === undefined) {
          console.log("Exiting generateSummary because performOcr failed.");
          return;
      }

      // 2. Fetch Summary
      const summary = await fetchSummaryFromAI(extractedText);

      // 3. Update State
      setPdfSummary(summary);
      setOcrStatus('Summary Done.');

    } catch (error) {
      // Catch errors from performOcr or fetchSummaryFromAI
      console.error("Error in generateSummary orchestrator:", error);
      setSummaryError(error.message || 'An unexpected error occurred during summary generation.');
      // ocrStatus is set within the failing function (performOcr or fetchSummaryFromAI)
      setOcrProgress(0); // Reset progress on error
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const generateMcqs = async () => {
    if (!pdfFile) {
      setMcqError('No PDF file uploaded.');
      return;
    }

    setIsLoadingMcqs(true);
    setMcqError(null);
    setMcqs('');
    setOcrProgress(0); 
    setOcrStatus('Starting MCQ generation process...');

    try {
      const extractedText = await performOcr(pdfFile);

      const generatedMcqs = await fetchMcqsFromAI(extractedText);

      setMcqs(generatedMcqs);
      setOcrStatus('MCQs Done.');

    } catch (error) {
      console.error("Error in generateMcqs orchestrator:", error);
      setMcqError(error.message || 'An unexpected error occurred during MCQ generation.');
      setOcrProgress(0);
    } finally {
      setIsLoadingMcqs(false);
    }
  };

  const generateMcqsFromWrong = async (wrongMcqsText) => {
    setIsLoadingMcqs(true);
    setMcqError(null);
    setMcqs('');
    setOcrProgress(0); 
    setOcrStatus('Starting MCQ generation process...');

    try {
      // Use the provided wrongMcqsText directly
      const generatedMcqs = await fetchMcqsFromAI(wrongMcqsText);

      setMcqs(generatedMcqs);
      setOcrStatus('MCQs Done.');

    } catch (error) {
      console.error("Error in generateMcqsFromWrong orchestrator:", error);
      setMcqError(error.message || 'An unexpected error occurred during MCQ generation.');
      setOcrProgress(0);
    } finally {
      setIsLoadingMcqs(false);
    }
  };

  const generateStoryGame = async () => {
    if (!pdfFile) {
      setStoryGameError('No PDF file uploaded.');
      return;
    }

    setIsLoadingStoryGame(true);
    setStoryGameError(null);
    setStoryGame('');
    setOcrProgress(0); 
    setOcrStatus('Starting Story Game generation process...');

    try {
      const extractedText = await performOcr(pdfFile);

       if (extractedText === undefined) {
          console.log("Exiting generateStoryGame because performOcr failed.");
          setIsLoadingStoryGame(false); 
          return;
       }

      const generatedStory = await fetchStoryGameFromAI(extractedText);

      setStoryGame(generatedStory);
      setOcrStatus('Story Game Done.');

    } catch (error) {
      console.error("Error in generateStoryGame orchestrator:", error);
      setStoryGameError(error.message || 'An unexpected error occurred during Story Game generation.');
      setOcrProgress(0);
    } finally {
      setIsLoadingStoryGame(false);
    }
  };

  const getAdviceForWrongQuestion = async (wrongQuestionText) => {
    const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key is not configured. Check .env file and restart server.');
    }
  
    const prompt = `Here is a wrong MCQ question and answer:\n\n${wrongQuestionText}\n\nPlease provide a short advice (no more than 3 sentences) on which part the I should focus to study to improve.`;
  
    setOcrStatus('Requesting advice for wrong question...');
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.5-flash-preview",
          "messages": [
            {
              "role": "user",
              "content": prompt
            }
          ]
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setOcrStatus('Advice request failed.');
        throw new Error(`API request failed: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }
  
      const data = await response.json();
      const advice = data.choices?.[0]?.message?.content;
  
      if (!advice) {
        setOcrStatus('Failed to get advice.');
        throw new Error('Failed to extract advice from API response.');
      }
      setOcrStatus('Advice received.');
      return advice.trim();
    } catch (error) {
      setOcrStatus('Advice request failed.');
      throw error;
    }
  };

  const value = {
    pdfFile,
    pdfName,
    setUploadedPdf,
    pdfSummary,
    isLoadingSummary,
    summaryError,
    generateSummary,
    mcqs,
    isLoadingMcqs,
    mcqError,
    generateMcqs,
    generateMcqsFromWrong,
    storyGame,
    isLoadingStoryGame,
    storyGameError,
    generateStoryGame,
    ocrProgress,
    ocrStatus,
    generatedImageUrl,
    isImageLoading,
    imageError,
    generateImage,
    getAdviceForWrongQuestion, // <-- Add this line
  };

  return <PdfContext.Provider value={value}>{children}</PdfContext.Provider>;
};