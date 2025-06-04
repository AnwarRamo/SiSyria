// src/components/admin/OrderProductOverview.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaMoneyBillWave, FaListOl } from 'react-icons/fa'; // Changed icons

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
};

const OrderProductOverview = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <motion.div 
        variants={tableVariants} 
        className="bg-white p-6 rounded-xl shadow-lg text-center text-gray-500"
      >
        No product order data available.
      </motion.div>
    );
  }

  return (
    <motion.div variants={tableVariants} className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Product & Package Performance</h2>
        <p className="text-sm text-gray-500">Overview of orders and revenue by item.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product/Package</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-md mr-3">
                       <FaBoxOpen className="text-indigo-600 h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${item.category === 'Adventure' ? 'bg-green-100 text-green-800' : 
                                    item.category === 'Cultural' ? 'bg-purple-100 text-purple-800' : 
                                    item.category === 'Beach' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {item.category || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{item.orders?.toLocaleString() || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold text-right">
                  ${item.revenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 5 && (
        <div className="px-6 py-3 border-t border-gray-200 text-right">
          <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            View all products &rarr;
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default OrderProductOverview;