import React, { useEffect, useState } from "react";

type TimerProps = {
  duration: number;
  onExpire: () => void;
  gameOver: boolean;
};

const Timer: React.FC<TimerProps> = ({ duration, onExpire, gameOver }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!gameOver) {
      setTimeLeft(duration);
    }
  }, [gameOver, duration]);

  useEffect(() => {
    if (gameOver) {
      return;
    }

    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onExpire, gameOver]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="timer">
      Time: {formatTime(timeLeft)}
    </div>
  );
};

export default Timer;
