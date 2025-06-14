import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { TripService } from '../api/services/trip.service';
import NavBar from '../layout/Navbar';
import Footer from '../layout/Footer';
import AutoSlider from '../components/user/AutoSlider';
import mon from '../assets/images/sekh4.jpg';

const CHOOSE_US_ITEMS = [
  {
    icon: "🌟",
    title: "Best Prices",
    description: "We offer the best prices for your dream vacations.",
    additional: "Enjoy exclusive discounts and seasonal offers."
  },
  {
    icon: "✈️",
    title: "Easy Booking",
    description: "Book your trips easily with our user-friendly platform.",
    additional: "24/7 customer support to assist you anytime."
  },
  {
    icon: "🛡️",
    title: "Safe & Secure",
    description: "Your safety and security are our top priorities.",
    additional: "Certified and verified travel partners."
  },
];

export const Home = () => {
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedTrips = async () => {
      try {
        const response = await TripService.getPublicTrips({ limit: 3 });
        if (isMounted) {
          setFeaturedTrips(response.trips || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load destinations');
          setLoading(false);
        }
      }
    };

    fetchFeaturedTrips();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // Example: send message to backend (not implemented)
      // await ContactService.sendMessage(formData);

      toast.success("Thank you for your message! We'll be in touch soon.");
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="bg-[#f8fafc] font-poppins min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-grow">
        <AutoSlider trips={featuredTrips} />

        {/* Why Choose Us Section */}
        <section className="bg-gradient-to-r from-[#115d5a] to-[#1a7c78] py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center text-white mb-8">Why Choose Us?</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CHOOSE_US_ITEMS.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-[#115d5a] mb-2">{item.title}</h3>
                  <p className="text-gray-700 mb-3">{item.description}</p>
                  <p className="text-gray-600 text-sm">{item.additional}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Trips Section */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto px-2 sm:px-4">
            <h2 className="text-4xl font-bold text-center text-[#115d5a] mb-10">Popular Trips</h2>
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115d5a]"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {featuredTrips.map((trip) => (
                  <motion.div
                    key={trip._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow w-full max-w-full min-w-0"
                  >
                    <img
                      src={trip.images?.[0] || '/default-image.jpg'}
                      alt={trip.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#115d5a] mb-2">{trip.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">${Number(trip.price).toFixed(2)}</span>
                        <button
                          onClick={() => window.location.href = `/travel/${trip._id}`}
                          className="bg-[#115d5a] text-white px-4 py-2 rounded-lg hover:bg-[#0d4a47] transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && !error && (
              <div className="text-center mt-8">
                <button
                  onClick={() => window.location.href = '/travel'}
                  className="bg-[#115d5a] text-white px-6 py-3 rounded-lg hover:bg-[#0d4a47] transition-colors"
                >
                  See More Trips
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section className="relative">
          <div className="aspect-w-16 aspect-h-9 md:aspect-none">
            <img
              className="w-full h-[500px] md:h-[700px] object-cover"
              src={mon}
              alt="Syrian mountainside landscape with ancient ruins"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="max-w-4xl w-full p-4 md:p-8">
              <form
                onSubmit={handleContactSubmit}
                className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl"
              >
                <h2 className="text-3xl font-bold text-[#115d5a] mb-6 text-center">
                  Contact Us
                </h2>

                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#115d5a] focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#115d5a] focus:border-transparent"
                    placeholder="Your email"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#115d5a] focus:border-transparent"
                    placeholder="Your message"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#115d5a] to-[#1a7c78] text-white py-3 rounded-lg font-bold hover:from-[#0d4a47] hover:to-[#115d5a] transition-all shadow-md"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
