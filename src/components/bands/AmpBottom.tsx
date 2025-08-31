'use client';

export default function AmpBottom() {
  return (
    <div className="relative w-full mb-25 md:top-0 -top-1">
      {/* Container principal gris avec border radius bottom */}
      <div
        className="relative w-full h-15 md:h-30 rounded-b-2xl"
        style={{ backgroundColor: '#353945' }}
      >
        {/* Bloc d'angle gauche */}
        <div
          className="absolute bottom-0 left-0 w-7 h-7 md:w-15 md:h-15 rounded-bl-2xl"
          style={{ backgroundColor: '#1F2937' }}
        />

        {/* Bloc d'angle droit */}
        <div
          className="absolute bottom-0 right-0 w-7 h-7 md:w-15 md:h-15 rounded-br-2xl"
          style={{ backgroundColor: '#1F2937' }}
        />
      </div>

      {/* Pieds de l'ampli */}
      <div className="relative">
        {/* Pied gauche */}
        <div
          className="absolute w-15 h-8 md:w-30 md:h-15 rounded-b-2xl left-7 md:left-15"
          style={{
            backgroundColor: '#1F2937',
            top: '0',
          }}
        />

        {/* Pied droit */}
        <div
          className="absolute w-15 h-8 md:w-30 md:h-15 rounded-b-2xl right-7 md:right-15"
          style={{
            backgroundColor: '#1F2937',
            top: '0',
          }}
        />
      </div>
    </div>
  );
}
