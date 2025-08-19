import React, { useEffect, useState } from 'react';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import { motion } from 'framer-motion';
import { FaImages, FaHotel, FaGlassCheers, FaUsers, FaCheckCircle } from 'react-icons/fa';
import { EventService } from '../../api/services/event.service';
import { useAuthStore } from '../../api/stores/auth.store';
import { toast } from 'react-toastify';

const Bullet = ({ children }) => (
  <div className="flex items-start text-sm text-gray-700"><span className="mt-1 mr-2 text-amber-700">•</span><span>{children}</span></div>
);

const EventCard = ({ title, image, services, price, onRequest }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3 }}
    className="relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
  >
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="absolute top-3 left-3 bg-black/50 text-white text-sm px-3 py-1 rounded-full">{title}</div>
    <div className="p-6">
      <p className="text-sm text-gray-600 mb-4">{title === 'Private Events' ? 'Intimate celebrations tailored to your personal style' : 'Professional events that make lasting impressions'}</p>
      <div className="text-sm font-semibold text-gray-800 mb-1">Services Include:</div>
      <div className="grid grid-cols-2 gap-y-2 mb-5">
        {services.map((s, i) => (<Bullet key={i}>{s}</Bullet>))}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase text-gray-500">Pricing</div>
          <div className="text-emerald-800 font-semibold">Starting from ${price.toLocaleString()}</div>
        </div>
        {onRequest && (
          <button onClick={onRequest} className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2 rounded-lg">
            <FaCheckCircle /> Request to Join
          </button>
        )}
      </div>
    </div>
  </motion.div>
);

