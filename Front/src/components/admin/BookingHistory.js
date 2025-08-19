import React, { useEffect, useState } from 'react';
import { AdminService } from '../../api/services/admin.service';
import LoadingSpinner from '../../components/LodingSpinner';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBookings = async () => {
      try {
        const [tripRes, eventRes] = await Promise.all([
          AdminService.getAllBookings(controller.signal),
          AdminService.getEventRequests(),
        ]);

        const tripRows = (tripRes?.trips || []).map((t) => ({
          kind: 'trip',
          id: t.bookingId || t._id,
          date: t.date || t.createdAt,
          title: t.trip?.title,
          destination: t.trip?.destination,
          user: t.user,
          status: t.status || 'pending',
        }));

        const eventRows = (eventRes?.items || []).map((e) => ({
          kind: 'event',
          id: e._id,
          date: e.createdAt || e.eventDate,
          title: (e.eventType || 'event') + (e.venue ? ` @ ${e.venue}` : ''),
          destination: e.description,
          user: e.createdBy || { email: e.email, username: e.fullName },
          status: e.status || 'pending',
        }));

        const combined = [...tripRows, ...eventRows].sort((a, b) => new Date(b.date) - new Date(a.date));
        setBookings(combined);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message || 'Failed to load booking history');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    return () => controller.abort();
  }, []);
  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Booking History</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 border">ID</th>
              <th className="px-6 py-3 border">Type</th>
              <th className="px-6 py-3 border">Date</th>
              <th className="px-6 py-3 border">Title / Destination</th>
              <th className="px-6 py-3 border">User</th>
              <th className="px-6 py-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={`${booking.kind}-${booking.id}`} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 border font-mono text-sm">
                    {booking.id}
                  </td>
                  <td className="px-6 py-4 border capitalize">
                    {booking.kind}
                  </td>
                  <td className="px-6 py-4 border">
                    {booking.date
                      ? new Date(booking.date).toLocaleDateString()
                      : booking.bookingDate
                      ? new Date(booking.bookingDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 border">
                    {booking.kind === 'trip'
                      ? `${booking.title || '—'}${booking.destination ? ` — ${booking.destination}` : ''}`
                      : `${booking.title || '—'}`}
                  </td>
                  <td className="px-6 py-4 border">
                    {booking.user?.email || booking.user?.username || booking.user?.displayName || '—'}
                  </td>
                  <td className="px-6 py-4 border">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        booking.status === 'approved' || booking.status === 'Confirmed'
                          ? 'bg-green-100 text-green-700'
                          : booking.status === 'rejected' || booking.status === 'Cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {booking.status || 'pending'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingHistory;