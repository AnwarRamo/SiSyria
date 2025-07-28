// src/components/TripModal.jsx
import React from 'react';
import { motion } from 'framer-motion';

const TripModal = ({ trip, onClose }) => {
  // Map destination to background gradient
  const getBgGradient = (destination) => {
    const gradients = {
      "Bali, Indonesia": "from-emerald-400 to-teal-500",
      "Japan": "from-red-400 to-amber-500",
      "Italy": "from-green-400 to-blue-500",
      "Costa Rica": "from-lime-400 to-emerald-500",
      "Greece": "from-blue-400 to-indigo-500",
      "Egypt": "from-amber-400 to-orange-500"
    };
    
    return gradients[destination] || "from-sky-400 to-emerald-500";
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-3xl overflow-hidden w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        {/* Modal Header */}
        <div className={`h-64 bg-gradient-to-r ${getBgGradient(trip.destination)} relative`}>
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center p-4">
              <h2 className="text-4xl font-bold mb-2">{trip.title}</h2>
              <p className="text-xl opacity-90">{trip.slogan}</p>
            </div>
          </div>
          
          <button 
            className="absolute top-4 right-4 bg-white bg-opacity-30 text-white rounded-full p-2 hover:bg-opacity-100 hover:text-gray-800 transition-all"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Trip Overview</h3>
              <p className="text-gray-600 mb-6">
                Embark on an unforgettable journey to {trip.destination}. This carefully crafted {trip.duration}-day adventure combines breathtaking landscapes, cultural immersion, and unique experiences that will create memories to last a lifetime.
              </p>
              
              <h4 className="text-xl font-bold text-gray-800 mb-3">Highlights</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {trip.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
              
              <h4 className="text-xl font-bold text-gray-800 mb-3">What's Included</h4>
              <div className="flex flex-wrap gap-4">
                <div className="bg-sky-50 rounded-lg p-4 flex-1 min-w-[150px]">
                  <div className="text-2xl mb-2">🏨</div>
                  <p className="font-medium text-gray-800">Accommodation</p>
                  <p className="text-sm text-gray-600">7 nights in 4-star hotels</p>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-4 flex-1 min-w-[150px]">
                  <div className="text-2xl mb-2">🍽️</div>
                  <p className="font-medium text-gray-800">Meals</p>
                  <p className="text-sm text-gray-600">{trip.meals}</p>
                </div>
                
                <div className="bg-emerald-50 rounded-lg p-4 flex-1 min-w-[150px]">
                  <div className="text-2xl mb-2">🚌</div>
                  <p className="font-medium text-gray-800">Transport</p>
                  <p className="text-sm text-gray-600">All ground transportation</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Trip Details</h3>
              
              <div className="space-y-5">
                <div>
                  <p className="text-gray-600 text-sm">Destination</p>
                  <p className="font-bold text-lg">{trip.destination}</p>
                </div>
                
                <div>
                  <p className="text-gray-600 text-sm">Duration</p>
                  <p className="font-bold text-lg">{trip.duration} days</p>
                </div>
                
                <div>
                  <p className="text-gray-600 text-sm">Next Departure</p>
                  <p className="font-bold text-lg">{trip.dates}</p>
                </div>
                
                <div>
                  <p className="text-gray-600 text-sm">Group Size</p>
                  <p className="font-bold text-lg">{trip.groupSize}</p>
                </div>
                
                <div>
                  <p className="text-gray-600 text-sm">Price From</p>
                  <p className="font-bold text-3xl text-emerald-600">${trip.price}</p>
                  <p className="text-gray-600 text-sm">per person</p>
                </div>
                
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg mt-4 hover:from-amber-600 hover:to-orange-600 transition-all duration-300">
                  Book This Trip
                </button>
                
                <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium mt-2 hover:bg-gray-50 transition-all">
                  Download Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TripModal;