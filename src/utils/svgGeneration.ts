// src/components/team/utils/svgGeneration.ts

import { AttachmentPoint } from './attachmentPoints';

// ================================
// CONFIGURATION DES ZONES D'ÉVITEMENT
// ================================

// Zone interdite autour de chaque carte (en % de l'écran)
const CARD_AVOIDANCE_ZONE = 3; // ±3% de chaque côté des cartes

// Largeur minimale d'une zone libre pour placer une lumière (en %)
const MIN_FREE_ZONE_WIDTH = 4; // Zone doit faire au moins 4% de largeur

// Espacement minimum entre les lumières (en %)
const MIN_LIGHT_SPACING = 3; // Au moins 3% entre chaque lumière

// Zone de vérification pour les positions par défaut (en %)
const DEFAULT_POSITION_CHECK = 2; // ±2% pour vérifier les positions par défaut

// Pourcentage minimum de lumières à placer avant d'utiliser l'algorithme de fallback
const MIN_LIGHTS_THRESHOLD = 0.7; // 70% des lumières doivent être placées

// Pourcentage minimum pour déclencher le fallback complet
const FALLBACK_THRESHOLD = 0.6; // Si moins de 60%, utiliser l'algorithme par défaut

// Variation maximale pour le positionnement aléatoire (en %)
const POSITION_VARIATION = 1; // ±1% de variation aléatoire

// Marge de sécurité pour les bords de zones (en %)
const ZONE_SAFETY_MARGIN = 1; // 1% de marge dans chaque zone

// ================================
// INTERFACES
// ================================

export interface Point {
  x: number; // percentage 0..100
  y: number; // percentage 0..100
}

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
  seed?: number;
}

// Fixed: Match what the components expect - return SVG path strings
interface GarlandSystemData {
  curve1: string; // SVG path string
  curve2: string; // SVG path string
  lightPositions: Point[];
  width: number;
  numberOfCrossings: number;
  crossingPoints: { x: number; y: number; index: number }[];
  cardPositions: { x: number; y: number; cardIndex?: number }[];
  amplitude: { min: number; max: number };
}

// ================================
// FONCTIONS UTILITAIRES
// ================================

// Fonction pour créer un hash unique basé sur les paramètres d'entrée
const createGarlandHash = (
  cardPoints: AttachmentPoint[],
  width: number,
  customParams?: Partial<CurveParameters>,
): number => {
  // Créer une chaîne unique basée sur les paramètres
  const cardPositions = cardPoints.map((p) => `${p.x.toFixed(2)}-${p.cardIndex || 0}`).join('|');
  const paramsString = customParams ? JSON.stringify(customParams) : '';
  const inputString = `${cardPositions}-${width}-${paramsString}`;

  // Générer un hash simple mais déterministe
  let hash = 0;
  for (let i = 0; i < inputString.length; i++) {
    const char = inputString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convertir en 32bit
  }

  return Math.abs(hash) % 10000; // Retourner un nombre positif entre 0 et 9999
};

export const getCrossingPointsMatrix = (width: number): number => {
  if (width < 768) return 2; // Mobile : seulement 2 points de croisement
  if (width < 1024) return 2; // Tablette : 2 points
  if (width < 1280) return 3; // Desktop petit : 3 points
  if (width < 1536) return 4; // Desktop moyen : 4 points
  return 5; // Desktop large : maximum 5 points
};

