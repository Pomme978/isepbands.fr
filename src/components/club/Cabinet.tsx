'use client';

import { useEffect, useState } from 'react';
import CabinetDrawers from './CabinetDrawers';

interface CardData {
  title: string;
  content: string;
  stack?: number;
}

interface CabinetProps {
  numberOfDrawers: number;
  cards: CardData[];
}

export default function Cabinet({ numberOfDrawers, cards }: CabinetProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('cabinet');
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Start animation when element enters viewport - more gradual
      const startPoint = windowHeight - 100; // Start earlier
      const endPoint = -elementHeight + 200; // End later
      
      if (elementTop <= startPoint && elementTop >= endPoint) {
        const progress = (startPoint - elementTop) / (startPoint - endPoint);
        // Smooth easing function for more fluid movement
        const easedProgress = progress * progress * (3 - 2 * progress); // smoothstep
        setScrollProgress(Math.min(Math.max(easedProgress, 0), 1));
      } else if (elementTop > startPoint) {
        setScrollProgress(0);
      } else if (elementTop < endPoint) {
        setScrollProgress(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call to set correct state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Distribute cards across drawers
  const distributeCards = (cards: CardData[], numDrawers: number) => {
    const cardsPerDrawer = Math.ceil(cards.length / numDrawers);
    const drawers: CardData[][] = [];
    
    for (let i = 0; i < numDrawers; i++) {
      drawers[i] = [];
    }
    
    // Distribute cards evenly, avoiding empty drawers
    let currentDrawer = 0;
    for (let i = 0; i < cards.length; i++) {
      drawers[currentDrawer].push(cards[i]);
      
      // Move to next drawer if current has enough cards
      if (drawers[currentDrawer].length >= cardsPerDrawer && currentDrawer < numDrawers - 1) {
        // Check if remaining cards can fill remaining drawers
        const remainingCards = cards.length - i - 1;
        const remainingDrawers = numDrawers - currentDrawer - 1;
        if (remainingCards >= remainingDrawers) {
          currentDrawer++;
        }
      }
    }
    
    return drawers.filter(drawer => drawer.length > 0);
  };

  const distributedCards = distributeCards(cards, numberOfDrawers);

  return (
    <div className="relative w-full py-16">
      <div
        id="cabinet"
        className="relative bg-gray-800 rounded-xl shadow-2xl w-full md:w-96 md:ml-0"
        style={{ minHeight: '600px' }}
      >
        {/* Cabinet Title */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center whitespace-nowrap">
            CE QU'ON PROPOSE
          </h2>
        </div>

        {/* Cabinet Drawers */}
        <CabinetDrawers
          drawers={distributedCards}
          scrollProgress={scrollProgress}
        />


        {/* Cabinet Front Cover - higher z-index to hide drawers */}
        <div 
          className="absolute inset-0 bg-gray-800 rounded-xl pointer-events-none"
          style={{
            zIndex: Math.max(...distributedCards.map((_, i) => distributedCards.length - i + 10)) + 10, // Higher than all drawers
          }}
        />
      </div>
    </div>
  );
}