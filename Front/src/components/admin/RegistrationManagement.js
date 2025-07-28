import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaIdCard, FaUsers, FaCalendar, FaPhone } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { TripService } from '../../api/services/trip.service';

const RegistrationCard = ({ registration, onStatusUpdate, onViewDetails }) => {
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onStatusUpdate(registration.registrationId, 'approved', '', adminNote);
      toast.success('Registration approved successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to approve registration');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setIsProcessing(true);
    try {
      await onStatusUpdate(registration.registrationId, 'rejected', rejectionReason, adminNote);
      toast.success('Registration rejected successfully');
      setShowRejectionForm(false);
      setRejectionReason('');
    } catch (error) {
      toast.error(error.message || 'Failed to reject registration');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{registration.trip.title}</h3>
            <p className="text-sm text-gray-600">{registration.trip.destination}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUserInfo(!showUserInfo)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showUserInfo ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
            <button
              onClick={() => onViewDetails(registration.trip._id)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaEye size={16} />
            </button>
          </div>
        </div>

        {/* User Information */}
        <AnimatePresence>
          {showUserInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-gray-50 rounded-lg"
            >
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <FaUser className="w-4 h-4 mr-2" />
                User Information
              </h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                 <div className="flex items-center">
                   <FaUser className="w-4 h-4 mr-2 text-gray-500" />
                   <span className="font-medium">Name:</span>
                   <span className="ml-2">{registration.user.name}</span>
                 </div>
                 <div className="flex items-center">
                   <FaEnvelope className="w-4 h-4 mr-2 text-gray-500" />
                   <span className="font-medium">Email:</span>
                   <span className="ml-2">{registration.user.email}</span>
                 </div>
                 <div className="flex items-center">
                   <FaPhone className="w-4 h-4 mr-2 text-gray-500" />
                   <span className="font-medium">Phone:</span>
                   <span className="ml-2">{registration.userInfo.phone}</span>
                 </div>
                 <div className="flex items-center">
                   <FaIdCard className="w-4 h-4 mr-2 text-gray-500" />
                   <span className="font-medium">National ID:</span>
                   <span className="ml-2">{registration.userInfo.nationalId}</span>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Registration Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FaUsers className="w-4 h-4 mr-2" />
            <span className="font-medium">Guests:</span>
            <span className="ml-2">{registration.numGuests}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaCalendar className="w-4 h-4 mr-2" />
            <span className="font-medium">Registered:</span>
            <span className="ml-2">{formatDate(registration.registeredAt)}</span>
          </div>
        </div>

        {/* Notes */}
        {registration.notes && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-1">User Notes</h4>
            <p className="text-sm text-blue-800">{registration.notes}</p>
          </div>
        )}

        {/* Admin Note Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Note (optional)
          </label>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Add a note for the user..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows="2"
          />
        </div>

        {/* Rejection Form */}
        <AnimatePresence>
          {showRejectionForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <h4 className="font-medium text-red-900 mb-2">Rejection Reason</h4>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                rows="3"
                required
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleApprove}
            disabled={isProcessing}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <FaCheck className="w-4 h-4 mr-2" />
                Approve
              </>
            )}
          </button>
          
          {!showRejectionForm ? (
            <button
              onClick={() => setShowRejectionForm(true)}
              disabled={isProcessing}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <FaTimes className="w-4 h-4 mr-2" />
              Reject
            </button>
          ) : (
            <div className="flex gap-2 flex-1">
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaTimes className="w-4 h-4 mr-2" />
                    Confirm Reject
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowRejectionForm(false);
                  setRejectionReason('');
                }}
                disabled={isProcessing}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await TripService.getPendingRegistrations();
      setRegistrations(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load registrations');
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (registrationId, status, rejectionReason, adminNote) => {
    try {
      await TripService.updateRegistrationStatus(registrationId, status, rejectionReason, adminNote);
      // Remove the registration from the list after status update
      setRegistrations(prev => prev.filter(reg => reg.registrationId !== registrationId));
    } catch (error) {
      throw error;
    }
  };

  const handleViewDetails = (tripId) => {
    // Navigate to trip details page
    window.open(`/trips/${tripId}`, '_blank');
  };

  const filteredRegistrations = registrations.filter(registration => {
    if (filter === 'all') return true;
    return registration.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trip Registration Management</h2>
          <p className="text-gray-600">Review and manage trip registration requests</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
          </select>
          <button
            onClick={fetchRegistrations}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-2xl font-bold text-gray-900">{registrations.length}</div>
          <div className="text-sm text-gray-600">Total Pending</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 shadow-sm border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-800">
            {registrations.filter(r => r.status === 'pending').length}
          </div>
          <div className="text-sm text-yellow-700">Pending Review</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-200">
          <div className="text-2xl font-bold text-blue-800">
            {registrations.filter(r => r.status === 'approved').length}
          </div>
          <div className="text-sm text-blue-700">Recently Approved</div>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={fetchRegistrations}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-xl mb-4">
            {filter === 'all' 
              ? "No registrations found."
              : `No ${filter} registrations found.`
            }
          </div>
          <p className="text-gray-400">All caught up! No pending registrations to review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredRegistrations.map(registration => (
              <RegistrationCard
                key={registration.registrationId}
                registration={registration}
                onStatusUpdate={handleStatusUpdate}
                onViewDetails={handleViewDetails}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default RegistrationManagement; 