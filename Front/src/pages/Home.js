import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TripService } from '../api/services/trip.service';
import Review from '../components/user/Review';
import AutoSlider from '../components/user/AutoSlider';
import NavBar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import Btn from '../components/user/bokingBtn';
import Btn2 from "../components/user/learnBtn";
import mon from "../assets/images/sekh4.jpg";

export const Home = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await TripService.getAllTrips();
        setTrips(response);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load destinations");
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="bg-[#f8fafc] font-poppins">
      {/* Navbar */}
      <NavBar />

      {/* AutoSlider with trip images */}
      <AutoSlider trips={trips} />

      {/* Why Choose Us Section */}
      <div className="bg-gradient-to-r from-[#115d5a] to-[#1a7c78] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🌟",
                title: "Best Prices",
                description: "We offer the best prices for your dream vacations.",
                additional: "Enjoy exclusive discounts and seasonal offers.",
              },
              {
                icon: "✈️",
                title: "Easy Booking",
                description: "Book your trips easily with our user-friendly platform.",
                additional: "24/7 customer support to assist you anytime.",
              },
              {
                icon: "🛡️",
                title: "Safe & Secure",
                description: "Your safety and security are our top priorities.",
                additional: "Certified and verified travel partners.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 bg-[#E7C873] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-[#115d5a]">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-[#115d5a]">{item.title}</h3>
                <p className="text-[#4a5568] mb-4">{item.description}</p>
                <div className="absolute inset-0 bg-[#115d5a] text-white p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-sm">{item.additional}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Trips Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center text-[#115d5a] mb-10">
          Popular Trips
        </h2>

        {loading ? (
          <div className="text-center text-lg text-gray-600">Loading featured trips...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.slice(0, 3).map((trip) => (
                <motion.div
                  key={trip.id}
                  className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Trip Image */}
                  <div className="relative">
                    <img
                      src={trip.images[0]}
                      alt={trip.title}
                      className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-semibold">{trip.title}</h3>
                      <div className="flex items-center mt-1">
                        <FaMapMarkerAlt className="mr-2" />
                        <p className="text-sm">{trip.destination}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="p-6">
                    <p className="text-gray-500 text-sm mb-4">{trip.description}</p>
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold text-[#115d5a] mb-2">Activities:</h4>
                      <ul className="list-disc list-inside text-gray-500 text-sm">
                        {trip.activities.slice(0, 3).map((activity, index) => (
                          <li key={index}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                      <span className="text-lg font-bold text-[#115d5a]">
                        ${trip.price.toLocaleString()}
                      </span>
                      <Btn2 onClick={() => navigate(`/trip/${trip.id}`)} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View More Button */}
            <div className="flex justify-center mt-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/trips")}
                className="px-8 py-3 bg-[#115d5a] text-white rounded-lg hover:bg-[#0d4a47] transition-all duration-300 font-semibold"
              >
                View All Trips
              </motion.button>
            </div>
          </>
        )}
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-[#115d5a] to-[#1a7c78] text-white py-20">
        <div className="container mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-6"
          >
            Ready for Your Syrian Adventure?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl mb-8"
          >
            Start planning your unforgettable journey today!
          </motion.p>
          <Btn onClick={() => navigate("/trips")} />
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="container mx-auto p-8">
        <h2 className="text-4xl font-bold text-center text-[#115d5a] mb-8">
          Traveler Experiences
        </h2>
        <Review />
      </div>

      {/* Contact Section */}
      <div className="relative">
        <img
          className="w-full h-[700px] object-cover"
          src={mon}
          alt="Contact background"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between p-8">
            {/* Contact Form */}
            <motion.div 
              className="w-full md:w-1/3 p-8 bg-white bg-opacity-90 rounded-2xl shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-[#115d5a] mb-6">Get in Touch</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a] focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a] focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#115d5a] focus:border-transparent h-32"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  type="submit"
                  className="w-full bg-[#115d5a] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#0d4a47] transition-colors"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              className="w-full md:w-1/3 p-8 text-white mt-8 md:mt-0"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <p className="flex items-center">
                  <span className="font-semibold mr-2">Phone:</span>
                  +963 987 654 321
                </p>
                <p className="flex items-center">
                  <span className="font-semibold mr-2">Email:</span>
                  contact@syriatravel.com
                </p>
                <p className="flex items-center">
                  <span className="font-semibold mr-2">Address:</span>
                  Damascus, Syria
                </p>
              </div>
              <div className="flex space-x-4 mt-8">
                <a href="#" className="hover:text-[#E7C873] transition-colors">
                  <FaFacebook className="w-8 h-8" />
                </a>
                <a href="#" className="hover:text-[#E7C873] transition-colors">
                  <FaTwitter className="w-8 h-8" />
                </a>
                <a href="#" className="hover:text-[#E7C873] transition-colors">
                  <FaInstagram className="w-8 h-8" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;