const Events = () => {
  const [types, setTypes] = useState([]);
  const [organized, setOrganized] = useState([]);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', eventType: 'private', eventDate: '', guestCount: 1, venue: '', budgetRange: '', description: '' });
  const { user } = useAuthStore();

  useEffect(() => {
    EventService.getEventTypes().then(setTypes).catch(() => {});
    EventService.getOrganized().then(setOrganized).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    try {
      const payload = { ...form };
      if (payload.eventDate) {
        // Ensure a proper ISO date if user selected a plain date
        const d = new Date(payload.eventDate);
        if (!isNaN(d.getTime())) payload.eventDate = d.toISOString();
      }
      await EventService.bookEvent(payload);
      toast.success('Booking request submitted');
      setForm({ fullName: '', email: '', phone: '', eventType: 'private', eventDate: '', guestCount: 1, venue: '', budgetRange: '', description: '' });
      setIsRequestOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.code || 'Failed to submit booking');
    }
  };

  const openRequest = (preset = {}) => {
    setForm(prev => ({
      ...prev,
      fullName: user?.displayName || user?.username || prev.fullName,
      email: user?.email || prev.email,
      eventType: preset.eventType || prev.eventType,
      eventDate: preset.eventDate || prev.eventDate,
      description: preset.description || prev.description,
    }));
    setIsRequestOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-amber-50 text-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Create <span className="text-emerald-700">Unforgettable</span> Events
            </h1>
            <p className="mt-5 text-gray-700 max-w-xl">
              From intimate private gatherings to grand public celebrations, we manage every detail to make your event extraordinary.
            </p>
            <div className="mt-8 flex gap-4">
              {user ? (
                <button onClick={() => openRequest()} className="px-5 py-3 rounded-lg bg-emerald-700 text-white font-semibold shadow">Request Event</button>
              ) : null}
              <a href="#types" className="px-5 py-3 rounded-lg bg-white text-gray-900 font-semibold border shadow flex items-center gap-2"><FaImages /> Design Gallery</a>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
              <div className="flex items-center gap-3 rounded-xl bg-white/70 border p-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700"><FaHotel /></div>
                <div>
                  <div className="text-sm font-semibold">Private Events</div>
                  <div className="text-xs text-gray-600">Weddings, birthdays, anniversaries</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/70 border p-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700"><FaUsers /></div>
                <div>
                  <div className="text-sm font-semibold">Public Events</div>
                  <div className="text-xs text-gray-600">Conferences, galas, product launches</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="rounded-2xl overflow-hidden shadow-xl bg-white p-2">
              <div className="aspect-video rounded-xl bg-cover bg-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop)'}} />
            </div>
          </div>
        </section>

        <section id="types" className="mt-20 text-center">
          <h2 className="text-3xl font-extrabold">Choose Your <span className="text-emerald-700">Event Type</span></h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Whether an intimate gathering or a grand celebration, we have the expertise to make it perfect.</p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {(types.length ? types : [
              { key: 'private', title: 'Private Events', services: ["Wedding Ceremonies","Anniversary Celebrations","Birthday Parties","Family Reunions"], startingPrice: 2500, image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1600&auto=format&fit=crop' },
              { key: 'public', title: 'Public Events', services: ["Corporate Conferences","Product Launches","Charity Galas","Award Ceremonies"], startingPrice: 5000, image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop' },
            ]).map(t => (
              <EventCard
                key={t.key}
                title={t.title}
                image={t.image}
                services={t.services}
                price={t.startingPrice}
                onRequest={user ? () => openRequest({ eventType: t.key, description: `Interested in ${t.title}` }) : undefined}
              />
            ))}
          </div>
        </section>

        {organized?.length > 0 && (
          <section id="organized" className="mt-20">
            <h3 className="text-2xl font-extrabold text-center mb-6">Upcoming <span className="text-emerald-700">Organized Events</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {organized.map(ev => (
                <EventCard
                  key={ev._id}
                  title={ev.title}
                  image={ev.image}
                  services={ev.services || []}
                  price={ev.startingPrice || 0}
                  onRequest={user ? () => openRequest({ eventType: 'public', eventDate: ev.date, description: `Join request for organized event: ${ev.title}` }) : undefined}
                />
              ))}
            </div>
          </section>
        )}

        {/* Request Modal (only when logged in) */}
        {isRequestOpen && user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl border p-6 md:p-8 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-extrabold">Request an Event</h3>
                <button onClick={() => setIsRequestOpen(false)} className="text-gray-500 hover:text-gray-900">✕</button>
              </div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm text-gray-700">Full Name</label>
                  <input className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Enter your full name" value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} required />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Email</label>
                  <input type="email" className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="your.email@example.com" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Phone Number</label>
                  <input className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Event Type</label>
                  <select className="mt-1 w-full border rounded-lg px-3 py-2" value={form.eventType} onChange={e=>setForm({...form, eventType:e.target.value})}>
                    <option value="private">Private Event</option>
                    <option value="public">Public Event</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-700">Event Date</label>
                  <input type="date" className="mt-1 w-full border rounded-lg px-3 py-2" value={form.eventDate} onChange={e=>setForm({...form, eventDate:e.target.value})} required />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Guest Count</label>
                  <input type="number" className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Expected number of guests" value={form.guestCount} onChange={e=>setForm({...form, guestCount:e.target.value})} />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Preferred Venue</label>
                  <input className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Location or venue preference" value={form.venue} onChange={e=>setForm({...form, venue:e.target.value})} />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Budget Range</label>
                  <select className="mt-1 w-full border rounded-lg px-3 py-2" value={form.budgetRange} onChange={e=>setForm({...form, budgetRange:e.target.value})}>
                    <option value="<2500">Under $2,500</option>
                    <option value="2500-5000">$2,500 - $5,000</option>
                    <option value="5000-10000">$5,000 - $10,000</option>
                    <option value=">10000">$10,000+</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-700">Event Description</label>
                  <textarea rows={4} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Tell us about your vision, theme, and any special requirements" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
                </div>
                <div className="md:col-span-2 flex justify-center mt-2">
                  <button type="submit" className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-emerald-700 text-white font-semibold shadow">Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Events;



