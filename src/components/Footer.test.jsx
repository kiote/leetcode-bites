import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import * as versionManager from '../utils/versionManager';

// Fix the test setup
jest.mock('../utils/versionManager', () => ({
  getAppVersion: jest.fn()
}));

describe('Footer Component', () => {
  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
  });

  it('displays the application version', () => {
    // Mock the getAppVersion function
    const mockVersion = '1.2.3';
    versionManager.getAppVersion.mockReturnValue(mockVersion);
    
    // Render the component
    render(<Footer />);
    
    // Check if the version is displayed
    const versionElement = screen.getByTestId('app-version');
    expect(versionElement).toBeInTheDocument();
    expect(versionElement.textContent).toBe(`v${mockVersion}`);
  });
});
