// Basic editor implementation without monaco-editor dependency
import React from 'react';
import PropTypes from 'prop-types';

export const CodeEditor = ({ code, onChange, language = 'javascript' }) => {
  const handleEditorChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full border border-gray-300 rounded-md bg-white">
      <div className="p-2 bg-gray-100 border-b border-gray-300 flex items-center justify-between">
        <span className="font-medium">
          {language === 'python' ? 'Python' : 'JavaScript'} Editor
        </span>
        <span className="text-xs text-gray-500">Simple text editor</span>
      </div>
      <textarea
        value={code}
        onChange={handleEditorChange}
        className="w-full h-96 p-4 font-mono text-sm focus:outline-none"
        style={{
          resize: 'none',
          lineHeight: 1.5,
        }}
        placeholder={`Write your ${language === 'python' ? 'Python' : 'JavaScript'} code here...`}
        spellCheck="false"
      />
    </div>
  );
};

CodeEditor.propTypes = {
  code: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  language: PropTypes.oneOf(['javascript', 'python'])
};

export default CodeEditor;
