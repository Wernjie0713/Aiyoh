/**
 * Predefined learning paths for common topics
 * Each path includes a sequence of steps with descriptions
 */

export const predefinedLearningPaths = {
  // Web Development Path
  "web development": {
    title: "Web Development",
    description: "A comprehensive path to learn modern web development from basics to advanced frameworks",
    steps: [
      {
        title: "Learn HTML",
        description: "Master HTML basics including tags, document structure, forms, and semantic elements",
        searchQuery: "HTML tutorial for beginners web development"
      },
      {
        title: "Learn CSS",
        description: "Learn styling with CSS, including selectors, box model, flexbox, and CSS grid",
        searchQuery: "CSS tutorial beginner flexbox grid"
      },
      {
        title: "Learn JavaScript",
        description: "Master JavaScript fundamentals, DOM manipulation, events, and asynchronous programming",
        searchQuery: "JavaScript tutorial for beginners DOM events async"
      },
      {
        title: "Learn a Frontend Framework",
        description: "Learn a modern frontend framework like React, Vue, or Angular",
        searchQuery: "React.js tutorial for beginners components state hooks"
      },
      {
        title: "Backend Development",
        description: "Learn server-side programming with Node.js, Express, and databases",
        searchQuery: "Node.js Express MongoDB tutorial REST API"
      }
    ]
  },

  // Data Science Path
  "data science": {
    title: "Data Science",
    description: "Learn data science from fundamentals to advanced machine learning techniques",
    steps: [
      {
        title: "Learn Python",
        description: "Master Python basics for data science, including variables, data structures, and functions",
        searchQuery: "Python for data science beginners tutorial"
      },
      {
        title: "Data Analysis with Python",
        description: "Learn data manipulation with Pandas, NumPy, and data cleaning techniques",
        searchQuery: "Pandas NumPy data analysis tutorial Python"
      },
      {
        title: "Data Visualization",
        description: "Create visualizations with Matplotlib, Seaborn, and other Python visualization libraries",
        searchQuery: "Data visualization Python Matplotlib Seaborn tutorial"
      },
      {
        title: "Machine Learning Basics",
        description: "Learn fundamental machine learning algorithms and concepts with scikit-learn",
        searchQuery: "Machine learning scikit-learn beginners tutorial Python"
      },
      {
        title: "Advanced Machine Learning & Deep Learning",
        description: "Dive into deep learning with TensorFlow or PyTorch",
        searchQuery: "Deep learning TensorFlow PyTorch tutorial beginners"
      }
    ]
  },

  // Python Programming Path
  "python programming": {
    title: "Python Programming",
    description: "Master Python programming from basics to advanced applications",
    steps: [
      {
        title: "Python Basics",
        description: "Learn Python syntax, variables, data types, and basic control structures",
        searchQuery: "Python programming basics tutorial beginners"
      },
      {
        title: "Functions and Modules",
        description: "Learn to create functions, modules, and understand Python scopes",
        searchQuery: "Python functions modules tutorial"
      },
      {
        title: "Object-Oriented Programming",
        description: "Master OOP concepts in Python including classes, inheritance, and polymorphism",
        searchQuery: "Python object oriented programming tutorial classes inheritance"
      },
      {
        title: "Working with Files and Data",
        description: "Learn file handling, data processing, and error handling in Python",
        searchQuery: "Python file handling CSV JSON data processing tutorial"
      },
      {
        title: "Python Libraries and Frameworks",
        description: "Explore popular Python libraries such as NumPy, Pandas, and frameworks like Django or Flask",
        searchQuery: "Python libraries NumPy Pandas Django Flask tutorial"
      }
    ]
  },

  // Machine Learning Path
  "machine learning": {
    title: "Machine Learning",
    description: "A structured path to learn machine learning from theory to practical applications",
    steps: [
      {
        title: "Mathematics for Machine Learning",
        description: "Learn essential math concepts: linear algebra, calculus, statistics, and probability",
        searchQuery: "Mathematics for machine learning linear algebra statistics probability tutorial"
      },
      {
        title: "Python and Libraries for ML",
        description: "Master Python and essential libraries like NumPy, Pandas, and Matplotlib",
        searchQuery: "Python NumPy Pandas for machine learning tutorial"
      },
      {
        title: "Machine Learning Fundamentals",
        description: "Learn supervised/unsupervised learning, algorithms, and model evaluation",
        searchQuery: "Machine learning fundamentals algorithms supervised unsupervised tutorial"
      },
      {
        title: "Deep Learning",
        description: "Understand neural networks, deep learning architectures, and frameworks like TensorFlow/PyTorch",
        searchQuery: "Deep learning neural networks TensorFlow PyTorch tutorial"
      },
      {
        title: "Applied Machine Learning",
        description: "Apply ML to real-world problems: computer vision, NLP, or recommendation systems",
        searchQuery: "Applied machine learning projects computer vision NLP recommendation systems"
      }
    ]
  },

  // JavaScript Programming Path
  "javascript": {
    title: "JavaScript Programming",
    description: "Master JavaScript from basics to advanced concepts and frameworks",
    steps: [
      {
        title: "JavaScript Fundamentals",
        description: "Learn JavaScript syntax, data types, operators, and control structures",
        searchQuery: "JavaScript fundamentals basics tutorial beginners"
      },
      {
        title: "DOM Manipulation",
        description: "Learn to interact with web pages by manipulating the Document Object Model",
        searchQuery: "JavaScript DOM manipulation tutorial"
      },
      {
        title: "Asynchronous JavaScript",
        description: "Master promises, async/await, and handling asynchronous operations",
        searchQuery: "JavaScript asynchronous programming promises async await tutorial"
      },
      {
        title: "Modern JavaScript ES6+",
        description: "Learn modern JavaScript features and syntax improvements",
        searchQuery: "Modern JavaScript ES6 ES2015 tutorial features"
      },
      {
        title: "JavaScript Frameworks",
        description: "Explore popular frameworks like React, Vue, or Angular",
        searchQuery: "JavaScript frameworks React Vue Angular comparison tutorial"
      }
    ]
  }
};

