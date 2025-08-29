'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/utils/utils';

interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  variant?: 'default' | 'transparent';
}

function Switch({ className, variant = 'default', ...props }: SwitchProps) {
  const switchClasses =
    variant === 'transparent'
      ? 'peer data-[state=checked]:bg-white/30 data-[state=unchecked]:bg-white/10 focus-visible:border-white/50 focus-visible:ring-white/30 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-white/20 backdrop-blur-sm transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50'
      : 'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

  const thumbClasses =
    variant === 'transparent'
      ? 'bg-white pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0'
      : 'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0';

  return (
    <SwitchPrimitive.Root data-slot="switch" className={cn(switchClasses, className)} {...props}>
      <SwitchPrimitive.Thumb data-slot="switch-thumb" className={cn(thumbClasses)} />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
