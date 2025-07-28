// src/components/TripFilter.jsx
import React from 'react';

const TripFilter = ({ 
  destinationFilter, 
  setDestinationFilter,
  durationFilter,
  setDurationFilter,
  priceFilter,
  setPriceFilter,
  searchQuery,
  setSearchQuery,
  handlePriceHover
}) => {
  // Unique destinations from trips data
  const destinations = [
    "All Destinations",
    "Bali, Indonesia",
    "Japan",
    "Italy",
    "Costa Rica",
    "Greece",
    "Egypt"
  ];

  return (
    <div className="py-12 px-4 bg-white shadow-lg relative z-10 -mt-20 rounded-t-3xl mx-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Find Your Perfect Journey</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Filter our collection of handcrafted adventures to find your ideal getaway
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Trips</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations, activities..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute right-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          {/* Destination Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value === 'All Destinations' ? 'all' : e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              {destinations.map((dest, index) => (
                <option key={index} value={dest === 'All Destinations' ? 'all' : dest}>
                  {dest}
                </option>
              ))}
            </select>
          </div>
          
          {/* Duration Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="all">Any Duration</option>
              <option value="1-5">1-5 Days</option>
              <option value="6-10">6-10 Days</option>
              <option value="11-15">11-15 Days</option>
              <option value="15-99">15+ Days</option>
            </select>
          </div>
          
          {/* Price Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              onMouseEnter={handlePriceHover}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="all">Any Price</option>
              <option value="0-1000">Under $1000</option>
              <option value="1000-2000">$1000 - $2000</option>
              <option value="2000-3000">$2000 - $3000</option>
              <option value="3000-10000">$3000+</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripFilter;