import React from 'react';
import PropTypes from 'prop-types';

export const TestResults = ({ results, isRunning }) => {
  const passedCount = results.filter(r => r.passed).length;
  const passPercentage = results.length ? Math.round(passedCount / results.length * 100) : 0;
  
  return (
    <div className="bg-white p-4 border border-gray-300 rounded-md">
      <h3 className="font-bold mb-2">Test Results</h3>
      
      {isRunning ? (
        <p className="text-center py-4">Running tests...</p>
      ) : results.length > 0 ? (
        <div>
          <div className="flex justify-between mb-2">
            <span>Tests: {results.length}</span>
            <span>
              Passed: {passedCount}/{results.length} 
              ({passPercentage}%)
            </span>
          </div>
          
          {results.map(result => (
            <div 
              key={result.id} 
              className={`mb-2 p-3 rounded-md ${result.passed ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border`}
            >
              <div className="flex justify-between">
                <span className="font-medium">{result.name}</span>
                <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                  {result.passed ? 'PASS' : 'FAIL'}
                </span>
              </div>
              {!result.passed && (
                <p className="text-red-600 mt-1">{result.error}</p>
              )}
              <div className="mt-1">
                <span className="text-sm text-gray-600">
                  Input: <span className="font-mono">{result.inputs.join(', ')}</span>
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <span>
                  Output: <span className="font-mono">{JSON.stringify(result.output)}</span>
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <span>Execution time: {result.executionTime.toFixed(3)}ms</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-4 text-gray-500">No tests have been run yet</p>
      )}
    </div>
  );
};

TestResults.propTypes = {
  results: PropTypes.array.isRequired,
  isRunning: PropTypes.bool.isRequired
};
