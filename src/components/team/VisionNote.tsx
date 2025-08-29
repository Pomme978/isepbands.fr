// components/VisionNote.tsx
import React from 'react';
import Image from 'next/image';
import pinIcon from '@/assets/svg/pin.svg';

interface VisionNoteProps {
  vision?: string;
}

export const VisionNote: React.FC<VisionNoteProps> = ({ vision }) => {
  const defaultVision = `🎵 Rassembler les passionnés de musique
🎸 Créer des expériences musicales inoubliables
🤝 Renforcer les liens entre les étudiants
🎯 Développer les talents artistiques
🌟 Faire rayonner l'ISEP par la musique`;

  const visionText = vision || defaultVision;

  return (
    <div className="relative max-w-md mx-auto">
      {/* Pin */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
        <Image src={pinIcon} alt="Pin" width={34} height={42} className="drop-shadow-md" />
      </div>

      {/* Post-it Note */}
      <div className="bg-yellow-200 p-6 shadow-lg font-handrawn transform rotate-2 hover:rotate-1 transition-transform duration-300">
        {/* Note header */}
        <div className="text-center mb-4">
          <h2 className="font-bold text-lg text-yellow-900 underline">Notre Vision Pour</h2>
          <h3 className="font-bold text-lg text-yellow-900 underline">L&#39;année 2025-2026 :</h3>
        </div>

        {/* Vision content */}
        <div className="space-y-3 text-md text-yellow-900 leading-relaxed">
          {visionText.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
          <p className="text-center font-bold mt-4 text-yellow-800">#IsepBands2026</p>
        </div>

        {/* Paper texture lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-px bg-yellow-600 absolute left-4 right-4"
              style={{ top: `${60 + i * 20}px` }}
            />
          ))}
        </div>
      </div>

      {/* Shadow */}
      <div className="absolute inset-0 bg-black/10 transform translate-x-1 translate-y-1 -z-10 rounded"></div>
    </div>
  );
};
