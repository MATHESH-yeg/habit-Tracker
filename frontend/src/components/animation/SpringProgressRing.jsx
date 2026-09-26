import React from 'react';
import { useSpring, animated } from '@react-spring/web';

export const SpringProgressRing = ({
  size = 48,
  strokeWidth = 4,
  progress = 0, // 0 to 1
  color = '#fa8c16',
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // React Spring physics animation for progress ring stroke
  const springProps = useSpring({
    strokeDashoffset: circumference * (1 - Math.min(1, Math.max(0, progress))),
    config: { tension: 180, friction: 20 },
  });

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Ring */}
        <animated.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={springProps.strokeDashoffset}
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
};
