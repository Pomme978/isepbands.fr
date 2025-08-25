import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/locales/client';
import { useState, useEffect } from 'react';

interface BackButtonProps {
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive';
  withIcon?: boolean;
  withText?: boolean;
}

export default function BackButton({
  variant = 'default',
  withIcon = true,
  withText = true,
}: BackButtonProps) {
  const router = useRouter();
  const t = useI18n();
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    // Check if there's browser history to go back to
    // We'll use document.referrer as it's more reliable than window.history.length
    const hasReferrer = document.referrer && document.referrer !== window.location.href;
    const hasHistoryEntries = window.history.length > 1;
    setHasHistory(hasReferrer || hasHistoryEntries);
  }, []);

  // Don't render the button if there's no history
  if (!hasHistory) {
    return null;
  }

  return (
    <Button
      variant={variant}
      onClick={() => router.back()}
      size={withText ? 'default' : 'icon'}
      aria-label="Back"
    >
      {withIcon && <ArrowLeft />}
      {withText && t('common.goback')}
    </Button>
  );
}
