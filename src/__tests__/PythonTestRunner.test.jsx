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
  beforeEach(() => {
    // Setup mock implementation for usePyodide
    usePyodide.mockReturnValue({
      isLoading: false,
      isReady: true,
      error: null,
      runPython: jest.fn().mockResolvedValue({ 
        output: 'test output', 
        stdout: '', 
        executionTime: 0 
      })
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('console logs are captured and displayed in the console output', async () => {
    // Render the component
    render(<PythonTestRunner />);
    
    // Click on the console tab to view it
    fireEvent.click(screen.getByRole('tab', { name: /console/i }));
    
    // Use act to batch state updates
    act(() => {
      console.log('Test console message');
    });
    
    // Wait for the log to appear in the DOM
    await waitFor(() => {
      expect(screen.getByText(/> Test console message/)).toBeInTheDocument();
    });
  });

  test('multiple console logs are captured in order', async () => {
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
    
    // Wait for all logs to appear in the DOM
    await waitFor(() => {
      expect(screen.getByText(/> First message/)).toBeInTheDocument();
      expect(screen.getByText(/> Second message/)).toBeInTheDocument();
      expect(screen.getByText(/> {"data":"Object message"}/)).toBeInTheDocument();
    });
    
    // Get all log entries
    const consoleDiv = screen.getByRole('tabpanel', { name: /console/i });
    const logEntries = Array.from(consoleDiv.querySelectorAll('.mb-1'));
    
    // Verify the logs appear in the correct order
    expect(logEntries.length).toBeGreaterThanOrEqual(3);
    expect(logEntries[0].textContent).toContain('First message');
    expect(logEntries[1].textContent).toContain('Second message');
    expect(logEntries[2].textContent).toContain('{"data":"Object message"}');
  });
});
