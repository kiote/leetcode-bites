import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { CodeEditor } from './components/CodeEditor';
import { TestCases } from './components/TestCases';
import { ConsoleOutput } from './components/ConsoleOutput';
import { TestResults } from './components/TestResults';
import { allTests } from './data/testCases';
import { problems } from './data/problems';
import mainProblem from './data/mainProblem';
// Removed unused import for executeCode
// import { getAppVersion } from './utils/versionManager';
import { usePyodide } from './hooks/usePyodide';

// Removed unused APP_VERSION variable

// Utility function to sanitize code input (especially from mobile devices)
const sanitizeCode = (code) => {
  if (!code) return '';
  
  // Create a map of problematic characters to their proper coding equivalents
  const charMap = {
    // ... existing code...
  };
  
  // Replace characters using the map
  let sanitized = code;
  for (const [problematic, replacement] of Object.entries(charMap)) {
    sanitized = sanitized.split(problematic).join(replacement);
  }
  
  // Additional generic replacements for any remaining smart quotes or similar characters
  sanitized = sanitized
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[—–]/g, '-')
    .replace(/[∶]/g, ':')
    .replace(/[；]/g, ';');
  
  return sanitized;
};

// Custom hook for console capture
const useConsoleCapture = () => {
  // ... existing code...
};

