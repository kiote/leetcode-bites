import React, { useState } from 'react';

const JavaScriptTestRunner = () => {
  const [code, setCode] = useState(`function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}`);
  
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const [consoleOutput, setConsoleOutput] = useState([]);
  
  // Predefined tests
  const predefinedTests = [
    {
      id: 1,
      name: 'Test add function with positive numbers',
      testCode: 'add(2, 3) === 5',
      functionName: 'add',
      inputs: [2, 3],
      expectedOutput: 5
    },
    {
      id: 2,
      name: 'Test add function with negative numbers',
      testCode: 'add(-1, -1) === -2',
      functionName: 'add',
      inputs: [-1, -1],
      expectedOutput: -2
    },
    {
      id: 3,
      name: 'Test multiply function with positive numbers',
      testCode: 'multiply(3, 4) === 12',
      functionName: 'multiply',
      inputs: [3, 4],
      expectedOutput: 12
    },
    {
      id: 4,
      name: 'Test multiply function with zero',
      testCode: 'multiply(5, 0) === 0',
      functionName: 'multiply',
      inputs: [5, 0],
      expectedOutput: 0
    }
  ];
  
  // Actually run JavaScript code
  const runTests = () => {
    setIsRunning(true);
    setTestResults([]);
    setConsoleOutput([]);
    
    const logs = [];
    const originalConsoleLog = console.log;
    
    // Override console.log to capture output
    console.log = (...args) => {
      logs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' '));
      originalConsoleLog(...args);
    };
    
    setTimeout(() => {
      const results = predefinedTests.map(test => {
        let passed = false;
        let error = null;
        let actualOutput = null;
        let executionTime = 0;
        
        try {
          // Create a safe execution environment and execute the code
          const start = performance.now();
          
          // Create a function from the code
          const userCode = code + `\n\nreturn ${test.functionName}(${test.inputs.map(i => JSON.stringify(i)).join(', ')});`;
          
          // Use Function constructor to execute code in a sandbox
          const userFunction = new Function(userCode);
          actualOutput = userFunction();
          
          executionTime = performance.now() - start;
          
          // Check if output matches expected
          passed = actualOutput === test.expectedOutput;
          if (!passed) {
            error = `Expected ${test.expectedOutput}, but got ${actualOutput}`;
          }
        } catch (e) {
          error = e.toString();
          actualOutput = 'Error';
          executionTime = 0;
        }
        
        return {
          ...test,
          passed,
          error,
          output: actualOutput,
          executionTime
        };
      });
      
      // Restore console.log
      console.log = originalConsoleLog;
      
      setTestResults(results);
      setConsoleOutput(logs);
      setIsRunning(false);
    }, 500);
  };
  
  return (
    <div className="flex flex-col w-full max-w-4xl p-4 bg-gray-100 rounded-lg">
      <div className="flex mb-4">
        <button 
          className={`px-4 py-2 mr-2 rounded-t-lg ${activeTab === 'code' ? 'bg-white' : 'bg-gray-300'}`}
          onClick={() => setActiveTab('code')}
        >
          Code Editor
        </button>
        <button 
          className={`px-4 py-2 mr-2 rounded-t-lg ${activeTab === 'tests' ? 'bg-white' : 'bg-gray-300'}`}
          onClick={() => setActiveTab('tests')}
        >
          Test Cases
        </button>
        <button 
          className={`px-4 py-2 rounded-t-lg ${activeTab === 'console' ? 'bg-white' : 'bg-gray-300'}`}
          onClick={() => setActiveTab('console')}
        >
          Console
        </button>
      </div>
      
      {activeTab === 'code' ? (
        <div className="mb-4">
          <textarea
            className="w-full h-64 p-4 font-mono border border-gray-300 rounded-md"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your JavaScript code here..."
          />
        </div>
      ) : activeTab === 'tests' ? (
        <div className="mb-4 bg-white p-4 border border-gray-300 rounded-md h-64 overflow-y-auto">
          <h3 className="font-bold mb-4">Predefined Test Cases</h3>
          {predefinedTests.map(test => (
            <div key={test.id} className="mb-4 p-3 border border-gray-200 rounded-md">
              <p className="font-medium">{test.name}</p>
              <p className="font-mono text-sm bg-gray-100 p-2 my-2">{test.testCode}</p>
              <p className="text-sm text-gray-600">
                Function: <span className="font-mono">{test.functionName}</span>, 
                Inputs: <span className="font-mono">{test.inputs.join(', ')}</span>, 
                Expected: <span className="font-mono">{test.expectedOutput}</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-4 bg-black text-green-400 p-4 border border-gray-300 rounded-md h-64 overflow-y-auto font-mono">
          {consoleOutput.length > 0 ? (
            consoleOutput.map((log, i) => (
              <div key={i} className="mb-1">{'> ' + log}</div>
            ))
          ) : (
            <p className="text-gray-400">No console output yet. Use console.log() in your code to see output here.</p>
          )}
        </div>
      )}
      
      <button
        className="px-4 py-2 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={runTests}
        disabled={isRunning}
      >
        {isRunning ? 'Running Tests...' : 'Run Tests'}
      </button>
      
      <div className="bg-white p-4 border border-gray-300 rounded-md">
        <h3 className="font-bold mb-2">Test Results</h3>
        
        {isRunning ? (
          <p className="text-center py-4">Running tests...</p>
        ) : testResults.length > 0 ? (
          <div>
            <div className="flex justify-between mb-2">
              <span>Tests: {testResults.length}</span>
              <span>
                Passed: {testResults.filter(r => r.passed).length}/{testResults.length} 
                ({Math.round(testResults.filter(r => r.passed).length / testResults.length * 100)}%)
              </span>
            </div>
            
            {testResults.map(result => (
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
      
      <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Feature:</strong> This app actually executes your JavaScript code and runs real tests against it! 
          You can use console.log() statements in your code and see the output in the Console tab.
        </p>
      </div>
    </div>
  );
};

export default JavaScriptTestRunner;
