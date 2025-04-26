import React, { useState, useEffect, useRef } from 'react';
import { useAIChat } from './AIChatAssistant';

const InactivityAlerts = () => {
  const [lastActive, setLastActive] = useState(Date.now());
  const [showSmallPopup, setShowSmallPopup] = useState(false);
  const [showLargePopup, setShowLargePopup] = useState(false);
  const [inactivityMonitoring, setInactivityMonitoring] = useState(true);
  const timeoutRef = useRef(null);
  const smallPopupTimerRef = useRef(null);
  const largePopupTimerRef = useRef(null);
  
  // Access AI Chat context functions if available
  const aiChat = useAIChat();
  
  // Time thresholds in milliseconds - reduced further for testing
  const SMALL_POPUP_THRESHOLD = 30000; // 30 seconds for testing
  const LARGE_POPUP_THRESHOLD = 60000; // 1 minute
  
  // Reset activity timer without hiding popups
  const updateActivity = () => {
    // Only update the last active time if we're still monitoring inactivity
    if (inactivityMonitoring) {
      setLastActive(Date.now());
      
      // Clear existing timers when activity is detected
      if (showSmallPopup) {
        if (largePopupTimerRef.current) {
          clearTimeout(largePopupTimerRef.current);
          largePopupTimerRef.current = null;
        }
      }
    }
  };
  
  // Reset everything - timer, popups, and resume monitoring
  const resetEverything = () => {
    console.log('Resetting everything');
    setLastActive(Date.now());
    setShowSmallPopup(false);
    setShowLargePopup(false);
    setInactivityMonitoring(true);
    
    if (smallPopupTimerRef.current) {
      clearTimeout(smallPopupTimerRef.current);
      smallPopupTimerRef.current = null;
    }
    
    if (largePopupTimerRef.current) {
      clearTimeout(largePopupTimerRef.current);
      largePopupTimerRef.current = null;
    }
  };
  
  // Handle dismissing the small popup manually
  const dismissSmallPopup = () => {
    console.log('Small popup dismissed manually');
    setShowSmallPopup(false);
    // If the user manually dismisses the small popup, pause the inactivity monitoring for a while
    setInactivityMonitoring(false);
    
    if (smallPopupTimerRef.current) {
      clearTimeout(smallPopupTimerRef.current);
      smallPopupTimerRef.current = null;
    }
    
    if (largePopupTimerRef.current) {
      clearTimeout(largePopupTimerRef.current);
      largePopupTimerRef.current = null;
    }
    
    // Resume monitoring after 2 minutes
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      console.log('Resuming monitoring after small popup dismissal');
      setInactivityMonitoring(true);
      setLastActive(Date.now()); // Reset the timer
    }, 120000); // 2 minutes
  };
  
  // Handle dismissing the large popup manually
  const dismissLargePopup = () => {
    console.log('Large popup dismissed manually');
    setShowLargePopup(false);
    // If the user manually dismisses the large popup, pause the inactivity monitoring for a while
    setInactivityMonitoring(false);
    
    if (smallPopupTimerRef.current) {
      clearTimeout(smallPopupTimerRef.current);
      smallPopupTimerRef.current = null;
    }
    
    if (largePopupTimerRef.current) {
      clearTimeout(largePopupTimerRef.current);
      largePopupTimerRef.current = null;
    }
    
    // Resume monitoring after 5 minutes
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      console.log('Resuming monitoring after large popup dismissal');
      setInactivityMonitoring(true);
      setLastActive(Date.now()); // Reset the timer
    }, 300000); // 5 minutes
  };
  
  // Handle opening the AI chat
  const handleOpenAIChat = (e) => {
    if (e) e.stopPropagation(); // Prevent triggering the parent click handler
    console.log('Opening AI chat');
    
    // If we have direct access to the AI chat context, use it
    if (aiChat && aiChat.sendToChatbox) {
      aiChat.sendToChatbox("I need help with this course.");
    } else {
      // Otherwise try to click the AI button
      // Look for the floating AI button that appears at the bottom right
      const aiButton = document.querySelector('[class*="fixed bottom-4 right-4 bg-accent"]');
      if (aiButton) {
        aiButton.click();
      }
    }
    
    // Dismiss popups and pause monitoring
    resetEverything();
  };

  // Function to display large popup
  const showLargePopupFn = () => {
    console.log('Showing large popup');
    setShowSmallPopup(false);
    setShowLargePopup(true);
  };
  
  useEffect(() => {
    console.log('InactivityAlerts effect running, monitoring:', inactivityMonitoring);
    console.log('Current state:', { showSmallPopup, showLargePopup });
    
    // Setup event listeners to track user activity
    const handleActivity = () => {
      updateActivity();
    };
    
    // Add event listeners for mouse movement and clicks
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('click', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('scroll', handleActivity);
    
    // Setup interval to check for inactivity
    const inactivityCheckInterval = setInterval(() => {
      // Only check for inactivity if monitoring is enabled
      if (!inactivityMonitoring) return;
      
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActive;
      
      console.log('Checking inactivity:', inactiveTime, 'ms');
      
      // Show large popup directly if inactive for LARGE_POPUP_THRESHOLD
      if (inactiveTime >= LARGE_POPUP_THRESHOLD && !showLargePopup) {
        console.log('LARGE threshold reached, showing large popup');
        setShowSmallPopup(false);
        setShowLargePopup(true);
        return;
      }
      
      // Show small popup based on inactivity threshold
      if (inactiveTime >= SMALL_POPUP_THRESHOLD && inactiveTime < LARGE_POPUP_THRESHOLD && !showSmallPopup && !showLargePopup) {
        console.log('SMALL threshold reached, showing small popup');
        setShowSmallPopup(true);
        
        // After showing the small popup, set a timer for the large popup
        if (largePopupTimerRef.current) {
          clearTimeout(largePopupTimerRef.current);
        }
        
        // Set a direct timer to show large popup after the difference in thresholds
        largePopupTimerRef.current = setTimeout(() => {
          console.log('Timer elapsed, showing large popup');
          showLargePopupFn();
        }, LARGE_POPUP_THRESHOLD - SMALL_POPUP_THRESHOLD);
      }
    }, 1000); // Check every second
    
    // Initialize with current time
    setLastActive(Date.now());
    
    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('scroll', handleActivity);
      clearInterval(inactivityCheckInterval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (smallPopupTimerRef.current) clearTimeout(smallPopupTimerRef.current);
      if (largePopupTimerRef.current) clearTimeout(largePopupTimerRef.current);
    };
  }, [inactivityMonitoring, showSmallPopup, showLargePopup, lastActive]);
  
  // Small popup component with mascot
  const SmallPopup = (
    <div 
      className="fixed bottom-20 right-4 z-50 animate-pop-in flex flex-col items-center cursor-pointer"
      onClick={handleOpenAIChat}
    >
      <div className="relative mb-1">
        <div className="bg-accent text-black py-2 px-3 rounded-lg shadow-lg relative">
          <p className="font-medium text-sm">Need Help?</p>
          {/* Triangle pointer for speech bubble */}
          <div 
            className="absolute -bottom-2 right-4 w-4 h-4 bg-accent transform rotate-45"
            style={{ zIndex: -1 }}
          ></div>
        </div>
      </div>
      
      <img 
        src="/assets/gif/mascot.gif" 
        alt="AI Assistant Mascot" 
        className="w-32 h-20 rounded-full"
      />
      
      {/* Hidden close button that only appears on hover */}
      <button 
        className="absolute -top-2 -right-1 bg-gray-200 text-black hover:text-gray-700 transition-colors rounded-full p-1 opacity-100 hover:opacity-100 focus:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          dismissSmallPopup();
        }}
        aria-label="Close popup"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
  
  // Large popup component
  const LargePopup = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div 
        className="bg-accent text-black py-4 px-6 rounded-lg shadow-xl animate-pop-in flex flex-col items-center relative max-w-sm w-full mx-4"
      >
        <button 
          className="absolute top-2 right-2 text-black hover:text-gray-700 transition-colors"
          onClick={dismissLargePopup}
          aria-label="Close popup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex flex-col items-center mb-3">
          <img 
            src="/assets/gif/mascot.gif" 
            alt="AI Assistant Mascot" 
            className="w-32 h-20 rounded-full"
          />
          <p className="font-medium text-lg mb-1">Are you still there?</p>
          <p className="mb-2 text-center">Need help with your course? Our AI assistant can answer your questions.</p>
        </div>
        
        <button 
          className="bg-black text-white py-2 px-5 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          onClick={handleOpenAIChat}
        >
          Get Help
        </button>
      </div>
    </div>
  );
  
  return (
    <>
      {showSmallPopup && !showLargePopup && SmallPopup}
      {showLargePopup && LargePopup}
    </>
  );
};

export default InactivityAlerts; 