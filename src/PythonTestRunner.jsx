import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { CodeEditor } from './components/CodeEditor';
import { TestCases } from './components/TestCases';
import { ConsoleOutput } from './components/ConsoleOutput';
import { TestResults } from './components/TestResults';
import ProblemNavigation from './components/ProblemNavigation';
import MainProblemDescription from './components/MainProblemDescription';
import PyodideStatus from './components/PyodideStatus';
import TabPanel from './components/TabPanel';
import RunButton from './components/RunButton';
import { allTests } from './data/testCases';
import { problems } from './data/problems';
import mainProblem from './data/mainProblem';
import { usePyodide } from './hooks/usePyodide';
import usePythonConsoleCapture from './hooks/usePythonConsoleCapture';
import useTestRunner from './hooks/useTestRunner';
import { sanitizeCode } from './utils/codeUtils';

const PythonTestRunner = ({ initialCode }) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const currentProblem = problems[currentProblemIndex];
  
  // Track solved problems
  const [solvedProblems, setSolvedProblems] = useState(() => {
    // Load solved problems from localStorage if available
    const saved = localStorage.getItem('solvedProblems');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  
  // Add state for collapsible main problem
  const [isMainProblemExpanded, setIsMainProblemExpanded] = useState(true);
  
  // Store code for all problems
  const [allProblemsCode, setAllProblemsCode] = useState(() => {
    // Load saved code from localStorage if available
    const savedCode = localStorage.getItem('userCode');
    return savedCode ? JSON.parse(savedCode) : {};
  });
  
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('code');
  
  // Initialize Pyodide
  const { isLoading: isPyodideLoading, isReady: isPyodideReady, error: pyodideError, runPython } = usePyodide();
  
  // Use extracted hooks
  const { logs: consoleLogs, addPythonLogs } = usePythonConsoleCapture();
  
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
  
  // Handle test completion
  const handleTestsComplete = useCallback((results) => {
    // Check if all tests passed and update solved problems
    if (results.every(result => result.passed)) {
      setSolvedProblems(prev => new Set([...prev, currentProblem.id]));
    }
  }, [currentProblem.id, setSolvedProblems]);
  
  // Use the test runner hook
  const { runTests, isRunning, testResults } = useTestRunner({
    code,
    tests,
    currentProblemId: currentProblem.id,
    runPython,
    isPyodideReady,
    addPythonLogs,
    onTestsComplete: handleTestsComplete
  });
  
  // Check if all tests pass
  const allTestsPass = useMemo(() => {
    if (testResults.length === 0) return false;
    return testResults.every(result => result.passed);
  }, [testResults]);
  
  // Check if we can go to next problem
  const canGoToNextProblem = useMemo(() => {
    return allTestsPass || solvedProblems.has(currentProblem.id);
  }, [allTestsPass, solvedProblems, currentProblem.id]);
  
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
  
  // Add toggle function for main problem
  const toggleMainProblem = useCallback(() => {
    setIsMainProblemExpanded(prev => !prev);
  }, []);
  
  // Define tabs for the TabPanel component
  const tabs = [
    { id: 'code', label: 'Code Editor' },
    { id: 'tests', label: 'Test Cases' },
    { id: 'console', label: 'Console' }
  ];
  
  return (
    <div className="flex flex-col w-full max-w-4xl p-4 bg-gray-100 rounded-lg">
      {/* Problem Navigation */}
      <ProblemNavigation
        currentProblem={currentProblem}
        currentProblemIndex={currentProblemIndex}
        totalProblems={problems.length}
        canGoToNextProblem={canGoToNextProblem}
        onPrevious={goToPreviousProblem}
        onNext={goToNextProblem}
      />
      
      {/* Main Problem Description */}
      <MainProblemDescription
        mainProblem={mainProblem}
        isExpanded={isMainProblemExpanded}
        onToggle={toggleMainProblem}
      />

      <div className="mb-4 p-4 bg-white border border-gray-300 rounded-md">
        <h3 className="font-bold mb-2">Current task:</h3>
        <p>{currentProblem.description}</p>
      </div>
      
      {/* Pyodide Status Message */}
      <PyodideStatus
        isLoading={isPyodideLoading}
        isReady={isPyodideReady}
        error={pyodideError}
      />
      
      {/* Tab Panel */}
      <TabPanel
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      >
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
      </TabPanel>
      
      {/* Run Button */}
      <RunButton
        onClick={runTests}
        isRunning={isRunning}
        isPyodideLoading={isPyodideLoading}
        isPyodideReady={isPyodideReady}
      />
      
      <TestResults results={testResults} isRunning={isRunning} />
    </div>
  );
};

PythonTestRunner.propTypes = {
  initialCode: PropTypes.string
};

export default PythonTestRunner;
