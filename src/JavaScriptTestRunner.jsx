import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { CodeEditor } from './components/CodeEditor';
import { TestCases } from './components/TestCases';
import { ConsoleOutput } from './components/ConsoleOutput';
import { TestResults } from './components/TestResults';
import { allTests } from './data/testCases';
import { problems } from './data/problems';
import { executeCode } from './utils/codeExecutor';
import { getAppVersion } from './utils/versionManager';

// Get the application version dynamically
const APP_VERSION = getAppVersion();

// Utility function to sanitize code input (especially from mobile devices)
const sanitizeCode = (code) => {
  if (!code) return '';
  
  // Create a map of problematic characters to their proper coding equivalents
  const charMap = {
    // Smart quotes
    '\u2018': "'", // '
    '\u2019': "'", // '
    '\u201A': "'", // ‚
    '\u201B': "'", // ‛
    '\u201C': '"', // "
    '\u201D': '"', // "
    '\u201E': '"', // „
    '\u201F': '"', // ‟
    // Dashes
    '\u2013': '-', // –
    '\u2014': '-', // —
    // Other common problematic characters
    '\u2026': '...', // …
    '\u00A0': ' ', // Non-breaking space
    '\u3000': ' ', // Ideographic space
    '\uFEFF': '', // Zero-width no-break space
    '\u200B': '', // Zero-width space
    '\u200C': '', // Zero-width non-joiner
    '\u200D': '', // Zero-width joiner
    // Additional punctuation
    '\u2022': '*', // •
    '\u2023': '>', // ‣
    '\u2043': '-', // ⁃
    '\u02D7': '-', // ˗
    // Brackets and parentheses
    '\uFF08': '(', // （
    '\uFF09': ')', // ）
    '\uFF5B': '{', // ｛
    '\uFF5D': '}', // ｝
    '\uFF3B': '[', // ［
    '\uFF3D': ']', // ］
    // Punctuation
    '\uFF1A': ':', // ：
    '\uFF1B': ';', // ；
    '\uFF0C': ',', // ，
    '\u3001': ',', // 、
    '\uFF0E': '.', // ．
    '\uFF01': '!', // ！
    '\uFF1F': '?', // ？
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
    setTimeout(() => {
      try {
        const results = tests.map(test => {
          try {
            const { output, executionTime } = executeCode(sanitizedCode, test.functionName, test.inputs);
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
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-bold mb-2 text-blue-800">Main Problem:</h3>
        <p className="mb-2">This series of exercises will help you practice implementing common algorithms and data structures. 
        Complete each challenge to build your problem-solving skills and prepare for technical interviews.</p>
        
        <div className="mt-4 p-3 bg-white rounded border border-blue-100">
          <h4 className="font-semibold text-blue-700 mb-1">Problem Description:</h4>
          <p className="mb-2">Given a string s, find the length of the longest substring without duplicate characters.</p>
          
          <div className="mt-3">
            <h5 className="font-medium text-blue-600">Examples:</h5>
            <div className="pl-2 mt-1 border-l-2 border-blue-200">
              <p className="mb-1"><span className="font-medium">Example 1:</span></p>
              <p className="mb-1 pl-2">Input: s = "abcabcbb"</p>
              <p className="mb-1 pl-2">Output: 3</p>
              <p className="mb-3 pl-2 text-gray-600 text-sm">Explanation: The answer is "abc", with the length of 3.</p>

              <p className="mb-1"><span className="font-medium">Example 2:</span></p>
              <p className="mb-1 pl-2">Input: s = "bbbbb"</p>
              <p className="mb-1 pl-2">Output: 1</p>
              <p className="mb-3 pl-2 text-gray-600 text-sm">Explanation: The answer is "b", with the length of 1.</p>

              <p className="mb-1"><span className="font-medium">Example 3:</span></p>
              <p className="mb-1 pl-2">Input: s = "pwwkew"</p>
              <p className="mb-1 pl-2">Output: 3</p>
              <p className="mb-1 pl-2 text-gray-600 text-sm">Explanation: The answer is "wke", with the length of 3.</p>
              <p className="mb-1 pl-2 text-gray-600 text-sm">Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h5 className="font-medium text-blue-600">Constraints:</h5>
            <ul className="list-disc pl-5 mt-1">
              <li>0 ≤ s.length ≤ 5 * 10<sup>4</sup></li>
              <li>s consists of English letters, digits, symbols and spaces.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-4 p-4 bg-white border border-gray-300 rounded-md">
        <h3 className="font-bold mb-2">Current task:</h3>
        <p>{currentProblem.description}</p>
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
        {activeTab === 'code' && <CodeEditor code={code} onChange={handleCodeChange} />}
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
        disabled={isRunning}
        aria-busy={isRunning}
        style={{ 
          opacity: isRunning ? 0.7 : 1,
          boxShadow: !isRunning ? '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)' : 'none'
        }}
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
          className="bg-green-600 h-2.5 rounded-full transition-all duration-500" 
          style={{width: `${(Array.from(solvedProblems).length / problems.length) * 100}%`}}
        ></div>
      </div>
      
      {/* Problem completion status */}
      {allTestsPass && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md animate-pulse">
          <p className="text-sm text-green-800">
            <strong>Great job!</strong> You've solved this problem.
            {currentProblemIndex < problems.length - 1 && " You can now move to the next problem."}
          </p>
        </div>
      )}
      
      {/* App version footer */}
      <div className="mt-4 text-xs text-gray-500 text-right">
        Version {APP_VERSION}
      </div>
    </div>
  );
};

JavaScriptTestRunner.propTypes = {
  initialCode: PropTypes.string
};

export default JavaScriptTestRunner;
