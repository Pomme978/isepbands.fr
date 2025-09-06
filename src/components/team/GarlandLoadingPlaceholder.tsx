// src/components/team/GarlandLoadingPlaceholder.tsx
import React from 'react';

interface GarlandLoadingPlaceholderProps {
  className?: string;
}

export const GarlandLoadingPlaceholder: React.FC<GarlandLoadingPlaceholderProps> = ({
  className = '',
}) => {
  return (
    <div className={`w-full h-96 flex items-center justify-center ${className}`}>
      <div className="relative max-w-2xl w-full">
        {/* Animated garland-like curves */}
        <svg width="100%" height="160" viewBox="0 0 600 160" className="opacity-20">
          <defs>
            {/* Shimmer gradient */}
            <linearGradient id="shimmer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="70%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="transparent" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                values="-200 0;800 0;-200 0"
                dur="3s"
                repeatCount="indefinite"
              />
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main garland curves with shimmer effect */}
          <path
            d="M 50 80 Q 150 40, 250 80 T 450 80 Q 500 60, 550 80"
            stroke="url(#shimmer-gradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            filter="url(#glow)"
          />
          <path
            d="M 50 80 Q 150 120, 250 80 T 450 80 Q 500 100, 550 80"
            stroke="url(#shimmer-gradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            filter="url(#glow)"
            style={{ animationDelay: '1s' }}
          />

          {/* Placeholder lights */}
          {Array.from({ length: 8 }, (_, i) => (
            <circle
              key={i}
              cx={75 + i * 60}
              cy={80 + Math.sin(i * 0.8) * 20}
              r="6"
              fill="rgba(251, 191, 36, 0.3)"
              className="animate-pulse"
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s',
              }}
            >
              <animate
                attributeName="opacity"
                values="0.2;0.8;0.2"
                dur="1.5s"
                repeatCount="indefinite"
                begin={`${i * 0.2}s`}
              />
            </circle>
          ))}
        </svg>

        {/* Spinning ornament in center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-400 rounded-full animate-spin opacity-60" />

            {/* Inner sparkle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div
                className="w-6 h-6 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full animate-pulse shadow-lg"
                style={{
                  boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            </div>

            {/* Orbiting mini lights */}
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-70"
                style={{
                  left: '50%',
                  top: '50%',
                  transformOrigin: '0 0',
                  transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-30px)`,
                  animation: `orbit 2s linear infinite`,
                  animationDelay: `${i * 0.25}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes orbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateY(-30px);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateY(-30px);
          }
        }
      `}</style>
    </div>
  );
};
