import React from 'react';
import PropTypes from 'prop-types';

export const CodeEditor = ({ code, onChange }) => {
  return (
    <div className="mb-4">
      <textarea
        className="w-full h-64 p-4 font-mono border border-gray-300 rounded-md"
        value={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your JavaScript code here..."
        aria-label="Code editor"
      />
    </div>
  );
};

CodeEditor.propTypes = {
  code: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
