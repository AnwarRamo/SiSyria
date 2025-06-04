// components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="relative flex items-center justify-center h-screen bg-transparent">
      {/* Main orb */}
      <div className="relative w-32 h-32">
        {/* Liquid core animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff6b6b] via-[#4ecdc4] to-[#45b7d1] animate-liquidRotate blur-xl"></div>
        
        {/* Pulsing core */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff6b6b] via-[#4ecdc4] to-[#45b7d1] animate-pulseSlow"></div>
        
        {/* Dynamic rings */}
        <div className="absolute w-full h-full border-4 border-transparent rounded-full animate-spinSlow 
          [border-top:4px_solid_#ff6b6b] [border-bottom:4px_solid_#4ecdc4] [border-left:4px_solid_#45b7d1] [border-right:4px_solid_#ff6b6b]">
        </div>
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => {
          const angle = i * 60; // spacing in circle
          const radius = 30; // adjust for smaller float radius
          const top = `${50 + radius * Math.sin((angle * Math.PI) / 180)}%`;
          const left = `${50 + radius * Math.cos((angle * Math.PI) / 180)}%`;

          return (
            <div 
              key={i}
              className="absolute w-3 h-3 bg-[#ff6b6b] rounded-full animate-float"
              style={{
                top,
                left,
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          );
        })}
      </div>

      <span className="absolute mt-40 text-xl font-bold bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] bg-clip-text text-transparent animate-colorShift">
        Loading...
      </span>
    </div>
  );
};

export default LoadingSpinner;
