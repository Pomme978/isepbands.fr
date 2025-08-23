// src/components/board/DecoratedText.tsx
'use client';

import React from 'react';
import TextGarland from './TextGarland';

interface DecoratedTextProps {
  children: React.ReactNode;
  lightType?: 'yellow' | 'blue';
  garlandWidth?: number; // Width of each garland in pixels
  showGarlands?: boolean; // Option to toggle garlands on/off
  className?: string;
  textClassName?: string;
  spacing?: 'tight' | 'normal' | 'wide'; // Spacing between garlands and text
  // Custom garland parameters
  amplitude?: number;
  smoothing?: number;
  complexity?: number;
  asymmetry?: number;
  extremeVariation?: number;
  minLights?: number;
  maxLights?: number;
}
const DecoratedText: React.FC<DecoratedTextProps> = ({
  children,
  lightType = 'yellow',
  garlandWidth = 200,
  showGarlands = true,
  className = '',
  textClassName = '',
  spacing = 'normal',
  // Custom parameters with defaults
  amplitude = 15,
  smoothing = 0.95,
  complexity = 0.8,
  asymmetry = 0.5,
  extremeVariation = 8,
  minLights = 2,
  maxLights = 3,
}) => {
  const spacingClasses = {
    tight: 'gap-2 sm:gap-4', // Responsive gaps
    normal: 'gap-4 sm:gap-8', // Smaller gaps on mobile
    wide: 'gap-6 sm:gap-12', // Smaller gaps on mobile
  };

  const spacingClass = spacingClasses[spacing];

  // Make garland width responsive
  const responsiveGarlandWidth =
    typeof window !== 'undefined' && window.innerWidth < 768
      ? Math.min(garlandWidth, 120) // Max 120px on mobile
      : garlandWidth;

  if (!showGarlands) {
    return <div className={textClassName}>{children}</div>;
  }

  return (
    <div
      className={`flex items-center justify-center ${spacingClass} ${className} px-4 overflow-hidden sm:px-0`}
    >
      {/* Left Garland */}
      <div className="flex-shrink-0 overflow-hidden hidden sm:block">
        <TextGarland
          side="left"
          lightType={lightType}
          width={responsiveGarlandWidth}
          animationDelay={0}
          amplitude={amplitude}
          smoothing={smoothing}
          complexity={complexity}
          asymmetry={asymmetry}
          extremeVariation={extremeVariation}
          minLights={minLights}
          maxLights={maxLights}
        />
      </div>

      {/* Text Content */}
      <div className={`flex-shrink-0 text-center ${textClassName}`}>{children}</div>

      {/* Right Garland */}
      <div className="flex-shrink-0 overflow-hidden hidden sm:block">
        <TextGarland
          side="right"
          lightType={lightType}
          width={responsiveGarlandWidth}
          animationDelay={0.5}
          amplitude={amplitude}
          smoothing={smoothing}
          complexity={complexity}
          asymmetry={asymmetry}
          extremeVariation={extremeVariation}
          minLights={minLights}
          maxLights={maxLights}
        />
      </div>
    </div>
  );
};

export default DecoratedText;
