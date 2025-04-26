import React, { useState } from 'react';

/**
 * A component that displays a "Suggested for you" label with a tooltip on hover
 * 
 * @param {Object} props - Component props
 * @param {string} props.reason - The reason text to show in the tooltip
 * @returns {JSX.Element} - The rendered component
 */
const SuggestedLabel = ({ reason }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="relative inline-flex items-center ml-2 group">
      <span 
        className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Suggested for you
        </span>
      </span>
      
      {/* Tooltip that shows on hover */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-black text-white text-xs rounded py-1 px-2 z-10 shadow-lg">
          <div className="relative">
            {reason}
            {/* Triangle pointer */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestedLabel;