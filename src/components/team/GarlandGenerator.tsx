// src/components/team/GarlandGenerator.tsx

'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Image from 'next/image';
import { AttachmentPoint, getCardPoints } from '@/utils/attachmentPoints';
import { generateGarlandSystem, getCardYPosition, type Point } from '@/utils/svgGeneration';
import { useViewportBreakpoints } from '@/hooks/useViewportBreakpoints';

import starYellow from '@/assets/svg/star_yellow.svg';
import circleYellow from '@/assets/svg/circle_yellow.svg';
import starBlue from '@/assets/svg/star_blue.svg';
import circleBlue from '@/assets/svg/circle_blue.svg';

interface GarlandGeneratorProps {
  attachmentPoints: AttachmentPoint[];
  lightType: 'yellow' | 'blue';
  className?: string;
  garlandIndex?: number; // Index pour différencier les guirlandes sur la même page
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
  rotation: number;
  garlandIndex?: number; // Add garlandIndex to create alternation
  totalCardsInRow?: number; // Add to know when to alternate
}> = ({ position, lightType, index, rotation, garlandIndex = 0, totalCardsInRow = 1 }) => {
  const getLightAsset = () => {
    const assets = {
      yellow: [starYellow, circleYellow],
      blue: [starBlue, circleBlue],
    };
    const selectedAssets = assets[lightType];

    // If only one card per garland, alternate the light pattern based on garlandIndex
    if (totalCardsInRow === 1) {
      // Alternate starting pattern: even garlands start with star, odd with circle
      const startWithStar = garlandIndex % 2 === 0;
      const adjustedIndex = startWithStar ? index : index + 1;
      return selectedAssets[adjustedIndex % selectedAssets.length];
    }

    // Normal behavior for multiple cards
    return selectedAssets[index % selectedAssets.length];
  };

  const getLightShape = () => {
    const shapes = ['star', 'circle'];

    // If only one card per garland, alternate the light pattern based on garlandIndex
    if (totalCardsInRow === 1) {
      // Alternate starting pattern: even garlands start with star, odd with circle
      const startWithStar = garlandIndex % 2 === 0;
      const adjustedIndex = startWithStar ? index : index + 1;
      return shapes[adjustedIndex % shapes.length];
    }

    // Normal behavior for multiple cards
    return shapes[index % shapes.length];
  };

  const lightAsset = getLightAsset();
  const lightShape = getLightShape();
  const glowColors = {
    yellow: '#fbbf24',
    blue: '#3b82f6',
  };

  return (
    <div
      className="absolute z-0"
      style={{
        left: `${position.x}%`,
        top: `${(position.y / 100) * 240}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      }}
    >
      <Image
        src={lightAsset}
        alt="Light"
        width={lightShape === 'star' ? 100 : 140}
        height={lightShape === 'star' ? 100 : 140}
        className="blur-xs"
        style={{
          animationDelay: `${index * 0.2}s`,
          animationDuration: '2.5s',
          filter: `brightness(1.6) drop-shadow(0 0 20px ${glowColors[lightType]})`,
        }}
      />
    </div>
  );
};

// No longer needed - curves are already SVG path strings from generateGarlandSystem

export const GarlandGenerator: React.FC<GarlandGeneratorProps> = ({
  attachmentPoints,
  lightType,
  className = '',
  garlandIndex = 0,
  onCurveDataUpdate,
}) => {
  // Add hydration protection
  const [isClient, setIsClient] = useState(false);
  const [uniqueId] = useState(() => Math.random().toString(36).substr(2, 9));

  const { size } = useViewportBreakpoints();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const cardPoints = useMemo(() => getCardPoints(attachmentPoints), [attachmentPoints]);

  // Only generate hash and params on client side with consistent defaults
  const garlandHash = useMemo(() => {
    if (!isClient) return 12345; // Stable default for SSR

    const cardPositions = cardPoints.map((p) => `${p.x.toFixed(2)}-${p.cardIndex || 0}`).join('|');
    const inputString = `${cardPositions}-${size.width}-${garlandIndex}-${lightType}`;

    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
      const char = inputString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    return Math.abs(hash) % 10000;
  }, [cardPoints, size.width, garlandIndex, lightType, isClient]);

  // Generate garland parameters with stable defaults
  const garlandParams = useMemo(() => {
    const seedRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Use consistent screen size defaults for SSR
    const screenWidth = isClient ? size.width : 1024; // Default to desktop size
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;

    let baseAmplitude, baseComplexity, baseAsymmetry;

    if (isMobile) {
      baseAmplitude = 8;
      baseComplexity = 0.4;
      baseAsymmetry = 0.4;
    } else if (isTablet) {
      baseAmplitude = 8;
      baseComplexity = 0.3;
      baseAsymmetry = 0.3;
    } else {
      baseAmplitude = 10;
      baseComplexity = 0.4;
      baseAsymmetry = 0.3;
    }

    return {
      amplitude: baseAmplitude + seedRandom(garlandHash) * (isMobile ? 2 : 5),
      smoothing: 0.9 + seedRandom(garlandHash + 1) * 0.1,
      complexity: baseComplexity + seedRandom(garlandHash + 2) * (isMobile ? 0.2 : 0.4),
      asymmetry: baseAsymmetry + seedRandom(garlandHash + 3) * (isMobile ? 0.2 : 0.4),
      extremeVariation: (isMobile ? 2 : 4) + seedRandom(garlandHash + 4) * (isMobile ? 2 : 4),
      seed: garlandHash,
    };
  }, [garlandHash, size.width, isClient]);

  // Generate light rotations with stable defaults
  const lightRotations = useMemo(() => {
    const seedRandom = (seedValue: number) => {
      const x = Math.sin(seedValue) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: 20 }, (_, index) => seedRandom(garlandHash + index + 100) * 360);
  }, [garlandHash]);

  const garlandData = useMemo(() => {
    const systemData = generateGarlandSystem(
      cardPoints,
      isClient ? size.width : 1024,
      garlandParams,
    );
    return systemData;
  }, [cardPoints, size.width, garlandParams, isClient]);

  // garlandData.curve1 and curve2 are already SVG path strings from generateGarlandSystem

  const cardPositions = useMemo(
    () =>
      cardPoints.map((cardPoint) => ({
        x: cardPoint.x,
        y: getCardYPosition(garlandData, cardPoint.x),
        cardIndex: cardPoint.cardIndex,
      })),
    [cardPoints, garlandData],
  );

  // Use ref to prevent infinite loops in onCurveDataUpdate
  const lastUpdateRef = useRef<string>('');

  useEffect(() => {
    if (onCurveDataUpdate && isClient && garlandData) {
      const updateData = {
        crossingPoints: garlandData.crossingPoints || [],
        cardPositions,
        amplitude: garlandData.amplitude || { min: 50, max: 50 },
      };

      // Create a simple hash of the update data to prevent unnecessary calls
      const updateHash = JSON.stringify({
        crossingCount: updateData.crossingPoints.length,
        cardCount: updateData.cardPositions.length,
        ampMin: Math.round(updateData.amplitude.min * 100),
        ampMax: Math.round(updateData.amplitude.max * 100),
      });

      if (lastUpdateRef.current !== updateHash) {
        lastUpdateRef.current = updateHash;
        // Use setTimeout to prevent immediate re-render issues
        setTimeout(() => {
          onCurveDataUpdate(updateData);
        }, 0);
      }
    }
  }, [garlandData, cardPositions, onCurveDataUpdate, isClient]);

  // Show simple placeholder during hydration
  if (!isClient) {
    return (
      <div className={`w-full h-60 relative ${className}`}>
        {/* Simple placeholder that matches final dimensions */}
        <div className="w-full h-60 opacity-0" />
      </div>
    );
  }

  return (
    <div className={`w-full h-60 relative ${className}`}>
      <svg
        width="100%"
        height="240px"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        suppressHydrationWarning={true}
      >
        <defs>
          <filter
            id={`wire-glow-${uniqueId}`}
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

        {/* Use the SVG path strings directly */}
        <path
          d={garlandData.curve1}
          stroke="#ffffff"
          strokeWidth="0.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#wire-glow-${uniqueId})`}
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
          filter={`url(#wire-glow-${uniqueId})`}
          opacity="0.98"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="absolute inset-0 w-full h-full z-0">
        {garlandData.lightPositions.map((lightPos, index) => (
          <Light
            key={`light-${uniqueId}-${index}`}
            position={{
              x: lightPos.x,
              y: lightPos.y,
            }}
            lightType={lightType}
            index={index}
            rotation={lightRotations[index] || 0}
            garlandIndex={garlandIndex}
            totalCardsInRow={cardPoints.length}
          />
        ))}
      </div>
    </div>
  );
};
