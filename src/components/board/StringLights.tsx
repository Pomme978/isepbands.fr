// components/board/StringLights.tsx
import React from 'react';
import Image from 'next/image';

// Import des SVG statiques
import guirlande1 from '@/assets/svg/guirlande1.svg';
import guirlande2 from '@/assets/svg/guirlande2.svg';
import guirlande3 from '@/assets/svg/guirlande3.svg';
import starYellow from '@/assets/svg/star_yellow.svg';
import circleYellow from '@/assets/svg/circle_yellow.svg';
import starBlue from '@/assets/svg/star_blue.svg';
import circleBlue from '@/assets/svg/circle_blue.svg';

interface StringLightsProps {
  className?: string;
  cardCount: number;
  spacing?: 'normal' | 'wide';
  lightType?: 'yellow' | 'blue';
}

export const StringLights: React.FC<StringLightsProps> = ({
  className = '',
  cardCount,
  spacing = 'normal',
  lightType = 'yellow',
}) => {
  // Get random guirlande SVG (1-3)
  const getGuirlandeNumber = () => Math.floor(Math.random() * 3) + 1;
  const guirlandeNumber = getGuirlandeNumber();

  const guirlandeAssets = [guirlande1, guirlande2, guirlande3];
  const selectedGuirlande = guirlandeAssets[guirlandeNumber - 1];

  // Positions des lumières réparties uniformément sur la largeur
  // On évite les zones où seront placées les clothespins
  const getLightPositions = () => {
    const positions = [];

    if (cardCount === 1) {
      // Pour 1 carte, clothespin au centre (50%)
      const lightSpots = [8, 15, 22, 30, 38, 62, 70, 78, 85, 92];
      return lightSpots.map((x) => ({ x, y: 60 })); // y=60 pour être sur le fil de la guirlande
    } else if (cardCount === 2) {
      // Pour 2 cartes, clothespins à 33% et 67%
      const lightSpots = [5, 12, 20, 27, 40, 47, 53, 60, 73, 80, 87, 95];
      return lightSpots.map((x) => ({ x, y: 60 }));
    } else if (cardCount === 3) {
      // Pour 3 cartes, clothespins à 25%, 50%, 75%
      const lightSpots = [3, 8, 15, 20, 30, 35, 40, 55, 60, 65, 80, 85, 92, 97];
      return lightSpots.map((x) => ({ x, y: 60 }));
    } else {
      // Pour 4+ cartes
      const lightSpots = [2, 6, 12, 16, 24, 28, 36, 40, 48, 52, 60, 64, 72, 76, 84, 88, 94, 98];
      return lightSpots.map((x) => ({ x, y: 60 }));
    }
  };

  const lightPositions = getLightPositions();

  // Positions des clothespins (où il ne faut pas de lumières)
  const getClothespinPositions = () => {
    if (cardCount === 1) {
      return [50];
    } else if (cardCount === 2) {
      return [33, 67];
    } else if (cardCount === 3) {
      return [25, 50, 75];
    } else {
      return [20, 44, 68];
    }
  };

  const clothespinPositions = getClothespinPositions();

  // Available light assets
  const lightAssets = {
    yellow: [starYellow, circleYellow],
    blue: [starBlue, circleBlue],
  };

  const getRandomLightAsset = () => {
    const assets = lightAssets[lightType];
    return assets[Math.floor(Math.random() * assets.length)];
  };

  // Filtrer les lumières qui sont trop proches des clothespins
  const filteredLights = lightPositions.filter((light) => {
    return !clothespinPositions.some(
      (clothespinX) => Math.abs(light.x - clothespinX) < 6, // 6% de distance minimum
    );
  });

  return (
    <div className={`w-full h-32 relative ${className}`}>
      {/* Guirlande background - étirée sur toute la largeur */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={selectedGuirlande}
          alt="Guirlande"
          fill
          className="object-fill w-full h-full" // object-fill pour étirer sur toute la largeur
          style={{
            objectFit: 'fill', // Force l'étirement
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {/* Lights positioned on the guirlande */}
      <div className="absolute inset-0">
        {filteredLights.map((position, index) => {
          const lightAsset = getRandomLightAsset();
          const animationDelay = index * 0.15;

          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`, // Position sur le fil de la guirlande
              }}
            >
              <Image
                src={lightAsset}
                alt="Light"
                width={40} // Plus grandes
                height={40}
                className="animate-pulse drop-shadow-xl"
                style={{
                  animationDelay: `${animationDelay}s`,
                  animationDuration: '2s',
                  filter: `brightness(1.4) drop-shadow(0 0 12px ${lightType === 'yellow' ? '#fbbf24' : '#3b82f6'})`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
