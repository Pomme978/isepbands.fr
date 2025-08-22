// src/components/board/GarlandGenerator.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import { AttachmentPoint, getCardPoints } from '@/utils/attachmentPoints';
import { generateGarlandSystem, getCardYPosition } from '@/utils/svgGeneration';
import { useViewportBreakpoints } from '@/hooks/useViewportBreakpoints';

import starYellow from '@/assets/svg/star_yellow.svg';
import circleYellow from '@/assets/svg/circle_yellow.svg';
import starBlue from '@/assets/svg/star_blue.svg';
import circleBlue from '@/assets/svg/circle_blue.svg';

interface GarlandGeneratorProps {
  attachmentPoints: AttachmentPoint[];
  lightType: 'yellow' | 'blue';
  className?: string;
  onCurveDataUpdate?: (data: {
    crossingPoints: { x: number; y: number; index: number }[];
    cardPositions: { x: number; y: number; cardIndex?: number }[];
    amplitude: { min: number; max: number };
  }) => void;
}

const Light: React.FC<{
  position: { x: number; y: number };
  lightType: 'yellow' | 'blue';
  index: number;
}> = ({ position, lightType, index }) => {
  const getLightAsset = () => {
    const assets = {
      yellow: [starYellow, circleYellow],
      blue: [starBlue, circleBlue],
    };
    const selectedAssets = assets[lightType];
    return selectedAssets[index % selectedAssets.length];
  };

  const lightAsset = getLightAsset();
  const glowColors = {
    yellow: '#fbbf24',
    blue: '#3b82f6',
  };

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-0"
      style={{
        left: `${position.x}%`,
        top: `${(position.y / 100) * 240}px`,
      }}
    >
      <Image
        src={lightAsset}
        alt="Light"
        width={160}
        height={160}
        className="drop-shadow-xl"
        style={{
          animationDelay: `${index * 0.2}s`,
          animationDuration: '2.5s',
          filter: `brightness(1.6) drop-shadow(0 0 20px ${glowColors[lightType]})`,
        }}
      />
    </div>
  );
};

export const GarlandGenerator: React.FC<GarlandGeneratorProps> = ({
  attachmentPoints,
  lightType,
  className = '',
  onCurveDataUpdate,
}) => {
  const { size } = useViewportBreakpoints();
  const cardPoints = getCardPoints(attachmentPoints);

  const garlandParams = {
    amplitude: 15,
    smoothing: 0.95,
    complexity: 0.7,
    asymmetry: 0.5,
  };

  const garlandData = generateGarlandSystem(cardPoints, size.width, garlandParams);

  const cardPositions = cardPoints.map((cardPoint) => ({
    x: cardPoint.x,
    y: getCardYPosition(garlandData, cardPoint.x),
    cardIndex: cardPoint.cardIndex,
  }));

  React.useEffect(() => {
    if (onCurveDataUpdate) {
      onCurveDataUpdate({
        crossingPoints: garlandData.crossingPoints,
        cardPositions,
        amplitude: garlandData.amplitude,
      });
    }
  }, [garlandData, cardPositions, onCurveDataUpdate]);

  return (
    <div className={`w-screen h-60 relative ${className}`}>
      <svg width="100%" height="240px" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter
            id="wire-glow"
            filterUnits="userSpaceOnUse"
            primitiveUnits="userSpaceOnUse"
            x="-50"
            y="-50"
            width="200"
            height="200"
          >
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={garlandData.curve1}
          stroke="#ffffff"
          strokeWidth="0.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#wire-glow)"
          opacity="0.98"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d={garlandData.curve2}
          stroke="#ffffff"
          strokeWidth="0.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#wire-glow)"
          opacity="0.98"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="absolute inset-0 w-full h-full z-0">
        {garlandData.lightPositions.map((lightPos, index) => (
          <Light
            key={`crossing-light-${index}`}
            position={{
              x: lightPos.x,
              y: lightPos.y,
            }}
            lightType={lightType}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
