import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiClock, FiStar } from 'react-icons/fi';
import CountdownTimer from './CountdownTimer';

const TripCard = ({ trip, userRegistration, isLoading, onToggleRegister, onViewDetails }) => {
  if (!trip) {
    return (
      <div className="bg-white/80 rounded-3xl shadow-2xl p-8 flex items-center justify-center min-h-[200px] text-red-600 font-bold">
        Trip data unavailable
      </div>
    );
  }

  // Now it's safe to access trip.images and other trip properties
  const [showStatus, setShowStatus] = useState(false);
  const firstImage = trip.images?.[0] || null;

  useEffect(() => {
    if (userRegistration?.status) {
      setShowStatus(true);
      const timer = setTimeout(() => setShowStatus(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [userRegistration]);

  const renderStatus = () => {
    if (!userRegistration) return null;
    switch(userRegistration.status) {
      case 'pending':
        return (
          <motion.div
            className="mt-2 p-2 bg-amber-100 rounded-lg text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-amber-800 font-medium">⏳ Pending Approval</span>
          </motion.div>
        );
      case 'rejected':
        return (
          <motion.div
            className="mt-2 p-2 bg-red-100 rounded-lg text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-red-700 font-medium">
              ❌ Trip is full, please choose another trip
            </span>
          </motion.div>
        );
      case 'approved':
        return <CountdownTimer startDate={trip.startDate} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#E7C873] hover:shadow-amber-200 transition-all duration-300 group"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      {/* Featured badge */}
      {trip.featured && (
        <div className="absolute top-4 left-4 bg-[#E7C873] text-[#115d5a] px-3 py-1 rounded-full text-xs font-bold flex items-center z-10 shadow">
          <FiStar className="mr-1" /> Featured
        </div>
      )}
      {/* Trip image */}
      {firstImage ? (
        <img
          src={firstImage}
          alt={trip.title}
          className="w-full h-52 object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-52 bg-gradient-to-r from-[#115d5a] to-[#E7C873] flex items-center justify-center">
          <span className="text-white font-bold">No image available</span>
        </div>
      )}
      {/* Card content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-extrabold text-[#115d5a] truncate">{trip.title}</h3>
          <div className="bg-[#E7C873] text-[#115d5a] px-4 py-1 rounded-full text-base font-bold shadow">
            ${trip.price}
          </div>
        </div>
        <div className="flex items-center gap-3 mb-2 text-sm text-[#115d5a] font-medium">
          <FiMapPin className="inline mr-1" />
          <span>{trip.destination}</span>
          <FiCalendar className="inline ml-3 mr-1" />
          <span>{trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'TBA'}</span>
          {trip.duration && (
            <><FiClock className="inline ml-3 mr-1" /><span>{trip.duration} days</span></>
          )}
        </div>
        <p className="text-gray-700 text-sm mb-3 line-clamp-3 flex-grow">
          {trip.description || 'No description available'}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {(trip.highlights || []).slice(0, 4).map((highlight, idx) => (
            <span key={idx} className="bg-[#115d5a]/10 text-[#115d5a] px-3 py-1 rounded-full text-xs font-semibold border border-[#E7C873]">
              {highlight}
            </span>
          ))}
        </div>
        {showStatus && renderStatus()}
        <div className="mt-auto flex flex-col gap-3">
          <button
            onClick={() => onViewDetails(trip._id)}
            className="w-full py-2 px-4 rounded-xl text-white font-bold bg-[#115d5a] hover:bg-[#0d4a47] transition-all duration-300 shadow-md"
          >
            View Details
          </button>
          <button
            disabled={isLoading || userRegistration?.status === 'approved'}
            onClick={() => onToggleRegister(trip._id)}
            className={`w-full py-2 px-4 rounded-xl font-bold transition-all duration-300 shadow-md
              ${isLoading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : userRegistration?.status === 'approved'
                ? 'bg-green-600 text-white cursor-default'
                : userRegistration
                ? 'bg-[#E7C873] text-[#115d5a] hover:bg-yellow-400'
                : 'bg-gradient-to-r from-[#115d5a] to-[#1a7c78] text-white hover:from-[#0d4a47] hover:to-[#115d5a]'}
            `}
          >
            {isLoading ? (
              <span className="animate-spin inline-block mr-2 align-middle">⏳</span>
            ) : userRegistration?.status === 'approved' ? (
              '✓ Approved'
            ) : userRegistration ? (
              'Registered'
            ) : (
              'Register Now'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;