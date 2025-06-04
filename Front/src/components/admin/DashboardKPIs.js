// src/components/admin/DashboardKPIs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaUsers, FaDollarSign, FaUserPlus } from 'react-icons/fa';

const kpiContainerVariants = {
  hidden: { opacity: 1 }, // Container itself is visible, children stagger
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const kpiItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } }
};

const KPICard = ({ title, value, icon, iconBgColor, borderColor, textColor, subtext }) => (
  <motion.div
    variants={kpiItemVariants}
    className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out group overflow-hidden relative border-l-4 ${borderColor}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-full ${iconBgColor} transition-transform duration-300 group-hover:scale-110`}>
        {React.cloneElement(icon, { className: `h-7 w-7 ${textColor}` })}
      </div>
    </div>
  </motion.div>
);

const DashboardKPIs = ({ kpiData = {} }) => {
  const {
    totalOrders = 0,
    totalCustomers = 0,
    totalRevenue = 0,
    newSignUps = 0,
  } = kpiData;

  return (
    <motion.div 
      variants={kpiContainerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
    >
      <KPICard
        title="Total Sales"
        value={totalOrders.toLocaleString()}
        icon={<FaShoppingCart />}
        borderColor="border-blue-500"
        iconBgColor="bg-blue-100"
        textColor="text-blue-600"
        subtext="All successful orders"
      />
      <KPICard
        title="Total Revenue"
        value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        icon={<FaDollarSign />}
        borderColor="border-purple-500"
        iconBgColor="bg-purple-100"
        textColor="text-purple-600"
        subtext="From all bookings"
      />
      <KPICard
        title="Active Users"
        value={totalCustomers.toLocaleString()}
        icon={<FaUsers />}
        borderColor="border-green-500"
        iconBgColor="bg-green-100"
        textColor="text-green-600"
        subtext="Registered customers"
      />
      <KPICard
        title="New Sign-ups"
        value={newSignUps.toLocaleString()}
        icon={<FaUserPlus />}
        borderColor="border-yellow-500"
        iconBgColor="bg-yellow-100"
        textColor="text-yellow-600"
        subtext="Last 30 days"
      />
    </motion.div>
  );
};

export default DashboardKPIs;