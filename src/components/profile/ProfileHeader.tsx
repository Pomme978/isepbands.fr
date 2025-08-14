// @components/profile/ProfileHeader.tsx
'use client';

import { Card } from '@/components/ui/card';
// ...existing code...
import ProfileStats from './ProfileStats';
import BadgeDisplay from './BadgeDisplay';
import Image from 'next/image';
import React from 'react';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  image: string;
  createdAt: string;
  emailVerified: boolean;
  currentLevel: string; // Nouveau champ
  dateOfBirth: string; // Nouveau champ
  isOutOfSchool: boolean; // Nouveau champ
  promotion: string; // Calculé automatiquement
  role: string;
  badges: string[];
  bio: string;
  pronouns: 'he/him' | 'she/her' | 'they/them' | 'other';
  isLookingForGroup: boolean;
  totalGroups: number;
  eventsAttended: number;
  activeGroups: number;
  memberSince: string;
  instrumentCount: number; // Ajouté
  concertsPlayed: number; // Ajouté
}

interface ProfileHeaderProps {
  user: UserProfile;
  isUserProfile?: boolean;
}

const getPronounDisplay = (pronouns: UserProfile['pronouns']): string => {
  const pronounLabels = {
    'he/him': 'il/lui',
    'she/her': 'elle/elle',
    'they/them': 'iel/ellui',
    other: 'autre',
  };
  return pronounLabels[pronouns];
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card className="p-8 bg-gradient-to-r from-white to-gray-50 border-0">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Profile Image */}
        <div className="relative">
          <div className="w-42 h-42 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden shadow-lg">
            <Image
              src={user.image}
              alt={user.username}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                {user.username}
              </h1>
              {/* Affiche la promo seulement si l'utilisateur n'est pas hors école et que la promo existe */}
              {!user.isOutOfSchool && user.promotion && (
                <p className="text-gray-600 text-lg">{user.promotion}</p>
              )}
              {/* Affiche la date de promo seulement si l'utilisateur n'est pas hors école et que la date existe */}
              {!user.isOutOfSchool && user.dateOfBirth && (
                <p className="text-gray-600 text-sm">Année de promo : {user.dateOfBirth}</p>
              )}
              <p className="text-sm text-gray-500">
                Pronoms: {getPronounDisplay(user.pronouns)} • Membre depuis {user.memberSince}
              </p>
            </div>

            {/* Stats Row */}
            <ProfileStats
              totalGroups={user.totalGroups}
              instrumentCount={user.instrumentCount}
              eventsAttended={user.eventsAttended}
            />

            {/* Badges */}
            <BadgeDisplay
              role={user.role}
              badges={user.badges}
              isLookingForGroup={user.isLookingForGroup}
              pronouns={user.pronouns}
            />

            {/* Bio */}
            <div>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">{user.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
