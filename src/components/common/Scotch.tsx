// src/components/common/Scotch.tsx
'use client';

import React from 'react';

interface ScotchProps {
  className?: string;
  width?: number; // Width in pixels, default 120
  rotation?: number; // Rotation in degrees, default random
  opacity?: number; // Opacity 0-1, default 0.7
  color?: string; // CSS color, default semi-transparent white
  style?: React.CSSProperties;
}

const Scotch: React.FC<ScotchProps> = ({
  className = '',
  width = 120,
  rotation,
  opacity = 0.7,
  color = 'rgba(255, 255, 255, 0.15)',
  style = {},
}) => {
  // Generate a consistent random rotation if none provided
  const finalRotation = React.useMemo(() => {
    if (rotation !== undefined) return rotation;
    // Generate a random rotation between -15 and 15 degrees
    return Math.random() * 30 - 15;
  }, [rotation]);

  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: `${width}px`,
        height: '40px',
        transform: `rotate(${finalRotation}deg)`,
        opacity,
        ...style,
      }}
    >
      {/* Main scotch body */}
      <div
        className="w-full h-full relative rounded-sm"
        style={{
          background: `linear-gradient(45deg, 
            ${color} 0%, 
            rgba(255, 255, 255, ${opacity * 0.3}) 25%, 
            ${color} 50%, 
            rgba(255, 255, 255, ${opacity * 0.3}) 75%, 
            ${color} 100%
          )`,
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, ${opacity * 0.4}),
            inset 0 -1px 0 rgba(0, 0, 0, ${opacity * 0.2}),
            0 2px 4px rgba(0, 0, 0, 0.1)
          `,
        }}
      >
        {/* Scotch texture lines */}
        <div className="absolute inset-0 overflow-hidden rounded-sm">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="absolute h-px w-full"
              style={{
                top: `${(i + 1) * 25}%`,
                background: `rgba(255, 255, 255, ${opacity * 0.2})`,
                transform: 'skewX(-5deg)',
              }}
            />
          ))}
        </div>

        {/* Edge highlights */}
        <div
          className="absolute top-0 left-0 w-full h-px"
          style={{
            background: `rgba(255, 255, 255, ${opacity * 0.6})`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-px"
          style={{
            background: `rgba(0, 0, 0, ${opacity * 0.3})`,
          }}
        />
      </div>
    </div>
  );
};

export default Scotch;
