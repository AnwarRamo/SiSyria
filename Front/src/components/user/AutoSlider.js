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

  // حساب موضع الصورة بناء على الفهرس النشط
  const position = (index - activeIndex + totalImages) % totalImages;
  const translateX = position * 100; // تحريك الصورة بشكل أفقي

    // إذا كانت الصورة نشطة، لا تعرضها
    //if (isActive) return null;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={` -mt-36 absolute w-48 h-72 cursor-pointer border-2 rounded-xl transition-all duration-500 ease-in-out ${
        isActive
          ? "border-[#E7C873] scale-200 z-20 shadow-black"
          : "border-transparent scale-90 z-10 shadow-lg"
      } hover:scale-110`}
      style={{
        transform: `translateX(${translateX}%)`,
        boxShadow: isHovered ? "0 10px 20px rgba(0, 0, 0, 0.3)" : "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <img
        src={image.src}
        alt={image.location}
        className="w-full h-full object-cover rounded-md"
      />
      <div className="absolute top-4 left-1 text-[#E7C873] text-3xl">
        <FaMapMarkerAlt />
      </div>
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 text-white text-center">
          <p>{image.description}</p>
        </div>
      )}
    </div>
  );
};

const LocationIndicator = ({ activeIndex, images }) => (
  <div className="absolute top-0 left-4 h-full flex flex-col items-center justify-center">
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[#E7C873]"></div>
    {images.map((_, index) => (
      <div key={index} className="relative z-10 mb-16">
        <div
          className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
            activeIndex === index
              ? "bg-[#E7C873] text-[#115d5a] border-[#E7C873] scale-100"
              : "bg-transparent text-white border-white scale-75"
          }`}
        >
          <span className="text-sm lg:text-base">{index + 1}</span>
        </div>
      </div>
    ))}
  </div>
);

const ProgressBar = ({ activeIndex, images, setActiveIndex }) => {
  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
      {images.map((_, index) => (
        <button
          key={index}
          onClick={() => setActiveIndex(index)}
          className={`h-1 w-8 rounded-full transition-all duration-500 ${
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

  // Keyboard Navigation
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
    <div className="flex flex-col min-h-screen overflow-hidden mt-20">
      <div className="flex-grow relative w-full h-screen">
        {/* Background Image with Animation */}
        <div className="absolute inset-0 w-full h-full">
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.location}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                activeIndex === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>

        {/* Content with Smooth Transition */}
        <div
          className={`absolute top-1/3 left-4 lg:left-32 transform -translate-y-1/2 text-white max-w-md px-4 transition-all duration-500 ${
            isTransitioning ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
          }`}
        >
          <h1 className="text-3xl lg:text-5xl font-bold text-shadow">
            {images[activeIndex].location}
          </h1>
          <p className="text-base lg:text-xl text-shadow">
            {images[activeIndex].description}
          </p>
          <hr className="my-4 lg:my-6 border-[#E7C873] border-2 w-24 lg:w-32" />
          <button className="flex items-center px-8 py-3 bg-[#E7C873] text-[#115d5a] font-semibold rounded-lg hover:bg-[#d4b15d] transition-all duration-700 transform hover:scale-105 shadow-lg">
            <span>Explore</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 ml-2"
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