import React, { useEffect, useState } from 'react';
import { AdminService } from '../../api/services/admin.service';
import apiClient from '../../api/config/axiosConfig';
import { toast } from 'react-toastify';

const OrganizedEvents = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', services: '', startingPrice: '', image: '' });

  const fetchEvents = async () => {
    try {
      const data = await AdminService.listOrganizedEvents();
      setEvents(data.events || []);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('date', form.date);
      formData.append('location', form.location);
      formData.append('startingPrice', form.startingPrice);
      if (form.services) {
        const arr = form.services.split(',').map(s => s.trim()).filter(Boolean);
        arr.forEach(s => formData.append('services', s));
      }
      if (document.getElementById('image')?.files?.[0]) {
        formData.append('image', document.getElementById('image').files[0]);
      }
      await apiClient.post('/api/events/organized', formData, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });
      toast.success('Organized event created');
      setForm({ title: '', description: '', date: '', location: '', services: '', startingPrice: '', image: '' });
      fetchEvents();
    } catch (err) {
      toast.error(err.message || 'Creation failed');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl border p-4">
        <h1 className="text-2xl font-bold mb-4">Create Organized Event</h1>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCreate}>
          <input className="border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
          <input className="border rounded px-3 py-2" placeholder="Date (YYYY-MM-DD)" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} required />
          <input className="border rounded px-3 py-2" placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Starting Price" value={form.startingPrice} onChange={e=>setForm({...form, startingPrice:e.target.value})} />
          <input id="image" type="file" accept="image/*" className="border rounded px-3 py-2 md:col-span-2" />
          <textarea className="border rounded px-3 py-2 md:col-span-2" rows="3" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
          <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Services (comma separated)" value={form.services} onChange={e=>setForm({...form, services:e.target.value})} />
          <div className="md:col-span-2">
            <button type="submit" className="px-4 py-2 rounded bg-emerald-600 text-white">Create</button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map(ev => (
          <div key={ev._id} className="bg-white rounded-xl border p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">{ev.title}</div>
              <div className="text-sm text-gray-600">{new Date(ev.date).toLocaleDateString()}</div>
            </div>
            <div className="text-sm text-gray-700">{ev.location}</div>
            {ev.services?.length > 0 && <div className="text-sm text-gray-600 mt-1">Services: {ev.services.join(', ')}</div>}
            {ev.startingPrice ? <div className="text-sm text-gray-600 mt-1">Starting: ${ev.startingPrice}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizedEvents;


