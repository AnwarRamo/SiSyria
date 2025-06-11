// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify'; // For contact form feedback

// Services & Components
import { TripService } from '../api/services/trip.service';
import NavBar from '../layout/Navbar';
import Footer from '../layout/Footer';
import AutoSlider from '../components/user/AutoSlider';

// Icons & Images
import mon from '../assets/images/sekh4.jpg';

// For better organization, move static data to a constant
const CHOOSE_US_ITEMS = [
  { icon: "🌟", title: "Best Prices", description: "We offer the best prices for your dream vacations.", additional: "Enjoy exclusive discounts and seasonal offers." },
  { icon: "✈️", title: "Easy Booking", description: "Book your trips easily with our user-friendly platform.", additional: "24/7 customer support to assist you anytime." },
  { icon: "🛡️", title: "Safe & Secure", description: "Your safety and security are our top priorities.", additional: "Certified and verified travel partners." },
];

export const Home = () => {
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedTrips = async () => {
      try {
        setLoading(true);
        // PERFORMANCE: Fetch ONLY featured trips, not all of them.
        // This should be a dedicated endpoint on your backend (e.g., /api/trips/featured)
        const response = await TripService.getAllTrips({ limit: 3 }); // Assuming your service can take a limit
        setFeaturedTrips(response);
      } catch (err) {
        setError(err.message || 'Failed to load destinations');
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedTrips();
  }, []);

  // BUG FIX: Add a submit handler for the contact form
  const handleContactSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    // Here you would typically send the data to a server
    toast.success("Thank you for your message! We'll be in touch soon.");
    e.target.reset(); // Clear the form
  };

  return (
    <div className="bg-[#f8fafc] font-poppins">
      <NavBar />

      {/* Pass only featured trips or just their images to the slider */}
      <AutoSlider trips={featuredTrips} />

      {/* Why Choose Us Section */}
      <div className="bg-gradient-to-r from-[#115d5a] to-[#1a7c78] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CHOOSE_US_ITEMS.map((item, index) => (
              <motion.div key={index} /* ... your existing item code ... */ />
            ))}
          </div>
        </div>
      </div>

      {/* Popular Trips Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center text-[#115d5a] mb-10">Popular Trips</h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTrips.map((trip) => (
              <motion.div key={trip.id} /* ... your existing trip card code ... */ />
            ))}
          </div>
        )}
      </div>

      {/* ... other sections ... */}
      
      {/* Contact Section */}
      <div className="relative">
        <img
          className="w-full h-[700px] object-cover"
          src={mon}
          alt="Syrian mountainside landscape with ancient ruins" // SEO: Add descriptive alt text
          loading="lazy" // PERFORMANCE: Lazy load below-the-fold images
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="container mx-auto p-8">
                {/* BUG FIX: Add onSubmit handler to the form */}
                <form onSubmit={handleContactSubmit} className="... a wrapper div ...">
                    {/* ... your form content ... */}
                    <button type="submit" /* ... */ >Send Message</button>
                </form>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
