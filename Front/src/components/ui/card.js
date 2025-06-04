import React from 'react';

const Card = ({ className, children }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ className, children }) => {
  return <div className={`text-gray-700 ${className}`}>{children}</div>;
};

// Export Card as the default export
export default Card;