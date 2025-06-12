import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaMapMarkerAlt, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
// BUG FIX: Import the 'shallow' equality checker from Zustand
import { shallow } from 'zustand/shallow';

// Central Store & Services
import { useAuthStore } from '../../api/stores/auth.store';
import { TripService } from '../../api/services/trip.service';

// Layout & Assets
import Navbar from '../../layout/Navbar';
import HERO_IMAGE_URL from '../../assets/images/anwar3.jpeg';

// To clean up the main component, we extract the trip card into its own component.
const TripCard = ({ trip, isRegistered, isLoading, onToggleRegister }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={trip.images[0]}
        alt={trip.title}
        className="w-full h-48 object-cover"
        loading="lazy" // SEO/PERFORMANCE: Lazy load images
      />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800">{trip.title}</h3>
        <p className="text-teal-600 text-sm mb-3 flex items-center">
          <FaMapMarkerAlt className="inline mr-2" /> {trip.destination}
        </p>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{trip.description}</p>
        <button
          disabled={isLoading}
          onClick={() => onToggleRegister(trip._id)}
          className={`w-full mt-auto py-2 px-4 rounded-lg text-white font-semibold transition-all duration-300 ${
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
    </motion.div>
  );
};

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registerLoadingIds, setRegisterLoadingIds] = useState([]);

  // BUG FIX: Apply the 'shallow' equality checker here.
  // This tells Zustand to only re-render if the *values* inside the object change,
  // preventing the infinite loop.
  const { savedTrips, toggleTripRegistration, fetchRegisteredTrips } = useAuthStore(
    (state) => ({
      savedTrips: state.savedTrips,
      toggleTripRegistration: state.toggleTripRegistration,
      fetchRegisteredTrips: state.fetchRegisteredTrips,
    }),
    shallow
  );

  // PERFORMANCE FIX: Fetch trips with pagination.
  const fetchTrips = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      // Assumes your service returns a paginated response like { trips: [...], page: 1, totalPages: 5 }
      const data = await TripService.getAllTrips({ page: pageNum, limit: 6 });
      setTrips((prev) => (pageNum === 1 ? data.trips : [...prev, ...data.trips]));
      setHasMore(data.page < data.totalPages);
    } catch (err) {
      setError(err.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array is correct here as the function is self-contained.

  useEffect(() => {
    // This effect is now safe and will only run when the component mounts,
    // or if the function references from the store *actually* change (they won't).
    fetchTrips(1);
    fetchRegisteredTrips();
  }, [fetchTrips, fetchRegisteredTrips]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTrips(nextPage);
  };

  const handleToggleRegister = async (tripId) => {
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

  const heroStyle = useMemo(
    () => ({
      backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url(${HERO_IMAGE_URL})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }),
    []
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <header className="h-96 text-white flex items-center justify-center" style={heroStyle}>
        <h1 className="text-5xl font-bold tracking-wider">Discover Our Trips</h1>
      </header>

      <main className="p-6 md:p-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Available Trips</h2>
        {loading && trips.length === 0 ? (
          <div className="flex justify-center mt-10">
            <FaSpinner className="animate-spin text-teal-700 text-5xl" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center flex flex-col items-center">
            <FaExclamationTriangle className="text-4xl mb-2" /> {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map((trip) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  isRegistered={savedTrips.some((savedTrip) => savedTrip._id === trip._id)}
                  isLoading={registerLoadingIds.includes(trip._id)}
                  onToggleRegister={handleToggleRegister}
                />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-teal-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-800 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default TripsPage;