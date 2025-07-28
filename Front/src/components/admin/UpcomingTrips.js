import React, { useEffect, useState } from 'react';
import { AdminService } from '../../api/services/admin.service';
import LoadingSpinner from '../../components/LodingSpinner';

function UpcomingTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    
    AdminService.getUpcomingTrips(controller.signal)
      .then(data => {
        // FIXED: Handle different response structures
        const tripsData = data?.trips || data || [];
        setTrips(Array.isArray(tripsData) ? tripsData : []);
      })
      .catch(error => {
        setError(error.message || 'Failed to load upcoming trips');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-purple-900">Upcoming Trips</h2>
        <a href="/admin/trips" className="text-purple-600 hover:underline">View All</a>
      </div>
      <ul className="space-y-4">
        {trips.length === 0 ? (
          <li className="text-gray-500">No upcoming trips found.</li>
        ) : (
          trips.map((trip) => {
            // FIXED: Use first image from images array
            const firstImage = trip.images?.[0] || '/images/default.jpg';
            
            return (
              <li key={trip._id} className="bg-gray-100 p-4 rounded-lg flex items-center shadow-sm">
                <img
                  src={firstImage}
                  alt={trip.title}
                  className="w-24 h-24 rounded-md object-cover mr-4"
                  onError={(e) => { e.target.src = '/images/default.jpg'; }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{trip.title}</h3>
                  <p className="text-gray-500 text-sm">
                    {trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }) : 'Date not available'}
                  </p>
                </div>
                <span className="text-gray-700 font-medium">
                  {trip.participants || 0} participants
                </span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default UpcomingTrips;