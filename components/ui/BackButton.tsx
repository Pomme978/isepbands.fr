// components/BackButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { useI18n, useScopedI18n } from '../../locales/client'
import { Button } from "@/components/ui/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface BackButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function BackButton({ 
  className = "", 
  variant = "ghost", 
  size = "sm" 
}: BackButtonProps) {
  const router = useRouter();
  const t = useI18n()

  const handleBack = (): void => {
    // Retour à la page précédente ou à l'accueil si pas d'historique
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={className}
    >
      <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
      {t('common.goback')}
    </Button>
  );
}