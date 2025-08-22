// src/components/board/utils/svgGeneration.ts

import { AttachmentPoint } from './attachmentPoints';

interface CrossingPoint {
  x: number;
  y: number;
  index: number;
}

interface IntermediatePoint {
  x: number;
  y: number;
  isCrossing: boolean;
}

interface CurveParameters {
  amplitude: number;
  smoothing: number;
  complexity: number;
  asymmetry: number;
  extremeVariation: number;
}

interface GarlandSystemData {
  curve1: string;
  curve2: string;
  crossingPoints: CrossingPoint[];
  lightPositions: { x: number; y: number }[];
  amplitude: { min: number; max: number };
  width: number;
  numberOfCrossings: number;
}

export const getCrossingPointsMatrix = (width: number): number => {
  if (width < 768) return 2;
  if (width < 1024) return 3;
  if (width < 1280) return 4;
  if (width < 1536) return 5;
  return 6;
};

const generateStablePositions = (numberOfCrossings: number): number[] => {
  if (numberOfCrossings === 2) return [30, 70];
  if (numberOfCrossings === 3) return [25, 50, 75];
  if (numberOfCrossings === 4) return [20, 40, 60, 80];
  if (numberOfCrossings === 5) return [18, 35, 50, 65, 82];
  if (numberOfCrossings === 6) return [15, 30, 45, 55, 70, 85];

  const positions: number[] = [];
  const baseStep = 70 / (numberOfCrossings - 1);

  for (let i = 0; i < numberOfCrossings; i++) {
    const variation = Math.sin(i * 1.3) * baseStep * 0.1;
    const basePos = 15 + baseStep * i;
    const finalPos = Math.max(10, Math.min(90, basePos + variation));
    positions.push(finalPos);
  }

  return positions.sort((a, b) => a - b);
};

const generateStableCrossingPoints = (width: number): CrossingPoint[] => {
  const numberOfCrossings = getCrossingPointsMatrix(width);
  const positions = generateStablePositions(numberOfCrossings);

  const baseY = 50;
  const yVariation = 6;

  return positions.map((x, index) => {
    const sineVariation = Math.sin(index * 1.2 + x * 0.02) * yVariation * 0.7;
    const cosVariation = Math.cos(index * 0.8 + x * 0.015) * yVariation * 0.3;
    const yOffset = sineVariation + cosVariation;

    return {
      x,
      y: Math.max(35, Math.min(65, baseY + yOffset)),
      index,
    };
  });
};

const generateIntermediatePoints = (
  crossingPoints: CrossingPoint[],
  wireIndex: number,
  params: CurveParameters,
): IntermediatePoint[] => {
  const allPoints: IntermediatePoint[] = [];

  for (let i = 0; i < crossingPoints.length - 1; i++) {
    const currentCrossing = crossingPoints[i];
    const nextCrossing = crossingPoints[i + 1];

    allPoints.push({
      x: currentCrossing.x,
      y: currentCrossing.y,
      isCrossing: true,
    });

    const distance = nextCrossing.x - currentCrossing.x;
    const numIntermediatePoints = Math.max(2, Math.min(3, Math.floor(distance / 8)));

    for (let j = 1; j <= numIntermediatePoints; j++) {
      const ratio = j / (numIntermediatePoints + 1);
      const x = currentCrossing.x + distance * ratio;

      const baseY = currentCrossing.y + (nextCrossing.y - currentCrossing.y) * ratio;

      let yVariation = 0;

      if (wireIndex === 0) {
        const bellShape = Math.sin(ratio * Math.PI) * params.amplitude * 0.6;
        const microWave = Math.sin(ratio * Math.PI * 3) * params.amplitude * 0.2;
        yVariation = bellShape + microWave;

        if (j === Math.floor(numIntermediatePoints / 2)) {
          yVariation *= Math.sin(i * 1.5) > 0 ? 1.3 : -1.2;
        }
      } else {
        const gentleWave = Math.sin(ratio * Math.PI * 1.3) * params.amplitude * 0.5;
        const subWave = Math.cos(ratio * Math.PI * 2) * params.amplitude * 0.3;
        yVariation = -(gentleWave + subWave);

        if (j === Math.floor(numIntermediatePoints * 0.6)) {
          yVariation *= Math.cos(i * 1.8) > 0 ? 1.2 : -1.1;
        }
      }

      const asymmetryFactor =
        wireIndex === 0 ? 1 + params.asymmetry * 0.3 : 1 - params.asymmetry * 0.3;
      yVariation *= asymmetryFactor;

      const finalY = Math.max(20, Math.min(80, baseY + yVariation));

      allPoints.push({
        x,
        y: finalY,
        isCrossing: false,
      });
    }
  }

  const lastCrossing = crossingPoints[crossingPoints.length - 1];
  allPoints.push({
    x: lastCrossing.x,
    y: lastCrossing.y,
    isCrossing: true,
  });

  return allPoints;
};

