import React,{useState,useEffect} from 'react';

const ActivityMonitor = ({ lastActive }) => {
  const calculateTimeLeft = () => {
    const difference = Date.now() - lastActive;
    const minutesLeft = 15 - Math.floor(difference / 60000);
    return Math.max(minutesLeft, 0);
  };

  const [minutesLeft, setMinutesLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setMinutesLeft(calculateTimeLeft());
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