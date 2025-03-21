import { useState, useEffect, useCallback } from 'react';
import { initializePyodide, executePythonCode } from '../utils/pyodideExecutor';

/**
 * Custom hook to use Pyodide in React components
 * @returns {Object} - Pyodide state and utilities
 */
export const usePyodide = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize Pyodide on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadPyodide = async () => {
      if (isReady) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        await initializePyodide();
        if (isMounted) {
          setIsReady(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load Pyodide');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadPyodide();
    
    return () => {
      isMounted = false;
    };
  }, [isReady]);
  
  // Execute Python code
  const runPython = useCallback(async (code, functionName, inputs) => {
    if (!isReady) {
      throw new Error('Pyodide is not ready yet');
    }
    
    try {
      return await executePythonCode(code, functionName, inputs);
    } catch (err) {
      throw err;
    }
  }, [isReady]);
  
  return {
    isLoading,
    isReady,
    error,
    runPython
  };
};

export default usePyodide;
