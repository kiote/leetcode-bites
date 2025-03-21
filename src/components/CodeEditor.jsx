import React from 'react';
import PropTypes from 'prop-types';

export const CodeEditor = ({ code, onChange }) => {
  const handleEditorChange = (e) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const { selectionStart, selectionEnd } = e.target;
      const newValue = 
        code.substring(0, selectionStart) + 
        '\t' + 
        code.substring(selectionEnd);
      
      onChange(newValue);
      
      // Set cursor position after the inserted tab
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;
      }, 0);
    }
  };

  return (
    <div className="w-full border border-gray-300 rounded-md bg-white">
      <div className="p-2 bg-gray-100 border-b border-gray-300 flex items-center justify-between">
        <span className="font-medium">Python Editor</span>
        <span className="text-xs text-gray-500">Simple text editor</span>
      </div>
      <textarea
        value={code}
        onChange={handleEditorChange}
        onKeyDown={handleKeyDown}
        className="w-full h-96 p-4 font-mono text-sm focus:outline-none"
        style={{
          resize: 'none',
          lineHeight: 1.5,
        }}
        placeholder="Write your Python code here..."
        spellCheck="false"
      />
    </div>
  );
};

CodeEditor.propTypes = {
  code: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default CodeEditor;
