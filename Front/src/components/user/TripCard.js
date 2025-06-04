// src/components/user/TripCard.jsx
import React from 'react';
import { FaMapMarkerAlt, FaPlusCircle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TripCard = ({ trip, onAddToProfile, isSaved, showAddToProfileButton = true, onLearnMore }) => {
  // Add console.log here to see when TripCard re-renders and with what props
  // console.log(`[TripCard] Rendering: ${trip?.title}`, { isSaved, onAddToProfile });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }
  };

  if (!trip) {
    return (
      <motion.div variants={cardVariants} className="p-5 text-center text-slate-500">
        Trip data unavailable.
      </motion.div>
    );
  }
  
  const handleLearnMoreClick = (e) => {
    e.stopPropagation();
    if (onLearnMore) {
      onLearnMore(trip.id || trip._id);
    }
  };

  const handleAddToProfileClick = (e) => {
    e.stopPropagation();
    if (onAddToProfile) {
      onAddToProfile(trip);
    }
  };

  // CRITICAL: If you have any useEffect hooks in TripCard,
  // ensure their dependency arrays are correct and they don't
  // unconditionally call onAddToProfile or another state-setting function.
  // Example of a BAD effect:
  // useEffect(() => {
  //   if (isSaved) { onAddToProfile(trip); } // This could loop if onAddToProfile changes and isSaved is true
  // }, [isSaved, onAddToProfile, trip]);

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out flex flex-col group"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={trip.images?.[0] || '/placeholder-trip.jpg'}
          alt={trip.title || 'Trip Image'}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-xl font-semibold text-white shadow-sm drop-shadow-md">{trip.title || 'Untitled Trip'}</h3>
          {trip.destination && (
            <div className="flex items-center mt-1 text-slate-200 text-sm">
              <FaMapMarkerAlt className="mr-1.5 h-4 w-4 flex-shrink-0" />
              <span>{trip.destination}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {trip.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 flex-grow">
            {trip.description}
          </p>
        )}
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            {trip.price !== undefined && trip.price !== null ? (
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                ${Number(trip.price).toLocaleString()}
              </span>
            ) : (
               <span className="text-sm text-slate-500 dark:text-slate-400">Price N/A</span>
            )}
            {trip.duration && (
              <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                {trip.duration} Days
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={handleLearnMoreClick}
              className="flex-1 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              <FaInfoCircle /> Learn More
            </button>
            {showAddToProfileButton && onAddToProfile && (
              <button
                type="button"
                onClick={handleAddToProfileClick}
                className={`flex-1 w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isSaved
                    ? "bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-800 focus:ring-green-500"
                    : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 focus:ring-slate-500"
                }`}
              >
                {isSaved ? <FaCheckCircle /> : <FaPlusCircle />}
                {isSaved ? "Saved" : "Save Trip"} 
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(TripCard);