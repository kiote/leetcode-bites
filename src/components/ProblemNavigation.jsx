import React from 'react';
import PropTypes from 'prop-types';

const ProblemNavigation = ({ 
  currentProblem,
  currentProblemIndex,
  totalProblems,
  canGoToNextProblem,
  onPrevious,
  onNext
}) => {
  return (
    <div className="mb-4 flex justify-between items-center">
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-all duration-200"
        onClick={onPrevious}
        disabled={currentProblemIndex === 0}
        style={{ opacity: currentProblemIndex === 0 ? 0.5 : 1 }}
      >
        Previous
      </button>
      <div className="text-center">
        <h2 className="text-xl font-bold">{currentProblem.title}</h2>
        <p className="text-sm text-gray-600">Problem {currentProblemIndex + 1} of {totalProblems}</p>
      </div>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-all duration-200"
        onClick={onNext}
        disabled={currentProblemIndex === totalProblems - 1 || !canGoToNextProblem}
        title={!canGoToNextProblem ? "Solve this problem first to continue" : ""}
        style={{ opacity: (currentProblemIndex === totalProblems - 1 || !canGoToNextProblem) ? 0.5 : 1 }}
      >
        Next
      </button>
    </div>
  );
};

ProblemNavigation.propTypes = {
  currentProblem: PropTypes.object.isRequired,
  currentProblemIndex: PropTypes.number.isRequired,
  totalProblems: PropTypes.number.isRequired,
  canGoToNextProblem: PropTypes.bool.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
};

export default ProblemNavigation;
