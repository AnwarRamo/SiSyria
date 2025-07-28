import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaSpinner, FaExclamationTriangle, FaChevronLeft, FaChevronRight, FaStar, FaRegClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { shallow } from 'zustand/shallow';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../api/stores/auth.store';
import { TripService } from '../../api/services/trip.service';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import TravelGuide from '../../components/public/components/TravelGuide';
import CountdownTimer from '../../components/user/CountdownTimer';

// Updated hero images with proper travel destinations
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
];

const TripCard = ({ trip, isRegistered, isLoading, onToggleRegister, onViewDetails }) => {
  const cardRef = useRef(null);
  const [isFull, setIsFull] = useState(false);

  // Check if trip is full
  useEffect(() => {
    if (trip.capacity && trip.registeredCount) {
      setIsFull(trip.registeredCount >= trip.capacity);
    }
  }, [trip.capacity, trip.registeredCount]);

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

  if (!trip) {
    return (
      <div className="bg-white/80 rounded-3xl shadow-2xl p-8 flex items-center justify-center min-h-[200px] text-red-600 font-bold">
        Trip data unavailable
      </div>
    );
  }
  const firstImage = trip.images?.[0] || null;

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
      {firstImage ? (
        <img
          src={firstImage}
          alt={trip.title}
          className="w-full h-56 object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-56 bg-gradient-to-r from-[#115d5a] to-[#E7C873] flex items-center justify-center">
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
          <FaMapMarkerAlt className="inline mr-1" />
          <span>{trip.destination}</span>
          <FaRegClock className="inline ml-3 mr-1" />
          <span>{trip.startDate ? new Date(trip.startDate).toLocaleString() : 'TBA'}</span>
          <FaRegClock className="inline ml-3 mr-1" />
          <span>{trip.days} days</span>
        </div>
        {/* Countdown Timer */}
        {trip.startDate && <CountdownTimer startDate={trip.startDate} />}
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
        <div className="mt-auto flex flex-col gap-3">
          <button
            onClick={() => onViewDetails(trip._id)}
            className="w-full py-2 px-4 rounded-xl text-white font-bold bg-[#115d5a] hover:bg-[#0d4a47] transition-all duration-300 shadow-md"
          >
            View Details
          </button>
          <button
            disabled={isLoading || isFull}
            onClick={() => onToggleRegister(trip._id)}
            className={`w-full py-2 px-4 rounded-xl font-bold transition-all duration-300 shadow-md
              ${isLoading || isFull
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : isRegistered
                ? 'bg-[#E7C873] text-[#115d5a] hover:bg-yellow-400'
                : 'bg-gradient-to-r from-[#115d5a] to-[#1a7c78] text-white hover:from-[#0d4a47] hover:to-[#115d5a]'}
            `}
          >
            {isLoading ? (
              <span className="animate-spin inline-block mr-2 align-middle">⏳</span>
            ) : isFull ? (
              'Trip is Full'
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

const TravelPage = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registerLoadingIds, setRegisterLoadingIds] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isWaving, setIsWaving] = useState(true);
  const [isPointing, setIsPointing] = useState(false);
  
  const [destinationFilter, setDestinationFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const savedTrips = useAuthStore((state) => state.savedTrips, shallow);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const toggleTripRegistration = useAuthStore((state) => state.toggleTripRegistration);
  const fetchRegisteredTrips = useAuthStore((state) => state.fetchRegisteredTrips);

  const normalizeTripImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images) && images.every(img => typeof img === 'string')) return images;
    if (Array.isArray(images)) {
      return images.map(img => {
        if (typeof img === 'string') return img;
        if (img.url) return img.url;
        if (img.path) return `${process.env.REACT_APP_API_BASE || ''}/uploads/${img.path}`;
        return null;
      }).filter(Boolean);
    }
    if (typeof images === 'object') {
      if (images.url) return [images.url];
      if (images.path) return [`${process.env.REACT_APP_API_BASE || ''}/uploads/${images.path}`];
    }
    return [];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevSlide = () => setCurrentHeroIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  const goToNextSlide = () => setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchRegisteredTrips().catch(console.error);
    }
  }, [isLoggedIn, fetchRegisteredTrips]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const data = await TripService.getPublicTrips({ page: 1, limit: 100 });
      
      let tripsFromAPI = [];
      if (Array.isArray(data)) tripsFromAPI = data;
      else if (Array.isArray(data?.trips)) tripsFromAPI = data.trips;
      else if (Array.isArray(data?.data?.trips)) tripsFromAPI = data.data.trips;

      const normalizedTrips = tripsFromAPI.map(trip => ({
        ...trip,
        images: normalizeTripImages(trip.images),
        price: trip.price || 0,
        duration: trip.duration || 0
      }));

      setTrips(normalizedTrips);
      setFilteredTrips(normalizedTrips);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load trips');
      setTrips([]);
      setFilteredTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = trips;
    
    if (destinationFilter !== 'all') {
      result = result.filter(trip => 
        trip.destination?.toLowerCase().includes(destinationFilter.toLowerCase())
      );
    }
    
    if (durationFilter !== 'all') {
      const [min, max] = durationFilter.split('-').map(Number);
      result = result.filter(trip => trip.duration >= min && trip.duration <= max);
    }
    
    if (priceFilter !== 'all') {
      const [min, max] = priceFilter.split('-').map(Number);
      result = result.filter(trip => trip.price >= min && trip.price <= max);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(trip => 
        trip.title?.toLowerCase().includes(query) || 
        trip.destination?.toLowerCase().includes(query) ||
        (trip.highlights || []).some(h => h.toLowerCase().includes(query))
      );
    }
    
    setFilteredTrips(result);
  }, [destinationFilter, durationFilter, priceFilter, searchQuery, trips]);

  const handlePriceHover = () => {
    setIsPointing(true);
    setTimeout(() => setIsPointing(false), 2000);
  };

  const handleWave = () => {
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1500);
  };

  const handleViewDetails = (tripId) => {
    navigate(`/trips/${tripId}`);
  };

  const handleToggleRegister = async (tripId) => {
    if (!isLoggedIn) {
      toast.info('Please login to register for trips');
      return;
    }
    setRegisterLoadingIds((prev) => [...prev, tripId]);
    try {
      await toggleTripRegistration(tripId);
      toast.success('Your registration has been updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to update registration');
    } finally {
      setRegisterLoadingIds((prev) => prev.filter((id) => id !== tripId));
    }
  };

  const getUniqueDestinations = () => {
    const destinations = trips.map(trip => trip.destination)
      .filter((value, index, self) => value && self.indexOf(value) === index);
    return ['All Destinations', ...destinations];
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden bg-[#f8fafc] text-black dark:bg-[#0a192f] dark:text-white">
      <Navbar />
      
      {/* Hero Section with Slider */}
      <div className="relative h-screen max-h-[700px] overflow-hidden">
        {HERO_IMAGES.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${image})`,
              filter: 'blur(2px) brightness(0.85)'
            }}
          />
        ))}
        
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white max-w-4xl bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-[#115d5a] drop-shadow-lg">Discover Extraordinary Trips</h1>
            <p className="text-xl md:text-2xl mb-8 text-[#115d5a]/80">Explore breathtaking destinations around the world</p>
            <button 
              className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={handleWave}
            >
              Start Exploring
            </button>
          </motion.div>
        </div>
        
        {/* Slider Navigation */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-colors"
          aria-label="Previous slide"
        >
          <FaChevronLeft size={24} />
        </button>
        <button
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-colors"
          aria-label="Next slide"
        >
          <FaChevronRight size={24} />
        </button>
        
        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentHeroIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <TravelGuide isPointing={isPointing} isWaving={isWaving} />
      </div>
      
      {/* Filter Section */}
      <div className="py-12 px-4 bg-white shadow-lg relative z-10 -mt-20 rounded-t-3xl mx-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Find Your Perfect Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Filter our collection of handcrafted adventures to find your ideal getaway
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Trips</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations, activities..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute right-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
              <select
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value === 'All Destinations' ? 'all' : e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                {getUniqueDestinations().map((dest, index) => (
                  <option key={index} value={dest === 'All Destinations' ? 'all' : dest}>
                    {dest}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="all">Any Duration</option>
                <option value="1-5">1-5 Days</option>
                <option value="6-10">6-10 Days</option>
                <option value="11-15">11-15 Days</option>
                <option value="15-99">15+ Days</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                onMouseEnter={handlePriceHover}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="all">Any Price</option>
                <option value="0-1000">Under $1000</option>
                <option value="1000-2000">$1000 - $2000</option>
                <option value="2000-3000">$2000 - $3000</option>
                <option value="3000-10000">$3000+</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trips Grid Section */}
      <div className="py-16 px-4 max-w-7xl mx-auto">
        {loading && filteredTrips.length === 0 ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center flex flex-col items-center py-20">
            <FaExclamationTriangle className="text-4xl mb-2" /> 
            <p className="text-xl font-medium">{error}</p>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No trips match your criteria</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <button 
              className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                setDestinationFilter('all');
                setDurationFilter('all');
                setPriceFilter('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800">Available Trips</h2>
              <p className="text-gray-600">{filteredTrips.length} trips found</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrips.filter(Boolean).map(trip => (
                trip ? (
                  <TripCard
                    key={trip._id}
                    trip={trip}
                    isRegistered={savedTrips.some((savedTrip) => savedTrip._id === trip._id)}
                    isLoading={registerLoadingIds.includes(trip._id)}
                    onToggleRegister={handleToggleRegister}
                    onViewDetails={handleViewDetails}
                  />
                ) : null
              ))}
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default TravelPage;