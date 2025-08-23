// src/components/team/hooks/useGarlandLayout.ts
'use client';

import { useMemo } from 'react';
import { useViewportBreakpoints } from './useViewportBreakpoints';
import { getCardsPerRow, getTotalRows } from '../utils/garlandMath';
import { generateAttachmentPoints, AttachmentPoint } from '../utils/attachmentPoints';

interface GarlandLayout {
  cardsPerRow: number;
  totalRows: number;
  attachmentPoints: AttachmentPoint[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  motto?: string;
  profilePhoto?: string;
  role: string;
}

/**
 * Hook qui calcule le layout de la guirlande selon le viewport
 */
export const useGarlandLayout = (users: User[]): GarlandLayout => {
  const { size } = useViewportBreakpoints();

  const layout = useMemo(() => {
    const totalCards = users.length;

    if (totalCards === 0) {
      return {
        cardsPerRow: 0,
        totalRows: 0,
        attachmentPoints: [],
      };
    }

    // Calcule combien de cartes peuvent tenir par ligne
    const cardsPerRow = getCardsPerRow(size.width, totalCards);

    // Calcule le nombre de lignes nécessaires
    const totalRows = getTotalRows(totalCards, cardsPerRow);

    // Génère tous les points d'accroche
    const attachmentPoints = generateAttachmentPoints(cardsPerRow, totalCards);

    return {
      cardsPerRow,
      totalRows,
      attachmentPoints,
    };
  }, [users.length, size.width]);

  return layout;
};
