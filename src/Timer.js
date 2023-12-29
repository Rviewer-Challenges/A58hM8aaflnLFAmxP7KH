import React from 'react';

const Timer = ({ timeLeft }) => {
  return (
    <div className="timer">
      Time Left: {timeLeft} seconds
    </div>
  );
};

export default Timer;
