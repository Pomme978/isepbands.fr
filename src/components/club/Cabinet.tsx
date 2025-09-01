'use client';

import { useEffect, useState, useMemo } from 'react';
import CabinetDrawers from './CabinetDrawers';

interface CardData {
  title: string;
  content: string;
  stack?: number;
}

interface CabinetProps {
  cards: CardData[];
}

export default function Cabinet({ cards }: CabinetProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Set mobile state
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Recalculate scroll progress after resize to fix positioning
      setTimeout(() => {
        handleScroll();
      }, 100);
    };
    window.addEventListener('resize', handleResize);

    const handleScroll = () => {
      const element = document.getElementById('cabinet');
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Start animation when element enters viewport - more gradual
      const startPoint = windowHeight - 100; // Start earlier
      const endPoint = -elementHeight - 200; // End much later to allow reaching 1.5

      if (elementTop <= startPoint && elementTop >= endPoint) {
        const progress = (startPoint - elementTop) / (startPoint - endPoint);
        // Linear progression for constant speed on mobile
        const finalProgress = progress * 1.5;
        setScrollProgress(Math.min(Math.max(finalProgress, 0), 1.5));
      } else if (elementTop > startPoint) {
        setScrollProgress(0);
      } else if (elementTop < endPoint) {
        setScrollProgress(1.5); // Set to 150% when fully scrolled
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call to set correct state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Distribution logic: mobile = 1 card per drawer, desktop = distribute across 3 drawers
  const createDrawers = (cards: CardData[]) => {
    console.log('createDrawers called:', { isMobile, cardsLength: cards.length });
    if (isMobile) {
      // Mobile: 1 card per drawer
      const result = cards.map((card) => [card]);
      console.log('Mobile distribution:', result.length, 'drawers');
      return result;
    } else {
      // Desktop: distribute across 3 drawers
      const drawers: CardData[][] = [[], [], []];
      cards.forEach((card, index) => {
        const drawerIndex = index % 3; // Round-robin distribution across 3 drawers
        drawers[drawerIndex].push(card);
      });
      console.log('Desktop distribution:', drawers.length, 'drawers');
      return drawers;
    }
  };

  const distributedCards = useMemo(() => createDrawers(cards), [cards, isMobile]);

  return (
    <div
      className={`relative w-full py-16 overflow-x-hidden ${isMobile ? 'overflow-y-hidden' : 'overflow-y-visible'}`}
    >
      <div
        id="cabinet"
        className="relative bg-gray-800 rounded-xl shadow-2xl w-full md:w-80 lg:w-96"
        style={{ minHeight: isMobile ? '300px' : '600px' }}
      >
        {/* Cabinet Title - higher z-index */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{ zIndex: 999 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center whitespace-nowrap">
            CE QU&apos;ON PROPOSE
          </h2>
        </div>

        {/* Cabinet Drawers */}
        <CabinetDrawers
          drawers={distributedCards}
          scrollProgress={scrollProgress}
          isMobile={isMobile}
        />

        {/* Cabinet Front Cover - higher z-index to hide drawers */}
        <div
          className="absolute inset-0 bg-gray-800 rounded-xl pointer-events-none"
          style={{
            zIndex:
              Math.max(...distributedCards.map((_, i) => (distributedCards.length - i) * 10 + 10)) +
              20, // Higher than all drawers
          }}
        />
      </div>

      {/* Space for mobile drawers extending downward */}
      {isMobile && <div style={{ height: `${cards.length * 300}px` }} />}
    </div>
  );
}
