// src/components/admin/DashboardLayout.jsx
import React from 'react';
import { motion } from 'framer-motion';

import TravelPackages from './TravelPackages';
import TripOverview from './TripOverview';
import TopDestinations from './TopDestinations';
import RevenueOverview from './RevenueOverview';
import BookingHistory from './BookingHistory';
import Calendar from './Calendar';
import UpcomingTrips from './UpcomingTrips';
import SocialMedia from './SocialMedia';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const DashboardLayout = ({ data }) => {
  const {
    travelData = [],  // Ensure travelData is passed correctly
    tripData = {},
    revenueData = [],
    bookingData = []
  } = data || {};  // Destructure data and provide default values

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex-1 p-6 overflow-x-hidden bg-gradient-to-br from-gray-50 to-purple-50"
    >
      <motion.h1
        variants={itemVariants}
        className="text-3xl font-bold mb-8 text-purple-900"
      >
        Admin Dashboard
      </motion.h1>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Section */}
        <div className="md:col-span-2 space-y-8">
          <motion.div variants={itemVariants}>
            {/* Travel Packages Section */}
            <TravelPackages packages={travelData} />
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            <motion.div variants={itemVariants}>
              <TripOverview data={tripData} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <TopDestinations data={tripData?.destinations || []} />
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <RevenueOverview data={revenueData} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <BookingHistory data={bookingData} />
          </motion.div>
        </div>

        {/* Sidebar Section */}
        <div className="md:col-span-1 space-y-8">
          <motion.div variants={itemVariants}>
            <Calendar />
          </motion.div>

          <motion.div variants={itemVariants}>
            <UpcomingTrips />
          </motion.div>

          <motion.div variants={itemVariants}>
            <SocialMedia />
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
};

export default DashboardLayout;
