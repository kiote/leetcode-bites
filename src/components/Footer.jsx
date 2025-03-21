import React from 'react';
import { getAppVersion } from '../utils/versionManager';

const Footer = () => {
  // More robust styling to ensure visibility
  const footerStyle = {
    width: '100%',
    padding: '10px 0',
    backgroundColor: '#f5f5f5',
    borderTop: '1px solid #e0e0e0',
    textAlign: 'center',
    fontSize: '0.8rem',
    color: '#666',
    position: 'absolute',
    bottom: '0',
    left: '0',
    zIndex: 100, // Ensure it's above other elements
    display: 'block', // Explicitly set display
    visibility: 'visible', // Explicitly set visibility
  };

  return (
    <footer 
      className="app-footer"
      style={footerStyle}
      data-testid="app-footer" // Add a testid for the footer element itself
    >
      <div className="container">
        <div className="version-info">
          <span data-testid="app-version">v{getAppVersion()}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
