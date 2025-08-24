// hooks/useActivityHistory.ts
'use client';

import { useState } from 'react';
import type { ActivityType } from '@/types/activity';

interface UseActivityHistoryProps {
  activities: ActivityType[];
  title?: string;
}

interface UseActivityHistoryReturn {
  openHistory: () => void;
  closeHistory: () => void;
  isOpen: boolean;
  modalProps: {
    activities: ActivityType[];
    isOpen: boolean;
    onClose: () => void;
    title: string;
  };
}

export const useActivityHistory = ({
  activities,
  title = 'Historique complet des activités',
}: UseActivityHistoryProps): UseActivityHistoryReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const openHistory = () => setIsOpen(true);
  const closeHistory = () => setIsOpen(false);

  return {
    openHistory,
    closeHistory,
    isOpen,
    modalProps: {
      activities,
      isOpen,
      onClose: closeHistory,
      title,
    },
  };
};
