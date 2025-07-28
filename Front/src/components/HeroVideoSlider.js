import React, { useState, useEffect } from 'react';

const HERO_VIDEOS = [
  {
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    title: 'Discover Syria',
    subtitle: 'Experience the beauty, history, and culture of Syria like never before.'
  },
  {
    url: 'https://www.w3schools.com/html/movie.mp4',
    title: 'Adventure Awaits',
    subtitle: 'From ancient cities to breathtaking landscapes, your journey starts here.'
  }
];

const HeroVideoSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
      {HERO_VIDEOS.map((video, idx) => (
        <video
          key={idx}
          src={video.url}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${activeIndex === idx ? 'opacity-100' : 'opacity-0'}`}
          autoPlay
          loop
          muted
          playsInline
        />
      ))}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-xl mb-4 animate-fade-in">
          {HERO_VIDEOS[activeIndex].title}
        </h1>
        <p className="text-xl md:text-2xl text-white font-medium max-w-2xl mb-8 drop-shadow-md animate-fade-in">
          {HERO_VIDEOS[activeIndex].subtitle}
        </p>
        <button className="bg-[#E7C873] text-[#115d5a] px-8 py-4 rounded-full font-bold text-xl shadow-lg hover:bg-[#d4b15d] transition-all duration-300 animate-fade-in">
          Explore Syria
        </button>
      </div>
    </section>
  );
};

export default HeroVideoSlider; 