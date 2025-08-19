import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../layout/Navbar';
import { TripService } from '../../api/services/trip.service';

const SelectTripToBook = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await TripService.getPublicTrips();
        // TripService.getPublicTrips returns response.data; handle both shapes
        const list = Array.isArray(res?.data) ? res.data : res?.trips || res || [];
        setTrips(list);
      } catch (e) {
        setError('Failed to load trips');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 pt-24">
        <h1 className="text-3xl font-bold mb-6">Select a Trip to Book a Ticket</h1>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map(t => (
              <div key={t._id} className="border rounded-lg p-4 bg-white shadow">
                <div className="font-semibold text-lg">{t.title}</div>
                <div className="text-sm text-gray-600">{t.destination}</div>
                <div className="text-sm text-gray-600">{t.airline} • {t.flightNumber}</div>
                <button
                  onClick={() => navigate(`/book-ticket/${t._id}`)}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Book Ticket
                </button>
              </div>
            ))}
            {trips.length === 0 && <div className="text-gray-600">No trips available.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectTripToBook;
