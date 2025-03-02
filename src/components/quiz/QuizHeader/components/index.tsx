import React from 'react';
import { formatTime, getProgressBarWidth, getProgressBarColor } from '../helper';

interface TimerProps {
  timeLeft: number;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft }) => (
  <div className="flex items-center space-x-2">
    <svg 
      className="w-5 h-5 text-gray-600" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
    <span className="text-gray-600">Time Left: {formatTime(timeLeft)}</span>
  </div>
);

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(progress)}`}
      style={{ width: getProgressBarWidth(progress) }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  </div>
); 