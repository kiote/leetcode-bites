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
        <div className="text-center py-3">
          <div className="flex justify-center gap-4 mb-2 text-lg">
            <span>
              <span className="font-semibold">Tests:</span> {results.length}
            </span>
            <span>
              <span className="font-semibold text-green-600">Passed:</span> {passCount}
            </span>
            <span>
              <span className="font-semibold text-red-600">Failed:</span> {failCount}
            </span>
          </div>
          
          {allPassed ? (
            <div className="bg-green-100 text-green-800 p-3 mt-3 rounded-md font-medium">
              All tests passed! 🎉
            </div>
          ) : (
            <div className="bg-red-100 text-red-800 p-3 mt-3 rounded-md font-medium">
              Some tests failed ❌
            </div>
          )}
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
