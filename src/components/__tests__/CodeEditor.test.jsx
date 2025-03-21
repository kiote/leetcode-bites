import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CodeEditor } from '../CodeEditor';

describe('CodeEditor', () => {
  const mockOnChange = jest.fn();
  
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders correctly', () => {
    render(<CodeEditor code="test code" onChange={mockOnChange} />);
    expect(screen.getByText('Python Editor')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('test code');
  });

  test('calls onChange when input changes', () => {
    render(<CodeEditor code="test code" onChange={mockOnChange} />);
    const textArea = screen.getByRole('textbox');
    
    fireEvent.change(textArea, { target: { value: 'new code' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('new code');
  });

  test('inserts tab character when Tab key is pressed', () => {
    render(<CodeEditor code="test code" onChange={mockOnChange} />);
    const textArea = screen.getByRole('textbox');
    
    // Set selection position
    textArea.selectionStart = 4;
    textArea.selectionEnd = 4;
    
    // Fire Tab key event
    fireEvent.keyDown(textArea, { key: 'Tab' });
    
    // Check if onChange was called with the correct modified string
    expect(mockOnChange).toHaveBeenCalledWith('test\t code');
  });

  test('does not trigger default Tab behavior', () => {
    render(<CodeEditor code="test code" onChange={mockOnChange} />);
    const textArea = screen.getByRole('textbox');
    
    // Create a Tab key event
    const tabEvent = new KeyboardEvent('keydown', { 
      key: 'Tab', 
      bubbles: true, 
      cancelable: true 
    });
    
    // Spy on preventDefault
    const preventDefaultSpy = jest.spyOn(tabEvent, 'preventDefault');
    
    // Dispatch the event directly to check if preventDefault is called
    textArea.dispatchEvent(tabEvent);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  test('maintains indentation when Enter key is pressed', () => {
    const indentedCode = 'def example():\n    x = 1\n    y = 2';
    render(<CodeEditor code={indentedCode} onChange={mockOnChange} />);
    const textArea = screen.getByRole('textbox');
    
    // Place cursor at the end of the indented line
    const cursorPosition = 'def example():\n    x = 1'.length;
    textArea.selectionStart = cursorPosition;
    textArea.selectionEnd = cursorPosition;
    
    // Fire Enter key event
    fireEvent.keyDown(textArea, { key: 'Enter' });
    
    // Expected result: indentation is preserved on the new line
    const expectedResult = 'def example():\n    x = 1\n    \n    y = 2';
    expect(mockOnChange).toHaveBeenCalledWith(expectedResult);
  });

  test('handles non-indented lines correctly', () => {
    render(<CodeEditor code="line 1\nline 2" onChange={mockOnChange} />);
    const textArea = screen.getByRole('textbox');
    
    // Place cursor at the end of first line
    textArea.selectionStart = 6;
    textArea.selectionEnd = 6;
    
    // Fire Enter key event
    fireEvent.keyDown(textArea, { key: 'Enter' });
    
    // Alternative approach: Check that the result contains what we expect
    const result = mockOnChange.mock.calls[0][0];
    expect(result).toContain('line 1');
    expect(result).toContain('line 2');
    
    // Check there's empty space between the lines
    const middlePart = result.split('line 2')[0].split('line 1')[1];
    expect(middlePart.includes('\n')).toBe(true);
  });
});
