'use client';

import { useEffect, useState } from 'react';
import CabinetCards from './CabinetCards';

interface CardData {
  title: string;
  content: string;
  stack?: number;
}

interface CabinetDrawersProps {
  drawers: CardData[][];
  scrollProgress: number;
}

export default function CabinetDrawers({ drawers, scrollProgress }: CabinetDrawersProps) {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768; // md breakpoint
  
  // Animation configuration variables
  const DRAWER_FULL_EXTENSION = isMobile ? 200 : 250; // Maximum extension when alone
  const DRAWER_LIMITED_EXTENSION = isMobile ? 120 : 150; // Extension when others are open
  const OVERLAP_THRESHOLD = 0.4; // When other drawers start affecting this one
  const OVERLAP_REDUCTION_FACTOR = 0.6; // How much to reduce extension
  const ANIMATION_STAGGER = 0.25; // Time between drawer animations (0-1)
  const ANIMATION_DURATION = 0.4; // Duration of each drawer animation (0-1)

  return (
    <div className="relative w-full h-full">
      {drawers.map((drawerCards, index) => {
        // Bottom drawer opens first, then middle, then top
        const drawerOrder = drawers.length - 1 - index; // Reverse order: bottom=0, middle=1, top=2
        
        // Calculate individual drawer progress with controlled staggering
        const drawerStartProgress = drawerOrder * ANIMATION_STAGGER;
        const drawerEndProgress = drawerStartProgress + ANIMATION_DURATION;
        
        // Base progress for this drawer
        let individualProgress = Math.min(
          Math.max((scrollProgress - drawerStartProgress) / ANIMATION_DURATION, 0), 
          1
        );

        // Calculate other drawers' progress to prevent overlap
        const otherDrawersProgress = drawers.map((_, otherIndex) => {
          if (otherIndex === index) return 0;
          const otherOrder = drawers.length - 1 - otherIndex;
          const otherStart = otherOrder * ANIMATION_STAGGER;
          const otherProgress = Math.min(Math.max((scrollProgress - otherStart) / ANIMATION_DURATION, 0), 1);
          return otherProgress;
        });
        
        const maxOtherProgress = Math.max(...otherDrawersProgress);
        const hasOverlappingDrawer = maxOtherProgress > OVERLAP_THRESHOLD;
        
        // Determine max extension based on overlap situation
        const maxExtensionForThisDrawer = hasOverlappingDrawer 
          ? DRAWER_LIMITED_EXTENSION 
          : DRAWER_FULL_EXTENSION;
        
        // Apply overlap reduction if needed
        if (hasOverlappingDrawer) {
          individualProgress = Math.min(individualProgress, OVERLAP_REDUCTION_FACTOR);
        }

        // Calculate final extension distance
        const extensionDistance = individualProgress * maxExtensionForThisDrawer;
        
        // Z-index: higher drawers should be on top (reverse order)
        const zIndex = drawers.length - index + 10;

        // Position and styling - all drawers stacked at same position
        const cabinetHeight = 600; // Same as cabinet minHeight
        const drawerHeight = cabinetHeight; // Full height for each drawer
        const drawerTop = 0; // All drawers at same vertical position
        
        const drawerStyle = isMobile 
          ? {
              // Mobile: extend downward
              top: `${drawerTop + extensionDistance}px`,
              left: '20px',
              right: '20px',
              height: `${drawerHeight}px`,
              zIndex,
            }
          : {
              // Desktop: drawers start hidden inside cabinet and slide right to open
              top: `${drawerTop}px`,
              left: '0px', // Fixed position, width extends instead
              width: `${384 + extensionDistance}px`, // Cabinet width (384px) + extension to stay connected
              height: `${drawerHeight}px`,
              zIndex,
            };

        return (
          <div
            key={index}
            className="absolute bg-[#4D596A] rounded-xl shadow-lg"
            style={{
              ...drawerStyle,
              border: '8px solid rgb(31, 41, 55)', // gray-800 border
            }}
          >
            {/* Drawer Handle - Half flattened circle on exterior flank */}
            <div
              className="absolute w-6 h-12 bg-gray-800 z-10"
              style={{
                top: '50%',
                right: '-3px',
                transform: 'translateY(-50%)',
                borderRadius: '0 50px 50px 0',
                clipPath: 'ellipse(50% 80% at 0% 50%)', // Half flattened ellipse
              }}
            />
            
            {/* Drawer Content */}
            <div className="p-4 h-full">
              <CabinetCards cards={drawerCards} />
            </div>
          </div>
        );
      })}
    </div>
  );
}