// Fonction pour calculer des positions optimales en évitant les cartes
const generateOptimalPositions = (
  numberOfCrossings: number,
  cardPoints: AttachmentPoint[],
  seed: number = 0,
): number[] => {
  const seedRandom = (seedValue: number) => {
    const x = Math.sin(seedValue) * 10000;
    return x - Math.floor(x);
  };

  // Créer des zones interdites autour des cartes
  const forbiddenZones = cardPoints.map((card) => ({
    start: Math.max(5, card.x - CARD_AVOIDANCE_ZONE),
    end: Math.min(95, card.x + CARD_AVOIDANCE_ZONE),
  }));

  // Calculer les zones libres disponibles
  const freeZones: { start: number; end: number; width: number }[] = [];
  let currentStart = 10;

  // Trier les zones interdites par position
  const sortedForbiddenZones = forbiddenZones.sort((a, b) => a.start - b.start);

  for (const forbidden of sortedForbiddenZones) {
    if (currentStart < forbidden.start) {
      const width = forbidden.start - currentStart;
      if (width > MIN_FREE_ZONE_WIDTH) {
        freeZones.push({ start: currentStart, end: forbidden.start, width });
      }
    }
    currentStart = Math.max(currentStart, forbidden.end);
  }

  // Ajouter la zone finale si elle existe
  if (currentStart < 90) {
    const width = 90 - currentStart;
    if (width > MIN_FREE_ZONE_WIDTH) {
      freeZones.push({ start: currentStart, end: 90, width });
    }
  }

  const positions: number[] = [];

  // Distribuer les points dans les zones libres de manière plus permissive
  if (freeZones.length > 0) {
    // Calculer combien de points on peut placer
    const totalAvailableWidth = freeZones.reduce((sum, zone) => sum + zone.width, 0);
    const pointsWeCanFit = Math.min(
      numberOfCrossings,
      Math.floor(totalAvailableWidth / MIN_LIGHT_SPACING),
    );

    // Si on peut placer la plupart des points, distribuer intelligemment
    if (pointsWeCanFit >= numberOfCrossings * MIN_LIGHTS_THRESHOLD) {
      // Distribuer proportionnellement selon la largeur des zones
      let pointsToPlace = numberOfCrossings;

      for (let i = 0; i < freeZones.length && pointsToPlace > 0; i++) {
        const zone = freeZones[i];
        const zoneRatio = zone.width / totalAvailableWidth;
        const pointsInZone = Math.max(1, Math.round(numberOfCrossings * zoneRatio));
        const actualPointsInZone = Math.min(
          pointsInZone,
          pointsToPlace,
          Math.floor(zone.width / MIN_LIGHT_SPACING),
        );

        for (let j = 0; j < actualPointsInZone; j++) {
          const ratio = (j + 1) / (actualPointsInZone + 1);
          const basePos = zone.start + zone.width * ratio;
          const variation =
            seedRandom(seed + i * 10 + j + 100) * (POSITION_VARIATION * 2) - POSITION_VARIATION;
          const position = Math.max(
            zone.start + ZONE_SAFETY_MARGIN,
            Math.min(zone.end - ZONE_SAFETY_MARGIN, basePos + variation),
          );
          positions.push(position);
        }

        pointsToPlace -= actualPointsInZone;
      }
    }
  }

  // Si on n'a pas assez de points, utiliser l'algorithme par défaut avec vérification légère
  if (positions.length < numberOfCrossings * FALLBACK_THRESHOLD) {
    const defaultPositions = [15, 25, 35, 45, 55, 65, 75, 85];
    const neededPoints = numberOfCrossings - positions.length;

    for (let i = 0; i < defaultPositions.length && positions.length < numberOfCrossings; i++) {
      const pos = defaultPositions[i];
      // Vérification plus permissive
      const isTooClose = forbiddenZones.some(
        (zone) =>
          pos >= zone.start + DEFAULT_POSITION_CHECK && pos <= zone.end - DEFAULT_POSITION_CHECK,
      );

      if (!isTooClose) {
        const variation =
          seedRandom(seed + i + 200) * (POSITION_VARIATION * 4) - POSITION_VARIATION * 2;
        const finalPos = Math.max(10, Math.min(90, pos + variation));
        positions.push(finalPos);
      }
    }
  }

  return positions.sort((a, b) => a - b);
};

