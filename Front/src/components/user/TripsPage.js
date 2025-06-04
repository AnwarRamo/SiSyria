// src/pages/user/Travel.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../layout/Navbar"; // Corrected path
import Footer from "../../layout/Footer";   // Corrected path
import { TripService } from "../../api/services/trip.service"; // Corrected path
import hero from "../../assets/images/hero.jpg"; // Corrected path
import { useAuthStore } from "../../api/stores/auth.store"; // Corrected path
import LoadingSpinner from "../../components/LoadingSpinner"; // FIX: Corrected LodingSpinner -> LoadingSpinner
import TripCard from "../../components/user/TripCard"; // Corrected path
import { motion } from "framer-motion";
import { toast } from 'react-toastify';
import { FiBookmark } from "react-icons/fi"; // Icon for empty state

export const TripsPage = () => { // Keep export as TripsPage if that's how you use it elsewhere
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleTrips, setVisibleTrips] = useState(9);
  const TRIPS_PER_PAGE = 9;

  const { user, addTripToProfile, removeTripFromProfile } = useAuthStore(
    (state) => ({
      user: state.user,
      // Access savedTrips directly from the user object for consistency
      savedTrips: state.user?.savedTrips || [], 
      addTripToProfile: state.addTripToProfile,
      removeTripFromProfile: state.removeTripFromProfile,
    })
  );
  // Get savedTrips from the user object, which should be the source of truth
  const savedTrips = useAuthStore(state => state.user?.savedTrips || []);


  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await TripService.getAllTrips();
        console.log(`[Travel.js] Fetched ${response?.length || 0} trips from service.`);
        setTrips(response || []);
      } catch (err) {
        const errorMessage = err.message || "Failed to load trips";
        setError(errorMessage);
        console.error("[Travel.js] Failed to load trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleToggleTripInProfile = useCallback(async (trip) => {
    if (!user) {
      toast.info("Please login to save trips to your profile.");
      navigate("/login");
      return;
    }
    const tripId = trip.id || trip._id;
    const isCurrentlySaved = savedTrips.some((savedTrip) => (savedTrip.id || savedTrip._id) === tripId);

    try {
        if (isCurrentlySaved) {
            if (removeTripFromProfile) {
                await removeTripFromProfile(tripId); // Assuming this might be async if it calls an API via the store
                toast.warn(`${trip.title} removed from your profile.`);
            } else {
                toast.error("Could not remove trip: function unavailable.");
            }
        } else {
            if (addTripToProfile) {
                await addTripToProfile(trip); // Assuming this might be async
                toast.success(`${trip.title} added to your profile!`);
            } else {
                toast.error("Could not add trip: function unavailable.");
            }
        }
    } catch (e) {
        console.error("Error toggling trip in profile:", e);
        toast.error("An error occurred. Please try again.");
    }
  }, [user, savedTrips, addTripToProfile, removeTripFromProfile, navigate]);

  const handleLearnMore = (tripId) => {
    navigate(`/trips/${tripId}`);
  };

  const loadMoreTrips = () => {
    setVisibleTrips((prev) => prev + TRIPS_PER_PAGE);
  };

  const displayedTrips = trips.slice(0, visibleTrips);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 font-poppins transition-colors duration-300">
      <NavBar />

      <div
        className="relative h-[55vh] md:h-[70vh] flex items-center justify-center text-center overflow-hidden mt-16"
        style={{
          backgroundImage: `url(${hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.div
          className="z-10 p-4 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-xl mb-5">
            Your Adventure Awaits
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 mb-8 drop-shadow-md">
            Explore breathtaking destinations in Syria, curated for unforgettable experiences.
          </p>
          <motion.button
            onClick={() => document.getElementById('available-trips-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3.5 px-12 rounded-lg shadow-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            View Our Trips
          </motion.button>
        </motion.div>
      </div>

      <div id="available-trips-section" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
            Explore Available Adventures
          </h2>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Choose from a wide range of curated trips, each offering a unique glimpse into the heart of Syria.
          </p>
        </motion.div>

        {loading && <LoadingSpinner fullScreen={trips.length === 0} message="Fetching incredible journeys..." />}

        {error && !loading && (
          <div className="text-center py-10 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-xl font-semibold">Oops! Something went wrong.</p>
            <p className="text-slate-700 dark:text-slate-300 mt-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && trips.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
            <FiBookmark className="mx-auto text-6xl text-slate-300 dark:text-slate-600 mb-5" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">No Adventures Found</h3>
            <p className="text-slate-500 dark:text-slate-400">
              It seems there are no trips available right now. Please check back later!
            </p>
          </div>
        )}

        {!loading && !error && trips.length > 0 && (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {displayedTrips.map((trip) => {
                const tripId = trip.id || trip._id;
                const isSaved = savedTrips.some((savedTrip) => (savedTrip.id || savedTrip._id) === tripId);
                return (
                  <TripCard
                    key={tripId}
                    trip={trip}
                    onAddToProfile={handleToggleTripInProfile} // Renamed from onToggleTripInProfile for clarity
                    isSaved={isSaved}
                    onLearnMore={() => handleLearnMore(tripId)}
                  />
                );
              })}
            </motion.div>
            {visibleTrips < trips.length && (
              <div className="text-center mt-12">
                <motion.button
                  onClick={loadMoreTrips}
                  className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 1 }}
                >
                  Load More Trips
                </motion.button>
              </div>
            )}
          </>
        )}
        <div className="text-center mt-10 text-sm text-slate-500 dark:text-slate-400">
          {trips.length > 0 && `Showing ${displayedTrips.length} of ${trips.length} trips.`}
          {/* Consider a more robust check for backend limits if necessary */}
          {trips.length > 0 && trips.length % TRIPS_PER_PAGE === 0 && displayedTrips.length === trips.length && (
             <p className="mt-1">
                Displaying a selection of our finest trips. Contact us for more options or specific inquiries.
             </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TripsPage; // Assuming this is the default export