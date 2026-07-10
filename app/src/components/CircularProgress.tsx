import React, { useEffect, useState } from 'react';
import './CircularProgress.css';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 100,
  strokeWidth = 8,
  showLabel = true,
  color = 'primary',
  className = '',
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    // Animate from 0 to target percentage
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPercentage / 100) * circumference;

  const colorMap = {
    primary: 'var(--primary)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    error: 'var(--error)',
  };

  return (
    <div className={`circular-progress ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorMap[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="progress-ring"
        />
      </svg>
      {showLabel && (
        <div className="progress-label">
          <span className="progress-percentage">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
};