/**
 * Check if a given query matches any predefined learning path
 * @param {string} query - The user's learning query
 * @returns {Object|null} - The matched learning path or null if no match
 */
export const findPredefinedPath = (query) => {
  if (!query) return null;
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // Direct match with a key
  if (predefinedLearningPaths[normalizedQuery]) {
    return predefinedLearningPaths[normalizedQuery];
  }
  
  // Check for partial matches or keyword-based matches
  for (const [key, path] of Object.entries(predefinedLearningPaths)) {
    // Check if query contains this key
    if (normalizedQuery.includes(key)) {
      return path;
    }
    
    // Check for specific related terms
    if (key === "web development" && 
        (normalizedQuery.includes("html") || 
         normalizedQuery.includes("css") || 
         normalizedQuery.includes("web") ||
         normalizedQuery.includes("frontend") ||
         normalizedQuery.includes("front-end") ||
         normalizedQuery.includes("front end"))) {
      return path;
    }
    
    if (key === "data science" && 
        (normalizedQuery.includes("data analysis") || 
         normalizedQuery.includes("big data") || 
         normalizedQuery.includes("data visualization"))) {
      return path;
    }
    
    if (key === "python programming" && 
        (normalizedQuery.includes("python") && !normalizedQuery.includes("data science"))) {
      return path;
    }
    
    if (key === "machine learning" && 
        (normalizedQuery.includes("ml") || 
         normalizedQuery.includes("ai") || 
         normalizedQuery.includes("artificial intelligence"))) {
      return path;
    }
    
    if (key === "javascript" && 
        (normalizedQuery.includes("js") || 
         normalizedQuery.includes("react") || 
         normalizedQuery.includes("node"))) {
      return path;
    }
  }
  
  return null;
};

// Predefined reasons for personalization suggestions
export const predefinedReasons = [
  'Suggested based on your recent activity.',
  'Recommended due to your interest in beginner-level topics.',
  'Personalized for you due to your previous interactions.',
  'Suggested because you liked similar resources.',
  'Personalized based on common learning patterns.',
  'Recommended for users starting with this subject.',
  'Aligned with trending topics in this field.'
]; 