// components/CountdownTimer.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';

const CountdownTimer = ({ startDate, endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [mode, setMode] = useState('start'); // 'start' or 'end'

  useEffect(() => {
    const target = endDate ? new Date(endDate) : new Date(startDate);
    setMode(endDate ? 'end' : 'start');
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = target - now;
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        return { days, hours, minutes, seconds };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [startDate, endDate]);

  const formatTime = (time) => time.toString().padStart(2, '0');

  if (!(startDate || endDate)) return null;

  return (
    <motion.div 
      className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded-lg"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <FiClock className="text-blue-600" />
      <span className="text-blue-700 font-medium">
        {mode === 'end' ? 'Trip ends in: ' : 'Trip starts in: '}
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {timeLeft.hours > 0 ? `${formatTime(timeLeft.hours)}h ` : ''}
        {timeLeft.minutes > 0 ? `${formatTime(timeLeft.minutes)}m ` : ''}
        {formatTime(timeLeft.seconds)}s
      </span>
    </motion.div>
  );
};

export default CountdownTimer;