import React from 'react';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app" style={{ 
      minHeight: '100vh',
      position: 'relative',
      paddingBottom: '50px' // Add space for footer
    }}>
      <main>
        {/* Your main app content */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
