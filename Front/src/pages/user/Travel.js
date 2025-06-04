import React, { useState, useEffect, useMemo } from 'react';
import { FaMapMarkerAlt, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { TripService } from '../../api/services/trip.service';
import HERO_IMAGE_URL from '../../assets/images/anwar3.jpeg';
import Navbar from "../../layout/Navbar"
const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registeredTrips, setRegisteredTrips] = useState([]);
  const [registerLoadingIds, setRegisterLoadingIds] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await TripService.getAllTrips();
        setTrips(data);
      } catch (err) {
        setError(err.message || 'Failed to load trips');
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const heroStyle = useMemo(() => ({
    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url(${HERO_IMAGE_URL})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }), []);

  const toggleRegisterTrip = async (tripId) => {
    setRegisterLoadingIds(prev => [...prev, tripId]);
    try {
      const isRegistered = registeredTrips.includes(tripId);
      await TripService.registerTrip(tripId);
      setRegisteredTrips(prev =>
        isRegistered ? prev.filter(id => id !== tripId) : [...prev, tripId]
      );
    } catch (err) {
      alert(err.message || 'Failed to register trip');
    } finally {
      setRegisterLoadingIds(prev => prev.filter(id => id !== tripId));
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar/>
      <header className="h-96 text-white flex items-center justify-center" style={heroStyle}>
        <h1 className="text-5xl font-bold">Discover Syria</h1>
      </header>

      <main className="p-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Available Trips</h2>
        {loading ? (
          <div className="flex justify-center"><FaSpinner className="animate-spin text-4xl" /></div>
        ) : error ? (
          <div className="text-red-500 flex justify-center items-center">
            <FaExclamationTriangle className="mr-2" /> {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {trips.map((trip) => {
              const isRegistered = registeredTrips.includes(trip._id);
              const isLoading = registerLoadingIds.includes(trip._id);

              return (
                <div key={trip._id} className="bg-white p-4 rounded shadow">
                  <img src={trip.images[0]} alt={trip.title} className="w-full h-40 object-cover rounded" />
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">{trip.title}</h3>
                    <p className="text-gray-600 text-sm mb-2"><FaMapMarkerAlt className="inline mr-1" /> {trip.destination}</p>
                    <p className="text-sm text-gray-700 mb-2">{trip.description}</p>
                    <button
                      disabled={isLoading}
                      onClick={() => toggleRegisterTrip(trip._id)}
                      className={`w-full py-2 rounded text-white ${isRegistered ? 'bg-yellow-600' : 'bg-teal-700'} hover:opacity-90`}
                    >
                      {isLoading ? 'Loading...' : isRegistered ? 'Registered' : 'Register'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default TripsPage;