const generateStablePositions = (
  numberOfCrossings: number,
  cardPoints: AttachmentPoint[],
  seed: number = 0,
): number[] => {
  // Si pas de cartes, utiliser l'algorithme original
  if (cardPoints.length === 0) {
    const seedRandom = (seedValue: number) => {
      const x = Math.sin(seedValue) * 10000;
      return x - Math.floor(x);
    };

    let positions: number[] = [];

    if (numberOfCrossings === 2) {
      positions = [30, 70];
    } else if (numberOfCrossings === 3) {
      positions = [25, 50, 75];
    } else if (numberOfCrossings === 4) {
      positions = [20, 40, 60, 80];
    } else if (numberOfCrossings === 5) {
      positions = [18, 35, 50, 65, 82];
    } else if (numberOfCrossings === 6) {
      positions = [15, 30, 45, 55, 70, 85];
    } else {
      const baseStep = 70 / (numberOfCrossings - 1);
      for (let i = 0; i < numberOfCrossings; i++) {
        const variation = Math.sin(i * 1.3 + seed) * baseStep * 0.1;
        const basePos = 15 + baseStep * i;
        const finalPos = Math.max(10, Math.min(90, basePos + variation));
        positions.push(finalPos);
      }
    }

    return positions.map((pos, index) => {
      const variation = seedRandom(seed + index + 50) * 6 - 3;
      return Math.max(10, Math.min(90, pos + variation));
    });
  }

  // Utiliser l'algorithme optimisé qui évite les cartes
  return generateOptimalPositions(numberOfCrossings, cardPoints, seed);
};

