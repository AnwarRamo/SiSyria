// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaUserFriends } from 'react-icons/fa';
import { FiShield, FiClock, FiStar, FiHeadphones, FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { TripService } from '../../api/services/trip.service';
import NavBar from '../../layout/Navbar';
import AutoSlider from '../../components/user/AutoSlider';
import Footer from '../../layout/Footer';
import mon from '../../assets/images/sekh4.jpg';

const CHOOSE_US_ITEMS = [
  {
    icon: <FiStar className="w-7 h-7 text-amber-500" />,
    title: "Best Prices",
    description: "We offer the best prices for your dream vacations.",
    additional: "Enjoy exclusive discounts and seasonal offers.",
  },
  {
    icon: <FiClock className="w-7 h-7 text-emerald-500" />,
    title: "Easy Booking",
    description: "Book your trips easily with our user-friendly platform.",
    additional: "24/7 customer support to assist you anytime.",
  },
  {
    icon: <FiShield className="w-7 h-7 text-sky-500" />,
    title: "Safe & Secure",
    description: "Your safety and security are our top priorities.",
    additional: "Certified and verified travel partners.",
  },
  {
    icon: <FiHeadphones className="w-7 h-7 text-fuchsia-500" />,
    title: "Premium Support",
    description: "Real humans. Real help. Whenever you need it.",
    additional: "Multi-language support with fast response.",
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
        const trips = Array.isArray(response) 
          ? response.slice(0, 3) 
          : response?.trips?.slice(0, 3) || response?.data?.trips?.slice(0, 3) || [];

        const tripsWithImages = trips.map(trip => ({
          ...trip,
          images: trip.images?.length ? trip.images : []
        }));

        if (isMounted) {
          setFeaturedTrips(tripsWithImages);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load destinations");
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Thank you for your message! We'll be in touch soon.");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen font-poppins flex flex-col bg-[#f8fafc] text-black dark:bg-[#0a192f] dark:text-white">
      <NavBar />
      
      <main className="flex-grow mt-[-100px]" >
        <AutoSlider trips={featuredTrips} />

        <section 
          className="relative overflow-hidden  py-20 px-4"
          aria-labelledby="why-choose-us-heading"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />

          <div className="relative max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wider bg-white/10 text-white ring-1 ring-white/20">Trusted by Travelers</span>
              <h1 
                id="why-choose-us-heading"
                className="mt-4 text-4xl md:text-5xl font-extrabold text-green"
              >
                Why Choose Us?
              </h1>
              <p className="mt-3 max-w-2xl mx-auto text-emerald-50/90">Premium experiences, seamless booking, and support that actually cares. We make every trip unforgettable.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CHOOSE_US_ITEMS.map((item, index) => (
                <motion.div
                  key={`choose-us-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative rounded-2xl bg-white/95 dark:bg-white/10 backdrop-blur-md p-6 border border-white/30 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)] transition-all"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 via-transparent to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10" />
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-white/5 dark:to-white/5 ring-1 ring-black/5 mb-4">
                    {item.icon}
                  </div>
                  <h3 className="relative text-lg font-bold text-[#0f4d4a] dark:text-emerald-200 mb-2">
                    {item.title}
                  </h3>
                  <p className="relative text-sm text-gray-700 dark:text-emerald-50/80 mb-2">{item.description}</p>
                  <p className="relative text-xs text-gray-600 dark:text-emerald-50/60">{item.additional}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section 
          className="py-12 px-4"
          aria-labelledby="popular-trips-heading"
        >
          <div className="max-w-7xl mx-auto px-2 sm:px-4">
            <h2 
              id="popular-trips-heading"
              className="text-4xl font-bold text-center text-[#115d5a] mb-10"
            >
              Popular Trips
            </h2>
            
            {loading ? (
              <div className="flex justify-center">
                <div 
                  className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115d5a]"
                  aria-label="Loading trips"
                />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : featuredTrips.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No trips available at the moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {featuredTrips.map((trip) => (
                  <motion.div
                    key={trip._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
                  >
                    <button
                      type="button"
                      className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center text-emerald-700 shadow"
                      aria-label="Save trip"
                    >
                      <FaHeart />
                    </button>
                    <div className="relative">
                      <img
                        src={trip.images?.[0] || '/default-image.jpg'}
                        alt={trip.title || 'Trip image'}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                        width={400}
                        height={192}
                      />
                      <div className="absolute bottom-3 left-4 text-white text-lg font-semibold drop-shadow">
                        {trip.title}
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-gray-600 mb-4">
                        {trip.description?.slice(0, 120) || 'Intimate celebrations tailored to your personal style'}
                      </p>
                      <div className="mb-2 text-sm font-semibold text-gray-800">Services Include:</div>
                      <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700 mb-5">
                        {(trip.highlights && trip.highlights.length ? trip.highlights : [trip.destination, `${trip.duration || trip.days || 0} days`, 'Guided tours', 'Transportation'])
                          .slice(0, 4)
                          .map((item, idx) => (
                            <div key={idx} className="flex items-start">
                              <span className="mt-1 mr-2 text-amber-600">•</span>
                              <span className="leading-5">{item}</span>
                            </div>
                          ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs uppercase text-gray-500">Pricing</div>
                          <div className="text-[#115d5a] font-semibold">Starting from ${Number(trip.price || 0).toLocaleString()}</div>
                        </div>
                        <button
                          onClick={() => window.location.href = `/travel/${trip._id}`}
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                          aria-label={`View details for ${trip.title}`}
                        >
                          <FaUserFriends /> Book Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && !error && featuredTrips.length > 0 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => window.location.href = '/travel'}
                  className="bg-[#115d5a] text-white px-6 py-3 rounded-lg hover:bg-[#0d4a47] transition-colors"
                  aria-label="See more trips"
                >
                  See More Trips
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="relative" aria-label="Contact section">
          <div className="aspect-w-16 aspect-h-9 md:aspect-none">
            <img
              className="w-full h-[520px] md:h-[720px] object-cover"
              src={mon}
              alt="Syrian mountainside landscape with ancient ruins"
              loading="lazy"
              width={1920}
              height={720}
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.65),rgba(0,0,0,.35))] flex items-center justify-center">
            <div className="max-w-6xl w-full p-4 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/90 dark:bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/30 shadow-xl">
                  <h2 className="text-3xl font-extrabold text-[#e2f8f5] drop-shadow mb-4">
                    Contact Us
                  </h2>
                  <p className="text-emerald-50/90 mb-6">We'd love to hear from you. Tell us about your next adventure and we'll make it happen.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 bg-white/90 dark:bg-white/10 rounded-xl p-4 border border-white/30">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-white/10 flex items-center justify-center">
                        <FiPhone className="text-emerald-700 dark:text-emerald-300" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-emerald-200">Phone</div>
                        <div className="font-semibold text-[#115d5a] dark:text-white">+1 (555) 123-4567</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/90 dark:bg-white/10 rounded-xl p-4 border border-white/30">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-white/10 flex items-center justify-center">
                        <FiMail className="text-emerald-700 dark:text-emerald-300" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-emerald-200">Email</div>
                        <div className="font-semibold text-[#115d5a] dark:text-white">hello@sisyria.com</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/90 dark:bg-white/10 rounded-xl p-4 border border-white/30 sm:col-span-2">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-white/10 flex items-center justify-center">
                        <FiMapPin className="text-emerald-700 dark:text-emerald-300" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-emerald-200">Office</div>
                        <div className="font-semibold text-[#115d5a] dark:text-white">Damascus, Syria</div>
                      </div>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleContactSubmit}
                  className="bg-white/95 dark:bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/30 shadow-xl"
                >
                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="peer w-full px-4 pt-6 pb-2 bg-white/70 dark:bg-transparent border border-gray-300 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-[#1a7c78] focus:border-transparent placeholder-transparent"
                        placeholder="Your name"
                        aria-required="true"
                      />
                      <label htmlFor="name" className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">Name</label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="peer w-full px-4 pt-6 pb-2 bg-white/70 dark:bg-transparent border border-gray-300 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-[#1a7c78] focus:border-transparent placeholder-transparent"
                        placeholder="Your email"
                        aria-required="true"
                      />
                      <label htmlFor="email" className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">Email</label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="4"
                        className="peer w-full px-4 pt-6 pb-2 bg-white/70 dark:bg-transparent border border-gray-300 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-[#1a7c78] focus:border-transparent placeholder-transparent"
                        placeholder="Your message"
                        aria-required="true"
                      />
                      <label htmlFor="message" className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">Message</label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#115d5a] to-[#1a7c78] text-white py-3 rounded-lg font-bold hover:from-[#0d4a47] hover:to-[#115d5a] transition-all shadow-lg"
                  >
                    <FiSend className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;