import React from 'react';
import PropTypes from 'prop-types';

export const ConsoleOutput = ({ logs }) => {
  return (
    <div className="mb-4 bg-black text-green-400 p-4 border border-gray-300 rounded-md h-64 overflow-y-auto font-mono">
      {logs && logs.length > 0 ? (
        logs.map((log, i) => (
          <div key={i} className={`mb-1 console-log-entry ${log.source === 'python' ? 'text-yellow-400' : 'text-green-400'}`}>
            {log.source === 'python' ? 
              `Python> ${log.content}` : 
              `JS> ${log.content}`}
          </div>
        ))
      ) : (
        <p className="text-gray-400">
          No console output yet. Use print() in your Python code or console.log() in JavaScript to see output here.
        </p>
      )}
    </div>
  );
};

ConsoleOutput.propTypes = {
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      source: PropTypes.oneOf(['js', 'python']).isRequired,
      content: PropTypes.string.isRequired
    })
  ).isRequired
};

// Add default props to ensure logs is always an array
ConsoleOutput.defaultProps = {
  logs: []
};