const generateStableCrossingPoints = (
  width: number,
  cardPoints: AttachmentPoint[],
  seed: number = 0,
): CrossingPoint[] => {
  const numberOfCrossings = getCrossingPointsMatrix(width);
  const positions = generateStablePositions(numberOfCrossings, cardPoints, seed);

  const seedRandom = (seedValue: number) => {
    const x = Math.sin(seedValue) * 10000;
    return x - Math.floor(x);
  };

  const baseY = 50;
  const yVariation = 8; // Augmenté pour plus de variation

  return positions.map((x, index) => {
    const sineVariation = Math.sin(index * 1.2 + x * 0.02 + seed) * yVariation * 0.7;
    const cosVariation = Math.cos(index * 0.8 + x * 0.015 + seed) * yVariation * 0.3;
    const seedVariation = seedRandom(seed + index + 200) * yVariation * 0.4 - yVariation * 0.2;
    const yOffset = sineVariation + cosVariation + seedVariation;

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
  width: number, // Ajouter la largeur pour adaptation
): IntermediatePoint[] => {
  const seedRandom = (seedValue: number) => {
    const x = Math.sin(seedValue) * 10000;
    return x - Math.floor(x);
  };

  const allPoints: IntermediatePoint[] = [];
  const seed = params.seed || 0;

  for (let i = 0; i < crossingPoints.length - 1; i++) {
    const currentCrossing = crossingPoints[i];
    const nextCrossing = crossingPoints[i + 1];

    allPoints.push({
      x: currentCrossing.x,
      y: currentCrossing.y,
      isCrossing: true,
    });

    const distance = nextCrossing.x - currentCrossing.x;

    // Contrôler le nombre de points intermédiaires selon la distance ET la largeur d'écran
    let numIntermediatePoints = 0;

    // Adapter selon la taille d'écran
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    if (isMobile) {
      // Mobile : très peu de points pour éviter le chaos
      if (distance >= 30) {
        numIntermediatePoints = 1;
      } else {
        numIntermediatePoints = 0;
      }
    } else if (isTablet) {
      // Tablette : points modérés
      if (distance >= 25) {
        numIntermediatePoints = 2;
      } else if (distance >= 15) {
        numIntermediatePoints = 1;
      } else {
        numIntermediatePoints = 0;
      }
    } else {
      // Desktop : points normaux
      if (distance >= 20) {
        numIntermediatePoints = 2;
      } else if (distance >= 12) {
        numIntermediatePoints = 1;
      } else {
        numIntermediatePoints = 0;
      }
    }

    for (let j = 1; j <= numIntermediatePoints; j++) {
      const ratio = j / (numIntermediatePoints + 1);
      const x = currentCrossing.x + distance * ratio;

      const baseY = currentCrossing.y + (nextCrossing.y - currentCrossing.y) * ratio;

      let yVariation = 0;
      const randomFactor = seedRandom(seed + i * 10 + j * 100 + wireIndex * 1000);

      if (wireIndex === 0) {
        const bellShape = Math.sin(ratio * Math.PI) * params.amplitude * (0.4 + randomFactor * 0.2); // Réduit l'amplitude
        const microWave = Math.sin(ratio * Math.PI * 2 + seed) * params.amplitude * 0.1; // Moins de micro-ondulations
        yVariation = bellShape + microWave;

        if (j === Math.floor(numIntermediatePoints / 2)) {
          const extremeVariation = seedRandom(seed + i * 50 + 300);
          yVariation *=
            extremeVariation > 0.5 ? 1.1 + randomFactor * 0.2 : -(1.1 + randomFactor * 0.2); // Moins extrême
        }
      } else {
        const gentleWave =
          Math.sin(ratio * Math.PI * 1.2 + seed * 0.5) *
          params.amplitude *
          (0.4 + randomFactor * 0.1); // Plus doux
        const subWave = Math.cos(ratio * Math.PI * 1.5 + seed) * params.amplitude * 0.15; // Moins d'ondulations
        yVariation = -(gentleWave + subWave);

        if (j === Math.floor(numIntermediatePoints * 0.6)) {
          const extremeVariation = seedRandom(seed + i * 50 + 400);
          yVariation *=
            extremeVariation > 0.5 ? 1.1 + randomFactor * 0.1 : -(1.05 + randomFactor * 0.1); // Plus subtil
        }
      }

      const asymmetryFactor =
        wireIndex === 0
          ? 1 + params.asymmetry * (0.2 + randomFactor * 0.1)
          : 1 - params.asymmetry * (0.2 + randomFactor * 0.1); // Moins d'asymétrie
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

  const seedRandom = (seedValue: number) => {
    const x = Math.sin(seedValue) * 10000;
    return x - Math.floor(x);
  };

  const seed = params.seed || 0;

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

    const randomVariation = seedRandom(seed + i * 25 + 500);
    const controlDistance = distance * (0.5 * params.smoothing + randomVariation * 0.05); // Plus de contrôle, moins de variation

    const currentLength =
      Math.sqrt(currentTangentX * currentTangentX + currentTangentY * currentTangentY) || 1;
    const nextLength = Math.sqrt(nextTangentX * nextTangentX + nextTangentY * nextTangentY) || 1;

    const cp1x = current.x + (currentTangentX / currentLength) * controlDistance;
    const cp1y =
      current.y +
      (currentTangentY / currentLength) * controlDistance * (0.9 + randomVariation * 0.1); // Moins de variation Y

    const cp2x = next.x - (nextTangentX / nextLength) * controlDistance;
    const cp2y =
      next.y - (nextTangentY / nextLength) * controlDistance * (0.9 + randomVariation * 0.1);

    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${next.x.toFixed(2)} ${next.y.toFixed(2)}`;
  }

  return path;
};

// Fonction pour convertir les points en chemin SVG
const pointsToSvgPath = (points: Point[]): string => {
  if (points.length === 0) return '';

  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)}`;
  }

  return path;
};

// Fonction pour convertir les points intermédiaires en points
const intermediatePointsToPoints = (intermediatePoints: IntermediatePoint[]): Point[] => {
  return intermediatePoints.map((point) => ({
    x: point.x,
    y: point.y,
  }));
};

// Fixed: Return string paths instead of Point arrays
export const generateGarlandSystem = (
  cardPoints: AttachmentPoint[],
  width: number,
  customParams?: Partial<CurveParameters>,
): GarlandSystemData => {
  const defaultParams: CurveParameters = {
    amplitude: 10, // Augmenté légèrement pour plus d'expression
    smoothing: 0.95, // Gardé pour la fluidité
    complexity: 0.5, // Augmenté un peu
    asymmetry: 0.4, // Augmenté pour plus de caractère
    extremeVariation: 5, // Augmenté légèrement
    seed: 0,
  };

  // Créer un seed unique basé sur les paramètres d'entrée
  const uniqueHash = createGarlandHash(cardPoints, width, customParams);

  // Utiliser le seed fourni ou le hash généré
  const finalSeed = customParams?.seed !== undefined ? customParams.seed : uniqueHash;

  const params = { ...defaultParams, ...customParams, seed: finalSeed };
  const crossingPoints = generateStableCrossingPoints(width, cardPoints, params.seed);

  if (crossingPoints.length === 0) {
    return {
      curve1: '',
      curve2: '',
      crossingPoints: [],
      lightPositions: [],
      amplitude: { min: 50, max: 50 },
      width,
      numberOfCrossings: 0,
      cardPositions: [],
    };
  }

  const seedRandom = (seedValue: number) => {
    const x = Math.sin(seedValue) * 10000;
    return x - Math.floor(x);
  };

  const seed = params.seed || 0;
  const startY = crossingPoints[0]?.y || 50;
  const endY = crossingPoints[crossingPoints.length - 1]?.y || 50;

  // Ajouter de la variation aux points de début et fin
  const startVariation = seedRandom(seed + 600) * 6 - 3;
  const endVariation = seedRandom(seed + 700) * 6 - 3;

  const startPoint = { x: -20, y: Math.max(30, Math.min(70, startY + startVariation)) };
  const endPoint = { x: 120, y: Math.max(30, Math.min(70, endY + endVariation)) };

  const allCrossingPoints = [
    { x: startPoint.x, y: startPoint.y, index: -1 },
    ...crossingPoints,
    { x: endPoint.x, y: endPoint.y, index: 999 },
  ];

  const curve1Points = generateIntermediatePoints(allCrossingPoints, 0, params, width);
  const curve2Points = generateIntermediatePoints(allCrossingPoints, 1, params, width);

  // Generate SVG path strings instead of returning Point arrays
  const curve1 = generateSmoothCurveThroughPoints(curve1Points, params);
  const curve2 = generateSmoothCurveThroughPoints(curve2Points, params);

  const allYValues = [...curve1Points.map((p) => p.y), ...curve2Points.map((p) => p.y)];
  const minY = Math.min(...allYValues) - 3;
  const maxY = Math.max(...allYValues) + 3;

  const lightPositions: Point[] = crossingPoints.map((cp) => ({ x: cp.x, y: cp.y }));

  return {
    cardPositions: cardPoints.map((point) => ({
      x: point.x,
      y: point.y,
      cardIndex: point.cardIndex,
    })),
    curve1, // Now returns SVG path string
    curve2, // Now returns SVG path string
    crossingPoints,
    lightPositions,
    amplitude: { min: minY, max: maxY },
    width,
    numberOfCrossings: crossingPoints.length,
  };
};

export interface CurveData {
  crossingPoints: { x: number; y: number; index: number }[];
  cardPositions: { x: number; y: number; cardIndex?: number }[];
  amplitude: { min: number; max: number };
}

export const getCardYPosition = (garlandData: GarlandSystemData, cardX: number): number => {
  if (garlandData.crossingPoints.length === 0) return 50;

  // Since we no longer have curve points, use crossing points to interpolate
  const nearestCrossing = garlandData.crossingPoints.reduce((prev, curr) =>
    Math.abs(curr.x - cardX) < Math.abs(prev.x - cardX) ? curr : prev,
  );

  // Add some stable variation based on position
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

// Fixed: Return proper Point[] instead of string
export const generateGarlandPath = (cardPoints: AttachmentPoint[]): Point[] => {
  const data = generateGarlandSystem(cardPoints, 1024);

  // Convert the curve path string back to points if needed
  // For now, return the light positions as they are already Point[]
  return data.lightPositions;
};

// Fixed: Return proper Point[] instead of string
export const generateVariableWidthPath = (cardPoints: AttachmentPoint[]): Point[] => {
  const data = generateGarlandSystem(cardPoints, 1024);

  // Convert the curve path string back to points if needed
  // For now, return the light positions as they are already Point[]
  return data.lightPositions;
};
