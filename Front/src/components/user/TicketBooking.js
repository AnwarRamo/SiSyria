import React, { useState, useEffect } from 'react';
import { FaPlane, FaUser, FaIdCard, FaCreditCard, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TicketService from '../../api/services/ticket.service';

const TicketBooking = ({ trip, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    passengerName: '',
    passengerId: '',
    seatClass: 'Economy',
    notes: ''
  });
  const [availableSeats, setAvailableSeats] = useState({});
  const [loading, setLoading] = useState(false);
  const [seatLoading, setSeatLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState('');

  useEffect(() => {
    if (trip?._id) {
      fetchAvailableSeats();
    }
  }, [trip]);

  const fetchAvailableSeats = async () => {
    try {
      setSeatLoading(true);
      const response = await TicketService.getAvailableSeats(trip._id);
      setAvailableSeats(response.data.availableSeats);
    } catch (error) {
      toast.error('Failed to fetch available seats');
    } finally {
      setSeatLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSeatSelection = (seatNumber) => {
    setSelectedSeat(seatNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSeat) {
      toast.error('Please select a seat');
      return;
    }

    if (!formData.passengerName || !formData.passengerId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const ticketData = {
        tripId: trip._id,
        seatClass: formData.seatClass,
        passengerName: formData.passengerName,
        passengerId: formData.passengerId,
        notes: formData.notes,
        seatNumber: selectedSeat
      };

      const response = await TicketService.bookTicket(ticketData);
      toast.success('Ticket booked successfully!');
      onSuccess(response.data);
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!trip) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <FaPlane className="mr-2" />
                Book Your Ticket
              </h2>
              <p className="text-blue-100 mt-1">{trip.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <FaTimesCircle size={24} />
            </button>
          </div>
        </div>

        {/* Flight Information */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Flight Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaPlane className="text-blue-600 mr-2" />
                <span className="font-semibold">Departure</span>
              </div>
              <p className="text-gray-700">{trip.departureCity} ({trip.departureAirport})</p>
              <p className="text-sm text-gray-500">
                {new Date(trip.departureTime).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaPlane className="text-green-600 mr-2" />
                <span className="font-semibold">Arrival</span>
              </div>
              <p className="text-gray-700">{trip.arrivalCity} ({trip.arrivalAirport})</p>
              <p className="text-sm text-gray-500">
                {trip.returnTime ? new Date(trip.returnTime).toLocaleString() : 'TBA'}
              </p>
            </div>
          </div>
          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">
              <span className="font-semibold">Airline:</span> {trip.airline} | 
              <span className="font-semibold ml-2">Flight:</span> {trip.flightNumber}
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Passenger Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2 text-blue-600" />
                Passenger Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="passengerName"
                    value={formData.passengerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter passenger full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaIdCard className="mr-2" />
                    ID Number *
                  </label>
                  <input
                    type="text"
                    name="passengerId"
                    value={formData.passengerId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="National ID or Passport"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seat Class
                  </label>
                  <select
                    name="seatClass"
                    value={formData.seatClass}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First Class</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special requests or notes..."
                  />
                </div>
              </div>
            </div>

            {/* Seat Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaCheckCircle className="mr-2 text-green-600" />
                Select Your Seat
              </h3>

              {seatLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(availableSeats).map(([seatClass, seats]) => (
                    <div key={seatClass} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">{seatClass} Class</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {seats.slice(0, 12).map((seat) => (
                          <button
                            key={seat}
                            type="button"
                            onClick={() => handleSeatSelection(seat)}
                            className={`p-2 text-sm rounded border transition-all ${
                              selectedSeat === seat
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                            }`}
                          >
                            {seat}
                          </button>
                        ))}
                      </div>
                      {seats.length > 12 && (
                        <p className="text-sm text-gray-500 mt-2">
                          +{seats.length - 12} more seats available
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedSeat && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <FaCheckCircle className="text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">
                      Selected Seat: {selectedSeat}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Price Information */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-800">Ticket Price</p>
                <p className="text-sm text-gray-600">Includes all taxes and fees</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">${trip.ticketPrice || trip.price}</p>
                <p className="text-sm text-gray-500">per ticket</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedSeat}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                loading || !selectedSeat
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Booking...
                </div>
              ) : (
                'Book Ticket'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TicketBooking; 