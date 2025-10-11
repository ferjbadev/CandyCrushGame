import React, { useEffect } from "react";

type TimerProps = {
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  onTimeUp: () => void;
};

const Timer: React.FC<TimerProps> = ({ timeLeft, setTimeLeft, onTimeUp }) => {
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, setTimeLeft, onTimeUp]);

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
