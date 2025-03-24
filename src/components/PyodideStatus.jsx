import React from 'react';
import PropTypes from 'prop-types';

const PyodideStatus = ({ isLoading, isReady, error }) => {
  return (
    <div className={`mb-4 p-2 rounded-md ${
      error ? 'bg-red-100 text-red-700' : 
      isLoading ? 'bg-yellow-100 text-yellow-700' : 
      isReady ? 'bg-green-100 text-green-700' : ''
    }`}>
      {error ? (
        <p>Error loading Python environment: {error}</p>
      ) : isLoading ? (
        <p>Loading Python environment... This may take a few moments.</p>
      ) : isReady ? (
        <p>Python environment ready!</p>
      ) : null}
    </div>
  );
};

PyodideStatus.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isReady: PropTypes.bool.isRequired,
  error: PropTypes.string
};

export default PyodideStatus;
