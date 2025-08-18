import React from 'react';
import Image from 'next/image';
import Note1 from '@/assets/svg/music_notes/note1.svg';
import Note2 from '@/assets/svg/music_notes/note2.svg';
import Note3 from '@/assets/svg/music_notes/note3.svg';
import Note4 from '@/assets/svg/music_notes/note4.svg';
import Note5 from '@/assets/svg/music_notes/note5.svg';
import Note6 from '@/assets/svg/music_notes/note6.svg';
import Note7 from '@/assets/svg/music_notes/note7.svg';
import Note8 from '@/assets/svg/music_notes/note8.svg';

interface MusicNotesProps {
  className?: string;
}

const MusicNotes: React.FC<MusicNotesProps> = ({ className = '' }) => {
  const notes = [Note1, Note2, Note3, Note4, Note5, Note6, Note7, Note8];

  // Static positions - no useMemo needed for hydration safety
  const positions = [
    { x: -9.7, y: -4.8, rotation: 334, size: 12, noteIndex: 0 },
    { x: -1.5, y: -7.4, rotation: 318, size: 14, noteIndex: 1 },
    { x: 12.9, y: 0.1, rotation: 92, size: 12, noteIndex: 2 },
    { x: 28.3, y: -2.1, rotation: 107, size: 12, noteIndex: 3 },
    { x: 45.4, y: -9.1, rotation: 26, size: 13, noteIndex: 4 },
    { x: 54.2, y: -4.1, rotation: 47, size: 13, noteIndex: 5 },
    { x: 72.9, y: -0.2, rotation: 61, size: 12, noteIndex: 6 },
    { x: 83.1, y: -1.7, rotation: 136, size: 14, noteIndex: 7 },
    { x: 102.3, y: -1, rotation: 159, size: 14, noteIndex: 0 },
    { x: 112.7, y: -5.2, rotation: 279, size: 14, noteIndex: 1 },
    { x: -12.7, y: 23.5, rotation: 213, size: 12, noteIndex: 2 },
    { x: 4.1, y: 15.3, rotation: 160, size: 12, noteIndex: 3 },
    { x: 13.3, y: 16.4, rotation: 150, size: 14, noteIndex: 4 },
    { x: 30.1, y: 22.7, rotation: 131, size: 13, noteIndex: 5 },
    { x: 39.7, y: 15.8, rotation: 295, size: 12, noteIndex: 6 },
    { x: 57.8, y: 16.3, rotation: 193, size: 12, noteIndex: 7 },
    { x: 71.9, y: 27.2, rotation: 143, size: 14, noteIndex: 0 },
    { x: 88, y: 22.7, rotation: 107, size: 13, noteIndex: 1 },
    { x: 98.5, y: 23.7, rotation: 226, size: 12, noteIndex: 2 },
    { x: 112.9, y: 22.8, rotation: 78, size: 14, noteIndex: 3 },
    { x: -15.8, y: 54.3, rotation: 177, size: 13, noteIndex: 4 },
    { x: -1.1, y: 52.9, rotation: 311, size: 13, noteIndex: 5 },
    { x: 14.4, y: 51.9, rotation: 50, size: 13, noteIndex: 6 },
    { x: 31.6, y: 44.3, rotation: 192, size: 14, noteIndex: 7 },
    { x: 41.8, y: 45.2, rotation: 164, size: 13, noteIndex: 0 },
    { x: 58, y: 48.8, rotation: 153, size: 12, noteIndex: 1 },
    { x: 73.9, y: 45.2, rotation: 122, size: 14, noteIndex: 2 },
    { x: 84.5, y: 52.2, rotation: 103, size: 14, noteIndex: 3 },
    { x: 100, y: 43.3, rotation: 198, size: 14, noteIndex: 4 },
    { x: 111.2, y: 43.3, rotation: 58, size: 14, noteIndex: 5 },
    { x: -15.9, y: 73.5, rotation: 41, size: 12, noteIndex: 6 },
    { x: -0.6, y: 71.2, rotation: 283, size: 14, noteIndex: 7 },
    { x: 16.6, y: 80.5, rotation: 330, size: 13, noteIndex: 0 },
    { x: 27.9, y: 84.7, rotation: 210, size: 14, noteIndex: 1 },
    { x: 43.7, y: 80.2, rotation: 42, size: 14, noteIndex: 2 },
    { x: 59, y: 83.3, rotation: 316, size: 13, noteIndex: 3 },
    { x: 74.5, y: 76.8, rotation: 54, size: 12, noteIndex: 4 },
    { x: 81.5, y: 83.5, rotation: 35, size: 12, noteIndex: 5 },
    { x: 97.6, y: 75.1, rotation: 144, size: 13, noteIndex: 6 },
    { x: 114.6, y: 73.8, rotation: 18, size: 12, noteIndex: 7 },
    { x: -10, y: 111.7, rotation: 329, size: 12, noteIndex: 0 },
    { x: -0.6, y: 107.4, rotation: 310, size: 13, noteIndex: 1 },
    { x: 16.3, y: 104.1, rotation: 355, size: 13, noteIndex: 2 },
    { x: 28.7, y: 100.4, rotation: 180, size: 12, noteIndex: 3 },
    { x: 39.7, y: 105.6, rotation: 315, size: 12, noteIndex: 4 },
    { x: 56.4, y: 104, rotation: 148, size: 12, noteIndex: 5 },
    { x: 72.8, y: 104.7, rotation: 342, size: 13, noteIndex: 6 },
    { x: 82.6, y: 107.5, rotation: 282, size: 14, noteIndex: 7 },
    { x: 98.4, y: 101.9, rotation: 194, size: 14, noteIndex: 0 },
    { x: 114.1, y: 99.3, rotation: 249, size: 14, noteIndex: 1 },
  ];

  return (
    <div
      className={`absolute top-0 left-0 w-screen h-screen z-10 pointer-events-none overflow-hidden ${className}`}
      style={{ filter: 'blur(2px)' }}
    >
      <style>{`
        .floating-note {
          animation: float ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
      {positions.map((pos, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: `${pos.size}px`,
            height: `${pos.size}px`,
            transform: `rotate(${pos.rotation}deg)`,
          }}
        >
          <div
            className="floating-note"
            style={{
              animationDuration: `${4 + (index % 3)}s`,
              animationDelay: `${(index % 10) * 0.3}s`,
            }}
          >
            <Image
              src={notes[pos.noteIndex]}
              alt="Music note"
              width={pos.size}
              height={pos.size}
              className="object-contain"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MusicNotes;
