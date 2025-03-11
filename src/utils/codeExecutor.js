/**
 * Safely executes user code and returns the result
 */
export const executeCode = (code, functionName, inputs) => {
  const start = performance.now();
  
  // Construct the code to be executed
  const userCode = `
    ${code}
    return ${functionName}(${inputs.map(i => JSON.stringify(i)).join(', ')});
  `;
  
  try {
    // Use Function constructor for sandboxed execution
    // Note: This is still not completely secure for untrusted code
    const userFunction = new Function(userCode);
    const output = userFunction();
    const executionTime = performance.now() - start;
    
    return { output, executionTime };
  } catch (error) {
    throw new Error(`Execution error: ${error.message}`);
  }
};
