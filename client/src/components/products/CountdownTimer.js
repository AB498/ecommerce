import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CountdownTimer = ({ endTime, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Calculate initial time left
    const calculateTimeLeft = () => {
      const difference = new Date(endTime) - new Date();
      
      if (difference <= 0) {
        // Timer has ended
        if (onComplete) {
          onComplete();
        }
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    // Set initial time
    setTimeLeft(calculateTimeLeft());
    
    // Update timer every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      // Check if timer has ended
      if (newTimeLeft.days === 0 && 
          newTimeLeft.hours === 0 && 
          newTimeLeft.minutes === 0 && 
          newTimeLeft.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(timer);
  }, [endTime, onComplete]);

  // Format time units to always have two digits
  const formatTimeUnit = (unit) => {
    return unit < 10 ? `0${unit}` : unit;
  };

  return (
    <div className="countdown-timer">
      <div className="text-center mb-2">
        <span className="text-gray-700 font-medium">OFFER ENDS AT</span>
      </div>
      <div className="flex justify-center space-x-2">
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-md w-10 h-10 flex items-center justify-center text-gray-800 font-semibold">
            {formatTimeUnit(timeLeft.days)}
          </div>
          <span className="text-xs text-gray-500 mt-1">Days</span>
        </div>
        <span className="text-gray-400 self-center">:</span>
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-md w-10 h-10 flex items-center justify-center text-gray-800 font-semibold">
            {formatTimeUnit(timeLeft.hours)}
          </div>
          <span className="text-xs text-gray-500 mt-1">Hours</span>
        </div>
        <span className="text-gray-400 self-center">:</span>
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-md w-10 h-10 flex items-center justify-center text-gray-800 font-semibold">
            {formatTimeUnit(timeLeft.minutes)}
          </div>
          <span className="text-xs text-gray-500 mt-1">Mins</span>
        </div>
        <span className="text-gray-400 self-center">:</span>
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-md w-10 h-10 flex items-center justify-center text-gray-800 font-semibold">
            {formatTimeUnit(timeLeft.seconds)}
          </div>
          <span className="text-xs text-gray-500 mt-1">Secs</span>
        </div>
      </div>
    </div>
  );
};

CountdownTimer.propTypes = {
  endTime: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date)
  ]).isRequired,
  onComplete: PropTypes.func
};

export default CountdownTimer;