const PythonTestRunner = ({ initialCode }) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const currentProblem = problems[currentProblemIndex];
  
  // Track solved problems
  const [solvedProblems, setSolvedProblems] = useState(() => {
    // Load solved problems from localStorage if available
    const saved = localStorage.getItem('solvedProblems');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  
  // Store code for all problems
  const [allProblemsCode, setAllProblemsCode] = useState(() => {
    // Load saved code from localStorage if available
    const savedCode = localStorage.getItem('userCode');
    return savedCode ? JSON.parse(savedCode) : {};
  });
  
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const consoleLogs = useConsoleCapture();
  
  // Initialize Pyodide
  const { isLoading: isPyodideLoading, isReady: isPyodideReady, error: pyodideError, runPython } = usePyodide();
  
  // Track the current problem ID to detect problem changes
  const previousProblemIdRef = useRef(null);
  
  // Initialize code when component mounts or problem changes
  useEffect(() => {
    const currentProblemId = currentProblem.id;
    
    // Check if we've changed problems
    if (previousProblemIdRef.current !== currentProblemId) {
      // Get saved code for current problem or use initial code
      const savedProblemCode = allProblemsCode[currentProblemId];
      
      setCode(savedProblemCode || currentProblem.initialCode);
      setTestResults([]);
      
      previousProblemIdRef.current = currentProblemId;
    }
  }, [currentProblem.id, currentProblem.initialCode, allProblemsCode]);
  
  // Handle code changes from user input only
  const handleCodeChange = useCallback((newCode) => {
    // Sanitize the code before setting it
    const sanitizedCode = sanitizeCode(newCode);
    setCode(sanitizedCode);
    
    // Save code to localStorage immediately on user change
    setAllProblemsCode(prev => {
      const updated = {
        ...prev,
        [currentProblem.id]: sanitizedCode
      };
      
      localStorage.setItem('userCode', JSON.stringify(updated));
      return updated;
    });
  }, [currentProblem.id]);
  
  // Save solved problems to localStorage
  useEffect(() => {
    localStorage.setItem('solvedProblems', JSON.stringify([...solvedProblems]));
  }, [solvedProblems]);
  
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
    
    // Sanitize the code before execution
    const sanitizedCode = sanitizeCode(code);
    
    // Update editor with sanitized code if different from original
    if (sanitizedCode !== code) {
      console.debug('Auto-fixed code formatting issues');
      setCode(sanitizedCode);
    }
    
    // Use setTimeout to prevent UI blocking during test execution
    setTimeout(async () => {
      try {
        if (!isPyodideReady) {
          throw new Error('Pyodide is not ready yet. Please wait for it to load completely.');
        }
        
        const results = await Promise.all(tests.map(async (test) => {
          try {
            const { output, stdout, executionTime } = await runPython(sanitizedCode, test.functionName, test.inputs);
            const passed = output === test.expectedOutput; // Using loose equality to handle type differences
            
            return {
              ...test,
              passed,
              error: passed ? null : `Expected ${test.expectedOutput}, but got ${output}`,
              output,
              stdout,
              executionTime
            };
          } catch (e) {
            return {
              ...test,
              passed: false,
              error: e.error || e.toString(),
              output: 'Error',
              executionTime: e.executionTime || 0
            };
          }
        }));
        
        setTestResults(results);
        
        // Check if all tests passed and update solved problems
        if (results.every(result => result.passed)) {
          setSolvedProblems(prev => new Set([...prev, currentProblem.id]));
        }
      } catch (error) {
        console.error("Test execution error:", error);
        setTestResults([{
          functionName: "Error",
          passed: false,
          error: error.toString(),
          output: 'Error running tests',
          executionTime: 0
        }]);
      } finally {
        setIsRunning(false);
      }
    }, 0);
  }, [code, tests, currentProblem.id, runPython, isPyodideReady]);
  
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
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-all duration-200"
          onClick={goToPreviousProblem}
          disabled={currentProblemIndex === 0}
          style={{ opacity: currentProblemIndex === 0 ? 0.5 : 1 }}
        >
          Previous
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold">{currentProblem.title}</h2>
          <p className="text-sm text-gray-600">Problem {currentProblemIndex + 1} of {problems.length}</p>
        </div>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-all duration-200"
          onClick={goToNextProblem}
          disabled={currentProblemIndex === problems.length - 1 || !canGoToNextProblem}
          title={!canGoToNextProblem ? "Solve this problem first to continue" : ""}
          style={{ opacity: (currentProblemIndex === problems.length - 1 || !canGoToNextProblem) ? 0.5 : 1 }}
        >
          Next
        </button>
      </div>
      
      {/* Main Problem Description */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-left">
        <h3 className="font-bold mb-2 text-blue-800 text-left">{mainProblem.title}</h3>
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

      <div className="mb-4 p-4 bg-white border border-gray-300 rounded-md">
        <h3 className="font-bold mb-2">Current task:</h3>
        <p>{currentProblem.description}</p>
      </div>
      
      {/* Pyodide Status Message */}
      <div className={`mb-4 p-2 rounded-md ${
        pyodideError ? 'bg-red-100 text-red-700' : 
        isPyodideLoading ? 'bg-yellow-100 text-yellow-700' : 
        isPyodideReady ? 'bg-green-100 text-green-700' : ''
      }`}>
        {pyodideError ? (
          <p>Error loading Python environment: {pyodideError}</p>
        ) : isPyodideLoading ? (
          <p>Loading Python environment... This may take a few moments.</p>
        ) : isPyodideReady ? (
          <p>Python environment ready!</p>
        ) : null}
      </div>
      
      <div className="flex mb-4" role="tablist">
        <button 
          className={`px-4 py-2 mr-2 rounded-t-lg transition-all duration-200 ${
            activeTab === 'code' 
            ? 'bg-white border-t border-l border-r border-gray-300 font-semibold' 
            : 'bg-gray-300 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => handleTabChange('code')}
          role="tab"
          aria-selected={activeTab === 'code'}
          aria-controls="code-panel"
          id="code-tab"
        >
          Code Editor
        </button>
        <button 
          className={`px-4 py-2 mr-2 rounded-t-lg transition-all duration-200 ${
            activeTab === 'tests' 
            ? 'bg-white border-t border-l border-r border-gray-300 font-semibold' 
            : 'bg-gray-300 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => handleTabChange('tests')}
          role="tab"
          aria-selected={activeTab === 'tests'}
          aria-controls="tests-panel"
          id="tests-tab"
        >
          Test Cases
        </button>
        <button 
          className={`px-4 py-2 rounded-t-lg transition-all duration-200 ${
            activeTab === 'console' 
            ? 'bg-white border-t border-l border-r border-gray-300 font-semibold' 
            : 'bg-gray-300 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => handleTabChange('console')}
          role="tab"
          aria-selected={activeTab === 'console'}
          aria-controls="console-panel"
          id="console-tab"
        >
          Console
        </button>
      </div>
      
      <div 
        role="tabpanel" 
        id="code-panel" 
        aria-labelledby="code-tab" 
        hidden={activeTab !== 'code'}
        className={`transition-opacity duration-200 ${activeTab === 'code' ? 'opacity-100' : 'opacity-0 absolute'}`}
      >
        {activeTab === 'code' && (
          <CodeEditor 
            code={code} 
            onChange={handleCodeChange} 
            language="python"
          />
        )}
      </div>
      
      <div 
        role="tabpanel" 
        id="tests-panel" 
        aria-labelledby="tests-tab" 
        hidden={activeTab !== 'tests'}
        className={`transition-opacity duration-200 ${activeTab === 'tests' ? 'opacity-100' : 'opacity-0 absolute'}`}
      >
        {activeTab === 'tests' && <TestCases tests={tests} />}
      </div>
      
      <div 
        role="tabpanel" 
        id="console-panel" 
        aria-labelledby="console-tab" 
        hidden={activeTab !== 'console'}
        className={`transition-opacity duration-200 ${activeTab === 'console' ? 'opacity-100' : 'opacity-0 absolute'}`}
      >
        {activeTab === 'console' && <ConsoleOutput logs={consoleLogs} />}
      </div>
      
      <button
        className="px-4 py-2 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-all duration-200 transform hover:scale-105"
        onClick={runTests}
        disabled={isRunning || !isPyodideReady || isPyodideLoading}
        aria-busy={isRunning}
        style={{ 
          opacity: isRunning || !isPyodideReady || isPyodideLoading ? 0.7 : 1,
          boxShadow: !isRunning ? '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)' : 'none'
        }}
      >
        {isRunning ? 'Running Tests...' : 
         isPyodideLoading ? 'Loading Python...' : 
         'Run Python Tests'}
      </button>
      
      <TestResults results={testResults} isRunning={isRunning} />
      
      {/* ... existing code ... */}
      
    </div>
  );
};

PythonTestRunner.propTypes = {
  initialCode: PropTypes.string
};

export default PythonTestRunner;
