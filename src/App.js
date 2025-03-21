import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import PythonTestRunner from './PythonTestRunner';
import AboutPage from './components/AboutPage';
import Footer from './components/Footer';
import BurgerMenu from './components/BurgerMenu';

function App() {
  // Define main content to avoid duplication
  const mainContent = (
    <>
      <header className="App-header">
        <h1>Master leetcode-style interviews</h1>
      </header>
      <main className="App-main">
        <PythonTestRunner />
      </main>
    </>
  );

  return (
    <Router>
      <div className="App" style={{ 
        minHeight: '100vh',
        position: 'relative',
        paddingBottom: '60px' // Increased padding to ensure space for footer
      }}>
        <BurgerMenu />
        
        <Routes>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/leetcode-bites" element={mainContent} />
          <Route path="/" element={mainContent} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
