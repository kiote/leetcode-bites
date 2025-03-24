import { useCallback, useState } from 'react';
import { sanitizeCode } from '../utils/codeUtils';

const useTestRunner = ({ 
  code, 
  tests, 
  currentProblemId, 
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
            const { output, stdout, executionTime } = await runPython(sanitizedCode, test.functionName, test.inputs);
            
            // Add Python stdout to console logs
            if (stdout) {
              addPythonLogs(stdout);
            }
            
            // For array comparisons, convert to JSON strings to ensure proper comparison
            let passed = false;
            let error = null;
            
            if (Array.isArray(test.expectedOutput)) {
              // If output is empty object but expected is array, this is a serialization error
              if (output && typeof output === 'object' && Object.keys(output).length === 0) {
                addPythonLogs("Warning: Function returned empty object instead of array. Check return type.");
                error = `Expected an array, but got an empty object {}. Make sure you're returning a list, not a set or other type.`;
              } else {
                // Try to compare arrays by converting to JSON strings
                const expectedJson = JSON.stringify(test.expectedOutput.sort());
                const actualJson = Array.isArray(output) ? 
                  JSON.stringify([...output].sort()) : 
                  JSON.stringify(output);
                passed = expectedJson === actualJson;
                if (!passed) {
                  error = `Expected ${expectedJson}, but got ${actualJson}`;
                }
              }
            } else {
              // For non-array types, use loose equality
              passed = output === test.expectedOutput;
              if (!passed) {
                error = `Expected ${test.expectedOutput}, but got ${output}`;
              }
            }
            
            return {
              ...test,
              passed,
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
  }, [code, tests, currentProblemId, runPython, isPyodideReady, addPythonLogs, onTestsComplete]);

  return { runTests, isRunning, testResults };
};

export default useTestRunner;
