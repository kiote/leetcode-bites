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
    } else if (e.key === 'Enter') {
      e.preventDefault();
      
      const { selectionStart } = e.target;
      
      // Find the start of the current line
      const currentLineStart = code.lastIndexOf('\n', selectionStart - 1) + 1;
      
      // Calculate indentation of the current line
      let indentation = '';
      for (let i = currentLineStart; i < selectionStart && (code[i] === ' ' || code[i] === '\t'); i++) {
        indentation += code[i];
      }
      
      // Insert new line with the same indentation
      const newValue = 
        code.substring(0, selectionStart) + 
        '\n' + indentation + 
        code.substring(selectionStart);
      
      // Update with the correctly formatted string
      onChange(newValue);
      
      // Set cursor position after indentation in the new line
      const newCursorPosition = selectionStart + 1 + indentation.length;
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = newCursorPosition;
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
