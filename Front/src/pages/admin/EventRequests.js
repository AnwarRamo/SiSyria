import React, { useEffect, useState } from 'react';
import { AdminService } from '../../api/services/admin.service';
import { toast } from 'react-toastify';

const EventRequests = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getEventRequests();
      setItems(data.items || []);
    } catch (e) {
      setError(e.message || 'Failed to load event requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await AdminService.updateEventRequest(id, { status });
      toast.success(`Request ${status}`);
      setItems(prev => prev.map(it => it._id === id ? { ...it, status } : it));
    } catch (e) {
      toast.error(e.message || 'Update failed');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Event Requests</h1>
        <button onClick={fetchItems} className="px-4 py-2 rounded bg-blue-600 text-white">Refresh</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map(r => (
          <div key={r._id} className="bg-white rounded-xl border p-4 shadow">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{(r.eventType || '').toUpperCase()} — {new Date(r.eventDate).toLocaleDateString()}</div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{r.status}</span>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <div>Full Name: {r.fullName}</div>
              <div>Email: {r.email}</div>
              {r.phone && <div>Phone: {r.phone}</div>}
              {r.venue && <div>Venue: {r.venue}</div>}
              <div>Guests: {r.guestCount || 1}</div>
            </div>
            {r.createdBy && r.createdBy.email && (
              <div className="mt-2 text-sm text-gray-600">
                <div className="font-medium">User</div>
                <div>Name: {r.createdBy.displayName || r.createdBy.username}</div>
                <div>Email: {r.createdBy.email}</div>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <button onClick={() => updateStatus(r._id, 'approved')} className="px-3 py-2 rounded bg-emerald-600 text-white">Approve</button>
              <button onClick={() => updateStatus(r._id, 'rejected')} className="px-3 py-2 rounded bg-red-600 text-white">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventRequests;



