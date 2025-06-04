import React from 'react';

const Button = ({ onClick, children, className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-5 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 text-white rounded ${sizeClasses[size]} hover:bg-blue-600 transition duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;