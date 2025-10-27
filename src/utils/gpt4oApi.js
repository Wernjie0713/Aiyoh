/**
 * This file handles the GPT-4O API integration for enhancing search queries
 * and processing user learning input.
 */

// GitHub AI API configuration - using environment variables
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const API_ENDPOINT = "https://models.inference.ai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2023-03-15-preview";
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const MODEL = process.env.REACT_APP_OPENAI_MODEL || "gpt-4o";

/**
 * Processes user learning input with GPT-4O to understand learning context
 * and generate optimized search queries
 * 
 * @param {string} userInput - The user's learning goals/request
 * @returns {Promise<string>} - The AI-enhanced search query
 */
export const processLearningInput = async (userInput) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Github-Auth': `Token ${GITHUB_TOKEN}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are an educational assistant that helps users find the best learning resources. Your task is to analyze the user's learning goal and create an optimized search query that will find the most relevant educational resources."
          },
          {
            role: "user",
            content: `I want to learn: ${userInput}. Generate an optimized search query to find the best educational resources for me.`
          }
        ],
        max_tokens: 150
      })
    });

    if (!response.ok) {
      console.error('Error response from GPT-4O API:', await response.text());
      throw new Error('Failed to process learning input with GPT-4O');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error processing learning input with GPT-4O:', error);
    // Fall back to basic query enhancement if the API call fails
    return enhanceQueryFallback(userInput);
  }
};

/**
 * Generates a structured learning path for undefined or niche topics.
 * 
 * @param {string} topic - The topic to generate a learning path for
 * @returns {Promise<Object>} - A structured learning path with steps and descriptions
 */
export const generateDynamicLearningPath = async (topic) => {
  try {
    console.log(`Generating dynamic learning path for: ${topic}`);
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Github-Auth': `Token ${GITHUB_TOKEN}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `You are an AI educational expert specializing in creating structured learning paths. 
            Your task is to create a logical, sequential learning path for a given topic. 
            The learning path should:
            1. Break down the topic into 4-5 sequential steps that progress from basics to more advanced concepts
            2. Follow a logical learning progression where each step builds on previous knowledge
            3. Include a descriptive title and explanation for each step
            4. Include an optimized search query for each step that can be used to find relevant resources
            5. Be structured in a specific JSON format`
          },
          {
            role: "user",
            content: `Create a structured learning path for "${topic}". 
            Return it in this exact JSON format:
            {
              "title": "Main topic title",
              "description": "Brief overview of this learning path",
              "steps": [
                {
                  "title": "Step 1 title",
                  "description": "Detailed description of what to learn in step 1",
                  "searchQuery": "Optimized search query for step 1 resources"
                },
                ...more steps...
              ]
            }`
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error('Error response from GPT-4O API:', await response.text());
      throw new Error('Failed to generate dynamic learning path with GPT-4O');
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    try {
      // Extract the JSON object from the response (in case there's additional text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : content;
      return JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Error parsing dynamic learning path JSON:', parseError);
      throw new Error('Failed to parse the generated learning path');
    }
  } catch (error) {
    console.error('Error generating dynamic learning path with GPT-4O:', error);
    // Return a simplified fallback path in case of API failure
    return generateFallbackLearningPath(topic);
  }
};

/**
 * Fallback function to generate a basic learning path when the API call fails
 * 
 * @param {string} topic - The topic to generate a learning path for
 * @returns {Object} - A simplified learning path structure
 */
const generateFallbackLearningPath = (topic) => {
  return {
    title: `Learning ${topic}`,
    description: `A basic guide to learning about ${topic}`,
    steps: [
      {
        title: `${topic} Fundamentals`,
        description: `Learn the basic concepts and principles of ${topic}`,
        searchQuery: `${topic} fundamentals basics tutorial beginners`
      },
      {
        title: `${topic} Core Techniques`,
        description: `Master the essential techniques and methodologies in ${topic}`,
        searchQuery: `${topic} essential techniques tutorial`
      },
      {
        title: `${topic} Advanced Concepts`,
        description: `Explore advanced concepts and applications of ${topic}`,
        searchQuery: `${topic} advanced concepts tutorial`
      },
      {
        title: `${topic} Practical Applications`,
        description: `Apply your knowledge in real-world ${topic} projects`,
        searchQuery: `${topic} practical projects applications examples`
      }
    ]
  };
};

/**
 * Fallback function to enhance search queries when the API call fails
 * 
 * @param {string} userInput - The user's learning goals/request
 * @returns {string} - An enhanced search query
 */
const enhanceQueryFallback = (userInput) => {
  let enhancedQuery = userInput;
  
  // Add general learning-related terms
  if (!enhancedQuery.toLowerCase().includes('learn') && 
      !enhancedQuery.toLowerCase().includes('tutorial') && 
      !enhancedQuery.toLowerCase().includes('course')) {
    enhancedQuery += ' learn tutorial course';
  }
  
  // Add level-specific terms if they mention being a beginner
  if (enhancedQuery.toLowerCase().includes('beginner') || 
      enhancedQuery.toLowerCase().includes('start') || 
      enhancedQuery.toLowerCase().includes('new to')) {
    enhancedQuery += ' for beginners step by step';
  }
  
  // Add topic-specific enhancements
  if (enhancedQuery.toLowerCase().includes('javascript')) {
    enhancedQuery += ' javascript tutorial documentation examples';
  } else if (enhancedQuery.toLowerCase().includes('python')) {
    enhancedQuery += ' python programming guide documentation';
  } else if (enhancedQuery.toLowerCase().includes('web development')) {
    enhancedQuery += ' web development html css javascript resources';
  }
  
  return enhancedQuery;
}; 