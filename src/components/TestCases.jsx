import React from 'react';
import PropTypes from 'prop-types';

export const TestCases = ({ tests }) => {
  return (
    <div className="mb-4 bg-white p-4 border border-gray-300 rounded-md h-64 overflow-y-auto">
      <h3 className="font-bold mb-4">Predefined Test Cases</h3>
      {tests.map(test => (
        <div 
          key={test.id} 
          className="mb-4 p-3 border border-gray-200 rounded-md transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
        >
          <p className="font-medium">{test.name}</p>
          <p className="font-mono text-sm bg-gray-100 p-2 my-2">{test.testCode}</p>
          <p className="text-sm text-gray-600">
            Function: <span className="font-mono font-semibold">{test.functionName}</span>, 
            Inputs: <span className="font-mono">{test.inputs.join(', ')}</span>, 
            Expected: <span className="font-mono font-semibold">{JSON.stringify(test.expectedOutput)}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

TestCases.propTypes = {
  tests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      testCode: PropTypes.string.isRequired,
      functionName: PropTypes.string.isRequired,
      inputs: PropTypes.array.isRequired,
      expectedOutput: PropTypes.any.isRequired
    })
  ).isRequired
};
