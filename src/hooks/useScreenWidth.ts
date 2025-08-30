'use client';

import { useState, useEffect } from 'react';

export function useScreenWidth(): number {
  const [screenWidth, setScreenWidth] = useState(1024); // Default fallback value

  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    // Initial check
    updateScreenWidth();

    // Add event listener
    window.addEventListener('resize', updateScreenWidth);

    // Cleanup
    return () => window.removeEventListener('resize', updateScreenWidth);
  }, []);

  return screenWidth;
}
