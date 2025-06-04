// src/components/admin/TravelPackages.jsx
import React from 'react';
import { motion } from 'framer-motion';

const TravelPackages = ({ packages }) => {
  if (!packages || packages.length === 0) {
    return (
      <div className="bg-white p-6 shadow-xl rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-6 text-purple-900">Travel Packages</h2>
        <p className="text-gray-600">No travel packages available at the moment</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 shadow-xl rounded-2xl"
    >
      <h2 className="text-2xl font-bold mb-6 text-purple-900">Travel Packages</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg._id || index} // Ensure the key is set correctly
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img 
              src={pkg.imageUrl || '/images/default-package.jpg'}
              alt={pkg.destination}
              className="h-48 w-96 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.src = '/images/default-package.jpg';
              }}
            />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">{pkg.destination}</h3>
              <div className="flex justify-between items-center">
                <span className="text-purple-600 font-medium">${pkg.price}</span>
                <span className="text-sm text-gray-500">{pkg.duration}</span>
              </div>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < pkg.rating ? 'fill-current' : 'fill-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 ml-2 text-sm">({pkg.reviews})</span>
              </div>
              <button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TravelPackages;
