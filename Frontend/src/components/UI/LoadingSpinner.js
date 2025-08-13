import React from 'react';

const LoadingSpinner = ({ size = 'w-8 h-8', className = '' }) => {
  return (
    <div className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] ${size} ${className}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;


