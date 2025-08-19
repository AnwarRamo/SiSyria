import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import TicketService from '../../api/services/ticket.service';

const TicketsReview = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Reserved');
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const resp = await TicketService.listTickets(statusFilter ? { status: statusFilter } : {});
      setTickets(resp.data || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const updateStatus = async (tripId, ticketNumber, nextStatus) => {
    try {
      setProcessing(ticketNumber);
      await TicketService.updateTicketStatus(tripId, ticketNumber, { status: nextStatus });
      toast.success(`Ticket ${nextStatus}`);
      fetchTickets();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setProcessing(null);
    }
  };

  const filtered = tickets.filter(item => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      item.tripTitle?.toLowerCase().includes(q) ||
      item.ticket?.ticketNumber?.toLowerCase().includes(q) ||
      item.ticket?.passengerName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tickets Review</h1>
        <div className="flex items-center space-x-2">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded px-2 py-1">
            <option value="">All</option>
            <option value="Reserved">Reserved</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <div className="relative">
            <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" className="border rounded pl-8 pr-2 py-1" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(({ tripId, tripTitle, destination, startDate, ticket }) => (
            <div key={ticket.ticketNumber} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{tripTitle}</div>
                <div className="text-sm text-gray-600">{destination} • {new Date(startDate).toLocaleDateString()}</div>
                <div className="text-sm">#{ticket.ticketNumber} • {ticket.passengerName} • Seat {ticket.seatNumber} • {ticket.seatClass}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm mr-2">{ticket.status}</span>
                <button disabled={processing === ticket.ticketNumber} onClick={() => updateStatus(tripId, ticket.ticketNumber, 'Confirmed')} className="px-3 py-1 bg-green-600 text-white rounded flex items-center">
                  <FaCheck className="mr-1" /> Confirm
                </button>
                <button disabled={processing === ticket.ticketNumber} onClick={() => updateStatus(tripId, ticket.ticketNumber, 'Cancelled')} className="px-3 py-1 bg-red-600 text-white rounded flex items-center">
                  <FaTimes className="mr-1" /> Cancel
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="p-8 text-center text-gray-500">No tickets found</div>}
        </div>
      )}
    </div>
  );
};

export default TicketsReview;
