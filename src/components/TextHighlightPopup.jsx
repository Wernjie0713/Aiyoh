import React, { useState, useEffect, useRef } from 'react';
import { useAIChat } from './AIChatAssistant';

const TextHighlightPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const popupRef = useRef(null);
  const selectionTimeoutRef = useRef(null);
  
  // Get context with safety check
  const aiChatContext = useAIChat();
  const processHighlightedText = aiChatContext?.processHighlightedText;
  
  // Handle text selection
  useEffect(() => {
    // If the context isn't available, don't set up event listeners
    if (!processHighlightedText) return;
    
    const checkSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      // Only show popup for selections of 3 or more characters
      if (text && text.length >= 3) {
        try {
          // Get selection coordinates
          const range = selection.getRangeAt(0);
          
          // Get exact bounding rect of the selection
          const rect = range.getBoundingClientRect();
          
          if (rect.width > 0 && rect.height > 0) {
            // Account for scroll position to get absolute position
            const scrollX = window.scrollX || window.pageXOffset;
            const scrollY = window.scrollY || window.pageYOffset;
            
            // Calculate position for the popup
            // Center horizontally over the selection
            const xPos = rect.left + (rect.width / 2);
            
            // Position slightly above the selection with some spacing
            // If the selection is near the top of the viewport, position below instead
            const yPos = rect.top < 60
              ? rect.bottom + 10 // Position below if selection is near the top
              : rect.top - 50;   // Position above selection (allowing space for the popup)
            
            setPosition({ 
              x: xPos, 
              y: yPos
            });
            
            setSelectedText(text);
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        } catch (e) {
          console.error("Error getting selection:", e);
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }
    };
    
    // Handle selection events
    const handleSelectionChange = () => {
      // Use a timeout to prevent flickering during selection
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }
      
      selectionTimeoutRef.current = setTimeout(checkSelection, 200);
    };
    
    // Handle clicks outside the popup to close it
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };
    
    // Listen for both mouseup and touchend for better mobile support
    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('touchend', handleSelectionChange);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    // Handle window resize or scroll
    const handleWindowChange = () => {
      if (isVisible) {
        handleSelectionChange();
      }
    };
    
    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange);
    
    return () => {
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('touchend', handleSelectionChange);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange);
    };
  }, [isVisible, processHighlightedText]);
  
  const handleAddToChat = () => {
    if (selectedText && processHighlightedText) {
      processHighlightedText(selectedText);
      setIsVisible(false);
      window.getSelection().removeAllRanges(); // Clear selection
    }
  };
  
  // If the context isn't available or popup shouldn't be visible, don't render anything
  if (!processHighlightedText || !isVisible) return null;
  
  // Calculate if the popup should show the pointer above or below
  const showPointerBelow = position.y <= 60;
  
  return (
    <div 
      ref={popupRef}
      className={`fixed z-50 bg-accent text-black rounded-lg shadow-xl transform -translate-x-1/2 animate-fade-in-up ${showPointerBelow ? 'pointer-bottom' : 'pointer-top'}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`
      }}
    >
      <div className="flex flex-col items-center px-1 py-1">
        <button 
          onClick={handleAddToChat}
          className="font-medium flex items-center gap-2 px-3 py-2 rounded hover:bg-orange-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Add to Chat
          <span className="text-xs opacity-75">Ctrl+I</span>
        </button>
      </div>
      
    </div>
  );
};

export default TextHighlightPopup; 