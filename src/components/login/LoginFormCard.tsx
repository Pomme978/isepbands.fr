import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface LoginFormCardProps {
  children: ReactNode;
}

export default function LoginFormCard({ children }: LoginFormCardProps) {
  return <Card className="w-full max-w-md p-6 space-y-6">{children}</Card>;
}
