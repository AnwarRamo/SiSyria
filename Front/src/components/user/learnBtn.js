import React from 'react';
import { useNavigate } from 'react-router-dom';

function Btn2() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/details'); // Navigate to the "/details" page
  };

  return (
    <div className="pt-2 pb-2 flex justify-center">
      <button
        onClick={handleClick} // Add onClick handler
        className="px-8 py-3 bg-[#115d5a] text-white font-bold rounded-xl hover:bg-[#0d4a47] transform hover:scale-105 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#115d5a] focus:ring-opacity-50"
      >
        Learn More
      </button>
    </div>
  );
}

export default Btn2;