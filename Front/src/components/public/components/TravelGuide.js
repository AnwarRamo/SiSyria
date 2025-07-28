// components/TravelGuide.jsx
import React from 'react';
import { motion } from 'framer-motion';
import AnimatePresence from '../../../pages/admin/AnimatedCharacter';
const TravelGuide = ({ isPointing, isWaving, isExcited, isSad, isThinking }) => {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-24 h-24">
        {/* Character Body */}
        <motion.div
          className="absolute w-16 h-16 bg-yellow-300 rounded-full bottom-0 right-0 z-10 shadow-lg"
          animate={{
            y: isExcited ? [0, -5, 0] : 0,
            scale: isSad ? 0.95 : 1
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Eyes */}
        <motion.div
          className="absolute w-3 h-3 bg-black rounded-full bottom-8 right-10 z-20"
          animate={{
            height: isWaving ? [3, 1, 3] : 3,
            width: isWaving ? [3, 8, 3] : 3
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="absolute w-3 h-3 bg-black rounded-full bottom-8 right-6 z-20"
          animate={{
            height: isWaving ? [3, 1, 3] : 3,
            width: isWaving ? [3, 8, 3] : 3
          }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Mouth */}
        <motion.div 
          className="absolute w-6 h-2 bg-black rounded-full bottom-6 right-8 z-20"
          animate={{ 
            height: isWaving ? 1 : isSad ? 1 : 2, 
            width: isWaving ? 8 : 6,
            y: isSad ? 2 : 0
          }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Waving Arm */}
        <motion.div
          className="absolute w-3 h-8 bg-yellow-300 rounded-full bottom-2 right-16 origin-bottom z-0"
          animate={{
            rotate: isWaving ? [0, -20, 20, -20, 0] : 0
          }}
          transition={{ 
            duration: 1.5,
            times: [0, 0.25, 0.5, 0.75, 1]
          }}
        />
        
        {/* Pointing Arm */}
        <motion.div
          className="absolute w-3 h-8 bg-yellow-300 rounded-full bottom-2 right-4 origin-bottom z-0"
          animate={{
            rotate: isPointing ? -70 : isThinking ? -20 : 0,
            x: isPointing ? -5 : 0
          }}
          transition={{ duration: 0.5 }}
        >
          {/* Pointing Finger */}
          <motion.div
            className="absolute w-3 h-3 bg-yellow-300 rounded-full -top-1 -left-1"
            animate={{ scale: isPointing ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5, repeat: isPointing ? Infinity : 0 }}
          />
        </motion.div>
        
        {/* Speech Bubble */}
        <AnimatePresence>
          {isPointing && (
            <motion.div
              className="absolute bg-white rounded-lg p-3 shadow-lg -top-4 -left-32 w-28"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <p className="text-xs font-bold text-gray-800">Check out these prices!</p>
              <div className="absolute w-4 h-4 bg-white rotate-45 -right-2 top-6" />
            </motion.div>
          )}
          
          {isExcited && (
            <motion.div
              className="absolute bg-white rounded-lg p-3 shadow-lg -top-4 -left-40 w-32"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs font-bold text-gray-800">Great choice! 😎</p>
              <div className="absolute w-4 h-4 bg-white rotate-45 -right-2 top-6" />
            </motion.div>
          )}
          
          {isSad && (
            <motion.div
              className="absolute bg-white rounded-lg p-3 shadow-lg -top-16 -left-40 w-36"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <p className="text-xs font-bold text-gray-800">Oh no! You missed this trip 😢</p>
              <div className="absolute w-4 h-4 bg-white rotate-45 -right-2 bottom-2" />
            </motion.div>
          )}
          
          {isThinking && (
            <motion.div
              className="absolute bg-white rounded-lg p-3 shadow-lg -top-16 -left-40 w-32"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <p className="text-xs font-bold text-gray-800">Hmm... where to next? 🤔</p>
              <div className="absolute w-4 h-4 bg-white rotate-45 -right-2 bottom-2" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Exclamation mark when excited */}
        {isExcited && (
          <motion.div
            className="absolute -top-4 -right-2 text-3xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: [0, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            ❗
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TravelGuide;