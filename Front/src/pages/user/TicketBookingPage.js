import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../layout/Navbar';
import TicketBooking from '../../components/user/TicketBooking';
import apiClient from '../../api/config/axiosConfig';
import { useAuthStore } from '../../api/stores/auth.store';
import LoadingSpinner from '../../components/LodingSpinner';

const TicketBookingPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!tripId) {
      setError('No trip ID provided.');
      setLoading(false);
      return;
    }
    setLoading(true);
    apiClient.get(`/api/trips/${tripId}`)
      .then(res => {
        if (res.data && res.data.success) {
          setTrip(res.data.data);
        } else {
          setError('Trip not found.');
        }
      })
      .catch(() => setError('Failed to load trip details.'))
      .finally(() => setLoading(false));
  }, [tripId, isLoggedIn, navigate]);

  if (!isLoggedIn) return null;
  if (loading) return <LoadingSpinner fullScreen message="Loading trip..." />;
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Navbar />
      <div className="text-red-600 text-xl font-bold mt-10">{error}</div>
    </div>
  );
  if (!trip) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-8 text-blue-700">Book Plane Ticket</h1>
        {!success ? (
          <TicketBooking
            trip={trip}
            onClose={() => navigate(-1)}
            onSuccess={() => setSuccess(true)}
          />
        ) : (
          <div className="bg-green-100 border border-green-300 rounded-lg p-8 text-center mt-10">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Ticket Booked Successfully!</h2>
            <p className="text-green-800 mb-6">Your plane ticket for <span className="font-semibold">{trip.title}</span> has been booked.</p>
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={() => navigate('/profile')}
            >
              Go to My Tickets
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketBookingPage;