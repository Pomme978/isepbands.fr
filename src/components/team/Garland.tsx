// src/components/team/Garland.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MemberCard } from './MemberCard';
import { GarlandGenerator } from './GarlandGenerator';
import { useGarlandLayout } from '@/hooks/useGarlandLayout';
import { getCardPoints } from '@/utils/attachmentPoints';
import { getCardYPosition } from '@/utils/svgGeneration';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  motto?: string;
  profilePhoto?: string;
  role: string;
}

interface UserRole {
  role: string;
  displayName: string;
  section: 'executive' | 'other' | 'pole';
  variant?: 'president' | 'executive' | 'pole';
}

interface GarlandProps {
  users: User[];
  roleInfos: UserRole[];
  lightType?: 'yellow' | 'blue';
  className?: string;
}

// Updated to match GarlandGenerator's callback type
interface CurveData {
  crossingPoints: { x: number; y: number; index: number }[];
  cardPositions: { x: number; y: number; cardIndex?: number }[];
  amplitude: { min: number; max: number };
}

interface Point {
  x: number;
  y: number;
}

// This should match what getCardYPosition expects
interface GarlandSystemData {
  curve1: Point[];
  curve2: Point[];
  lightPositions: Point[];
  width: number;
  numberOfCrossings: number;
  crossingPoints: { x: number; y: number; index: number }[];
  cardPositions: { x: number; y: number; cardIndex?: number }[];
  amplitude: { min: number; max: number };
}

