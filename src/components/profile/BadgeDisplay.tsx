// @components/profile/BadgeDisplay.tsx
'use client';

import { Star } from 'lucide-react';

type Pronouns = 'he/him' | 'she/her' | 'they/them' | 'other';

interface BadgeDisplayProps {
  role: string;
  badges: string[];
  isLookingForGroup: boolean;
  pronouns: Pronouns;
}

const getDisplayRole = (role: string, pronouns: Pronouns): string => {
  // Placeholder implementation - will be replaced by database query
  const roleTranslations: Record<string, Record<string, string>> = {
    President: {
      'he/him': 'Président',
      'she/her': 'Présidente',
      'they/them': 'Président·e',
      other: 'Président·e',
    },
    'Vice-President': {
      'he/him': 'Vice-Président',
      'she/her': 'Vice-Présidente',
      'they/them': 'Vice-Président·e',
      other: 'Vice-Président·e',
    },
    Secretary: {
      'he/him': 'Secrétaire',
      'she/her': 'Secrétaire',
      'they/them': 'Secrétaire',
      other: 'Secrétaire',
    },
    Treasurer: {
      'he/him': 'Trésorier',
      'she/her': 'Trésorière',
      'they/them': 'Trésorier·ère',
      other: 'Trésorier·ère',
    },
    Member: { 'he/him': 'Membre', 'she/her': 'Membre', 'they/them': 'Membre', other: 'Membre' },
  };
  return roleTranslations[role]?.[pronouns] || role;
};

export default function BadgeDisplay({
  role,
  badges,
  isLookingForGroup,
  pronouns,
}: BadgeDisplayProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <span className="px-4 py-2 bg-gradient-to-r from-secondary to-primary text-white rounded-full text-sm font-medium shadow-md hover:scale-95 transition-transform duration-200 ease-in-out">
        {getDisplayRole(role, pronouns)}
      </span>

      {badges.map((badge, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-gray-200 text-gray-700 flex justify-center items-center rounded-full text-sm font-medium hover:scale-95 transition-transform duration-200 ease-in-out"
        >
          {badge}
        </span>
      ))}

      {isLookingForGroup && (
        <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-medium shadow-md animate-pulse hover:scale-95 transition-transform duration-200 ease-in-out">
          <span className="flex items-center gap-2">
            <Star className="h-3 w-3" />
            Prêt à rejoindre un groupe
          </span>
        </span>
      )}
    </div>
  );
}
