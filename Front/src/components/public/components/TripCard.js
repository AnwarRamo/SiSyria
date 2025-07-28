import { useState, useEffect } from 'react';

const TripCard = ({ trip, isRegistered, isLoading, onToggleRegister, onViewDetails }) => {
  // All hooks at the top
  const [timeLeft, setTimeLeft] = useState({});
  const [tripStatus, setTripStatus] = useState('upcoming'); // 'upcoming', 'ongoing', 'missed'

  // Null guard after hooks
  if (!trip) {
    return (
      <div className="bg-white/80 rounded-3xl shadow-2xl p-8 flex items-center justify-center min-h-[200px] text-red-600 font-bold">
        Trip data unavailable
      </div>
    );
  }

  const firstImage = trip.images?.[0] || null;

  // Calculate time until trip starts
  useEffect(() => {
    if (!trip.startDate || !isRegistered) return;
    const calculateTimeLeft = () => {
      const now = new Date();
      const startDate = new Date(trip.startDate);
      const difference = startDate - now;
      if (difference <= 0) {
        setTripStatus('missed');
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [trip.startDate, isRegistered]);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300 border border-gray-100"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {firstImage ? (
        <img
          src={firstImage}
          alt={trip.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center">
          <span className="text-white">No image available</span>
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">{trip.title}</h3>
          <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold">
            ${trip.price}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 flex items-center">
          <FaMapMarkerAlt className="inline mr-2 text-teal-600" /> 
          {trip.destination}
        </p>
        
        <p className="text-gray-600 text-sm mb-4 flex-grow">
          {trip.description || 'No description available'}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {(trip.highlights || []).slice(0, 3).map((highlight, index) => (
            <span key={index} className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs">
              {highlight}
            </span>
          ))}
        </div>
        
        {/* Trip Countdown Timer */}
        {isRegistered && trip.startDate && (
          <div className={`mb-4 p-3 rounded-lg ${
            tripStatus === 'missed' ? 'bg-red-100 border border-red-200' : 'bg-blue-50'
          }`}>
            <div className="flex items-center gap-2 text-sm font-medium">
              <FaRegClock className="text-blue-500" />
              <span>
                {tripStatus === 'missed' 
                  ? "You missed this trip!"
                  : "Your trip starts in:"}
              </span>
            </div>
            
            {tripStatus !== 'missed' && (
              <div className="flex gap-2 mt-2">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="flex flex-col items-center">
                    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm font-bold">
                      {value.toString().padStart(2, '0')}
                    </div>
                    <span className="text-xs text-gray-500 mt-1 capitalize">{unit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="mt-auto grid grid-cols-2 gap-3">
          <button
            onClick={() => onViewDetails(trip._id)}
            className="w-full py-2 px-4 rounded-lg text-white font-semibold transition-all duration-300 bg-gray-600 hover:bg-gray-700"
          >
            View Details
          </button>
          <button
            disabled={isLoading}
            onClick={() => onToggleRegister(trip._id)}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-all duration-300 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : isRegistered
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-teal-700 hover:bg-teal-800'
            }`}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin inline-block" />
            ) : isRegistered ? (
              '✓ Registered'
            ) : (
              'Register Now'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default TripCard