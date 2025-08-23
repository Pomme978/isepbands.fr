// src/components/team/GarlandGenerator.tsx

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
}> = ({ position, lightType, index, rotation }) => {
  const getLightAsset = () => {
    const assets = {
      yellow: [starYellow, circleYellow],
      blue: [starBlue, circleBlue],
    };
    const selectedAssets = assets[lightType];
    return selectedAssets[index % selectedAssets.length];
  };

  const getLightShape = () => {
    const shapes = ['star', 'circle'];
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

export const GarlandGenerator: React.FC<GarlandGeneratorProps> = ({
  attachmentPoints,
  lightType,
  className = '',
  garlandIndex = 0,
  onCurveDataUpdate,
}) => {
  const { size } = useViewportBreakpoints();
  const cardPoints = getCardPoints(attachmentPoints);

  // Créer un hash unique pour cette guirlande basé sur ses paramètres ET son index
  const garlandHash = React.useMemo(() => {
    const cardPositions = cardPoints.map((p) => `${p.x.toFixed(2)}-${p.cardIndex || 0}`).join('|');
    const inputString = `${cardPositions}-${size.width}-${garlandIndex}-${lightType}`;

    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
      const char = inputString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    return Math.abs(hash) % 10000;
  }, [cardPoints, size.width, garlandIndex, lightType]);

  // Générer des paramètres de guirlande variables basés sur le hash
  const garlandParams = React.useMemo(() => {
    const seedRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Adapter les paramètres selon la taille d'écran
    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1024;

    let baseAmplitude, baseComplexity, baseAsymmetry;

    if (isMobile) {
      // Mobile : paramètres très doux
      baseAmplitude = 8;
      baseComplexity = 0.4;
      baseAsymmetry = 0.4;
    } else if (isTablet) {
      // Tablette : paramètres modérés
      baseAmplitude = 8;
      baseComplexity = 0.3;
      baseAsymmetry = 0.3;
    } else {
      // Desktop : paramètres normaux
      baseAmplitude = 10;
      baseComplexity = 0.4;
      baseAsymmetry = 0.3;
    }

    return {
      amplitude: baseAmplitude + seedRandom(garlandHash) * (isMobile ? 2 : 5), // Variation réduite sur mobile
      smoothing: 0.9 + seedRandom(garlandHash + 1) * 0.1, // Toujours lisse
      complexity: baseComplexity + seedRandom(garlandHash + 2) * (isMobile ? 0.2 : 0.4), // Moins complexe sur mobile
      asymmetry: baseAsymmetry + seedRandom(garlandHash + 3) * (isMobile ? 0.2 : 0.4), // Moins asymétrique sur mobile
      extremeVariation: (isMobile ? 2 : 4) + seedRandom(garlandHash + 4) * (isMobile ? 2 : 4), // Très réduit sur mobile
      seed: garlandHash,
    };
  }, [garlandHash, size.width]);

  // Générer des rotations aléatoires pour chaque lumière basées sur le hash
  const lightRotations = React.useMemo(() => {
    const seedRandom = (seedValue: number) => {
      const x = Math.sin(seedValue) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: 20 }, (_, index) => seedRandom(garlandHash + index + 100) * 360);
  }, [garlandHash]);

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
    <div className={`w-full h-60 relative ${className}`}>
      <svg width="100%" height="240px" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter
            id={`wire-glow-${garlandHash}`}
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
          filter={`url(#wire-glow-${garlandHash})`}
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
          filter={`url(#wire-glow-${garlandHash})`}
          opacity="0.98"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="absolute inset-0 w-full h-full z-0">
        {garlandData.lightPositions.map((lightPos, index) => (
          <Light
            key={`crossing-light-${garlandHash}-${index}`}
            position={{
              x: lightPos.x,
              y: lightPos.y,
            }}
            lightType={lightType}
            index={index}
            rotation={lightRotations[index] || 0}
          />
        ))}
      </div>
    </div>
  );
};
