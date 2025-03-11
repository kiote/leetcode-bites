import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CodeEditor } from './components/CodeEditor';
import { TestCases } from './components/TestCases';
import { ConsoleOutput } from './components/ConsoleOutput';
import { TestResults } from './components/TestResults';
import { predefinedTests } from './data/testCases';
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
  const [code, setCode] = useState(initialCode || `function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}`);
  
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const consoleLogs = useConsoleCapture();
  
  // Memoize tests to prevent unnecessary re-renders
  const tests = useMemo(() => predefinedTests, []);
  
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
      } catch (error) {
        console.error("Test execution error:", error);
      } finally {
        setIsRunning(false);
      }
    }, 0);
  }, [code, tests]);
  
  // Tab selection handler
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);
  
  return (
    <div className="flex flex-col w-full max-w-4xl p-4 bg-gray-100 rounded-lg">
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
