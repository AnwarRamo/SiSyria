// components/AnimatedCharacter.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const AnimatedCharacter = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 500);
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 bg-white rounded-xl shadow-xl border border-blue-200 max-w-md"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            rotate: [0, 5, -5, 5, 0]
          }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ 
            duration: 0.3,
            rotate: { duration: 0.5, repeat: Infinity, repeatType: "reverse" }
          }}
        >
          <div className="p-4 flex items-start">
            <div className="mr-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <span className="text-lg">⏰</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <p className="font-medium text-gray-800">{message}</p>
            </div>
            
            <button 
              onClick={handleClose}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedCharacter;