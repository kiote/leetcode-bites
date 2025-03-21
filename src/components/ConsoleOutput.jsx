import React from 'react';
import PropTypes from 'prop-types';

export const ConsoleOutput = ({ logs }) => {
  return (
    <div className="mb-4 bg-black text-green-400 p-4 border border-gray-300 rounded-md h-64 overflow-y-auto font-mono">
      {logs && logs.length > 0 ? (
        logs.map((log, i) => (
          <div key={i} className="mb-1 console-log-entry">{'> ' + log}</div>
        ))
      ) : (
        <p className="text-gray-400">No console output yet. Use console.log() in your code to see output here.</p>
      )}
    </div>
  );
};

ConsoleOutput.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.string).isRequired
};

// Add default props to ensure logs is always an array
ConsoleOutput.defaultProps = {
  logs: []
};
