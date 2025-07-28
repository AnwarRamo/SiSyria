import React, { useState, useEffect } from "react";
import damascus from "../../assets/images/damascus.jpg";
import aleppo from "../../assets/images/Alepo.jpg";
import img3 from "../../assets/images/img3.jpg";
import Latakia from "../../assets/images/latakia2.jpg";
import { FaMapMarkerAlt } from "react-icons/fa";

const images = [
  {
    src: damascus,
    location: "Damascus",
    description:
      "The capital of Syria and one of the oldest continuously inhabited cities in the world, known for its historic markets and mosques.",
  },
  {
    src: aleppo,
    location: "Aleppo",
    description:
      "A city rich in cultural heritage, famous for its ancient citadel and traditional markets.",
  },
  {
    src: img3,
    location: "Palmyra",
    description:
      "An oasis in the Syrian desert, renowned for its Roman ruins and historical landmarks.",
  },
  {
    src: Latakia,
    location: "Latakia",
    description:
      "A coastal city on the Mediterranean Sea, known for its beautiful beaches and mild climate.",
  },
];

const ImageCard = ({ image, isActive, onClick, index, activeIndex, totalImages }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate the horizontal position of the image based on the active index
  const position = (index - activeIndex + totalImages) % totalImages;
  const translateX = position * 100;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`-mt-20 sm:-mt-24 md:-mt-28 lg:-mt-36 absolute w-32 h-48 sm:w-40 sm:h-56 md:w-44 md:h-64 lg:w-48 lg:h-72 cursor-pointer border-2 rounded-xl transition-all duration-500 ease-in-out ${
        isActive
          ? "border-[#E7C873] scale-110 sm:scale-125 md:scale-150 lg:scale-200 z-20 shadow-black"
          : "border-transparent scale-75 sm:scale-80 md:scale-85 lg:scale-90 z-10 shadow-lg"
      } hover:scale-105 sm:hover:scale-110`}
      style={{
        transform: `translateX(${translateX}%)`,
        boxShadow: isHovered
          ? "0 10px 20px rgba(0, 0, 0, 0.3)"
          : "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <img
        src={image.src}
        alt={image.location}
        className="w-full h-full object-cover rounded-md"
      />
      <div className="absolute top-2 sm:top-3 md:top-4 left-1 text-[#E7C873] text-xl sm:text-2xl md:text-3xl">
        <FaMapMarkerAlt />
      </div>
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-3 md:p-4 text-white text-center">
          <p className="text-xs sm:text-sm md:text-base">{image.description}</p>
        </div>
      )}
    </div>
  );
};

const LocationIndicator = ({ activeIndex, images }) => (
  <div className="absolute top-0 left-2 sm:left-3 md:left-4 h-full flex flex-col items-center justify-center">
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[#E7C873]"></div>
    {images.map((_, index) => (
      <div key={index} className="relative z-10 mb-8 sm:mb-12 md:mb-16">
        <div
          className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
            activeIndex === index
              ? "bg-[#E7C873] text-[#115d5a] border-[#E7C873] scale-100"
              : "bg-transparent text-white border-white scale-75"
          }`}
        >
          <span className="text-xs sm:text-sm md:text-sm lg:text-base">{index + 1}</span>
        </div>
      </div>
    ))}
  </div>
);

const ProgressBar = ({ activeIndex, images, setActiveIndex }) => {
  return (
    <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 flex justify-center space-x-1 sm:space-x-2">
      {images.map((_, index) => (
        <button
          key={index}
          onClick={() => setActiveIndex(index)}
          className={`h-1 w-6 sm:w-7 md:w-8 rounded-full transition-all duration-500 ${
            activeIndex === index ? "bg-[#E7C873]" : "bg-white/50"
          }`}
        ></button>
      ))}
    </div>
  );
};

const AutoSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Preload images before rendering slider
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = images.map((img) => {
        return new Promise((resolve) => {
          const image = new Image();
          image.src = img.src;
          image.onload = resolve;
        });
      });
      await Promise.all(imagePromises);
      setIsLoading(false);
    };
    loadImages();
  }, []);

  // Automatic slide change every 5 seconds with transition
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation for left and right arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % images.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E7C873]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden mt-16 sm:mt-18 md:mt-20">
      <div className="flex-grow relative w-full h-[100vh] sm:h-[110vh] md:h-[120vh]">
        {/* Background Images with Fade */}
        <div className="absolute inset-0 w-full h-full">
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.location}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                activeIndex === index ? "opacity-100" : "opacity-0"
              }`}
              style={{ filter: 'blur(2px) brightness(0.85)' }}
            />
          ))}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent" style={{backdropFilter: 'blur(4px)'}}></div>
        </div>

        {/* Text Content - Now White Card */}
        <div
          className={`absolute top-1/4 sm:top-1/3 left-2 sm:left-4 md:left-8 lg:left-16 xl:left-32 transform -translate-y-1/2 text-[#115d5a] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 sm:px-6 md:px-8 lg:px-10 transition-all duration-500 ${
            isTransitioning ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
          } bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 p-6 sm:p-8 md:p-10`}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold drop-shadow-sm">
            {images[activeIndex].location}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mt-2 sm:mt-3 md:mt-4 text-gray-700">
            {images[activeIndex].description}
          </p>
          <hr className="my-4 sm:my-5 md:my-6 lg:my-8 border-[#E7C873] border-2 w-20 sm:w-24 md:w-28 lg:w-32 xl:w-40" />
          <button className="flex items-center px-6 sm:px-8 md:px-10 py-2 sm:py-3 md:py-4 bg-[#E7C873] text-[#115d5a] font-semibold rounded-lg hover:bg-[#d4b15d] transition-all duration-700 transform hover:scale-105 shadow-lg text-sm sm:text-base md:text-lg">
            <span>Explore</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>

        {/* Image Cards */}
        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-full flex justify-center">
          {images.map((image, index) => (
            <ImageCard
              key={index}
              image={image}
              isActive={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              index={index}
              activeIndex={activeIndex}
              totalImages={images.length}
            />
          ))}
        </div>

        {/* Location Indicator */}
        <LocationIndicator activeIndex={activeIndex} images={images} />

        {/* Progress Bar */}
        <ProgressBar activeIndex={activeIndex} images={images} setActiveIndex={setActiveIndex} />
      </div>
    </div>
  );
};

export default AutoSlider;
