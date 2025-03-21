import React from 'react';
import { Link } from 'react-router-dom';
import { getAppVersion } from '../utils/versionManager';
import '../styles/AboutPage.css';

// Import images - uncomment and add actual images to your project
// import teamImage from '../assets/about-images/team.jpg';
// import appArchitectureImage from '../assets/about-images/architecture.png';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About LeetCode Bites</h1>
        
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            LeetCode Bites aims to make algorithm practice accessible and engaging for 
            developers of all levels. We break down complex problems into manageable, 
            bite-sized exercises that help you build confidence and skill.
          </p>
          
          {/* Uncomment when you add the actual image */}
          {/* <div className="about-image-container">
            <img 
              src={teamImage} 
              alt="The LeetCode Bites Team" 
              className="about-image"
            />
            <p className="image-caption">Our dedicated team of developers and educators</p>
          </div> */}
        </section>
        
        <section className="about-section">
          <h2>How It Works</h2>
          <p>
            Our platform provides an interactive coding environment where you can:
          </p>
          <ul>
            <li>Tackle progressively challenging coding problems</li>
            <li>Run your code directly in the browser</li>
            <li>Get immediate feedback with test cases</li>
            <li>Track your progress as you master more concepts</li>
          </ul>
          
          {/* Uncomment when you add the actual image */}
          {/* <div className="about-image-container">
            <img 
              src={appArchitectureImage} 
              alt="Application Architecture" 
              className="about-image"
            />
            <p className="image-caption">Our application architecture leverages Python in the browser via Pyodide</p>
          </div> */}
        </section>
        
        <section className="about-section">
          <h2>Technology Stack</h2>
          <p>
            LeetCode Bites is built with modern web technologies:
          </p>
          <ul>
            <li>React for our interactive UI</li>
            <li>Pyodide for running Python code in the browser</li>
            <li>Tailwind CSS for styling</li>
            <li>Github Copilot / Claude 3.7 with thinking for code</li>
          </ul>
        </section>
        
        <section className="about-section">
          <h2>Version Information</h2>
          <p>
            You're currently using LeetCode Bites version <strong>{getAppVersion()}</strong>
          </p>
        </section>
        
        <div className="back-link-container">
          <Link to="/" className="back-link">
            &larr; Back to Problems
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
