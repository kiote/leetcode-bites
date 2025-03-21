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
});
