// components/Gallery.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
    { id: 1, alt: "Bali rice terraces" },
    { id: 2, alt: "Uluwatu Temple" },
    { id: 3, alt: "Nusa Penida beach" },
    { id: 4, alt: "Balinese dancer" },
    { id: 5, alt: "Mount Batur sunrise" },
    { id: 6, alt: "Traditional Balinese offering" },
  ];
  
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  return (
    <div className="py-20 bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Experience Bali Through Our Lens</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>
        
        <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-gray-200 border-2 border-dashed rounded-xl"
            >
              {/* In a real app, this would be an actual image */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-sky-400 to-emerald-400">
                <p className="text-white text-2xl font-bold">Bali Image: {images[currentIndex].alt}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation buttons */}
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
            onClick={prevImage}
          >
            &larr;
          </button>
          
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
            onClick={nextImage}
          >
            &rarr;
          </button>
          
          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((img, index) => (
              <button
                key={img.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;