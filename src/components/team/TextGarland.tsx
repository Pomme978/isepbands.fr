// src/components/board/TextGarland.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import starYellow from '@/assets/svg/star_yellow.svg';
import circleYellow from '@/assets/svg/circle_yellow.svg';
import starBlue from '@/assets/svg/star_blue.svg';
import circleBlue from '@/assets/svg/circle_blue.svg';

interface TextGarlandProps {
  lightType?: 'yellow' | 'blue';
  side: 'left' | 'right';
  width?: number; // Width in pixels, default 200
  className?: string;
  animationDelay?: number;
  // Custom parameters
  amplitude?: number; // Curve amplitude (default: 10)
  smoothing?: number; // Curve smoothing (default: 0.95)
  complexity?: number; // Curve complexity (default: 0.4)
  asymmetry?: number; // Wire asymmetry (default: 0.3)
  extremeVariation?: number; // Extreme variation (default: 3)
  minLights?: number; // Minimum number of lights (default: 2)
  maxLights?: number; // Maximum number of lights (default: 3)
}

interface Point {
  x: number;
  y: number;
  isCrossing: boolean;
}

const TextGarland: React.FC<TextGarlandProps> = ({
  lightType = 'yellow',
  side,
  width = 200,
  className = '',
  animationDelay = 0,
  // Custom parameters with defaults
  amplitude = 15,
  smoothing = 0.95,
  complexity = 0.8,
  asymmetry = 0.5,
  extremeVariation = 8,
  minLights = 2,
  maxLights = 3,
}) => {
  // Fix hydration issue by ensuring consistent rendering
  const [isClient, setIsClient] = useState(false);
  const [uniqueId] = useState(() => Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate two crossing wires that go from center to edge
  const garlandData = React.useMemo(() => {
    // Only generate on client to avoid hydration issues
    if (!isClient) {
      return {
        wire1Path: '',
        wire2Path: '',
        crossingPoints: [],
        lightRotations: [],
      };
    }

    const seed = side === 'left' ? 12345 : 67890;

    const seedRandom = (seedValue: number) => {
      const x = Math.sin(seedValue) * 10000;
      return x - Math.floor(x);
    };

    // Calculate number of crossing points based on width and custom params
    const numCrossings = Math.max(minLights, Math.min(maxLights, Math.floor(width / 100) + 1));

    // Generate crossing points from center to edge
    const generateCrossingPoints = () => {
      const crossings = [];

      for (let i = 0; i < numCrossings; i++) {
        const t = (i + 1) / (numCrossings + 1); // Distribute evenly

        let x;
        if (side === 'left') {
          // Start from 90% (near center) and go to 10% (near left edge)
          x = 90 - t * 80;
        } else {
          // Start from 10% (near center) and go to 90% (near right edge)
          x = 10 + t * 80;
        }

        // Generate Y position with variation using custom parameters
        const baseY = 50;
        const yVariation = amplitude * 1.2; // Use custom amplitude
        const sineVar = Math.sin(i * 1.2 + x * 0.02 + seed) * yVariation * 0.7;
        const cosVar = Math.cos(i * 0.8 + x * 0.015 + seed) * yVariation * 0.3;
        const seedVar = seedRandom(seed + i + 200) * yVariation * 0.4 - yVariation * 0.2;
        const yOffset = sineVar + cosVar + seedVar;

        crossings.push({
          x,
          y: Math.max(25, Math.min(95, baseY + yOffset)),
          index: i,
        });
      }

      return crossings;
    };

    const crossingPoints = generateCrossingPoints();

    // Generate intermediate points for smooth curves
    const generateIntermediatePoints = (wireIndex: number) => {
      const allPoints = [];

      // Start point (center area)
      const startX = side === 'left' ? 100 : 0;
      const startY = crossingPoints[0]?.y || 50;
      const startVariation = seedRandom(seed + wireIndex + 600) * 6 - 3;

      allPoints.push({
        x: startX,
        y: Math.max(20, Math.min(100, startY + startVariation)),
        isCrossing: false,
      });

      // Add crossing points with intermediate points between them
      for (let i = 0; i < crossingPoints.length; i++) {
        const currentCrossing = crossingPoints[i];

        allPoints.push({
          x: currentCrossing.x,
          y: currentCrossing.y,
          isCrossing: true,
        });

        // Add intermediate points to next crossing
        if (i < crossingPoints.length - 1) {
          const nextCrossing = crossingPoints[i + 1];
          const distance = Math.abs(nextCrossing.x - currentCrossing.x);

          // Add 1-2 intermediate points based on distance and complexity
          const numIntermediate =
            distance > 30 ? Math.floor(1 + complexity) : Math.floor(complexity);

          for (let j = 1; j <= numIntermediate; j++) {
            const ratio = j / (numIntermediate + 1);
            const x = currentCrossing.x + (nextCrossing.x - currentCrossing.x) * ratio;
            const baseY = currentCrossing.y + (nextCrossing.y - currentCrossing.y) * ratio;

            // Add curve variation based on wire index and custom parameters
            let yVariation = 0;
            const randomFactor = seedRandom(seed + i * 10 + j * 100 + wireIndex * 1000);

            if (wireIndex === 0) {
              const bellShape = Math.sin(ratio * Math.PI) * amplitude * (0.4 + randomFactor * 0.2);
              const microWave = Math.sin(ratio * Math.PI * 2 + seed) * amplitude * 0.3;
              yVariation = bellShape + microWave;

              // Apply asymmetry
              yVariation *= 1 + asymmetry * (0.2 + randomFactor * 0.1);
            } else {
              const gentleWave =
                Math.sin(ratio * Math.PI * 1.2 + seed * 0.5) *
                amplitude *
                (0.4 + randomFactor * 0.1);
              const subWave = Math.cos(ratio * Math.PI * 1.5 + seed) * amplitude * 0.3;
              yVariation = -(gentleWave + subWave);

              // Apply asymmetry in opposite direction
              yVariation *= 1 - asymmetry * (0.2 + randomFactor * 0.1);
            }

            // Apply extreme variation occasionally
            if (randomFactor > 0.7) {
              yVariation *= 1 + extremeVariation * 0.1 * (randomFactor - 0.7);
            }

            const finalY = Math.max(15, Math.min(105, baseY + yVariation));

            allPoints.push({
              x,
              y: finalY,
              isCrossing: false,
            });
          }
        }
      }

      // End point (off screen)
      const endX = side === 'left' ? -30 : 130;
      const endY = crossingPoints[crossingPoints.length - 1]?.y || 50;
      const endVariation = seedRandom(seed + wireIndex + 700) * 6 - 3;

      allPoints.push({
        x: endX,
        y: Math.max(20, Math.min(100, endY + endVariation)),
        isCrossing: false,
      });

      return allPoints;
    };

    // Generate smooth SVG path from points
    const generateSmoothPath = (points: Point[]) => {
      if (points.length === 0) return '';

      const firstPoint = points[0];
      let path = `M ${firstPoint.x} ${firstPoint.y}`;

      if (points.length === 1) return path;

      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        const prev = i > 0 ? points[i - 1] : current;
        const following = i < points.length - 2 ? points[i + 2] : next;

        const distance = Math.abs(next.x - current.x);
        const controlDistance = distance * smoothing * 0.4;

        const currentTangentX = (next.x - prev.x) / 2;
        const currentTangentY = (next.y - prev.y) / 2;
        const nextTangentX = (following.x - current.x) / 2;
        const nextTangentY = (following.y - current.y) / 2;

        const currentLength =
          Math.sqrt(currentTangentX * currentTangentX + currentTangentY * currentTangentY) || 1;
        const nextLength =
          Math.sqrt(nextTangentX * nextTangentX + nextTangentY * nextTangentY) || 1;

        const cp1x = current.x + (currentTangentX / currentLength) * controlDistance;
        const cp1y = current.y + (currentTangentY / currentLength) * controlDistance;
        const cp2x = next.x - (nextTangentX / nextLength) * controlDistance;
        const cp2y = next.y - (nextTangentY / nextLength) * controlDistance;

        path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${next.x.toFixed(2)} ${next.y.toFixed(2)}`;
      }

      return path;
    };

    const wire1Points = generateIntermediatePoints(0);
    const wire2Points = generateIntermediatePoints(1);

    return {
      wire1Path: generateSmoothPath(wire1Points),
      wire2Path: generateSmoothPath(wire2Points),
      crossingPoints,
      lightRotations: Array.from(
        { length: numCrossings },
        (_, i) => seedRandom(seed + i + 100) * 360,
      ),
    };
  }, [
    isClient,
    side,
    width,
    amplitude,
    smoothing,
    complexity,
    asymmetry,
    extremeVariation,
    minLights,
    maxLights,
  ]);

  const Light: React.FC<{
    position: { x: number; y: number; index: number };
    index: number;
  }> = ({ position, index }) => {
    const getLightAsset = () => {
      const assets = {
        yellow: [starYellow, circleYellow],
        blue: [starBlue, circleBlue],
      };
      const selectedAssets = assets[lightType];
      return selectedAssets[index % selectedAssets.length];
    };

    const lightAsset = getLightAsset();
    const lightShape = index % 2 === 0 ? 'star' : 'circle';
    const glowColors = {
      yellow: '#fbbf24',
      blue: '#3b82f6',
    };

    const size = lightShape === 'star' ? 80 : 110;

    return (
      <div
        className="absolute z-10"
        style={{
          left: `${position.x}%`,
          top: `${(position.y / 120) * 140}px`,
          transform: `translate(-50%, -50%) rotate(${garlandData.lightRotations[index] || 0}deg)`,
          animationDelay: `${animationDelay + index * 0.2}s`,
        }}
      >
        <Image
          src={lightAsset}
          alt="Decorative Light"
          width={size}
          height={size}
          className="blur-xs"
          style={{
            animationDuration: '2.5s',
            filter: `brightness(1.6) drop-shadow(0 0 20px ${glowColors[lightType]})`,
          }}
        />
      </div>
    );
  };

  // Show loading state during hydration - completely static
  if (!isClient) {
    return (
      <div className={`relative ${className}`} style={{ width: `${width}px`, height: '140px' }}>
        {/* Completely static placeholder - no animations */}
        <div className="w-full h-full bg-gray-50 rounded opacity-50" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width: `${width}px`, height: '140px' }}>
      {/* Two Crossing Wires */}
      <svg
        width="100%"
        height="140px"
        viewBox="-30 0 160 120"
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        <defs>
          <filter
            id={`text-wire-glow-${uniqueId}`}
            filterUnits="userSpaceOnUse"
            primitiveUnits="userSpaceOnUse"
            x="-50"
            y="-50"
            width="250"
            height="200"
          >
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Wire 1 */}
        <path
          d={garlandData.wire1Path}
          stroke="#ffffff"
          strokeWidth="0.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#text-wire-glow-${uniqueId})`}
          opacity="0.98"
          vectorEffect="non-scaling-stroke"
        />

        {/* Wire 2 */}
        <path
          d={garlandData.wire2Path}
          stroke="#ffffff"
          strokeWidth="0.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#text-wire-glow-${uniqueId})`}
          opacity="0.98"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Lights at crossing points ONLY */}
      <div className="absolute inset-0 w-full h-full z-0">
        {garlandData.crossingPoints.map((crossingPoint, index) => (
          <Light key={`light-${uniqueId}-${index}`} position={crossingPoint} index={index} />
        ))}
      </div>
    </div>
  );
};

export default TextGarland;
