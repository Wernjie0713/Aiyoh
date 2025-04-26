import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { delay } from '../utils/helpers';
import '../styles/animations.css';

// Create a context for the AIChatAssistant
export const AIChatContext = createContext();

// Custom hook to use the AIChatAssistant functionality
export const useAIChat = () => useContext(AIChatContext);

// Add custom resizable chat styles
const resizableStyles = `
  .resizable-chat {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    overflow: hidden;
  }
  
  .resize-handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: transparent;
    z-index: 60;
  }
  
  .resize-handle-ne {
    top: 0;
    right: 0;
    cursor: ne-resize;
  }
  
  .resize-handle-nw {
    top: 0;
    left: 0;
    cursor: nw-resize;
  }
  
  .resize-handle-se {
    bottom: 0;
    right: 0;
    cursor: se-resize;
  }
  
  .resize-handle-sw {
    bottom: 0;
    left: 0;
    cursor: sw-resize;
  }
  
  .resize-handle-n {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 5px;
    cursor: n-resize;
  }
  
  .resize-handle-e {
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 5px;
    height: 100%;
    cursor: e-resize;
  }
  
  .resize-handle-s {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 5px;
    cursor: s-resize;
  }
  
  .resize-handle-w {
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 5px;
    height: 100%;
    cursor: w-resize;
  }
`;

