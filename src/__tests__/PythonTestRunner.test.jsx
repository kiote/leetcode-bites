import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import PythonTestRunner from '../PythonTestRunner';
import { usePyodide } from '../hooks/usePyodide';

// Mock the usePyodide hook
jest.mock('../hooks/usePyodide', () => ({
  usePyodide: jest.fn()
}));

// Mock necessary data dependencies
jest.mock('../data/testCases', () => ({
  allTests: {
    'problem1': [{ functionName: 'test', inputs: [], expectedOutput: 'expected' }]
  }
}));

jest.mock('../data/problems', () => ({
  problems: [{ 
    id: 'problem1', 
    title: 'Test Problem', 
    description: 'Test description', 
    initialCode: 'def test(): pass' 
  }]
}));

jest.mock('../data/mainProblem', () => ({
  __esModule: true,
  default: {
    title: 'Main Problem',
    description: 'Main problem description',
    examples: [],
    constraints: []
  }
}));

describe('PythonTestRunner', () => {
  // Mock console methods to prevent test output pollution
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  
  beforeEach(() => {
    // Setup mock implementation for usePyodide
    usePyodide.mockReturnValue({
      isLoading: false,
      isReady: true,
      error: null,
      runPython: jest.fn().mockResolvedValue({ 
        output: 'test output', 
        stdout: 'Python print output', 
        executionTime: 0 
      })
    });
    
    // Silence console output in tests
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Restore original console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  test('JavaScript console logs are captured and displayed in the console output', async () => {
    // Render the component
    render(<PythonTestRunner />);
    
    // Click on the console tab to view it
    fireEvent.click(screen.getByRole('tab', { name: /console/i }));
    
    // Use act to batch state updates
    act(() => {
      console.log('Test console message');
    });
    
    // Wait for the log to appear in the DOM with the new format
    await waitFor(() => {
      const consolePanel = screen.getByRole('tabpanel', { name: /console/i });
      expect(consolePanel).toHaveTextContent('JS> Test console message');
    });
  });

  test('multiple JavaScript console logs are captured in order', async () => {
    // Render the component
    render(<PythonTestRunner />);
    
    // Click on the console tab to view it
    fireEvent.click(screen.getByRole('tab', { name: /console/i }));
    
    // Use act to batch multiple state updates
    act(() => {
      console.log('First message');
      console.log('Second message');
      console.log({ data: 'Object message' });
    });
    
    // Wait for all logs to appear in the DOM with more flexible approach
    await waitFor(() => {
      const consolePanel = screen.getByRole('tabpanel', { name: /console/i });
      expect(consolePanel).toHaveTextContent('JS> First message');
      expect(consolePanel).toHaveTextContent('JS> Second message');
      expect(consolePanel).toHaveTextContent('JS> {"data":"Object message"}');
    });
    
    // Get all log entries
    const consolePanel = screen.getByRole('tabpanel', { name: /console/i });
    const logEntries = Array.from(consolePanel.querySelectorAll('.console-log-entry'));
    
    // Verify the logs appear in the correct order
    expect(logEntries.length).toBeGreaterThanOrEqual(3);
    expect(logEntries[0].textContent).toContain('First message');
    expect(logEntries[1].textContent).toContain('Second message');
    expect(logEntries[2].textContent).toContain('{"data":"Object message"}');
  });

  test('Python print statements are captured and displayed in the console output', async () => {
    // Mock the runPython function to return stdout
    usePyodide.mockReturnValue({
      isLoading: false,
      isReady: true,
      error: null,
      runPython: jest.fn().mockResolvedValue({ 
        output: 'test output', 
        stdout: 'Hello from Python!\nSecond line from Python', 
        executionTime: 0 
      })
    });

    // Render the component
    render(<PythonTestRunner />);
    
    // Go to console tab
    fireEvent.click(screen.getByRole('tab', { name: /console/i }));
    
    // Click the run tests button to execute Python code
    fireEvent.click(screen.getByText(/Run Python Tests/i));
    
    // Wait for Python output to appear with more flexible approach
    await waitFor(() => {
      const consolePanel = screen.getByRole('tabpanel', { name: /console/i });
      expect(consolePanel).toHaveTextContent('Python> Hello from Python!');
      expect(consolePanel).toHaveTextContent('Python> Second line from Python');
    });
    
    // Verify the Python logs have the correct styling
    const pythonLogs = Array.from(document.querySelectorAll('.text-yellow-400'));
    expect(pythonLogs.length).toBeGreaterThan(0);
    expect(pythonLogs[0].textContent).toContain('Python>');
  });
});
