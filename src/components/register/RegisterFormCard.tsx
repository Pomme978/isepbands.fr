import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface RegisterFormCard {
  children: ReactNode;
}

export default function RegisterFormCard({ children }: RegisterFormCard) {
  return <Card className="w-full max-w-lg p-6 space-y-6">{children}</Card>;
}
