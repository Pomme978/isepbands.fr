import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface LoginFormCardProps {
  children: ReactNode;
}

export default function LoginFormCard({ children }: LoginFormCardProps) {
  return (
    <Card className="w-full max-w-md p-6 h-full flex justify-center space-y-0 border shadow-lg md:bg-white bg-transparent md:border border-none md:shadow-md shadow-none">
      {children}
    </Card>
  );
}
