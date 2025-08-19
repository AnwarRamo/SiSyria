import React, { useState, useEffect } from 'react';
import { FaPlane, FaTicketAlt, FaCalendar, FaMapMarkerAlt, FaUser, FaIdCard, FaTimes, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TicketService from '../../api/services/ticket.service';

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      const response = await TicketService.getUserTickets();
      setTickets(response.data);
    } catch (error) {
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (tripId, ticketNumber) => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) {
      return;
    }

    try {
      await TicketService.cancelTicket(tripId, ticketNumber);
      toast.success('Ticket cancelled successfully');
      fetchUserTickets(); // Refresh the list
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Reserved':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Boarded':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Reserved':
        return <FaClock className="text-yellow-600" />;
      case 'Confirmed':
        return <FaCheckCircle className="text-blue-600" />;
      case 'Boarded':
        return <FaPlane className="text-green-600" />;
      case 'Completed':
        return <FaCheckCircle className="text-gray-600" />;
      case 'Cancelled':
        return <FaTimes className="text-red-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if ((tickets || []).length === 0) {
    return (
      <div className="text-center py-12">
        <FaTicketAlt className="mx-auto text-6xl text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Tickets Found</h3>
        <p className="text-gray-500">You haven't booked any tickets yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <FaTicketAlt className="mr-3 text-blue-600" />
          My Tickets
        </h2>
        
        <div className="grid gap-6">
          {(tickets || []).map((tripTickets) => (
            <div key={tripTickets.tripId} className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{tripTickets.tripTitle}</h3>
                  <p className="text-gray-600 flex items-center mt-1">
                    <FaMapMarkerAlt className="mr-2" />
                    {tripTickets.destination}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <FaCalendar className="inline mr-2" />
                    {tripTickets.startDate ? new Date(tripTickets.startDate).toLocaleDateString() : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{(tripTickets.tickets || []).length} ticket(s)</p>
                </div>
              </div>

              <div className="space-y-4">
                {(tripTickets.tickets || []).map((ticket) => (
                  <motion.div
                    key={ticket.ticketNumber}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">Ticket #{ticket.ticketNumber}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)} flex items-center`}>
                            {getStatusIcon(ticket.status)}
                            <span className="ml-1">{ticket.status}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">
                              <FaUser className="inline mr-2" />
                              <span className="font-medium">Passenger:</span> {ticket.passengerName}
                            </p>
                            <p className="text-gray-600">
                              <FaIdCard className="inline mr-2" />
                              <span className="font-medium">ID:</span> {ticket.passengerId}
                            </p>
                            <p className="text-gray-600">
                              <FaPlane className="inline mr-2" />
                              <span className="font-medium">Seat:</span> {ticket.seatNumber} ({ticket.seatClass})
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">
                              <FaPlane className="inline mr-2" />
                              <span className="font-medium">Flight:</span> {ticket.flightNumber}
                            </p>
                            <p className="text-gray-600">
                              <FaMapMarkerAlt className="inline mr-2" />
                              <span className="font-medium">Route:</span> {ticket.departureAirport} → {ticket.arrivalAirport}
                            </p>
                            <p className="text-gray-600">
                              <FaCalendar className="inline mr-2" />
                              <span className="font-medium">Departure:</span> {new Date(ticket.departureTime).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {ticket.notes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">Notes:</span> {ticket.notes}
                            </p>
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-lg font-bold text-blue-600">
                            ${ticket.price}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setShowTicketDetails(true);
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              View Details
                            </button>
                            {ticket.status === 'Reserved' && (
                              <button
                                onClick={() => handleCancelTicket(tripTickets.tripId, ticket.ticketNumber)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                Cancel Ticket
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Details Modal */}
      {showTicketDetails && selectedTicket && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Ticket Details</h2>
                <button
                  onClick={() => setShowTicketDetails(false)}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Passenger Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <p className="text-gray-800">{selectedTicket.passengerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">ID Number</label>
                      <p className="text-gray-800">{selectedTicket.passengerId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Seat</label>
                      <p className="text-gray-800">{selectedTicket.seatNumber} ({selectedTicket.seatClass})</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Flight Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Flight Number</label>
                      <p className="text-gray-800">{selectedTicket.flightNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Airline</label>
                      <p className="text-gray-800">{selectedTicket.airline}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Route</label>
                      <p className="text-gray-800">{selectedTicket.departureAirport} → {selectedTicket.arrivalAirport}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Departure Time</label>
                      <p className="text-gray-800">{new Date(selectedTicket.departureTime).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Arrival Time</label>
                      <p className="text-gray-800">{new Date(selectedTicket.arrivalTime).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Ticket Status</p>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTicket.status)}`}>
                      {getStatusIcon(selectedTicket.status)}
                      <span className="ml-1">{selectedTicket.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Price</p>
                    <p className="text-2xl font-bold text-blue-600">${selectedTicket.price}</p>
                  </div>
                </div>
              </div>

              {selectedTicket.notes && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Additional Notes</h4>
                  <p className="text-blue-700">{selectedTicket.notes}</p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowTicketDetails(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TicketManagement; 