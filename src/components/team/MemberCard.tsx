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

const CardContent: React.FC<{
  user: User | null;
  roleDisplay: string;
  showClothespin: boolean;
}> = ({ user, roleDisplay, showClothespin }) => {
  return (
    <>
      {showClothespin && (
        <Clothespin className="absolute -top-8 z-20 transform-gpu will-change-transform transition-transform duration-300 group-hover:scale-105" />
      )}

      {/* BIG YELLOW GLOW behind the card (Safari-friendly, no blur) */}
      <span className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <span
          className="
      block w-[36rem] h-[26rem] rounded-full
      opacity-0 group-hover:opacity-50 transition-opacity duration-300
    "
          style={{
            background: 'rgba(250,204,21,0.8)',
            filter: 'blur(80px)', // static blur, not animated
          }}
        />
      </span>

      {/* Card */}
      <div
        className="
          relative w-64 bg-white rounded-xl shadow-md p-4 pb-4
          h-auto flex flex-col justify-center items-between
          border-[3px] border-transparent
          transform-gpu will-change-transform
          transition-transform transition-colors duration-300
          group-hover:scale-105 group-hover:border-yellow-400
        "
      >
        {/* Photo */}
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

        {/* Text */}
        <div className="flex flex-col justify-center items-between flex-grow">
          <div className="text-center mb-0">
            <h2 className="text-xl font-bold text-black tracking-wider uppercase leading-tight">
              {roleDisplay}
            </h2>
          </div>

          <div className="text-center mb-1">
            <h3
              className="text-2xl !font-handrawn text-black leading-tight break-words text-center mt-1"
              style={{ fontFamily: 'serif' }}
            >
              {user ? `${user.firstName} ${user.lastName}` : 'Membre à venir'}
            </h3>
          </div>

          <div className="text-center mb-2">
            <p className="text-md italic font-handrawn text-gray-700 leading-tight break-words">
              &#34;{user?.motto || 'Motto à définir'}&#34;
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-primary underline break-all leading-tight">
              {user?.email || 'email@eleve.isep.fr'}
            </p>
          </div>

          <div className="absolute bottom-2 right-2 transform-gpu will-change-transform transition-transform duration-300 group-hover:scale-110">
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
  const cardClassName = `relative flex justify-center cursor-pointer group transform-gpu ${className}`;

  if (!user) {
    return (
      <div className={cardClassName}>
        <CardContent user={user} roleDisplay={roleDisplay} showClothespin={showClothespin} />
      </div>
    );
  }

  return (
    <Link href={`/profile/${user.id}`} className={cardClassName}>
      <CardContent user={user} roleDisplay={roleDisplay} showClothespin={showClothespin} />
    </Link>
  );
};
