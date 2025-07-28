// src/components/public/components/Itinerary.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Itinerary = ({ itinerary }) => {
  return (
    <div className="py-20 px-4 bg-gradient-to-b from-white to-sky-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Journey Day by Day</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the perfect blend of adventure, culture, and relaxation
          </p>
          <div className="w-24 h-1 bg-amber-500 mx-auto mt-6"></div>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 h-full w-1 bg-gradient-to-b from-sky-400 to-emerald-400 transform -translate-x-1/2"></div>
          
          <div className="space-y-12">
            {itinerary.map((day, index) => (
              <motion.div 
                key={index}
                className="relative z-10"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="w-full md:w-5/12 mb-6 md:mb-0 px-4">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center mb-4">
                        <div className="text-4xl mr-4">📅</div>
                        <h3 className="text-2xl font-bold text-gray-800">{day.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-4">{day.desc}</p>
                      {day.activities && day.activities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {day.activities.map((activity, i) => (
                            <span key={i} className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm">
                              {activity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-2/12 flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-emerald-400 flex items-center justify-center text-lg font-bold text-emerald-600 shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="hidden md:block w-5/12"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Itinerary;