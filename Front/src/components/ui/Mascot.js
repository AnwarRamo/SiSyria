import React, { useEffect, useRef, useState } from 'react';
// Lottie player completely removed due to URL issues - using fallback SVG instead
const fallbackSvg = (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="60" fill="#ffd700"/>
    <ellipse cx="60" cy="80" rx="30" ry="20" fill="#fff"/>
    <ellipse cx="45" cy="55" rx="8" ry="12" fill="#fff"/>
    <ellipse cx="75" cy="55" rx="8" ry="12" fill="#fff"/>
    <circle cx="45" cy="60" r="3" fill="#115d5a"/>
    <circle cx="75" cy="60" r="3" fill="#115d5a"/>
    <ellipse cx="60" cy="90" rx="10" ry="5" fill="#115d5a"/>
  </svg>
);

const defaultMessages = [
  "Don’t forget your passport, traveler! 🧳✈️",
  "I smell adventure! Ready?",
  "Need help booking a trip?",
  "Let’s explore the world together!",
  "Remember to pack your sunscreen! ☀️",
  "Where to next?"
];

const locationMessages = {
  'SY': [
    "Exploring Syria? Let’s find hidden gems! 🏜️",
    "Syria’s history is amazing! Want tips?",
    "Try some local food in Syria! 🍽️"
  ],
  // Add more country codes and messages as needed
};

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const Mascot = () => {
  const mascotRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ bottom: 32, right: 32 });
  const [message, setMessage] = useState(getRandom(defaultMessages));
  const [country, setCountry] = useState(null);
  const [idle, setIdle] = useState(false);
  const idleTimeout = useRef(null);

  // Geolocation for location-aware messages
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`);
          const data = await res.json();
          setCountry(data.countryCode);
        } catch {
          setCountry(null);
        }
      });
    }
  }, []);

  // Idle animation/message
  useEffect(() => {
    const resetIdle = () => {
      setIdle(false);
      clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => setIdle(true), 10000); // 10s idle
    };
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('scroll', resetIdle);
    window.addEventListener('keydown', resetIdle);
    resetIdle();
    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('scroll', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      clearTimeout(idleTimeout.current);
    };
  }, []);

  // Change message on idle or click
  useEffect(() => {
    if (idle) {
      if (country && locationMessages[country]) {
        setMessage(getRandom(locationMessages[country]));
      } else {
        setMessage(getRandom(defaultMessages));
      }
    }
  }, [idle, country]);

  // Drag logic
  const onMouseDown = (e) => {
    setDragging(true);
    mascotRef.current.startX = e.clientX;
    mascotRef.current.startY = e.clientY;
    mascotRef.current.startBottom = position.bottom;
    mascotRef.current.startRight = position.right;
    document.body.style.userSelect = 'none';
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    const dy = mascotRef.current.startY - e.clientY;
    const dx = mascotRef.current.startX - e.clientX;
    setPosition({
      bottom: Math.max(0, mascotRef.current.startBottom + dy),
      right: Math.max(0, mascotRef.current.startRight + dx)
    });
  };
  const onMouseUp = () => {
    setDragging(false);
    document.body.style.userSelect = '';
  };
  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);

  // On mascot click, show a new message
  const handleClick = () => {
    setMessage(getRandom(defaultMessages.concat(country && locationMessages[country] ? locationMessages[country] : [])));
  };

  return (
    <div
      ref={mascotRef}
      onMouseDown={onMouseDown}
      onClick={handleClick}
      style={{
        position: 'fixed',
        zIndex: 50,
        bottom: position.bottom,
        right: position.right,
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        transition: dragging ? 'none' : 'box-shadow 0.2s',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        borderRadius: '2rem',
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(8px)',
        padding: '0.5rem',
        minWidth: 120,
        minHeight: 120
      }}
      aria-label="Mascot: your travel buddy"
      tabIndex={0}
    >
      {/* Always use fallback SVG since lottie URL is not working */}
      <div style={{ height: 120, width: 120 }}>{fallbackSvg}</div>
      <div
        className="mt-2 px-3 py-2 rounded-xl shadow-lg text-sm font-semibold"
        style={{
          background: 'rgba(255,255,255,0.85)',
          color: '#115d5a',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.5)',
          backdropFilter: 'blur(4px)',
          pointerEvents: 'none',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 0,
          marginBottom: '110px',
          minWidth: 180,
          textAlign: 'center'
        }}
      >
        {message}
      </div>
    </div>
  );
};

export default Mascot; 