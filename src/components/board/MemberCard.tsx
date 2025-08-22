// components/board/MemberCard.tsx
import React from 'react';
import Image from 'next/image';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  motto?: string;
  profilePhoto?: string;
  role: string;
}

interface MemberCardProps {
  user: User | null;
  roleDisplay: string;
  className?: string;
  variant?: 'president' | 'executive' | 'pole';
}

export const MemberCard: React.FC<MemberCardProps> = ({
  user,
  roleDisplay,
  className = '',
  variant = 'executive',
}) => {
  // Déterminer la couleur du cadre selon le variant
  const getBorderColor = () => {
    switch (variant) {
      case 'president':
        return 'border-yellow-400';
      case 'pole':
        return 'border-blue-400';
      default:
        return 'border-purple-400';
    }
  };

  if (!user) {
    return (
      <div className={`relative ${className}`}>
        {/* Carte polaroid */}
        <div
          className={`w-64 h-80 bg-white rounded-xl shadow-2xl p-3 transform hover:rotate-3 transition-all duration-300 hover:scale-105 cursor-pointer border-4 ${getBorderColor()}`}
          style={{
            transform: 'rotate(-1deg)',
            transformOrigin: 'center center',
          }}
        >
          {/* Zone photo */}
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            <span className="text-gray-500 text-sm">Photo à venir</span>
          </div>

          {/* Texte du rôle */}
          <div className="text-center mb-2">
            <h2 className="text-lg font-bold text-black tracking-wider uppercase">{roleDisplay}</h2>
          </div>

          {/* Nom */}
          <div className="text-center mb-2">
            <h3 className="text-xl font-bold text-black" style={{ fontFamily: 'serif' }}>
              Membre à venir
            </h3>
          </div>

          {/* Motto */}
          <div className="text-center mb-2">
            <p className="text-sm italic text-gray-700">Motto à définir</p>
          </div>

          {/* Email */}
          <div className="text-center">
            <p className="text-xs text-gray-600 underline">email@eleve.isep.fr</p>
          </div>

          {/* Petite flèche en bas à droite */}
          <div className="absolute bottom-4 right-4">
            <span className="text-black text-xl font-bold">›</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Carte polaroid */}
      <div
        className={`w-64 h-80 bg-white rounded-xl shadow-2xl p-3 transform hover:rotate-3 transition-all duration-300 hover:scale-105 cursor-pointer border-4 ${getBorderColor()}`}
        style={{
          transform: 'rotate(-1deg)',
          transformOrigin: 'center center',
        }}
      >
        {/* Zone photo */}
        <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          {user.profilePhoto ? (
            <Image
              src={user.profilePhoto}
              alt={`${user.firstName} ${user.lastName}`}
              fill
              className="object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 text-3xl font-bold">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Texte du rôle */}
        <div className="text-center mb-2">
          <h2 className="text-lg font-bold text-black tracking-wider uppercase">{roleDisplay}</h2>
        </div>

        {/* Nom */}
        <div className="text-center mb-2">
          <h3 className="text-xl font-bold text-black" style={{ fontFamily: 'serif' }}>
            {user.firstName} {user.lastName}
          </h3>
        </div>

        {/* Motto */}
        {user.motto && (
          <div className="text-center mb-2">
            <p className="text-sm italic text-gray-700">{user.motto}</p>
          </div>
        )}

        {/* Email */}
        <div className="text-center">
          <p className="text-xs text-gray-600 underline">{user.email}</p>
        </div>

        {/* Petite flèche en bas à droite */}
        <div className="absolute bottom-4 right-4">
          <span className="text-black text-xl font-bold">›</span>
        </div>
      </div>
    </div>
  );
};
