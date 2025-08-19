import React, { useState, useEffect, useRef } from "react";
import damascus from "../../assets/images/damascus.jpg";
import aleppo from "../../assets/images/Alepo.jpg";
import img3 from "../../assets/images/img3.jpg";
import Latakia from "../../assets/images/latakia2.jpg";
import { FaMapMarkerAlt } from "react-icons/fa";

const images = [
  { src: damascus, location: "Damascus", description: "The capital of Syria and one of the oldest continuously inhabited cities in the world, known for its historic markets and mosques." },
  { src: aleppo, location: "Aleppo", description: "A city rich in cultural heritage, famous for its ancient citadel and traditional markets." },
  { src: img3, location: "Palmyra", description: "An oasis in the Syrian desert, renowned for its Roman ruins and historical landmarks." },
  { src: Latakia, location: "Latakia", description: "A coastal city on the Mediterranean Sea, known for its beautiful beaches and mild climate." },
];

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const ImageCard = ({ image, isActive, onClick, parallax, leave }) => {
  const parallaxX = parallax.x * (isActive ? 8 : 4);
  const parallaxY = parallax.y * (isActive ? 8 : 4);

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl will-change-transform transition-all duration-500 ${
        isActive ? "scale-100" : "scale-90" 
      } ${leave ? "-translate-y-6 rotate-[-4deg] opacity-0" : "opacity-100"} hover:scale-105`}
      style={{
        transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0)`,
        filter: isActive ? "none" : "grayscale(75%) brightness(0.9)",
        boxShadow: isActive ? "0 12px 28px rgba(231,200,115,0.35)" : "0 6px 18px rgba(0,0,0,0.25)",
        border: isActive ? "2px solid #E7C873" : "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <img
        src={image.src}
        alt={image.location}
        className="w-32 h-48 sm:w-36 sm:h-52 md:w-40 md:h-60 object-cover rounded-lg"
      />
      <div className="absolute top-2 left-2 text-[#E7C873] text-lg">
        <FaMapMarkerAlt />
      </div>
    </div>
  );
};

const ProgressDots = ({ activeIndex, images, setActiveIndex }) => (
  <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
    {images.map((_, index) => (
      <button
        key={index}
        onClick={() => setActiveIndex(index)}
        className={`h-3 w-3 rounded-full transition-all duration-500 ${
          activeIndex === index ? "bg-[#E7C873] shadow-lg shadow-[#E7C873]" : "bg-white/50"
        }`}
      />
    ))}
  </div>
);

const AutoSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0); // background/text hero
  const [cardLeadIndex, setCardLeadIndex] = useState(0); // first card in the row
  const [isCycling, setIsCycling] = useState(false); // animating first card moving to back
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Parallax state (x,y from -1 to 1)
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const sliderRef = useRef(null);

  useEffect(() => {
    Promise.all(images.map(img => {
      return new Promise(res => {
        const image = new Image();
        image.src = img.src;
        image.onload = res;
      });
    })).then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setIsCycling(true);

      // Compute next index for both hero and cards
      setCardLeadIndex(prev => {
        const next = (prev + 1) % images.length;
        // Update hero slightly earlier for a nicer handoff
        setTimeout(() => setActiveIndex(next), 200);
        // Reorder cards after the leave animation completes
        setTimeout(() => {
          setCardLeadIndex(next);
          setIsCycling(false);
          setIsTransitioning(false);
        }, 500);
        // Keep current until reorder timeout fires
        return prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation (Left/Right arrows)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveIndex(prev => (prev + 1) % images.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Parallax handler
  useEffect(() => {
    if (isLoading) return;

    const sliderEl = sliderRef.current;
    if (!sliderEl) return;

    const handleMouseMove = (e) => {
      const rect = sliderEl.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setParallax({ x: clamp(x, -1, 1), y: clamp(y, -1, 1) });
    };

    const handleMouseLeave = () => setParallax({ x: 0, y: 0 });

    sliderEl.addEventListener("mousemove", handleMouseMove);
    sliderEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      sliderEl.removeEventListener("mousemove", handleMouseMove);
      sliderEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E7C873]"></div>
      </div>
    );
  }

  // Background parallax offset (larger than cards)
  const bgTranslateX = parallax.x * 20;
  const bgTranslateY = parallax.y * 20;

  // Ordered cards so the first (index 0) is the highlighted one
  const orderedCards = [...images.slice(cardLeadIndex), ...images.slice(0, cardLeadIndex)];

  return (
    <div
      ref={sliderRef}
      className="relative w-full min-h-[110vh] md:min-h-[120vh] overflow-hidden select-none"
    >
      {/* Background */}
      {images.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={image.location}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] z-0`}
          style={{
            opacity: activeIndex === index ? 1 : 0,
            filter: "brightness(0.85)",
            transform: `translate3d(${bgTranslateX}px, ${bgTranslateY}px, 0) scale(1.05)`,
            transitionProperty: "opacity, transform",
          }}
        />
      ))}

      {/* Readability overlay (no white) */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.35), rgba(0,0,0,0.12) 35%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0.25))",
        }}
      />

      {/* Text Overlay on the LEFT */}
      <div
        className={`absolute top-1/2 left-10 md:left-16 transform -translate-y-1/2 text-left text-white transition-all duration-700 z-30 ${
          isTransitioning ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"
        }`}
        style={{
          textShadow: "0 6px 18px rgba(0,0,0,0.45)",
          transformStyle: "preserve-3d",
          transform: `translateZ(30px) translateX(${parallax.x * 10}px) translateY(${parallax.y * -10}px)`,
          transitionProperty: "opacity, transform",
          maxWidth: "38rem",
        }}
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-wide text-[#E7C873]">
          {images[activeIndex].location}
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-white/95 max-w-2xl">
          {images[activeIndex].description}
        </p>
        <button
          aria-label="Explore destination"
          className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#E7C873] text-[#115d5a] font-semibold shadow-[0_10px_30px_rgba(231,200,115,0.35)] ring-1 ring-white/20 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(231,200,115,0.45)] active:translate-y-0 transition-transform duration-300"
        >
          Explore
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M3.75 12a.75.75 0 01.75-.75h12.69l-4.22-4.22a.75.75 0 111.06-1.06l5.5 5.5a.75.75 0 010 1.06l-5.5 5.5a.75.75 0 11-1.06-1.06l4.22-4.22H4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Image Cards on the RIGHT: fixed, side-by-side, small gaps */}
      <div className="absolute top-1/2 right-10 md:right-16 -translate-y-1/2 z-20">
        <div className="flex items-center gap-3 md:gap-4">
          {orderedCards.map((image, index) => (
            <ImageCard
              key={index}
              image={image}
              isActive={index === 0}
              onClick={() => {
                // When clicking a card, make it the lead, then update hero shortly after
                setCardLeadIndex((prev) => {
                  const clickedAbsoluteIndex = (cardLeadIndex + index) % images.length;
                  setTimeout(() => setActiveIndex(clickedAbsoluteIndex), 250);
                  return clickedAbsoluteIndex;
                });
              }}
              parallax={parallax}
              leave={isCycling && index === 0}
            />
          ))}
        </div>
      </div>

      {/* Progress Dots (move bottom-right near cards) */}
      <div className="absolute bottom-8 right-10 md:right-16 z-40">
        <ProgressDots activeIndex={activeIndex} images={images} setActiveIndex={setActiveIndex} />
      </div>
    </div>
  );
};

export default AutoSlider;
