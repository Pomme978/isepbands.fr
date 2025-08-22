// src/components/board/utils/garlandMath.ts

/**
 * Calcule le nombre de cartes par ligne selon la largeur d'écran
 */
export const getCardsPerRow = (width: number, maxCards: number): number => {
  if (width < 768) return 1; // Mobile: 1 carte
  if (width < 1024) return Math.min(2, maxCards); // Tablet: 2 cartes max
  return Math.min(3, maxCards); // Desktop: 3 cartes max
};

/**
 * Calcule le nombre total de lignes nécessaires
 */
export const getTotalRows = (totalCards: number, cardsPerRow: number): number => {
  return Math.ceil(totalCards / cardsPerRow);
};

/**
 * Calcule les positions X des cartes pour une ligne donnée (en pourcentages)
 */
export const getCardPositionsForRow = (cardsInRow: number): number[] => {
  if (cardsInRow === 1) {
    return [50]; // Centré
  } else if (cardsInRow === 2) {
    return [30, 70]; // Plus d'espace sur les côtés
  } else if (cardsInRow === 3) {
    return [20, 50, 80]; // Distribution équilibrée
  } else {
    // Pour 4+ cartes, distribution équitable
    const positions: number[] = [];
    const spacing = 80 / (cardsInRow + 1); // 80% de largeur utilisable
    for (let i = 0; i < cardsInRow; i++) {
      positions.push(10 + spacing * (i + 1)); // Commence à 10% du bord
    }
    return positions;
  }
};

/**
 * Calcule les positions des lumières - RÉDUIT LE NOMBRE
 */
export const getLightPositionsForRow = (cardsInRow: number): number[] => {
  const cardPositions = getCardPositionsForRow(cardsInRow);
  const safeZone = 12; // Zone d'exclusion plus large autour des cartes
  const positions: number[] = [];

  if (cardsInRow === 1) {
    // Carte au centre (50%), MOINS de lumières sur les côtés
    return [10, 25, 35, 65, 75, 90];
  } else if (cardsInRow === 2) {
    // Cartes à 30% et 70%, MOINS de lumières
    return [8, 18, 42, 50, 58, 82, 92];
  } else if (cardsInRow === 3) {
    // Cartes à 20%, 50%, 80%, MOINS de lumières
    return [6, 12, 32, 38, 42, 58, 62, 68, 88, 94];
  } else {
    // Pour 4+ cartes, distribution réduite
    for (let x = 6; x <= 94; x += 8) {
      const tooCloseToCard = cardPositions.some((cardX) => Math.abs(x - cardX) < safeZone);
      if (!tooCloseToCard) {
        positions.push(x);
      }
    }
    return positions.slice(0, 8); // Maximum 8 lumières
  }
};

/**
 * Génère les points de contrôle pour une courbe de Bézier naturelle avec affaissement
 */
export const generateBezierControlPoints = (points: { x: number; y: number }[]): string => {
  if (points.length === 0) return '';

  // Extension de la guirlande au-delà du viewport
  const startX = -15; // Sort du côté gauche
  const endX = 115; // Sort du côté droit
  const baseY = 30; // Hauteur de base de la guirlande
  const sagAmount = 15; // Affaissement entre les points

  let path = `M ${startX} ${baseY}`;

  if (points.length === 1) {
    // Une seule carte : courbe simple avec affaissement
    const point = points[0];
    const midPoint1X = (startX + point.x) / 2;
    const midPoint2X = (point.x + endX) / 2;

    // Première courbe vers la carte (affaissement)
    path += ` Q ${midPoint1X} ${baseY + sagAmount}, ${point.x} ${baseY}`;
    // Deuxième courbe depuis la carte (affaissement)
    path += ` Q ${midPoint2X} ${baseY + sagAmount}, ${endX} ${baseY}`;
  } else if (points.length === 2) {
    // Deux cartes : trois segments avec affaissement
    const [point1, point2] = points;
    const midStart = (startX + point1.x) / 2;
    const midMiddle = (point1.x + point2.x) / 2;
    const midEnd = (point2.x + endX) / 2;

    // Segment 1: début vers première carte
    path += ` Q ${midStart} ${baseY + sagAmount}, ${point1.x} ${baseY}`;
    // Segment 2: première carte vers deuxième carte
    path += ` Q ${midMiddle} ${baseY + sagAmount}, ${point2.x} ${baseY}`;
    // Segment 3: deuxième carte vers fin
    path += ` Q ${midEnd} ${baseY + sagAmount}, ${endX} ${baseY}`;
  } else {
    // Trois cartes ou plus : segments multiples
    const allPoints = [{ x: startX, y: baseY }, ...points, { x: endX, y: baseY }];

    for (let i = 0; i < allPoints.length - 1; i++) {
      const currentPoint = allPoints[i];
      const nextPoint = allPoints[i + 1];
      const midX = (currentPoint.x + nextPoint.x) / 2;

      if (i === 0) {
        // Premier segment
        path += ` Q ${midX} ${baseY + sagAmount}, ${nextPoint.x} ${baseY}`;
      } else {
        // Segments suivants
        path += ` Q ${midX} ${baseY + sagAmount}, ${nextPoint.x} ${baseY}`;
      }
    }
  }

  return path;
};
