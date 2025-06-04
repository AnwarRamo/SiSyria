import React from 'react';
import { useNavigate } from 'react-router-dom'; 

function Btn() {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate('/bookingPage'); 
  };

  return (
    <div className="pt-2 pb-2 flex justify-center">
      <button
        onClick={handleClick} // Add onClick handler
        className="px-8 py-3 bg-[#E7C873] text-[#115d5a] font-bold rounded-xl hover:bg-[#0d4a47] hover:text-white transform hover:scale-105 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#E7C873] focus:ring-opacity-50"
      >
        Book Now
      </button>
    </div>
  );
}

export default Btn;