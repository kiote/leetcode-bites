import { render, screen } from '@testing-library/react';
import App from './App';
import * as versionManager from './utils/versionManager';

// Mock the version manager
jest.mock('./utils/versionManager', () => ({
  getAppVersion: jest.fn()
}));

describe('App Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders footer with version information', () => {
    // Mock the version returned
    const mockVersion = '1.2.3';
    versionManager.getAppVersion.mockReturnValue(mockVersion);
    
    // Render the App component
    render(<App />);
    
    // Check if the footer is in the document
    const footerElement = screen.getByTestId('app-version');
    expect(footerElement).toBeInTheDocument();
    expect(footerElement.textContent).toBe(`v${mockVersion}`);
    
    // Check if the footer is visible using getByTestId instead of direct DOM queries
    const footer = screen.getByTestId('app-footer');
    expect(footer).toBeInTheDocument();
    
    // Check for styles using getComputedStyle (this is still valid)
    const footerStyles = window.getComputedStyle(footer);
    expect(footerStyles.display).not.toBe('none');
    expect(footerStyles.visibility).not.toBe('hidden');
    
    // Check position - should be at the bottom
    expect(footerStyles.position).toBe('absolute');
    expect(footerStyles.bottom).toBe('0px');
  });
});
