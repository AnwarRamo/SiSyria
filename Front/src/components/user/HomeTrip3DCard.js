import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaRegClock } from 'react-icons/fa';
import CountdownTimer from './CountdownTimer';

const HomeTrip3DCard = ({ trip }) => {
  const cardRef = useRef(null);
  const firstImage = trip.images?.[0] || '/default-image.jpg';

  // 3D tilt effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    cardRef.current.style.transform = `perspective(1200px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale3d(1.04,1.04,1.04)`;
  };
  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1200px) rotateY(0) rotateX(0) scale3d(1,1,1)';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-[#E7C873] flex flex-col overflow-hidden group transition-transform duration-300"
      style={{ transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ boxShadow: '0 12px 32px 0 rgba(231,200,115,0.25)' }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 120 }}
    >
      {/* Featured badge */}
      {trip.featured && (
        <div className="absolute top-4 left-4 bg-[#E7C873] text-[#115d5a] px-3 py-1 rounded-full text-xs font-bold flex items-center z-10 shadow">
          <FaStar className="mr-1" /> Featured
        </div>
      )}
      {/* Trip image */}
      <img
        src={firstImage}
        alt={trip.title}
        className="w-full h-56 object-cover object-center transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      {/* Card content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-extrabold text-[#115d5a] truncate">{trip.title}</h3>
          <div className="bg-[#E7C873] text-[#115d5a] px-4 py-1 rounded-full text-base font-bold shadow">
            ${trip.price}
          </div>
        </div>
        <div className="flex items-center gap-3 mb-2 text-sm text-[#115d5a] font-medium">
          <FaMapMarkerAlt className="inline mr-1" />
          <span>{trip.destination}</span>
          <FaRegClock className="inline ml-3 mr-1" />
          <span>{trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'TBA'}</span>
          {trip.duration && (
            <><FaRegClock className="inline ml-3 mr-1" /><span>{trip.duration} days</span></>
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
        {/* Countdown Timer */}
        {(trip.startDate || trip.endDate) && <CountdownTimer startDate={trip.startDate} endDate={trip.endDate} />}
        <div className="mt-auto flex flex-col gap-3">
          <button
            onClick={() => window.location.href = `/travel/${trip._id}`}
            className="w-full py-2 px-4 rounded-xl text-white font-bold bg-[#115d5a] hover:bg-[#0d4a47] transition-all duration-300 shadow-md"
            aria-label={`View details for ${trip.title}`}
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeTrip3DCard; 