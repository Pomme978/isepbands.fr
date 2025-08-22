// src/components/board/hooks/useViewportBreakpoints.ts
'use client';

import { useState, useEffect } from 'react';

interface ViewportSize {
  width: number;
  height: number;
}

interface Breakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
}

export const useViewportBreakpoints = () => {
  const [size, setSize] = useState<ViewportSize>({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // Set initial size
    updateSize();

    // Add event listener
    window.addEventListener('resize', updateSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const breakpoints: Breakpoints = {
    isMobile: size.width < 768,
    isTablet: size.width >= 768 && size.width < 1024,
    isDesktop: size.width >= 1024 && size.width < 1280,
    isLarge: size.width >= 1280,
  };

  return {
    size,
    breakpoints,
  };
};