export const Garland: React.FC<GarlandProps> = ({
  users,
  roleInfos,
  lightType = 'yellow',
  className = '',
}) => {
  const [garlandData, setGarlandData] = useState<GarlandSystemData>({
    curve1: null,
    curve2: null,
    lightPositions: [],
    width: 0,
    numberOfCrossings: 0,
    crossingPoints: [],
    cardPositions: [],
    amplitude: { min: 50, max: 50 },
  });

  const [curveData, setCurveData] = useState<CurveData>({
    crossingPoints: [],
    cardPositions: [],
    amplitude: { min: 50, max: 50 },
  });

  const [cardHeights, setCardHeights] = useState<{ [key: string]: number }>({});
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const validUsers = roleInfos
    .map((roleInfo) => {
      const user = users.find((u) => u.role === roleInfo.role);
      return user ? { user, roleInfo } : null;
    })
    .filter(Boolean) as { user: User; roleInfo: UserRole }[];

  const { attachmentPoints, cardsPerRow, totalRows } = useGarlandLayout(
    validUsers.map((v) => v.user),
  );

  const cardPoints = getCardPoints(attachmentPoints);

  const handleCurveDataUpdate = React.useCallback((data: CurveData): void => {
    setCurveData((prevData) => {
      // Only update if data actually changed
      if (JSON.stringify(prevData) !== JSON.stringify(data)) {
        // Update garlandData for getCardYPosition compatibility
        setGarlandData((prev) => ({
          ...prev,
          crossingPoints: data.crossingPoints,
          cardPositions: data.cardPositions,
          amplitude: data.amplitude,
        }));
        return data;
      }
      return prevData;
    });
  }, []);

  useEffect(() => {
    const measureCardHeights = () => {
      const newHeights: { [key: string]: number } = {};

      Object.entries(cardRefs.current).forEach(([userId, ref]) => {
        if (ref) {
          newHeights[userId] = ref.offsetHeight;
        }
      });

      setCardHeights(newHeights);
    };

    const timeout = setTimeout(measureCardHeights, 50);
    return () => clearTimeout(timeout);
  }, [validUsers]);

  const calculateRowSpacing = React.useCallback(
    (rowIndex: number): number => {
      const baseSpacing = 20;
      const amplitudeHeight = Math.abs(curveData.amplitude.max - curveData.amplitude.min);
      const amplitudeInPixels = (amplitudeHeight / 100) * 240;
      const rowCards = validUsers.slice(rowIndex * cardsPerRow, (rowIndex + 1) * cardsPerRow);
      const maxCardHeight = Math.max(
        ...rowCards.map((item) => cardHeights[item.user.id] || 180),
        180,
      );

      return baseSpacing + amplitudeInPixels + maxCardHeight + 5 - 150;
    },
    [curveData.amplitude, validUsers, cardsPerRow, cardHeights],
  );

  const getCardRotation = (cardIndex: number, totalCardsInRow: number): number => {
    if (totalCardsInRow === 1) return 0;

    const rotations = [
      [0],
      [-3, 4],
      [-5, 0, 3],
      [-6, -2, 2, 5],
      [-7, -3, 0, 2, 6],
      [-8, -4, -1, 1, 4, 7],
    ];

    const rotationSet = rotations[Math.min(totalCardsInRow - 1, rotations.length - 1)];
    return rotationSet[cardIndex] || 0;
  };

  const renderGarlandRow = React.useCallback(
    (startIndex: number, cardsInRow: number) => {
      const rowCards = validUsers.slice(startIndex, startIndex + cardsInRow);
      const rowCardPoints = cardPoints.slice(startIndex, startIndex + cardsInRow);
      const rowIndex = Math.floor(startIndex / cardsPerRow);

      const dynamicSpacing = calculateRowSpacing(rowIndex);

      const rowAttachmentPoints = attachmentPoints.filter(
        (point) =>
          point.type === 'card' &&
          point.cardIndex !== undefined &&
          point.cardIndex >= startIndex &&
          point.cardIndex < startIndex + cardsInRow,
      );

      return (
        <div
          key={`row-${startIndex}`}
          className="relative w-full md:mb-0 mb-100"
          style={{ marginBottom: `${dynamicSpacing}px` }}
        >
          {/* Full width garland background */}
          <GarlandGenerator
            attachmentPoints={rowAttachmentPoints}
            lightType={lightType}
            className="absolute top-0 left-0 z-0"
            onCurveDataUpdate={handleCurveDataUpdate}
          />

          {/* Cards container with max-width constraint */}
          <div className="max-w-[130rem] mx-auto relative">
            <div className="relative z-10">
              <div className="relative">
                {rowCards.map((item, cardIndex) => {
                  const cardPoint = rowCardPoints[cardIndex];

                  if (!cardPoint) return null;

                  const actualCardIndex = startIndex + cardIndex;
                  const cardYPosition = getCardYPosition(garlandData, cardPoint.x);
                  const cardTopOffset = -80 + ((cardYPosition - 50) / 50) * 80;
                  const rotation = getCardRotation(cardIndex, cardsInRow);

                  return (
                    <div
                      key={item.user.id}
                      ref={(el) => {
                        if (el) {
                          cardRefs.current[item.user.id] = el;
                        } else {
                          delete cardRefs.current[item.user.id];
                        }
                      }}
                      className="absolute z-20"
                      style={{
                        left: `${cardPoint.x}%`,
                        top: `${cardTopOffset}px`,
                        transform: `translateX(-50%) rotate(${rotation}deg)`,
                        transformOrigin: 'center top',
                      }}
                    >
                      <MemberCard
                        user={item.user}
                        roleDisplay={item.roleInfo.displayName}
                        variant={item.roleInfo.variant}
                        className="relative z-30"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    },
    [
      validUsers,
      cardPoints,
      cardsPerRow,
      calculateRowSpacing,
      attachmentPoints,
      lightType,
      handleCurveDataUpdate,
      curveData,
    ],
  );

  if (validUsers.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {Array.from({ length: totalRows }, (unused, rowIndex) => {
        const startIndex = rowIndex * cardsPerRow;
        const cardsInThisRow = Math.min(cardsPerRow, validUsers.length - startIndex);

        return renderGarlandRow(startIndex, cardsInThisRow);
      })}
    </div>
  );
};
