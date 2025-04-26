/**
 * This file handles the Google Custom Search API integration
 * for the "Generate Learning Path" feature.
 */
import { processLearningInput, generateDynamicLearningPath } from './gpt4oApi';
import { findPredefinedPath } from './predefinedLearningPaths';

// Google Custom Search API configuration
const GOOGLE_API_KEY = "AIzaSyDaKyXSAqw0W0HzgCbS2xLOvXfRdEg6S-o";
const SEARCH_ENGINE_ID = "a28bd24c834014319";
const GOOGLE_CSE_URL = "https://www.googleapis.com/customsearch/v1";

/**
 * Fetches learning resources from Google Custom Search based on the user's query
 * @param {string} query - The user's learning need/query
 * @returns {Promise<Object>} - Object containing search results or error message
 */
export const fetchLearningResources = async (query) => {
  try {
    // Log API request for debugging
    console.log(`Fetching learning resources for query: "${query}"`);
    
    const response = await fetch(
      `${GOOGLE_CSE_URL}?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        console.error('Google CSE API error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to fetch learning resources');
      } catch (e) {
        console.error('Google CSE API error (non-JSON):', errorText);
        throw new Error(`API request failed with status ${response.status}`);
      }
    }
    
    const data = await response.json();
    console.log('Google CSE API response received:', data.searchInformation);
    
    if (!data.items || data.items.length === 0) {
      return { 
        success: false, 
        message: 'No learning resources found. Try a different search term.' 
      };
    }
    
    // Format the search results for better display
    const formattedResults = data.items.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet || 'No description available',
      displayLink: item.displayLink,
      // Include additional data if available
      pagemap: item.pagemap,
      formattedUrl: item.formattedUrl
    }));
    
    return {
      success: true,
      results: formattedResults,
      searchInfo: data.searchInformation
    };
  } catch (error) {
    console.error('Error fetching learning resources:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while searching for resources. Please try again later.'
    };
  }
};

/**
 * Uses GPT-4O to process the user's learning input and generate an optimized search query
 * @param {string} userInput - The user's learning need/query
 * @returns {Promise<string>} - Optimized search query
 */
export const generateSearchQuery = async (userInput) => {
  try {
    // Call the GPT-4O API to generate an optimized search query
    console.log('Sending learning query to GPT-4O:', userInput);
    const enhancedQuery = await processLearningInput(userInput);
    console.log('Enhanced query from GPT-4O:', enhancedQuery);
    return enhancedQuery;
  } catch (error) {
    console.error('Error generating search query with GPT-4O:', error);
    
    // Fall back to basic enhancement if GPT-4O integration fails
    let fallbackQuery = userInput;
    
    // Add keywords to improve search results
    if (userInput.toLowerCase().includes('javascript')) {
      fallbackQuery += ' best javascript tutorial beginner resources documentation examples';
    } else if (userInput.toLowerCase().includes('web development')) {
      fallbackQuery += ' learn html css javascript tutorial course roadmap';
    } else if (userInput.toLowerCase().includes('react')) {
      fallbackQuery += ' react.js tutorial documentation examples beginners guide';
    } else if (userInput.toLowerCase().includes('python')) {
      fallbackQuery += ' python programming beginner tutorial documentation examples';
    } else if (userInput.toLowerCase().includes('data science')) {
      fallbackQuery += ' data science learning path beginner tutorial courses resources';
    } else {
      fallbackQuery += ' best learn tutorial course beginner guide resources';
    }
    
    console.log('Using fallback query:', fallbackQuery);
    return fallbackQuery;
  }
};

/**
 * Fetches resources for a complete learning path, handling both predefined and dynamic paths
 * 
 * @param {string} userQuery - The user's original learning query
 * @returns {Promise<Object>} - A structured learning path with resources for each step
 */
export const generateCompleteLearningPath = async (userQuery) => {
  try {
    console.log('Generating complete learning path for:', userQuery);
    
    // Step 1: Check if this matches a predefined learning path
    let learningPath = findPredefinedPath(userQuery);
    let pathType = 'predefined';
    
    // Step 2: If no predefined path, generate a dynamic path
    if (!learningPath) {
      console.log('No predefined path found, generating dynamic path...');
      learningPath = await generateDynamicLearningPath(userQuery);
      pathType = 'dynamic';
    }
    
    console.log(`Using ${pathType} learning path:`, learningPath.title);
    
    // Step 3: Fetch resources for each step in the learning path
    const stepsWithResources = await Promise.all(
      learningPath.steps.map(async (step, index) => {
        try {
          console.log(`Fetching resources for step ${index + 1}: ${step.title}`);
          
          // Use the pre-optimized search query from the step
          const searchResults = await fetchLearningResources(step.searchQuery);
          
          // Limit to top 3 resources per step to keep it manageable
          const resources = searchResults.success 
            ? searchResults.results.slice(0, 3) 
            : [];
            
          return {
            ...step,
            resources,
            hasResources: resources.length > 0
          };
        } catch (error) {
          console.error(`Error fetching resources for step ${index + 1}:`, error);
          return {
            ...step,
            resources: [],
            hasResources: false,
            error: error.message
          };
        }
      })
    );
    
    // Step 4: Return the complete learning path with resources
    return {
      success: true,
      pathType,
      title: learningPath.title,
      description: learningPath.description,
      steps: stepsWithResources,
      hasSteps: stepsWithResources.length > 0,
      query: userQuery
    };
  } catch (error) {
    console.error('Error generating complete learning path:', error);
    return {
      success: false,
      message: `Failed to generate learning path: ${error.message}`,
      query: userQuery
    };
  }
}; 