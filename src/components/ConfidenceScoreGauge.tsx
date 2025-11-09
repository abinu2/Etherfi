'use client';

import { useEffect, useState } from 'react';

interface ConfidenceScoreGaugeProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
}

export default function ConfidenceScoreGauge({
  score,
  size = 120,
  strokeWidth = 10,
  animated = true
}: ConfidenceScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayScore / 100) * circumference;

  // Animate score counting
  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }

    let currentScore = 0;
    const increment = score / 50; // 50 frames
    const timer = setInterval(() => {
      currentScore += increment;
      if (currentScore >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(currentScore));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [score, animated]);

  // Determine color based on score
  const getColor = (score: number) => {
    if (score >= 75) return '#10b981'; // green
    if (score >= 50) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getTier = (score: number) => {
    if (score >= 75) return 'High';
    if (score >= 50) return 'Medium';
    return 'Low';
  };

  const color = getColor(displayScore);
  const tier = getTier(displayScore);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold" style={{ color }}>
            {Math.round(displayScore)}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Confidence
          </div>
        </div>
      </div>

      {/* Tier Badge */}
      <div
        className="px-3 py-1 rounded-full text-xs font-semibold"
        style={{
          backgroundColor: `${color}20`,
          color: color
        }}
      >
        {tier} Confidence
      </div>
    </div>
  );
}

// Mini version for compact displays
export function MiniConfidenceGauge({ score }: { score: number }) {
  const getColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-full max-w-[100px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(score)} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {score}%
      </span>
    </div>
  );
}
