import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';

interface LoginFormActionsProps {
  loading: boolean;
  error: string | null;
}

export default function LoginFormActions({ loading, error }: LoginFormActionsProps) {
  const t = useI18n();
  return (
    <>
      {error && (
        <div className="text-sm text-red-500" role="alert">
          {error}
        </div>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? t('common.loading') : t('auth.login.button')}
      </Button>
    </>
  );
}
