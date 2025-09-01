import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface RegisterFormCard {
  children: ReactNode;
}

export default function RegisterFormCard({ children }: RegisterFormCard) {
  return (
    <Card className="w-full max-w-2xl md:bg-white md:rounded-lg shadow-none bg-transparent md:shadow-xl">
      {children}
    </Card>
  );
}
