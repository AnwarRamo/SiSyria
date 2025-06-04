// src/components/admin/TripOverview.jsx
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { motion } from 'framer-motion';
import 'react-circular-progressbar/dist/styles.css';

const TripOverview = ({ data }) => {
  const stats = data?.statusDistribution || [];
  
  // Calculate total trips and percentages
  const totalTrips = stats.reduce((sum, item) => sum + item.count, 0);

  // Calculate counts for each status
  const completedTrips = stats.find(item => item._id === 'Completed')?.count || 0;
  const ongoingTrips = stats.find(item => item._id === 'Ongoing')?.count || 0;
  const upcomingTrips = stats.find(item => item._id === 'Upcoming')?.count || 0;
  const canceledTrips = stats.find(item => item._id === 'Canceled')?.count || 0;  // Assuming you add 'Canceled' to your data

  // Calculate percentages (default to 0 if totalTrips is 0)
  const canceledPercentage = totalTrips ? (canceledTrips / totalTrips) * 100 : 0;
  const bookedPercentage = totalTrips ? ((upcomingTrips + ongoingTrips) / totalTrips) * 100 : 0;
  const donePercentage = totalTrips ? (completedTrips / totalTrips) * 100 : 0;

  return (
    <motion.div 
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-white p-6 shadow-xl rounded-2xl h-full flex flex-col items-center transition-all duration-300 hover:shadow-2xl"
    >
      <h2 className="text-2xl font-bold mb-6 text-purple-900">Trip Overview</h2>
      <div className="w-48 h-48 relative mb-6">
        <CircularProgressbar
          value={donePercentage}
          styles={buildStyles({
            pathTransitionDuration: 1,
            pathColor: '#6A0DAD',
            trailColor: '#F3E8FF',
          })}
        />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <p className="text-3xl font-bold text-purple-600">{totalTrips}</p>
            <p className="text-gray-600">Total Trips</p>
          </div>
        </div>
      </div>
      <div className="flex justify-around w-full max-w-lg">
        {[ 
          { label: 'Cancelled', value: canceledPercentage },
          { label: 'Booked', value: bookedPercentage },
          { label: 'Done', value: donePercentage },
        ].map((stat, index) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.2 }}
            className="text-center p-3 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xl font-semibold text-gray-700">{stat.value.toFixed(1)}%</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TripOverview;
