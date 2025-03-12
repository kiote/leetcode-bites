import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CodeEditor } from './components/CodeEditor';
import { TestCases } from './components/TestCases';
import { ConsoleOutput } from './components/ConsoleOutput';
import { TestResults } from './components/TestResults';
import { allTests } from './data/testCases';
import { problems } from './data/problems';
import { executeCode } from './utils/codeExecutor';

// Custom hook for console capture
const useConsoleCapture = () => {
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    const originalConsoleLog = console.log;
    const capturedLogs = [];
    
    console.log = (...args) => {
      const logEntry = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      capturedLogs.push(logEntry);
      setLogs([...capturedLogs]);
      originalConsoleLog(...args);
    };
    
    return () => {
      console.log = originalConsoleLog;
    };
  }, []);
  
  return logs;
};

const JavaScriptTestRunner = ({ initialCode }) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const currentProblem = problems[currentProblemIndex];
  
  // Track solved problems
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  
  const [code, setCode] = useState(initialCode || currentProblem.initialCode);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const consoleLogs = useConsoleCapture();
  
  // Update code when problem changes
  useEffect(() => {
    setCode(currentProblem.initialCode);
    setTestResults([]);
  }, [currentProblemIndex, currentProblem.initialCode]);
  
  // Memoize tests for the current problem
  const tests = useMemo(() => allTests[currentProblem.id], [currentProblem.id]);
  
  // Check if all tests pass
  const allTestsPass = useMemo(() => {
    if (testResults.length === 0) return false;
    return testResults.every(result => result.passed);
  }, [testResults]);
  
  // Check if we can go to next problem
  const canGoToNextProblem = useMemo(() => {
    return allTestsPass || solvedProblems.has(currentProblem.id);
  }, [allTestsPass, solvedProblems, currentProblem.id]);
  
  // Extract run tests logic to a callback
  const runTests = useCallback(() => {
    setIsRunning(true);
    setTestResults([]);
    
    // Use setTimeout to prevent UI blocking during test execution
    setTimeout(() => {
      try {
        const results = tests.map(test => {
          try {
            const { output, executionTime } = executeCode(code, test.functionName, test.inputs);
            const passed = output === test.expectedOutput;
            
            return {
              ...test,
              passed,
              error: passed ? null : `Expected ${test.expectedOutput}, but got ${output}`,
              output,
              executionTime
            };
          } catch (e) {
            return {
              ...test,
              passed: false,
              error: e.toString(),
              output: 'Error',
              executionTime: 0
            };
          }
        });
        
        setTestResults(results);
        
        // Check if all tests passed and update solved problems
        if (results.every(result => result.passed)) {
          setSolvedProblems(prev => new Set([...prev, currentProblem.id]));
        }
      } catch (error) {
        console.error("Test execution error:", error);
      } finally {
        setIsRunning(false);
      }
    }, 0);
  }, [code, tests, currentProblem.id]);
  
  // Tab selection handler
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);
  
  // Problem navigation handlers
  const goToPreviousProblem = useCallback(() => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
    }
  }, [currentProblemIndex]);
  
  const goToNextProblem = useCallback(() => {
    if (currentProblemIndex < problems.length - 1 && canGoToNextProblem) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    }
  }, [currentProblemIndex, canGoToNextProblem]);
  
  return (
    <div className="flex flex-col w-full max-w-4xl p-4 bg-gray-100 rounded-lg">
      {/* Problem Navigation */}
      <div className="mb-4 flex justify-between items-center">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          onClick={goToPreviousProblem}
          disabled={currentProblemIndex === 0}
        >
          Previous
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold">{currentProblem.title}</h2>
          <p className="text-sm text-gray-600">Problem {currentProblemIndex + 1} of {problems.length}</p>
        </div>
        <button 
          className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 ${!canGoToNextProblem ? 'cursor-not-allowed opacity-50' : ''}`}
          onClick={goToNextProblem}
          disabled={currentProblemIndex === problems.length - 1 || !canGoToNextProblem}
          title={!canGoToNextProblem ? "Solve this problem first to continue" : ""}
        >
          Next
        </button>
      </div>
      
      {/* Problem Description */}
      <div className="mb-4 p-4 bg-white border border-gray-300 rounded-md">
        <h3 className="font-bold mb-2">Description:</h3>
        <p>{currentProblem.description}</p>
      </div>
      
      <div className="flex mb-4" role="tablist">
        <button 
          className={`px-4 py-2 mr-2 rounded-t-lg ${activeTab === 'code' ? 'bg-white' : 'bg-gray-300'}`}
          onClick={() => handleTabChange('code')}
          role="tab"
          aria-selected={activeTab === 'code'}
          aria-controls="code-panel"
          id="code-tab"
        >
          Code Editor
        </button>
        <button 
          className={`px-4 py-2 mr-2 rounded-t-lg ${activeTab === 'tests' ? 'bg-white' : 'bg-gray-300'}`}
          onClick={() => handleTabChange('tests')}
          role="tab"
          aria-selected={activeTab === 'tests'}
          aria-controls="tests-panel"
          id="tests-tab"
        >
          Test Cases
        </button>
        <button 
          className={`px-4 py-2 rounded-t-lg ${activeTab === 'console' ? 'bg-white' : 'bg-gray-300'}`}
          onClick={() => handleTabChange('console')}
          role="tab"
          aria-selected={activeTab === 'console'}
          aria-controls="console-panel"
          id="console-tab"
        >
          Console
        </button>
      </div>
      
      <div role="tabpanel" id="code-panel" aria-labelledby="code-tab" hidden={activeTab !== 'code'}>
        {activeTab === 'code' && <CodeEditor code={code} onChange={setCode} />}
      </div>
      
      <div role="tabpanel" id="tests-panel" aria-labelledby="tests-tab" hidden={activeTab !== 'tests'}>
        {activeTab === 'tests' && <TestCases tests={tests} />}
      </div>
      
      <div role="tabpanel" id="console-panel" aria-labelledby="console-tab" hidden={activeTab !== 'console'}>
        {activeTab === 'console' && <ConsoleOutput logs={consoleLogs} />}
      </div>
      
      <button
        className="px-4 py-2 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        onClick={runTests}
        disabled={isRunning}
        aria-busy={isRunning}
      >
        {isRunning ? 'Running Tests...' : 'Run Tests'}
      </button>
      
      <TestResults results={testResults} isRunning={isRunning} />
      
      {/* Progress indicator */}
      <div className="flex justify-between mt-4 mb-2">
        <div className="font-bold">Progress: </div>
        <div>{Array.from(solvedProblems).length} of {problems.length} solved</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-green-600 h-2.5 rounded-full" 
          style={{width: `${(Array.from(solvedProblems).length / problems.length) * 100}%`}}
        ></div>
      </div>
      
      {/* Problem completion status */}
      {allTestsPass && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md">
          <p className="text-sm text-green-800">
            <strong>Great job!</strong> You've solved this problem.
            {currentProblemIndex < problems.length - 1 && " You can now move to the next problem."}
          </p>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Feature:</strong> This app actually executes your JavaScript code and runs real tests against it! 
          You can use console.log() statements in your code and see the output in the Console tab.
        </p>
      </div>
    </div>
  );
};

JavaScriptTestRunner.propTypes = {
  initialCode: PropTypes.string
};

export default JavaScriptTestRunner;
