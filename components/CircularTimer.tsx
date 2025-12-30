
import React from 'react';

interface CircularTimerProps {
  timeLeft: number;
  totalTime: number;
}

const CircularTimer: React.FC<CircularTimerProps> = ({ timeLeft, totalTime }) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / totalTime) * 100;
  const offset = circumference - (progress / 100) * circumference;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-64 h-64 transform -rotate-90">
        <circle
          className="text-slate-800"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="128"
          cy="128"
        />
        <circle
          className="text-indigo-500 transition-all duration-1000 ease-linear"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="128"
          cy="128"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-mono font-bold text-white">
          {formatTime(timeLeft)}
        </span>
        <span className="text-slate-500 text-sm font-medium mt-1">Until next break</span>
      </div>
    </div>
  );
};

export default CircularTimer;