const AIChatAssistant = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi, I\'m your AI assistant. I can help with your web development questions. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSize, setChatSize] = useState({ width: 320, height: 400 });
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);
  const resizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  // For handling Ctrl+I with highlighted text
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
          setIsOpen(true);
          setIsMinimized(false);
          setInput(selectedText);
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Inject custom CSS for resize handles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = resizableStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup resize event handlers
  useEffect(() => {
    if (!isOpen || isMinimized) return;

    const handleMouseMove = (e) => {
      if (!resizing.current) return;
      
      e.preventDefault();
      
      // Calculate delta movement
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      
      // Calculate new size based on resize direction
      let newWidth = startSize.current.width;
      let newHeight = startSize.current.height;
      
      switch (resizing.current) {
        case 'ne':
          newWidth = startSize.current.width + deltaX;
          newHeight = startSize.current.height - deltaY;
          break;
        case 'nw':
          newWidth = startSize.current.width - deltaX;
          newHeight = startSize.current.height - deltaY;
          break;
        case 'se':
          newWidth = startSize.current.width + deltaX;
          newHeight = startSize.current.height + deltaY;
          break;
        case 'sw':
          newWidth = startSize.current.width - deltaX;
          newHeight = startSize.current.height + deltaY;
          break;
        case 'n':
          newHeight = startSize.current.height - deltaY;
          break;
        case 'e':
          newWidth = startSize.current.width + deltaX;
          break;
        case 's':
          newHeight = startSize.current.height + deltaY;
          break;
        case 'w':
          newWidth = startSize.current.width - deltaX;
          break;
        default:
          break;
      }
      
      // Apply constraints
      newWidth = Math.max(320, Math.min(800, newWidth));
      newHeight = Math.max(400, Math.min(window.innerHeight * 0.8, newHeight));
      
      // Update size
      if (chatRef.current) {
        chatRef.current.style.width = `${newWidth}px`;
        chatRef.current.style.height = `${newHeight}px`;
      }
      
      setChatSize({ width: newWidth, height: newHeight });
    };
    
    const handleMouseUp = () => {
      resizing.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isOpen, isMinimized]);

  // Start resize
  const startResize = (direction, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    resizing.current = direction;
    startPos.current = { x: e.clientX, y: e.clientY };
    
    if (chatRef.current) {
      startSize.current = {
        width: chatRef.current.offsetWidth,
        height: chatRef.current.offsetHeight
      };
    }
    
    document.body.style.cursor = `${direction}-resize`;
    document.body.style.userSelect = 'none';
  };

  // Function to handle external text input
  const sendToChatbox = (text) => {
    if (!text.trim()) return;
    
    setIsOpen(true);
    setIsMinimized(false);
    setInput(text);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Function to directly process the highlighted text
  const processHighlightedText = async (text) => {
    if (!text.trim()) return;
    
    setIsOpen(true);
    setIsMinimized(false);
    
    // Set user message with the highlighted text
    setMessages(prev => [...prev, { type: 'user', text }]);
    
    // Set loading state
    setIsLoading(true);
    
    // Simulate processing time
    await delay(1500);
    
    // Generate AI response
    const response = generateResponse(text);
    setMessages(prev => [...prev, { type: 'bot', text: response }]);
    
    // Remove loading state
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { type: 'user', text: input }]);
    const userQuestion = input;
    setInput('');
    
    // Set loading state
    setIsLoading(true);
    
    // Simulate processing time
    await delay(1500);
    
    const response = generateResponse(userQuestion);
    setMessages(prev => [...prev, { type: 'bot', text: response }]);
    
    // Remove loading state
    setIsLoading(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Predefined responses based on module exercise questions
  const generateResponse = (question) => {
    // Convert question to lowercase for case-insensitive matching
    const lowerQuestion = question.toLowerCase();
    
    // HTML Basics (Module 2) responses
    if (lowerQuestion.includes('html') && lowerQuestion.includes('page') && lowerQuestion.includes('create')) {
      return `For creating a simple HTML page about yourself, follow these steps:

1. Start with the basic HTML structure:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>About Me</title>
</head>
<body>
  <!-- Your content will go here -->
</body>
</html>
\`\`\`

2. Add a heading with your name:
\`\`\`html
<h1>Your Name</h1>
\`\`\`

3. Add a paragraph about your hobbies:
\`\`\`html
<p>I enjoy coding, reading, and hiking in my free time.</p>
\`\`\`

4. Add a list of your favorite websites with links:
\`\`\`html
<h2>My Favorite Websites</h2>
<ul>
  <li><a href="https://www.example.com" target="_blank">Example Website</a></li>
  <li><a href="https://www.another-site.com" target="_blank">Another Website</a></li>
</ul>
\`\`\`

5. Add an image:
\`\`\`html
<img src="your-image.jpg" alt="Description of image">
\`\`\`

Remember to save the file with a .html extension and open it in a web browser to see the result!`;
    }
    
    // CSS Fundamentals (Module 3) responses
    else if ((lowerQuestion.includes('css') && lowerQuestion.includes('style')) || 
             (lowerQuestion.includes('style') && lowerQuestion.includes('html page'))) {
      return `To style your HTML page with CSS, here are some tips:

1. Change the background color of the page:
\`\`\`css
body {
  background-color: #f0f0f0; /* Light gray background */
}
\`\`\`

2. Add custom colors to your headings:
\`\`\`css
h1 {
  color: #2c3e50; /* Dark blue */
}

h2 {
  color: #3498db; /* Light blue */
}
\`\`\`

3. Change the font family and size of paragraphs:
\`\`\`css
p {
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  line-height: 1.5;
}
\`\`\`

4. Add borders around your lists:
\`\`\`css
ul, ol {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px 15px 15px 35px;
  background-color: white;
}
\`\`\`

5. Add hover effects to links:
\`\`\`css
a {
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #e74c3c;
  text-decoration: underline;
}
\`\`\`

You can include these styles in your HTML using a <style> tag in the head section or by creating an external CSS file and linking to it.`;
    }
    
    // JavaScript Basics (Module 4) responses
    else if (lowerQuestion.includes('javascript') && lowerQuestion.includes('add')) {
      return `To add JavaScript to your HTML page, here are some examples:

1. Create a button that changes background color when clicked:
\`\`\`html
<button id="colorButton">Change Background Color</button>

<script>
  const colorButton = document.getElementById('colorButton');
  colorButton.addEventListener('click', function() {
    // Generate a random color
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    document.body.style.backgroundColor = randomColor;
  });
</script>
\`\`\`

2. Add a form that validates input:
\`\`\`html
<form id="myForm">
  <input type="text" id="username" placeholder="Enter your name">
  <button type="submit">Submit</button>
</form>

<script>
  const form = document.getElementById('myForm');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    
    if (username.trim() === '') {
      alert('Please enter your name!');
    } else {
      alert('Thank you, ' + username + '!');
      form.reset();
    }
  });
</script>
\`\`\`

3. Create an interactive element that responds to mouse hover:
\`\`\`html
<div id="hoverBox" style="width: 200px; height: 200px; background-color: lightblue; display: flex; justify-content: center; align-items: center; transition: all 0.3s ease;">
  Hover over me!
</div>

<script>
  const hoverBox = document.getElementById('hoverBox');
  
  hoverBox.addEventListener('mouseenter', function() {
    this.style.backgroundColor = 'lightgreen';
    this.style.transform = 'scale(1.1)';
    this.textContent = 'Mouse is over me!';
  });
  
  hoverBox.addEventListener('mouseleave', function() {
    this.style.backgroundColor = 'lightblue';
    this.style.transform = 'scale(1)';
    this.textContent = 'Hover over me!';
  });
</script>
\`\`\`

Remember to place your script at the end of the body tag for better performance, or use the defer attribute in the head section.`;
    }
    
    // Build Your First Web Page (Module 5) responses
    else if (lowerQuestion.includes('portfolio') && lowerQuestion.includes('customize')) {
      return `To customize the portfolio template, here are some ideas:

1. Add your own information:
   - Replace "John Doe" with your name
   - Update the job title and about me section
   - Add your actual projects with descriptions

2. Change the color scheme by updating these CSS variables:
\`\`\`css
:root {
  --primary-color: #3a4052;
  --secondary-color: #5b88a5;
  --accent-color: #ff6b6b;
  --text-color: #333;
  --bg-color: #f8f9fa;
}
\`\`\`

3. Add more projects with descriptions and images:
\`\`\`html
<div class="project">
  <img src="project-image.jpg" alt="Project Name">
  <h3>Project Name</h3>
  <p>Detailed project description. Explain what technologies you used and what problems you solved.</p>
  <a href="https://project-link.com" target="_blank">View Project</a>
</div>
\`\`\`

4. Enhance styling with animations:
\`\`\`css
.project {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}
\`\`\`

5. Add a skills section with progress bars:
\`\`\`html
<section>
  <h2>My Skills</h2>
  <div class="skill">
    <p>HTML/CSS <span>90%</span></p>
    <div class="skill-bar"><div class="skill-level" style="width: 90%"></div></div>
  </div>
  <div class="skill">
    <p>JavaScript <span>80%</span></p>
    <div class="skill-bar"><div class="skill-level" style="width: 80%"></div></div>
  </div>
</section>
\`\`\`

6. Add a light/dark mode toggle:
\`\`\`javascript
const themeToggle = document.createElement('button');
themeToggle.id = 'theme-toggle';
themeToggle.textContent = '🌙';
document.body.appendChild(themeToggle);

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});
\`\`\`

Remember to also add the corresponding CSS for these new features!`;
    }
    
    // Responsive Design (Module 6) responses
    else if (lowerQuestion.includes('responsive') && lowerQuestion.includes('portfolio')) {
      return `To make your portfolio page responsive, follow these tips:

1. Ensure all elements adapt to different screen sizes:
\`\`\`css
/* Base styles for mobile devices */
.container {
  width: 95%;
  padding: 1rem;
}

/* Tablet styles */
@media (min-width: 768px) {
  .container {
    width: 90%;
    padding: 1.5rem;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .container {
    width: 80%;
    max-width: 1200px;
    padding: 2rem;
  }
}
\`\`\`

2. Create a responsive navigation menu:
\`\`\`html
<nav>
  <div class="logo">Your Name</div>
  <button class="menu-toggle">☰</button>
  <ul class="nav-links">
    <li><a href="#about">About</a></li>
    <li><a href="#projects">Projects</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>
\`\`\`

\`\`\`css
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.menu-toggle {
  display: none;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }
  
  .nav-links {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 70%;
    background: #333;
    flex-direction: column;
    padding: 2rem;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }
  
  .nav-links.active {
    transform: translateX(0);
  }
}
\`\`\`

\`\`\`javascript
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
\`\`\`

3. Use flexible images:
\`\`\`css
img {
  max-width: 100%;
  height: auto;
}
\`\`\`

4. Create a responsive grid for projects:
\`\`\`css
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
\`\`\`

5. Test on multiple devices using browser dev tools to ensure it looks good on various screen sizes.

6. Don't forget to include the viewport meta tag in your HTML head:
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\``;
    }
    
    // If it's not a specific exercise question, return a helpful message without revealing limitations
    else if (lowerQuestion.includes('what') && lowerQuestion.includes('you') && (lowerQuestion.includes('do') || lowerQuestion.includes('can'))) {
      return "I can help you with web development questions, particularly around HTML, CSS, JavaScript, portfolio creation, and responsive design. Feel free to ask anything about your coding exercises or projects!";
    }
    else if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('hey')) {
      return "Hello there! How can I help with your web development journey today?";
    }
    else if (lowerQuestion.includes('thanks') || lowerQuestion.includes('thank you')) {
      return "You're welcome! Feel free to ask if you have any other questions.";
    }
    else if (lowerQuestion.includes('module 1') || lowerQuestion.includes('what is web development')) {
      return "Web development is the process of building and maintaining websites. It involves frontend (what users see), backend (server logic), and full-stack development (both). The core technologies are HTML (structure), CSS (presentation), and JavaScript (behavior). It's a highly valued skill set in today's digital world. Would you like to learn more about a specific aspect?";
    }
    else {
      return "I appreciate your question! While I'd like to help, I may need more context about which specific exercise or module you're working on. Could you clarify which part of web development (HTML, CSS, JavaScript, etc.) you're asking about? Or if you're working on a particular exercise, please mention which module it's from.";
    }
  };

  // Chat interface JSX
  const ChatInterface = (
    <div 
      ref={chatRef}
      className={`resizable-chat z-50 transition-all duration-300 ${isMinimized ? 'w-auto' : ''}`}
      style={{ 
        width: isMinimized ? 'auto' : `${chatSize.width}px`,
        height: isMinimized ? 'auto' : `${chatSize.height}px`,
        minWidth: isMinimized ? 'auto' : '320px',
        maxWidth: isMinimized ? 'auto' : '800px',
        minHeight: isMinimized ? 'auto' : '400px',
        maxHeight: isMinimized ? 'auto' : '80vh'
      }}
    >
      {/* Chat header */}
      <div className="bg-accent text-black p-3 rounded-t-lg flex justify-between items-center cursor-pointer" onClick={toggleMinimize}>
        <div className="font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          {isMinimized ? 'AI Assistant' : 'Exercise Helper AI'}
        </div>
        <div className="flex items-center">
          {!isMinimized && (
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="ml-2 text-black hover:text-gray-200 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Chat body - only show if not minimized */}
      {!isMinimized && (
        <>
          <div 
            className="bg-gray-800 text-black overflow-y-auto p-4 border-x border-white/10"
            style={{ 
              height: 'calc(100% - 120px)', // Adjust based on header and input height
              minHeight: '300px'
            }}
          >
            {messages.map((message, index) => (
              <div key={index} className={`mb-3 ${message.type === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-2 rounded-lg max-w-[85%] ${
                  message.type === 'user' 
                    ? 'bg-accent text-black' 
                    : 'bg-gray-700 text-white'
                }`}>
                  {message.text.split('\n').map((line, i) => {
                    if (line.includes('```')) {
                      // For code blocks
                      return null; // Handle in the next step
                    }
                    return <p key={i}>{line}</p>;
                  })}
                  
                  {/* Handle code blocks specifically */}
                  {message.text.includes('```') && (
                    message.text.split('```').map((block, i) => {
                      // Every odd index is a code block
                      if (i % 2 === 1) {
                        const [language, ...code] = block.split('\n');
                        return (
                          <div key={`code-${i}`} className="bg-gray-900 p-2 rounded my-2 text-gray-300 text-left overflow-x-auto">
                            <pre className="text-sm">
                              <code>
                                {code.join('\n')}
                              </code>
                            </pre>
                          </div>
                        );
                      }
                      return null;
                    })
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="mb-3" data-testid="loading-indicator">
                <div className="inline-block p-3 rounded-lg bg-gray-700 text-white">
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse flex gap-1">
                      <div className="h-2 w-2 bg-white rounded-full"></div>
                      <div className="h-2 w-2 bg-white rounded-full animation-delay-200"></div>
                      <div className="h-2 w-2 bg-white rounded-full animation-delay-400"></div>
                    </div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Chat input */}
          <form onSubmit={handleSubmit} className="bg-gray-700 rounded-b-lg p-2 border-x border-b border-white/10">
            <div className="flex">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about exercises..."
                className="flex-1 p-2 bg-gray-800 text-white rounded-l-md border border-gray-600 focus:outline-none focus:ring-1 focus:ring-accent"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`text-black font-medium py-2 px-4 rounded-r-md ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-accent'}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
            <div className="mt-1 text-gray-400 text-xs">
              Tip: Highlight text anywhere and press Ctrl+I to ask a question about it.
            </div>
          </form>
          
          {/* Resize handles */}
          <div className="resize-handle resize-handle-n" onMouseDown={(e) => startResize('n', e)}></div>
          <div className="resize-handle resize-handle-ne" onMouseDown={(e) => startResize('ne', e)}></div>
          <div className="resize-handle resize-handle-e" onMouseDown={(e) => startResize('e', e)}></div>
          <div className="resize-handle resize-handle-se" onMouseDown={(e) => startResize('se', e)}></div>
          <div className="resize-handle resize-handle-s" onMouseDown={(e) => startResize('s', e)}></div>
          <div className="resize-handle resize-handle-sw" onMouseDown={(e) => startResize('sw', e)}></div>
          <div className="resize-handle resize-handle-w" onMouseDown={(e) => startResize('w', e)}></div>
          <div className="resize-handle resize-handle-nw" onMouseDown={(e) => startResize('nw', e)}></div>
        </>
      )}
    </div>
  );

  // Floating button when chat is closed
  const FloatingButton = (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-4 right-4 bg-accent text-black rounded-full p-3 shadow-lg hover:bg-blue-700 transition-all z-50 flex items-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      <span className="font-medium">AI Assistant</span>
    </button>
  );

  // Wrap children with the context provider
  const contextValue = {
    sendToChatbox,
    processHighlightedText
  };

  // Use portal to render the chat outside the normal DOM hierarchy
  if (typeof document !== 'undefined') {
    return (
      <AIChatContext.Provider value={contextValue}>
        {children}
        {!isOpen && FloatingButton}
        {isOpen && createPortal(ChatInterface, document.body)}
      </AIChatContext.Provider>
    );
  }

  return <AIChatContext.Provider value={contextValue}>{children}</AIChatContext.Provider>;
};

export default AIChatAssistant; 