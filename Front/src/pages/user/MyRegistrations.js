import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaExclamationTriangle, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { TripService } from '../../api/services/trip.service';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import CountdownTimer from '../../components/user/CountdownTimer';
import { EventService } from '../../api/services/event.service';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      icon: FaHourglassHalf,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      text: 'Pending'
    },
    approved: {
      icon: FaCheckCircle,
      color: 'bg-green-100 text-green-800 border-green-200',
      text: 'Approved'
    },
    rejected: {
      icon: FaTimesCircle,
      color: 'bg-red-100 text-red-800 border-red-200',
      text: 'Rejected'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
      <Icon className="w-4 h-4 mr-2" />
      {config.text}
    </span>
  );
};

const TripCard = ({ booking, onCancel, onViewDetails }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const trip = booking.tripId || {};
  const isApproved = booking.status === 'approved';
  const isRejected = booking.status === 'rejected';
  const isPending = booking.status === 'pending';

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) {
      return;
    }

    setIsCancelling(true);
    try {
      await onCancel(booking._id);
      toast.success('Registration cancelled successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel registration');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
              {/* Trip Image */}
        <div className="relative h-48 overflow-hidden">
          {trip.images && trip.images.length > 0 ? (
            <img
              src={trip.images[0]}
              alt={trip.title || 'Trip'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">No Image</span>
            </div>
          )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <StatusBadge status={booking.status} />
        </div>

        {/* Countdown Timer for Approved Trips */}
        {isApproved && trip.startDate && trip.endDate && (
          <div className="absolute bottom-4 left-4 right-4">
            <CountdownTimer startDate={trip.startDate} endDate={trip.endDate} />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{trip.title || 'Trip Title Not Available'}</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showDetails ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="w-4 h-4 mr-2" />
            <span>{trip.destination || 'Destination not available'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaCalendarAlt className="w-4 h-4 mr-2" />
            <span>
              {trip.startDate ? formatDate(trip.startDate) : 'Start date not available'} - 
              {trip.endDate ? formatDate(trip.endDate) : 'End date not available'}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaUsers className="w-4 h-4 mr-2" />
            <span>{booking.numGuests || 1} guest{(booking.numGuests || 1) > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaClock className="w-4 h-4 mr-2" />
            <span>Registered on {booking.registeredAt ? formatDate(booking.registeredAt) : 'Date not available'}</span>
          </div>
        </div>

        {/* Rejection Reason */}
        {isRejected && booking.rejectionReason && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <FaExclamationTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Rejection Reason</h4>
                <p className="text-red-700 text-sm">{booking.rejectionReason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Admin Note */}
        {booking.adminNote && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-1">Admin Note</h4>
            <p className="text-blue-700 text-sm">{booking.adminNote}</p>
          </div>
        )}

        {/* Trip Details (Expandable) */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Trip Details</h4>
                <p className="text-gray-600 text-sm mb-4">{trip.description || 'No description available'}</p>
                
                {trip.dayPlans && trip.dayPlans.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Day-by-Day Schedule</h5>
                    <div className="space-y-2">
                      {trip.dayPlans.slice(0, 3).map((day, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          <span className="font-medium">Day {index + 1}:</span> {day.details}
                        </div>
                      ))}
                      {trip.dayPlans.length > 3 && (
                        <div className="text-sm text-gray-500 italic">
                          +{trip.dayPlans.length - 3} more days...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onViewDetails(trip._id)}
            disabled={!trip._id}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {trip._id ? 'View Full Details' : 'Details Not Available'}
          </button>
          
          {isPending && (
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isCancelling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cancelling...
                </>
              ) : (
                <>
                  <FaTrash className="w-4 h-4 mr-2" />
                  Cancel
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const MyRegistrations = () => {
  const [bookings, setBookings] = useState([]);
  const [eventRequests, setEventRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await TripService.getUserBookings();
      setBookings(data);
      try { const ev = await EventService.myBookings(); setEventRequests(ev); } catch {}
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load registrations');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (registrationId) => {
    await TripService.cancelTripRegistration(registrationId);
    setBookings(prev => prev.filter(booking => booking._id !== registrationId));
  };

  const handleViewDetails = (tripId) => {
    navigate(`/trips/${tripId}`);
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusCounts = () => {
    return bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Trip Registrations</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Track all your trip registrations, view their status, and manage your upcoming adventures.
            </p>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
              <div className="text-sm text-gray-600">Total Registrations</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 shadow-sm border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-800">{statusCounts.pending || 0}</div>
              <div className="text-sm text-yellow-700">Pending</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 shadow-sm border border-green-200">
              <div className="text-2xl font-bold text-green-800">{statusCounts.approved || 0}</div>
              <div className="text-sm text-green-700">Approved</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 shadow-sm border border-red-200">
              <div className="text-2xl font-bold text-red-800">{statusCounts.rejected || 0}</div>
              <div className="text-sm text-red-700">Rejected</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { key: 'all', label: 'All', count: bookings.length },
              { key: 'pending', label: 'Pending', count: statusCounts.pending || 0 },
              { key: 'approved', label: 'Approved', count: statusCounts.approved || 0 },
              { key: 'rejected', label: 'Rejected', count: statusCounts.rejected || 0 }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          {/* Content */}
          {error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-xl mb-4">{error}</div>
              <button
                onClick={fetchBookings}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-xl mb-4">
                {filter === 'all' 
                  ? "You haven't registered for any trips yet."
                  : `No ${filter} registrations found.`
                }
              </div>
              {filter === 'all' && (
                <button
                  onClick={() => navigate('/travel')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Trips
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredBookings.map(booking => (
                  <TripCard
                    key={booking._id}
                    booking={booking}
                    onCancel={handleCancel}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Event Requests */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Event Requests</h2>
            {eventRequests.length === 0 ? (
              <div className="text-gray-500">No event requests yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventRequests.map(r => (
                  <div key={r._id} className="bg-white rounded-2xl shadow border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{r.eventType?.toUpperCase()}</div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{r.status}</span>
                    </div>
                    <div className="text-sm text-gray-600">Date: {new Date(r.eventDate).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-600">Guests: {r.guestCount || 1}</div>
                    {r.venue && <div className="text-sm text-gray-600">Venue: {r.venue}</div>}
                    {r.description && <div className="text-sm text-gray-600 mt-2 line-clamp-2">{r.description}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MyRegistrations; 