import React, { useState, useEffect } from 'react';

// Game level data - expanded for more modules
const gameLevels = [
  {
    id: 0, // Module 1: Intro to Web Development
    title: "Web Development Concepts",
    description: "Arrange these web development concepts in order of their typical learning progression",
    initialBlocks: [
      { id: 'block-5', content: 'JavaScript' },
      { id: 'block-3', content: 'CSS' },
      { id: 'block-4', content: 'Responsive Design' },
      { id: 'block-6', content: 'Web Frameworks' },
      { id: 'block-1', content: 'HTML' },
      { id: 'block-2', content: 'Web Basics' },
      { id: 'block-7', content: 'APIs & Backend' },
    ],
    solution: [
      'block-2', 'block-1', 'block-3', 'block-4', 'block-5', 'block-7', 'block-6'
    ]
  },
  {
    id: 1, // Module 2: HTML Basics
    title: "HTML Basic Structure",
    description: "Arrange these elements to create a valid HTML document structure",
    initialBlocks: [
      { id: 'block-5', content: '</body>' },
      { id: 'block-3', content: '<title>My Page</title>' },
      { id: 'block-4', content: '<body>' },
      { id: 'block-6', content: '</html>' },
      { id: 'block-1', content: '<html>' },
      { id: 'block-2', content: '<head>' },
      { id: 'block-7', content: '</head>' },
    ],
    solution: [
      'block-1', 'block-2', 'block-3', 'block-7', 'block-4', 'block-5', 'block-6'
    ]
  },
  {
    id: 2, // Module 3: CSS Fundamentals
    title: "CSS Selectors",
    description: "Arrange these CSS selectors in order of increasing specificity",
    initialBlocks: [
      { id: 'block-5', content: '#header (ID selector)' },
      { id: 'block-3', content: '.box (Class selector)' },
      { id: 'block-4', content: 'button:hover (Pseudo-class)' },
      { id: 'block-6', content: 'section > p (Child selector)' },
      { id: 'block-1', content: 'h1 (Element selector)' },
      { id: 'block-2', content: '* (Universal selector)' },
      { id: 'block-7', content: 'style="color: red" (Inline style)' },
    ],
    solution: [
      'block-2', 'block-1', 'block-3', 'block-6', 'block-4', 'block-5', 'block-7'
    ]
  },
  {
    id: 3, // Module 4: JavaScript Basics
    title: "JavaScript Execution Order",
    description: "Arrange these JavaScript code snippets in their execution order",
    initialBlocks: [
      { id: 'block-5', content: 'callback function execution' },
      { id: 'block-3', content: 'variable declaration' },
      { id: 'block-4', content: 'event listener setup' },
      { id: 'block-6', content: 'DOM update' },
      { id: 'block-1', content: 'script loading' },
      { id: 'block-2', content: 'DOM ready check' },
      { id: 'block-7', content: 'API data fetching' },
    ],
    solution: [
      'block-1', 'block-2', 'block-3', 'block-4', 'block-7', 'block-5', 'block-6'
    ]
  },
  {
    id: 4, // Module 5: Responsive Web Design
    title: "Responsive Design Workflow",
    description: "Arrange these responsive design steps in a logical workflow order",
    initialBlocks: [
      { id: 'block-5', content: 'Implement media queries' },
      { id: 'block-3', content: 'Define breakpoints' },
      { id: 'block-4', content: 'Test on different devices' },
      { id: 'block-6', content: 'Optimize images and assets' },
      { id: 'block-1', content: 'Mobile-first planning' },
      { id: 'block-2', content: 'Create flexible layouts' },
      { id: 'block-7', content: 'Fix browser-specific issues' },
    ],
    solution: [
      'block-1', 'block-3', 'block-2', 'block-5', 'block-6', 'block-4', 'block-7'
    ]
  },
  {
    id: 5, // Module 6: Advanced JavaScript
    title: "JavaScript Concepts",
    description: "Arrange these JavaScript concepts from basic to advanced",
    initialBlocks: [
      { id: 'block-5', content: 'Promises & async/await' },
      { id: 'block-3', content: 'DOM manipulation' },
      { id: 'block-4', content: 'ES6 features' },
      { id: 'block-6', content: 'Design patterns' },
      { id: 'block-1', content: 'Variables & data types' },
      { id: 'block-2', content: 'Functions & scope' },
      { id: 'block-7', content: 'Web APIs' },
    ],
    solution: [
      'block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-7', 'block-6'
    ]
  },
  {
    id: 6, // Module 7: Web Frameworks
    title: "Framework Development Stages",
    description: "Arrange these web application development stages in order",
    initialBlocks: [
      { id: 'block-5', content: 'State management' },
      { id: 'block-3', content: 'Create components' },
      { id: 'block-4', content: 'Routing setup' },
      { id: 'block-6', content: 'API integration' },
      { id: 'block-1', content: 'Project setup' },
      { id: 'block-2', content: 'Define component hierarchy' },
      { id: 'block-7', content: 'Testing & deployment' },
    ],
    solution: [
      'block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-6', 'block-7'
    ]
  }
];

