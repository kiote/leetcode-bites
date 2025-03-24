// Store the Pyodide instance globally to avoid reloading
let pyodideInstance = null;
let loadingPromise = null;

/**
 * Initialize and load Pyodide
 * @returns {Promise<any>} - Promise that resolves to the Pyodide instance
 */
export const initializePyodide = async () => {
  if (pyodideInstance) {
    return pyodideInstance;
  }
  
  if (loadingPromise) {
    return loadingPromise;
  }

  const loadPyodideScript = () => {
    return new Promise((resolve, reject) => {
      if (window.loadPyodide) {
        resolve(window.loadPyodide);
        return;
      }

      // Create a script element to load Pyodide
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
      script.async = true;
      script.onload = () => {
        if (window.loadPyodide) {
          resolve(window.loadPyodide);
        } else {
          reject(new Error('Failed to load Pyodide script'));
        }
      };
      script.onerror = () => {
        reject(new Error('Failed to load Pyodide script'));
      };
      document.body.appendChild(script);
    });
  };
  
  try {
    // Load the Pyodide script dynamically
    const loadPyodide = await loadPyodideScript();
    
    // Set up loading promise to prevent multiple loads
    loadingPromise = loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
    });
    
    pyodideInstance = await loadingPromise;
    console.log("Pyodide loaded successfully");
    return pyodideInstance;
  } catch (error) {
    console.error("Failed to load Pyodide:", error);
    loadingPromise = null;
    throw error;
  }
};

/**
 * Execute Python code using Pyodide
 * @param {string} code - The Python code to execute
 * @param {string} functionName - Name of function to call
 * @param {Array} inputs - Arguments to pass to the function
 * @param {any} expectedOutput - Expected output to compare against
 * @returns {Object} - Result of execution including output and execution time
 */
export const executePythonCode = async (code, functionName, inputs, expectedOutput) => {
  const startTime = performance.now();
  
  try {
    const pyodide = await initializePyodide();
    
    // Create a namespace for our code
    pyodide.runPython(`
      import sys
      from io import StringIO
      
      # Create a custom stdout capture
      sys.stdout = StringIO()
    `);
    
    // Run the provided code
    pyodide.runPython(code);
    
    // Prepare input arguments for the function
    const argsArray = inputs.map(input => {
      if (typeof input === 'string') {
        return `"${input}"`;
      } else if (Array.isArray(input)) {
        return `[${input.map(item => 
          typeof item === 'string' ? `"${item}"` : item
        ).join(', ')}]`;
      }
      return input;
    });
    
    // Call the function with the inputs and get result
    const callStatement = `${functionName}(${argsArray.join(', ')})`;
    const result = pyodide.runPython(callStatement);
    
    // Get any stdout content
    const stdout = pyodide.runPython("sys.stdout.getvalue()");
    
    const executionTime = performance.now() - startTime;
    
    // Check if the output matches the expected output
    let testsPassed = null;
    if (expectedOutput !== undefined) {
      // Store the result in Python global scope
      pyodide.globals.set('_function_result', result);
      
      // Convert expectedOutput to a Python object using Pyodide's conversion
      pyodide.globals.set('_expected_output', pyodide.toPy(expectedOutput));
      
      // Compare in Python for accuracy
      testsPassed = pyodide.runPython(`_function_result == _expected_output`);
    }
    
    return {
      output: result,
      stdout,
      executionTime,
      testsPassed
    };
  } catch (error) {
    const executionTime = performance.now() - startTime;
    const errorWithTiming = new Error(error.message || String(error));
    errorWithTiming.executionTime = executionTime;
    throw errorWithTiming;
  }
};
