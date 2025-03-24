import { executePythonCode } from './pyodideExecutor';

/**
 * Safely executes user Python code and returns the result
 * @param {string} code - The user's Python code
 * @param {string} functionName - The name of the function to execute
 * @param {Array} inputs - The inputs to the function
 * @param {any} expectedOutput - Expected output to compare against
 * @returns {Promise<Object>} - Promise that resolves to execution result
 */
export const executeCode = async (code, functionName, inputs, expectedOutput) => {
  try {
    return await executePythonCode(code, functionName, inputs, expectedOutput);
  } catch (error) {
    throw new Error(`Execution error: ${error.message || String(error)}`);
  }
};
