// components/team/MemberCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clothespinSvg from '@/assets/svg/Clothespin.svg';
import { ChevronRight } from 'lucide-react';

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
  showClothespin?: boolean;
}

const Clothespin: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-14 h-auto -top-15 ${className}`}>
      <Image
        src={clothespinSvg}
        alt="Clothespin"
        width={64}
        height={80}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

// Composant de carte réutilisable pour éviter la duplication
const CardContent: React.FC<{
  user: User | null;
  roleDisplay: string;
  showClothespin: boolean;
}> = ({ user, roleDisplay, showClothespin }) => {
  return (
    <>
      {showClothespin && (
        <Clothespin className="absolute -top-8 z-20 transition-transform duration-300 group-hover:scale-105" />
      )}

      <div className="absolute w-80 h-80 bg-[#914AAE] rounded-full blur-[100px] opacity-50 -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

      {/* Carte polaroid */}
      <div className="w-64 bg-white rounded-xl shadow-2xl p-4 pb-4 h-auto flex flex-col justify-center items-between border-2 border-transparent transition-all duration-300 group-hover:border-yellow-400 group-hover:shadow-yellow-200 group-hover:shadow-2xl group-hover:scale-105 transform">
        {/* Zone photo - format carré avec inner shadow */}
        <div className="w-[90%] mx-auto aspect-square bg-gray-100 rounded-lg mb-3 flex flex-grow items-center justify-center overflow-hidden relative">
          {user?.profilePhoto ? (
            <Image
              src={user.profilePhoto}
              alt={`${user.firstName} ${user.lastName}`}
              fill
              className="object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
              {user ? (
                <span className="text-gray-600 text-2xl font-handrawn font-normal">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </span>
              ) : (
                <span className="text-gray-500 text-sm">Photo à venir</span>
              )}
            </div>
          )}
        </div>

        {/* Contenu textuel */}
        <div className="flex flex-col justify-center items-between flex-grow">
          {/* Texte du rôle */}
          <div className="text-center mb-0">
            <h2 className="text-xl font-bold text-black tracking-wider uppercase leading-tight">
              {roleDisplay}
            </h2>
          </div>

          {/* Nom */}
          <div className="text-center mb-1">
            <h3
              className="text-2xl !font-handrawn text-black leading-tight break-words text-center mt-1"
              style={{ fontFamily: 'serif' }}
            >
              {user ? `${user.firstName} ${user.lastName}` : 'Membre à venir'}
            </h3>
          </div>

          {/* Motto avec guillemets */}
          <div className="text-center mb-2">
            <p className="text-md italic font-handrawn text-gray-700 leading-tight break-words">
              &#34;{user?.motto || 'Motto à définir'}&#34;
            </p>
          </div>

          {/* Email avec couleur primaire */}
          <div className="text-center">
            <p className="text-sm text-primary underline break-all leading-tight">
              {user?.email || 'email@eleve.isep.fr'}
            </p>
          </div>

          <div className="absolute bottom-2 right-2 transition-transform duration-300 group-hover:scale-110">
            <ChevronRight className="w-6 h-6 text-black" />
          </div>
        </div>
      </div>
    </>
  );
};

export const MemberCard: React.FC<MemberCardProps> = ({
  user,
  roleDisplay,
  className = '',
  showClothespin = true,
}) => {
  const cardClassName = `relative flex justify-center cursor-pointer group ${className}`;

  // Si pas d'utilisateur, afficher la carte sans lien
  if (!user) {
    return (
      <div className={cardClassName}>
        <CardContent user={user} roleDisplay={roleDisplay} showClothespin={showClothespin} />
      </div>
    );
  }

  // Si utilisateur existe, envelopper dans un Link
  return (
    <Link href={`/profile/${user.id}`} className={cardClassName}>
      <CardContent user={user} roleDisplay={roleDisplay} showClothespin={showClothespin} />
    </Link>
  );
};
