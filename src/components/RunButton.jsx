import React from 'react';
import PropTypes from 'prop-types';

const RunButton = ({ onClick, isRunning, isPyodideLoading, isPyodideReady }) => {
  return (
    <button
      className="px-4 py-2 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-all duration-200 transform hover:scale-105"
      onClick={onClick}
      disabled={isRunning || !isPyodideReady || isPyodideLoading}
      aria-busy={isRunning}
      style={{ 
        opacity: isRunning || !isPyodideReady || isPyodideLoading ? 0.7 : 1,
        boxShadow: !isRunning ? '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)' : 'none'
      }}
    >
      {isRunning ? 'Running Tests...' : 
       isPyodideLoading ? 'Loading Python...' : 
       'Run Python Tests'}
    </button>
  );
};

RunButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isRunning: PropTypes.bool.isRequired,
  isPyodideLoading: PropTypes.bool.isRequired,
  isPyodideReady: PropTypes.bool.isRequired
};

export default RunButton;
