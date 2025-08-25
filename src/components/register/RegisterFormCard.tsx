import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface RegisterFormCard {
  children: ReactNode;
}

export default function RegisterFormCard({ children }: RegisterFormCard) {
  return <Card className="w-full max-w-2xl bg-white rounded-lg shadow-xl">{children}</Card>;
}