const generateSmoothCurveThroughPoints = (
  points: IntermediatePoint[],
  params: CurveParameters,
): string => {
  if (points.length === 0) return '';

  const firstPoint = points[0];
  let path = `M ${firstPoint.x.toFixed(2)} ${firstPoint.y.toFixed(2)}`;

  if (points.length === 1) return path;
  if (points.length === 2) {
    path += ` L ${points[1].x.toFixed(2)} ${points[1].y.toFixed(2)}`;
    return path;
  }

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];

    const prev = i > 0 ? points[i - 1] : current;
    const following = i < points.length - 2 ? points[i + 2] : next;

    const distance = Math.abs(next.x - current.x);

    const currentTangentX = (next.x - prev.x) / 2;
    const currentTangentY = (next.y - prev.y) / 2;

    const nextTangentX = (following.x - current.x) / 2;
    const nextTangentY = (following.y - current.y) / 2;

    const controlDistance = distance * 0.4 * params.smoothing;

    const currentLength =
      Math.sqrt(currentTangentX * currentTangentX + currentTangentY * currentTangentY) || 1;
    const nextLength = Math.sqrt(nextTangentX * nextTangentX + nextTangentY * nextTangentY) || 1;

    const cp1x = current.x + (currentTangentX / currentLength) * controlDistance;
    const cp1y = current.y + (currentTangentY / currentLength) * controlDistance * 0.8;

    const cp2x = next.x - (nextTangentX / nextLength) * controlDistance;
    const cp2y = next.y - (nextTangentY / nextLength) * controlDistance * 0.8;

    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${next.x.toFixed(2)} ${next.y.toFixed(2)}`;
  }

  return path;
};

export const generateGarlandSystem = (
  cardPoints: AttachmentPoint[],
  width: number,
  customParams?: Partial<CurveParameters>,
): GarlandSystemData => {
  const defaultParams: CurveParameters = {
    amplitude: 12,
    smoothing: 0.9,
    complexity: 0.6,
    asymmetry: 0.4,
    extremeVariation: 8,
  };

  const params = { ...defaultParams, ...customParams };
  const crossingPoints = generateStableCrossingPoints(width);

  if (crossingPoints.length === 0) {
    return {
      curve1: '',
      curve2: '',
      crossingPoints: [],
      lightPositions: [],
      amplitude: { min: 50, max: 50 },
      width,
      numberOfCrossings: 0,
    };
  }

  const startY = crossingPoints[0]?.y || 50;
  const endY = crossingPoints[crossingPoints.length - 1]?.y || 50;

  const startPoint = { x: -20, y: startY };
  const endPoint = { x: 120, y: endY };

  const allCrossingPoints = [
    { x: startPoint.x, y: startPoint.y, index: -1 },
    ...crossingPoints,
    { x: endPoint.x, y: endPoint.y, index: 999 },
  ];

  const curve1Points = generateIntermediatePoints(allCrossingPoints, 0, params);
  const curve2Points = generateIntermediatePoints(allCrossingPoints, 1, params);

  const curve1 = generateSmoothCurveThroughPoints(curve1Points, params);
  const curve2 = generateSmoothCurveThroughPoints(curve2Points, params);

  const allYValues = [...curve1Points.map((p) => p.y), ...curve2Points.map((p) => p.y)];
  const minY = Math.min(...allYValues) - 3;
  const maxY = Math.max(...allYValues) + 3;

  const lightPositions = crossingPoints.map((cp) => ({ x: cp.x, y: cp.y }));

  return {
    curve1,
    curve2,
    crossingPoints,
    lightPositions,
    amplitude: { min: minY, max: maxY },
    width,
    numberOfCrossings: crossingPoints.length,
  };
};

export const getCardYPosition = (garlandData: CurveData, cardX: number): number => {
  if (garlandData.crossingPoints.length === 0) return 50;

  const nearestCrossing = garlandData.crossingPoints.reduce((prev, curr) =>
    Math.abs(curr.x - cardX) < Math.abs(prev.x - cardX) ? curr : prev,
  );

  const stableVariation = Math.sin(cardX * 0.03) * 2;
  return nearestCrossing.y + stableVariation - 8;
};

export const generateParametricCurveSystem = (
  cardPoints: AttachmentPoint[],
  width: number,
  customParams?: Partial<CurveParameters>,
) => {
  const data = generateGarlandSystem(cardPoints, width, customParams);
  return {
    wire1Path: data.curve1,
    wire2Path: data.curve2,
    crossingPoints: data.crossingPoints,
    amplitude: data.amplitude,
    lightPositions: data.lightPositions,
  };
};

export const generateDoubleCurveGarlandPath = (cardPoints: AttachmentPoint[], width: number) => {
  const data = generateGarlandSystem(cardPoints, width);
  return {
    curve1: data.curve1,
    curve2: data.curve2,
    crossingPoints: data.crossingPoints,
    lightPositions: data.lightPositions,
    amplitude: data.amplitude,
  };
};

export const generateGarlandPath = (cardPoints: AttachmentPoint[]): string => {
  const data = generateGarlandSystem(cardPoints, 1024);
  return data.curve1;
};

export const generateVariableWidthPath = (cardPoints: AttachmentPoint[]): string => {
  const data = generateGarlandSystem(cardPoints, 1024);
  return data.curve1;
};
