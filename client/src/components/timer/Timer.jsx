import React, { useState, useEffect } from 'react';

const Timer = ({ initialTimeInMinutes }) => {
  // Convert initial time to seconds for easy countdown calculation
  const initialTimeInSeconds = initialTimeInMinutes * 60;

  // Set initial state: starting from 0 seconds
  const [timePassed, setTimePassed] = useState(0);
  const [timerFinished, setTimerFinished] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimePassed(prevTime => prevTime + 1);
      if (timePassed+1 == initialTimeInSeconds) {
        setTimerFinished(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timePassed, initialTimeInSeconds]);

  useEffect(() => {
    if (timerFinished) {
      // Play a bell sound
      const audio = new Audio('/bell.wav');
      audio.play();
    }
  }, [timerFinished]);

  const hours = Math.floor((timePassed / 60) / 60);
  const leftMinutes = Math.floor((timePassed / 60) % 60);
  const seconds = timePassed % 60;

  return (
    <div style={{ color: timerFinished ? '#D53D51' : '#1F63BE' }}>
        <div>
          {(hours < 10) && '0'}{hours} : {(leftMinutes < 10) && '0'}{leftMinutes} : {(seconds < 10) && '0'}{seconds}
        </div>
    </div>
  );
};

export default Timer;
