'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { MemberCard } from './MemberCard';
import { GarlandGenerator } from './GarlandGenerator';
import { GarlandLoadingPlaceholder } from './GarlandLoadingPlaceholder';
import { useGarlandLayout } from '@/hooks/useGarlandLayout';
import { getCardPoints } from '@/utils/attachmentPoints';
import { getCardYPosition, type Point } from '@/utils/svgGeneration';

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

interface CurveData {
  crossingPoints: { x: number; y: number; index: number }[];
  cardPositions: { x: number; y: number; cardIndex?: number }[];
  amplitude: { min: number; max: number };
}

interface GarlandSystemData {
  curve1: string;
  curve2: string;
  lightPositions: Point[];
  width: number;
  numberOfCrossings: number;
  crossingPoints: { x: number; y: number; index: number }[];
  cardPositions: { x: number; y: number; cardIndex?: number }[];
  amplitude: { min: number; max: number };
}

const isCurveDataEqual = (a: CurveData, b: CurveData): boolean => {
  if (a.crossingPoints.length !== b.crossingPoints.length) return false;
  if (a.cardPositions.length !== b.cardPositions.length) return false;

  for (let i = 0; i < a.crossingPoints.length; i++) {
    const pointA = a.crossingPoints[i];
    const pointB = b.crossingPoints[i];
    if (pointA.x !== pointB.x || pointA.y !== pointB.y || pointA.index !== pointB.index) {
      return false;
    }
  }

  for (let i = 0; i < a.cardPositions.length; i++) {
    const posA = a.cardPositions[i];
    const posB = b.cardPositions[i];
    if (posA.x !== posB.x || posA.y !== posB.y || posA.cardIndex !== posB.cardIndex) {
      return false;
    }
  }

  if (a.amplitude.min !== b.amplitude.min || a.amplitude.max !== b.amplitude.max) {
    return false;
  }

  return true;
};

export const Garland: React.FC<GarlandProps> = ({
  users,
  roleInfos,
  lightType = 'yellow',
  className = '',
}) => {
  const [isClient, setIsClient] = useState(false);

  const [garlandData, setGarlandData] = useState<GarlandSystemData>({
    curve1: '',
    curve2: '',
    lightPositions: [] as Point[],
    width: 0,
    numberOfCrossings: 0,
    crossingPoints: [],
    cardPositions: [],
    amplitude: { min: 50, max: 50 },
  });

  const [cardHeights, setCardHeights] = useState<Record<string, number>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastCurveDataRef = useRef<CurveData | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const validUsers = useMemo(
    () =>
      roleInfos
        .map((roleInfo) => {
          const user = users.find((u) => u.role === roleInfo.role);
          return user ? { user, roleInfo } : null;
        })
        .filter(Boolean) as { user: User; roleInfo: UserRole }[],
    [users, roleInfos],
  );

  const { attachmentPoints, cardsPerRow, totalRows } = useGarlandLayout(
    validUsers.map((v) => v.user),
  );

  const cardPoints: Point[] = useMemo(
    () =>
      getCardPoints(attachmentPoints).map((point) => ({
        x: point.x,
        y: point.y,
      })),
    [attachmentPoints],
  );

  // SIMPLIFIED: Fixed spacing calculation - much more predictable
  const calculateRowSpacing = useCallback((): number => {
    // Fixed spacing regardless of row content - keeps it consistent
    const baseSpacing = 180; // Reduced from complex calculation
    const garlandHeight = 60; // Fixed garland height allowance
    const cardBuffer = 40; // Fixed buffer for card variations

    return baseSpacing + garlandHeight + cardBuffer; // Total: ~220px consistently
  }, []); // No dependencies = no re-calculations causing jumps

  const handleCurveDataUpdate = useCallback((data: CurveData): void => {
    if (lastCurveDataRef.current && isCurveDataEqual(lastCurveDataRef.current, data)) {
      return;
    }

    lastCurveDataRef.current = data;
    requestAnimationFrame(() => {
      setGarlandData((prev: GarlandSystemData) => ({
        ...prev,
        crossingPoints: data.crossingPoints,
        cardPositions: data.cardPositions,
        amplitude: data.amplitude,
      }));
    });
  }, []);

  useEffect(() => {
    const measureCardHeights = () => {
      const newHeights: Record<string, number> = {};
      Object.entries(cardRefs.current).forEach(([userId, ref]) => {
        if (ref) newHeights[userId] = ref.offsetHeight;
      });
      setCardHeights(newHeights);
    };

    const timeout = setTimeout(measureCardHeights, 50);
    return () => clearTimeout(timeout);
  }, [validUsers]);

  const getCardRotation = useCallback(
    (cardIndex: number, totalCardsInRow: number, rowIndex: number): number => {
      if (totalCardsInRow === 1) {
        const singleCardRotations = [-2, 3, -4, 2, -3, 4, -1, 3, -2, 1];
        return singleCardRotations[rowIndex % singleCardRotations.length];
      }

      const rotations = [
        [0],
        [-3, 4],
        [-5, 0, 3],
        [-6, -2, 2, 5],
        [-7, -3, 0, 2, 6],
        [-8, -4, -1, 1, 4, 7],
      ] as const;

      const rotationSet = rotations[Math.min(totalCardsInRow - 1, rotations.length - 1)];
      return rotationSet[cardIndex] ?? 0;
    },
    [],
  );

  const renderGarlandRow = useCallback(
    (startIndex: number, cardsInRow: number) => {
      const rowCards = validUsers.slice(startIndex, startIndex + cardsInRow);
      const rowCardPoints = cardPoints.slice(startIndex, startIndex + cardsInRow);
      const rowIndex = Math.floor(startIndex / cardsPerRow);
      const fixedSpacing = calculateRowSpacing(); // Now returns consistent value

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
          className="relative w-full" // Removed conflicting margin classes
          style={{ marginBottom: `${fixedSpacing}px` }} // Consistent spacing
          suppressHydrationWarning={true}
        >
          <GarlandGenerator
            attachmentPoints={rowAttachmentPoints}
            lightType={lightType}
            className="absolute top-0 left-0 z-0"
            onCurveDataUpdate={handleCurveDataUpdate}
            garlandIndex={rowIndex}
          />

          <div className="max-w-[100rem] mx-auto relative">
            <div className="relative z-10">
              <div className="relative">
                {rowCards.map((item, cardIndex) => {
                  const cardPoint = rowCardPoints[cardIndex];
                  if (!cardPoint) return null;

                  const cardYPosition = getCardYPosition(garlandData, cardPoint.x);
                  const cardTopOffset = -80 + ((cardYPosition - 50) / 50) * 80;
                  const rotation = getCardRotation(cardIndex, cardsInRow, rowIndex);

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
      garlandData,
      getCardRotation,
    ],
  );

  if (validUsers.length === 0) return null;

  if (!isClient) {
    return <GarlandLoadingPlaceholder className={className} />;
  }

  return (
    <div className={`relative ${className}`}>
      {Array.from({ length: totalRows }, (_, rowIndex) => {
        const startIndex = rowIndex * cardsPerRow;
        const cardsInThisRow = Math.min(cardsPerRow, validUsers.length - startIndex);
        return renderGarlandRow(startIndex, cardsInThisRow);
      })}
    </div>
  );
};
