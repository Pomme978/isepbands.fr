// components/VisionNote.tsx
import React from 'react';

export const VisionNote: React.FC = () => {
  return (
    <div className="relative max-w-md mx-auto">
      {/* Post-it Note */}
      <div className="bg-yellow-200 p-6 shadow-lg transform rotate-2 hover:rotate-1 transition-transform duration-300">
        {/* Note header */}
        <div className="text-center mb-4">
          <h3 className="font-bold text-lg text-yellow-900 underline">Notre Vision Pour</h3>
          <h4 className="font-bold text-lg text-yellow-900 underline">L&#39;année 2025-2026 :</h4>
        </div>

        {/* Vision content */}
        <div className="space-y-3 text-sm text-yellow-900 leading-relaxed">
          <p>🎵 Rassembler les passionnés de musique</p>
          <p>🎸 Créer des expériences musicales inoubliables</p>
          <p>🤝 Renforcer les liens entre les étudiants</p>
          <p>🎯 Développer les talents artistiques</p>
          <p>🌟 Faire rayonner l&#39;ISEP par la musique</p>
          <p className="text-center font-bold mt-4 text-yellow-800">#IsepBands2026</p>
        </div>

        {/* Tape effect */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-white/80 rounded shadow-sm"></div>

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
