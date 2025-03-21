import React from 'react';
import './App.css';
import PythonTestRunner from './PythonTestRunner';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App" style={{ 
      minHeight: '100vh',
      position: 'relative',
      paddingBottom: '60px' // Increased padding to ensure space for footer
    }}>
      <header className="App-header">
        <h1>Master leetcode-style interviews</h1>
      </header>
      <main className="App-main">
        <PythonTestRunner />
      </main>
      <Footer />
    </div>
  );
}

export default App;