const WebDevGame = ({ onCompleteLevel, activeModule }) => {
  // Select level based on module
  const levelIdx = Math.min(activeModule, gameLevels.length - 1);
  const level = gameLevels[levelIdx];
  
  const [blocks, setBlocks] = useState(level.initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  // Reset blocks when level changes
  useEffect(() => {
    setBlocks(level.initialBlocks);
    setIsCorrect(null);
    setShowSuccessMessage(false);
    setSelectedBlockId(null);
  }, [level]);

  const handleBlockClick = (blockId) => {
    setSelectedBlockId(blockId);
  };

  const moveBlockUp = (blockId) => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index > 0) {
      const newBlocks = [...blocks];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      setBlocks(newBlocks);
      setIsCorrect(null);
    }
  };

  const moveBlockDown = (blockId) => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      setBlocks(newBlocks);
      setIsCorrect(null);
    }
  };

  // Drag handlers
  const handleDragStart = (e, blockId) => {
    setDraggedItem(blockId);
    // For better visual feedback during drag
    e.dataTransfer.effectAllowed = 'move';
    // Necessary for Firefox
    e.dataTransfer.setData('text/plain', blockId);
    // Add styling to the dragged element
    setTimeout(() => {
      e.target.classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50');
    setDraggedItem(null);
  };

  const handleDragOver = (e, blockId) => {
    e.preventDefault();
    // Add visual indication of drop target
    e.currentTarget.classList.add('bg-gray-700');
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = (e) => {
    // Remove visual indication when leaving drop target
    e.currentTarget.classList.remove('bg-gray-700');
  };

  const handleDrop = (e, targetBlockId) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-700');
    
    // Ensure we have both source and target
    if (!draggedItem) return;
    
    // Find the positions of both blocks
    const sourceIndex = blocks.findIndex(block => block.id === draggedItem);
    const targetIndex = blocks.findIndex(block => block.id === targetBlockId);
    
    // Don't do anything if dropping onto itself
    if (sourceIndex === targetIndex) return;
    
    // Create new array with the updated order
    const newBlocks = [...blocks];
    const [movedItem] = newBlocks.splice(sourceIndex, 1);
    newBlocks.splice(targetIndex, 0, movedItem);
    
    setBlocks(newBlocks);
    setIsCorrect(null);
  };

  const checkAnswer = () => {
    const currentOrder = blocks.map(block => block.id);
    const isCorrectAnswer = JSON.stringify(currentOrder) === JSON.stringify(level.solution);
    
    setIsCorrect(isCorrectAnswer);
    
    if (isCorrectAnswer) {
      setShowSuccessMessage(true);
      // Call the callback to award points
      if (onCompleteLevel) {
        onCompleteLevel(level.id);
      }
    }
  };

  const resetBlocks = () => {
    setBlocks(level.initialBlocks);
    setIsCorrect(null);
    setShowSuccessMessage(false);
    setSelectedBlockId(null);
  };

  return (
    <>
      <h4 className="text-xl font-semibold text-white mb-2">{level.title}</h4>
      <p className="text-gray-300 mb-4">{level.description}</p>
      
      <div className="mb-4">
        <div className={`p-4 rounded-lg mb-4 ${isCorrect === true ? 'bg-green-900/30 border border-green-500' : isCorrect === false ? 'bg-red-900/30 border border-red-500' : 'bg-gray-800/50'}`}>
          {blocks.map((block) => (
            <div 
              key={block.id}
              onClick={() => handleBlockClick(block.id)}
              className={`flex items-center justify-between bg-gray-800 border ${selectedBlockId === block.id ? 'border-orange-500' : 'border-gray-700'} p-3 mb-2 rounded-md shadow-md cursor-grab text-white font-mono text-sm hover:bg-gray-700 transition-colors`}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, block.id)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, block.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, block.id)}
            >
              <div className="flex items-center w-full">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                </span>
                <span>{block.content}</span>
              </div>
              {selectedBlockId === block.id && (
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveBlockUp(block.id); }}
                    className="px-2 py-1 bg-blue-900/50 rounded hover:bg-blue-800 transition-colors"
                    disabled={blocks.indexOf(block) === 0}
                  >
                    ↑
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveBlockDown(block.id); }}
                    className="px-2 py-1 bg-blue-900/50 rounded hover:bg-blue-800 transition-colors"
                    disabled={blocks.indexOf(block) === blocks.length - 1}
                  >
                    ↓
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={checkAnswer}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
          >
            Check Answer
          </button>
          <button 
            onClick={resetBlocks}
            className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
          >
            Reset Blocks
          </button>
        </div>
      </div>
      
      {showSuccessMessage && (
        <div className="mt-4 p-4 bg-green-900/30 border border-green-500 rounded-lg text-white animate-pulse">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🎉</span>
            <span>Excellent job! You've arranged the blocks correctly!</span>
          </div>
        </div>
      )}
      
      {isCorrect === false && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-lg text-white">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🤔</span>
            <span>Not quite right. Try rearranging the blocks to create the correct order.</span>
          </div>
        </div>
      )}
      
      <div className="mt-6 bg-gray-800/30 border border-gray-700 rounded-lg p-3">
        <h4 className="text-white font-medium mb-2">How to play:</h4>
        <ol className="list-decimal list-inside text-gray-300 space-y-1 text-sm">
          <li>Drag and drop blocks to rearrange them</li>
          <li>Alternatively, click a block and use the arrows</li>
          <li>Arrange all blocks in the correct order</li>
          <li>Click "Check Answer" when you're ready</li>
        </ol>
      </div>
    </>
  );
};

export default WebDevGame; 