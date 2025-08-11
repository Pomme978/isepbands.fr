import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-client';
import PendingValidationBanner from '@/components/ui/PendingValidationBanner';

export function PendingValidationOnLogin() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user && user.status === 'INACTIVE') {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [user]);

  if (!show) return null;
  return <PendingValidationBanner name={user?.name} open={show} onOpenChange={setShow} />;
}
