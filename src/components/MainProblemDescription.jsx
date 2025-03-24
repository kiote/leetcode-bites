import React from 'react';
import PropTypes from 'prop-types';

const MainProblemDescription = ({ mainProblem, isExpanded, onToggle }) => {
  return (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-left">
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={onToggle}
        aria-expanded={isExpanded}
        data-testid="main-problem-header"
      >
        <h3 className="font-bold mb-2 text-blue-800 text-left">{mainProblem.title}</h3>
        <span className="text-blue-800">
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>
      
      {isExpanded && (
        <div data-testid="main-problem-content">
          <p className="mb-2 text-left">{mainProblem.description}</p>
          
          {mainProblem.examples && mainProblem.examples.length > 0 && (
            <div className="mt-3 text-left">
              <h5 className="font-medium text-blue-600 text-left">Examples:</h5>
              <div className="pl-2 mt-1 border-l-2 border-blue-200">
                {mainProblem.examples.map((example) => (
                  <div key={example.id} className="mb-3">
                    <p className="mb-1 text-left"><span className="font-medium">Example {example.id}:</span></p>
                    <p className="mb-1 pl-2 text-left">Input: {example.input}</p>
                    <p className="mb-1 pl-2 text-left">Output: {example.output}</p>
                    {Array.isArray(example.explanation) ? (
                      example.explanation.map((line, idx) => (
                        <p key={idx} className="mb-1 pl-2 text-gray-600 text-sm text-left">{line}</p>
                      ))
                    ) : (
                      <p className="mb-1 pl-2 text-gray-600 text-sm text-left">{example.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {mainProblem.constraints && mainProblem.constraints.length > 0 && (
            <div className="mt-4 text-left">
              <h5 className="font-medium text-blue-600 text-left">Constraints:</h5>
              <ul className="list-disc pl-5 mt-1">
                {mainProblem.constraints.map((constraint, index) => (
                  <li key={index} className="text-left" dangerouslySetInnerHTML={{ __html: constraint.replace(/\^(\d+)/g, '<sup>$1</sup>') }}></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

MainProblemDescription.propTypes = {
  mainProblem: PropTypes.object.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default MainProblemDescription;
