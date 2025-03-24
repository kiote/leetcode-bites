import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    
    // Wait for Python output to appear
    await waitFor(() => {
      const consolePanel = screen.getByRole('tabpanel', { name: /console/i });
      expect(consolePanel).toHaveTextContent('Python> Hello from Python!');
    });
    
    // Verify the Python logs are displayed using Testing Library methods
    const consolePanel = screen.getByRole('tabpanel', { name: /console/i });
    const pythonLogs = within(consolePanel).getAllByText(/Python>/);
    expect(pythonLogs.length).toBeGreaterThan(0);
  });
});
