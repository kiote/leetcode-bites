import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PythonTestRunner from '../PythonTestRunner';

// Mock the dependencies
jest.mock('../hooks/usePyodide', () => ({
  usePyodide: () => ({
    isLoading: false,
    isReady: true,
    error: null,
    runPython: jest.fn()
  })
}));

jest.mock('../data/testCases', () => ({
  allTests: {
    problem1: [{ id: 1, functionName: 'test', inputs: [], expectedOutput: 'expected' }]
  }
}));

jest.mock('../data/problems', () => ({
  problems: [
    { 
      id: 'problem1', 
      title: 'Test Problem', 
      description: 'Test description', 
      initialCode: 'def solution():\n    pass' 
    }
  ]
}));

jest.mock('../data/mainProblem', () => ({
  __esModule: true,
  default: {
    title: 'Main Problem Title',
    description: 'Main problem description',
    examples: [
      {
        id: 1,
        input: 'Input example',
        output: 'Output example',
        explanation: 'Example explanation'
      }
    ],
    constraints: ['Constraint 1', 'Constraint 2']
  }
}));

describe('MainProblemDescription Component', () => {
  test('should toggle visibility when clicked', () => {
    render(<PythonTestRunner />);
    
    // Initial state: problem description should be visible
    expect(screen.getByTestId('main-problem-content')).toBeInTheDocument();
    
    // Click the header to collapse
    fireEvent.click(screen.getByTestId('main-problem-header'));
    
    // After clicking, the description should not be visible
    expect(screen.queryByTestId('main-problem-content')).not.toBeInTheDocument();
    
    // Click again to expand
    fireEvent.click(screen.getByTestId('main-problem-header'));
    
    // Description should be visible again
    expect(screen.getByTestId('main-problem-content')).toBeInTheDocument();
  });
});
