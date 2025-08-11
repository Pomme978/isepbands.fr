import { useRouter } from 'next/navigation';
import { Button } from './button';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

interface BackButtonProps {
  variant?: 'ghost' | 'default';
}

export default function BackButton({ variant = 'default' }: BackButtonProps) {
  const router = useRouter();
  return (
    <Button variant={variant} onClick={() => router.back()} size="icon" aria-label="Back">
      <ArrowLeft className="w-4 h-4" />
    </Button>
  );
}
