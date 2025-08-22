// src/components/board/utils/attachmentPoints.ts

import { getCardPositionsForRow, getTotalRows } from './garlandMath';

export interface AttachmentPoint {
  x: number;
  y: number;
  type: 'card' | 'light';
  cardIndex?: number;
  lightIndex?: number;
}

/**
 * Génère uniquement les points d'accroche pour les cartes
 * Les lumières sont maintenant gérées par les points de croisement
 */
export const generateAttachmentPoints = (
  cardsPerRow: number,
  totalCards: number,
): AttachmentPoint[] => {
  const points: AttachmentPoint[] = [];
  const rows = getTotalRows(totalCards, cardsPerRow);

  for (let row = 0; row < rows; row++) {
    const cardsInThisRow = Math.min(cardsPerRow, totalCards - row * cardsPerRow);

    // Points d'accroche UNIQUEMENT pour les cartes
    const cardPositions = getCardPositionsForRow(cardsInThisRow);
    cardPositions.forEach((x, col) => {
      const cardIndex = row * cardsPerRow + col;
      points.push({
        x,
        y: 40, // Hauteur de base - sera ajustée par les points de croisement
        type: 'card',
        cardIndex,
      });
    });

    // Plus de génération de lumières ici !
    // Les lumières sont maintenant aux points de croisement uniquement
  }

  return points;
};

/**
 * Filtre les points par type
 */
export const filterPointsByType = (
  points: AttachmentPoint[],
  type: 'card' | 'light',
): AttachmentPoint[] => {
  return points.filter((point) => point.type === type);
};

/**
 * Obtient les points de cartes uniquement
 */
export const getCardPoints = (points: AttachmentPoint[]): AttachmentPoint[] => {
  return filterPointsByType(points, 'card');
};

/**
 * Obtient les points de lumières uniquement (maintenant vide)
 */
export const getLightPoints = (points: AttachmentPoint[]): AttachmentPoint[] => {
  return filterPointsByType(points, 'light');
};
