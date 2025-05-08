import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'indigo', className = '' }) => {
  // Size classes
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  // Color classes
  const colorClasses = {
    indigo: 'text-indigo-600',
    white: 'text-white',
    gray: 'text-gray-600',
    primary: 'text-primary-600'
  };

  // Get the appropriate size and color classes
  const sizeClass = sizeClasses[size] || sizeClasses.medium;
  const colorClass = colorClasses[color] || colorClasses.indigo;

  return (
    <div className={`inline-block ${className}`} role="status" aria-label="Loading">
      <svg 
        className={`animate-spin ${sizeClass} ${colorClass}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
