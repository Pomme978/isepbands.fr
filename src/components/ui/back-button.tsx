import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/locales/client';

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
