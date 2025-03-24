import { useCallback, useState } from 'react';
import { sanitizeCode } from '../utils/codeUtils';

const useTestRunner = ({ 
  code, 
  tests,
  runPython, 
  isPyodideReady,
  addPythonLogs,
  onTestsComplete 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const runTests = useCallback(() => {
    setIsRunning(true);
    setTestResults([]);
    
    // Sanitize the code before execution
    const sanitizedCode = sanitizeCode(code);
    
    // Use setTimeout to prevent UI blocking during test execution
    setTimeout(async () => {
      try {
        if (!isPyodideReady) {
          throw new Error('Pyodide is not ready yet. Please wait for it to load completely.');
        }
        
        const results = await Promise.all(tests.map(async (test) => {
          try {
            // Pass the expected output to runPython
            const { output, stdout, executionTime, testsPassed } = await runPython(
              sanitizedCode, 
              test.functionName, 
              test.inputs, 
              test.expectedOutput
            );
            
            // Add Python stdout to console logs
            if (stdout) {
              addPythonLogs(stdout);
            }
            
            let error = null;
            if (testsPassed === false) {
              // Generate error message for failed test
              const expectedStr = JSON.stringify(test.expectedOutput);
              const actualStr = JSON.stringify(output);
              error = `Expected ${expectedStr}, but got ${actualStr}`;
            }
            
            return {
              ...test,
              passed: testsPassed,
              error,
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
        
        // Notify parent component about test completion
        if (onTestsComplete) {
          onTestsComplete(results);
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
  }, [code, tests, runPython, isPyodideReady, addPythonLogs, onTestsComplete]);

  return { runTests, isRunning, testResults };
};

export default useTestRunner;
