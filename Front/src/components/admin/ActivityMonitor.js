import React, { useState, useEffect } from 'react';

const ActivityMonitor = ({ lastActive }) => {
  const [minutesLeft, setMinutesLeft] = useState(15);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = Date.now() - lastActive;
      const minutes = 15 - Math.floor(difference / 60000);
      return Math.max(minutes, 0);
    };

    setMinutesLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setMinutesLeft(prev => {
        const newValue = calculateTimeLeft();
        if (newValue <= 0) clearInterval(timer);
        return newValue;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, [lastActive]);

  return (
    <div className="activity-monitor bg-blue-100 p-2 text-sm text-center">
      Session expires in: {minutesLeft} minutes
    </div>
  );
};

export default ActivityMonitor;