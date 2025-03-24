import { useState, useCallback } from 'react';

/**
 * Hook for capturing and managing Python console output
 */
const usePythonConsoleCapture = () => {
  const [logs, setLogs] = useState([]);
  
  // Function to add Python stdout to logs
  const addPythonLogs = useCallback((stdout) => {
    if (stdout && stdout.trim()) {
      // Split by newlines to handle multiple print statements
      const pythonLogs = stdout.split('\n').filter(log => log.trim());
      
      setLogs(prevLogs => [
        ...prevLogs,
        ...pythonLogs.map(content => ({ content }))
      ]);
    }
  }, []);
  
  // Return the logs array and the function to add Python logs
  return { logs, addPythonLogs };
};

export default usePythonConsoleCapture;
