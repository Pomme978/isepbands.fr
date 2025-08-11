import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface LoginFormCardProps {
  children: ReactNode;
}

export default function LoginFormCard({ children }: LoginFormCardProps) {
  return (
    <Card className="w-full max-w-md p-6 h-screen md:h-full flex justify-center space-y-6 border-none md:border shadow-none md:shadow-lg">
      {children}
    </Card>
  );
}
