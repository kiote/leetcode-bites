import React from 'react';
import PropTypes from 'prop-types';

export const TestResults = ({ results, isRunning }) => {
  // Calculate pass/fail statistics
  const passCount = results.filter(result => result.passed).length;
  const failCount = results.length - passCount;
  const allPassed = results.length > 0 && failCount === 0;
  
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
              Passed: <span className="text-green-600">{passCount}</span> | 
              Failed: <span className="text-red-600">{failCount}</span>
            </span>
          </div>
          
          {allPassed && (
            <div className="bg-green-100 text-green-800 p-2 mb-4 rounded-md">
              All tests passed! 🎉
            </div>
          )}
          
          <div className="mt-4">
            {results.map((result, index) => (
              <div 
                key={`test-result-${index}`} 
                className={`mb-2 p-3 rounded-md ${
                  result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">
                    {result.functionName}{result.inputs.length > 0 ? 
                      `(${result.inputs.map(i => JSON.stringify(i)).join(', ')})` : '()'}
                  </h4>
                  <span 
                    className={`text-sm font-medium px-2 py-1 rounded-md ${
                      result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {result.passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                
                <div className="mt-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-medium">Expected:</p>
                      <pre className="bg-gray-100 p-1 mt-1 rounded text-xs overflow-x-auto">
                        {JSON.stringify(result.expectedOutput)}
                      </pre>
                    </div>
                    <div>
                      <p className="font-medium">Actual:</p>
                      <pre className="bg-gray-100 p-1 mt-1 rounded text-xs overflow-x-auto">
                        {JSON.stringify(result.output)}
                      </pre>
                    </div>
                  </div>
                  
                  {result.error && (
                    <div className="mt-2 text-red-600">
                      <p className="font-medium">Error:</p>
                      <pre className="bg-red-50 p-1 mt-1 rounded text-xs overflow-x-auto">
                        {result.error}
                      </pre>
                    </div>
                  )}
                  
                  {result.stdout && (
                    <div className="mt-2">
                      <p className="font-medium">Output:</p>
                      <pre className="bg-gray-100 p-1 mt-1 rounded text-xs overflow-x-auto">
                        {result.stdout}
                      </pre>
                    </div>
                  )}
                  
                  <p className="mt-2 text-gray-500 text-xs">
                    Execution time: {result.executionTime}ms
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center py-4 text-gray-500">
          No tests have been run yet
        </p>
      )}
    </div>
  );
};

TestResults.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      functionName: PropTypes.string.isRequired,
      passed: PropTypes.bool,
      error: PropTypes.string,
      output: PropTypes.any,
      expectedOutput: PropTypes.any,
      executionTime: PropTypes.number,
      stdout: PropTypes.string
    })
  ).isRequired,
  isRunning: PropTypes.bool.isRequired
};

TestResults.defaultProps = {
  results: [],
  isRunning: false
};
