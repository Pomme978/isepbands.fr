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
  isMobile: boolean;
}

export default function CabinetDrawers({ drawers, scrollProgress, isMobile }: CabinetDrawersProps) {

  // =============================================================================
  // CONFIGURATION VARIABLES - Adjust these to fine-tune the cabinet behavior
  // =============================================================================

  // Card dimensions
  const CARD_WIDTH = isMobile ? 192 : 160; // w-48 on mobile (12rem = 192px), w-40 on desktop (10rem = 160px)
  const CARD_SPACING = 24; // gap-6 = 1.5rem = 24px between cards (increased)
  const DRAWER_PADDING = 24; // p-6 = 1.5rem = 24px
  const CARDS_TOTAL_WIDTH = CARD_WIDTH + DRAWER_PADDING; // Space needed for 1 card + padding

  // Drawer extensions - adjust these values to control how far each drawer opens
  const DRAWER_EXTENSIONS = {
    mobile: 300, // Mobile vertical spacing between drawers - much bigger opening
    desktop: [650, 430, 220, 100], // Bottom to top drawer extensions - can handle any number of cards
  };

  // Animation timing - adjust these to control when and how fast drawers open
  const ANIMATION_CONFIG = {
    mobile: {
      stagger: 0.2, // Time between each drawer starting to open
      duration: 0.4, // How long each drawer takes to fully open
      startEarlier: -0.35, // Start earlier so last drawer finishes at 150% scroll
    },
    desktop: {
      stagger: 0.08, // Closer together on desktop
      duration: 0.4, // Longer duration for smoother animation
      startEarlier: 0.1, // Start later on desktop (10% earlier instead of 30%)
    },
  };

  // Z-index spacing
  const Z_INDEX_SPACING = 10; // Space between drawer z-indexes

  // =============================================================================
  // END CONFIGURATION
  // =============================================================================

  // Fixed extensions based on drawer position
  const getDrawerExtension = (drawerIndex: number, totalDrawers: number) => {
    if (isMobile) {
      // Mobile: each drawer extends downward - all drawers need some extension
      const drawerOrder = totalDrawers - 1 - drawerIndex; // Bottom drawer = 0, top drawer = max
      // Add minimum extension so even the last drawer extends
      return (drawerOrder + 1) * DRAWER_EXTENSIONS.mobile; // 300, 600, 900, 1200, etc.
    }

    const drawerOrder = totalDrawers - 1 - drawerIndex;
    return (
      DRAWER_EXTENSIONS.desktop[drawerOrder] ||
      DRAWER_EXTENSIONS.desktop[DRAWER_EXTENSIONS.desktop.length - 1]
    );
  };

  console.log('CabinetDrawers render:', {
    drawersCount: drawers.length,
    isMobile,
    drawersContent: drawers.map((d, i) => ({
      index: i,
      cardCount: d.length,
      firstCard: d[0]?.title,
    })),
  });

  return (
    <div className="relative w-full h-full mx-auto">
      {drawers.map((drawerCards, index) => {
        // Bottom drawer opens first, then middle, then top
        const drawerOrder = drawers.length - 1 - index; // Reverse order: bottom=0, middle=1, top=2

        // Fixed animation timing for each drawer - different for mobile/desktop
        const config = isMobile ? ANIMATION_CONFIG.mobile : ANIMATION_CONFIG.desktop;
        const drawerStartProgress = Math.max(0, drawerOrder * config.stagger - config.startEarlier);
        const drawerEndProgress = drawerStartProgress + config.duration;

        // Calculate progress for this specific drawer - no returning to initial position
        let individualProgress = 0;
        if (scrollProgress >= drawerStartProgress) {
          if (scrollProgress >= drawerEndProgress) {
            individualProgress = 1; // Stay fully extended once reached
          } else {
            individualProgress = (scrollProgress - drawerStartProgress) / config.duration;
          }
        }

        // Get fixed extension for this drawer
        const maxExtension = getDrawerExtension(index, drawers.length);

        // Calculate final extension distance
        const extensionDistance = individualProgress * maxExtension;

        // Z-index: on mobile, make sure all drawers are visible (reverse z-index order)
        const zIndex = isMobile
          ? index * Z_INDEX_SPACING + 10 // Mobile: first drawer (bottom) has lowest z-index, last drawer (top) has highest
          : (drawers.length - index) * Z_INDEX_SPACING + 10; // Desktop: reverse order

        // Debug pour voir les extensions
        if (isMobile) {
          console.log(`Drawer ${index} (${drawerCards[0]?.title}):`, {
            drawerOrder,
            individualProgress: individualProgress.toFixed(2),
            maxExtension,
            extensionDistance: extensionDistance.toFixed(2),
            zIndex,
          });
        }

        // Position and styling - center drawers vertically in cabinet
        const cabinetHeight = isMobile ? 300 : 600; // Cabinet height
        const drawerHeight = isMobile ? cabinetHeight : 580; // Smaller drawer height on desktop
        const drawerTop = isMobile ? 0 : (cabinetHeight - drawerHeight) / 2; // Center vertically on desktop

        const drawerStyle = isMobile
          ? {
              // Mobile: extend downward but height reaches back to cabinet
              top: `${drawerTop}px`, // Start at cabinet top
              left: '0',
              right: '0',
              height: `${drawerHeight + extensionDistance}px`, // Height extends to cover the extension distance
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

        // Don't render empty drawers
        if (drawerCards.length === 0) {
          return null;
        }

        return (
          <div
            key={index}
            className="absolute bg-[#4D596A] rounded-xl"
            style={{
              ...drawerStyle,
              border: '15px solid rgb(31, 41, 55)', // gray-800 border - uniform on all sides
              boxSizing: 'border-box', // Include border in width/height calculations
              boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)', // Strong shadow
            }}
          >
            {/* Drawer Handle - Half flattened circle positioned */}
            <div
              className="absolute w-8 h-18 bg-gray-800 z-10"
              style={
                isMobile
                  ? {
                      // Mobile: positioned at bottom, facing down
                      bottom: '-30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      borderRadius: '0 0 100px 100px', // Half circle facing up
                      clipPath: 'ellipse(100% 50% at 50% 100%)', // Half flattened ellipse facing up
                      width: '72px', // w-18 = 4.5rem = 72px
                      height: '32px', // h-8 = 2rem = 32px
                    }
                  : {
                      // Desktop: positioned at right side, facing right
                      top: '50%',
                      right: '-25px',
                      transform: 'translateY(-50%)',
                      borderRadius: '0 100px 100px 0', // Half circle facing right
                      clipPath: 'ellipse(50% 100% at 100% 50%)', // Half flattened ellipse facing right
                    }
              }
            />

            {/* Drawer Content - only show if drawer has cards */}
            {drawerCards.length > 0 && (
              <div
                className="p-6 h-full"
                style={
                  isMobile
                    ? {
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        height: `${drawerHeight}px`, // Original drawer height for content
                      }
                    : {}
                }
              >
                <CabinetCards cards={drawerCards} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
