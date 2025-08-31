'use client';

export default function AmpTweeter() {
  const barHeight = 50; // Hauteur des barres

  return (
    <div
      className="relative w-full flex items-center justify-center my-2 overflow-visible h-[400px] md:h-[450px]"
      style={{
        marginLeft: 'calc(-100vw / 2 + 50%)',
        marginRight: 'calc(-100vw / 2 + 50%)',
        width: '100vw',
      }}
    >
      {/* Barres croisées */}
      <div
        className="absolute bg-gray-800"
        style={{
          height: `${barHeight}px`,
          transform: 'rotate(15deg)',
          top: '50%',
          left: '0',
          right: '0',
          marginTop: `-${barHeight / 2}px`,
          width: '100%',
        }}
      />
      <div
        className="absolute bg-gray-800"
        style={{
          height: `${barHeight}px`,
          transform: 'rotate(-15deg)',
          top: '50%',
          left: '0',
          right: '0',
          marginTop: `-${barHeight / 2}px`,
          width: '100%',
        }}
      />

      {/* Cercle principal avec séparation diagonale */}
      <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden bg-gray-800 z-10">
        {/* Moitié supérieure avec rotation */}
        <div
          className="absolute w-full h-full"
          style={{
            background: `linear-gradient(-130deg, #1F2937 50%, #353945 50%)`,
          }}
        />

        {/* Textes autour du cercle */}
        <span className="absolute top-12 md:top-16 left-1/2 -translate-x-1/2 text-gray-300 font-bold text-xs md:text-sm whitespace-nowrap text-center">
          MEET-UPS
        </span>
        <span className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 text-gray-300 font-bold text-xs md:text-sm whitespace-nowrap text-center">
          RECORDINGS
        </span>
        <span className="absolute left-12 md:left-16 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-xs md:text-sm whitespace-nowrap text-center">
          JAMS
        </span>
        <span className="absolute right-12 md:right-16 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-xs md:text-sm whitespace-nowrap text-center">
          SHOWS
        </span>

        {/* Cercle intérieur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-36 md:h-36 rounded-full bg-gray-600 flex items-center justify-center p-3">
          <h3 className="text-white font-black text-center text-xs md:text-sm leading-tight">
            WHAT YOU DO
            <br />
            IN A BAND
          </h3>
        </div>
      </div>
    </div>
  );
}
