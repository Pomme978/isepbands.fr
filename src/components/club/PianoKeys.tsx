import React, { useState, useEffect, useRef } from 'react';

const PianoKeys = ({ title = "L'ASSOCIATION", subtitle = 'QUI SOMMES-NOUS ?' }) => {
  const [screenWidth, setScreenWidth] = useState(0);

  // Fonction pour calculer le nombre de groupes en fonction de la largeur de l'écran
  const calculateGroups = (width) => {
    if (width < 768) {
      // Mobile: calculer pour remplir exactement l'écran sans débordement
      const keyWidth = 16; // w-4 = 16px (garder la taille originale)
      const gapWidth = 12; // gap-3 = 12px (réduire légèrement les gaps)
      const padding = 32; // px-4 = 32px total
      const centralGap = 12; // gap central
      const availableWidth = width - padding - centralGap;

      // Calculer combien de touches on peut mettre de chaque côté
      const keysPerSide = Math.floor(availableWidth / (2 * (keyWidth + gapWidth)));
      const groupsPerSide = Math.max(1, Math.floor(keysPerSide / 3)); // 3 touches par groupe en moyenne

      return { leftGroups: groupsPerSide, rightGroups: groupsPerSide };
    }

    // Desktop: calculer pour remplir l'écran entier
    const keyWidth = 24; // w-6 = 24px
    const gapWidth = 16; // gap-4 = 16px
    const padding = 32; // px-4 = 32px total
    const titleSpace = 300; // Augmenter l'espace réservé pour le titre
    const availableWidth = width - padding - titleSpace;

    // Recalculer avec les nouveaux gaps
    const groupWidth = 3 * keyWidth + 2 * gapWidth + 16; // 3 touches + gaps internes + gap entre groupes
    const smallGroupWidth = 2 * keyWidth + gapWidth + 16; // 2 touches + gaps internes + gap entre groupes
    const avgGroupWidth = (groupWidth + smallGroupWidth) / 2;

    const totalGroups = Math.floor(availableWidth / avgGroupWidth);
    const groupsPerSide = Math.max(2, Math.floor(totalGroups / 2)); // Réduire le minimum

    return {
      leftGroups: Math.min(groupsPerSide, 6), // Réduire le maximum
      rightGroups: Math.min(groupsPerSide, 6),
    };
  };

  // Fonction pour gérer le redimensionnement
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize(); // Initial calculation
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { leftGroups, rightGroups } = calculateGroups(screenWidth);

  // Fonction pour générer un groupe de 3 touches
  const renderThreeKeys = (heightClass = 'h-32 md:h-24') => (
    <div className="flex gap-3 md:gap-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className={`w-4 md:w-6 ${heightClass} bg-gray-800 rounded-b-sm`} />
      ))}
    </div>
  );

  // Fonction pour générer un groupe de 2 touches
  const renderTwoKeys = (heightClass = 'h-32 md:h-24') => (
    <div className="flex gap-3 md:gap-4">
      {[...Array(2)].map((_, index) => (
        <div key={index} className={`w-4 md:w-6 ${heightClass} bg-gray-800 rounded-b-sm`} />
      ))}
    </div>
  );

  // Génère les groupes de touches dynamiquement
  const renderKeyGroups = (numGroups, heightClass) => {
    const groups = [];
    for (let i = 0; i < numGroups; i++) {
      const isThreeKeys = i % 2 === 0; // Alterne entre 3 et 2 touches
      groups.push(
        <React.Fragment key={i}>
          {isThreeKeys ? renderThreeKeys(heightClass) : renderTwoKeys(heightClass)}
          {i < numGroups - 1 && <div className="w-3 md:w-4" />}
        </React.Fragment>,
      );
    }
    return groups;
  };

  return (
    <div className="w-full absolute top-0 left-0 z-40 overflow-x-hidden">
      {/* Version Desktop */}
      <div className="hidden md:block">
        <div className="flex items-end w-full px-4 overflow-x-hidden">
          <div className="flex gap-4 w-full justify-center min-w-0">
            {/* Touches de gauche */}
            {renderKeyGroups(leftGroups, 'h-52')}

            {/* Séparateur avec gap uniforme */}
            <div className="w-4" />

            {/* Titre centré */}
            <div className="flex flex-col items-between justify-center h-full">
              <div className="flex gap-4">{renderKeyGroups(3, 'h-30')}</div>
              <div className="text-center mt-4">
                <h1 className="text-4xl font-black text-gray-900 tracking-wider">{title}</h1>
                <p className="text-xl font-black text-gray-900 mt-1 tracking-wide">{subtitle}</p>
              </div>
            </div>

            {/* Séparateur avec gap uniforme */}
            <div className="w-4" />

            {/* Touches de droite */}
            {renderKeyGroups(rightGroups, 'h-52')}
          </div>
        </div>
      </div>

      {/* Version Mobile */}
      <div className="md:hidden">
        <div className="flex justify-center items-center gap-3 px-4 mb-6 overflow-x-hidden">
          {/* Touches générées dynamiquement pour mobile */}
          <div className="flex gap-3 w-full justify-center min-w-0">
            {renderKeyGroups(leftGroups, 'h-25')}
            <div className="w-3" />
            {renderTwoKeys('h-25')}
            <div className="w-3" />
            {renderKeyGroups(rightGroups, 'h-25')}
          </div>
        </div>

        {/* Titre en dessous sur mobile */}
        <div className="text-center px-6">
          <h1 className="text-4xl font-black text-gray-900 tracking-wider">{title}</h1>
          <p className="text-xl text-gray-900 font-black mt-0 tracking-wide">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default PianoKeys;
