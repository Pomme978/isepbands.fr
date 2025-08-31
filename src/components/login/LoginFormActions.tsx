import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';
import Loading from '@/components/ui/Loading';

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
        {loading ? <Loading size="sm" theme="white" /> : t('auth.login.button')}
      </Button>
    </>
  );
}
