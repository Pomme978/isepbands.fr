// @components/settings/ProfileHeader.tsx
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import ProfileStats from './ProfileStats';
import BadgeDisplay from './BadgeDisplay';
import Avatar from '../common/Avatar';
import React from 'react';
import Link from 'next/link';
import { useLang } from '@/hooks/useLang';
import { useI18n } from '@/locales/client';
import { formatPreferredGenres } from '@/utils/genreUtils';
import { calculateGraduationYear } from '@/utils/schoolUtils';

interface Badge {
  id: number;
  name: string;
  description?: string | null;
  color: string;
  isSystemBadge: boolean;
  assignedAt?: string | Date | null;
  badgeDefinition?: {
    id: number;
    key: string;
    labelFr: string;
    labelEn: string;
    color: string;
    colorEnd?: string | null;
    gradientDirection: string;
    textColor: string;
    description?: string | null;
  };
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  image: string;
  createdAt: string;
  emailVerified: boolean;
  currentLevel: string; // Nouveau champ
  dateOfBirth: string; // Nouveau champ
  promotion: string; // Calculé automatiquement
  role: string;
  roleColors?: {
    gradientStart?: string;
    gradientEnd?: string;
  } | null;
  badges: Badge[];
  bio: string;
  pronouns: 'he/him' | 'she/her' | 'they/them' | 'other';
  isLookingForGroup: boolean;
  totalGroups: number;
  eventsAttended: number;
  activeGroups: number;
  memberSince: string;
  instrumentCount: number; // Ajouté
  concertsPlayed: number; // Ajouté
  age?: number | null; // Age calculé
  preferredGenres?: string[] | string | null; // Genres préférés (peut être JSON string ou array)
}

interface ProfileHeaderProps {
  user: UserProfile;
  isUserProfile?: boolean;
}

export default function ProfileHeader({ user, isUserProfile }: ProfileHeaderProps) {
  const { lang } = useLang();
  const t = useI18n();

  const getPronounDisplay = (pronouns: UserProfile['pronouns']): string => {
    const pronounLabels = {
      'he/him': t('user.profile.pronouns_values.hehim'),
      'she/her': t('user.profile.pronouns_values.sheher'),
      'they/them': t('user.profile.pronouns_values.theythem'),
      other: t('user.profile.pronouns_values.other'),
    };
    return pronounLabels[pronouns];
  };

  return (
    <Card className="p-8 bg-gradient-to-r bg-white border-0">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Profile Image */}
        <div className="relative">
          <Avatar src={user.image} name={user.username} size="xl" className="shadow-lg" />
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="space-y-3">
            <div>
              <div className="flex flex-row justify-between items-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                  {user.username}
                </h1>
                {isUserProfile && (
                  <Link href={`/${lang}/profile/settings`}>
                    <Button variant="ghost" size="icon" className="h-12 w-12">
                      <Settings className="h-6 w-6" />
                    </Button>
                  </Link>
                )}
              </div>
              {(user.currentLevel || user.promotion || user.age) && (
                <p className="text-gray-600 text-lg">
                  {user.currentLevel &&
                    `${t('user.profile.promotion_year')} ${calculateGraduationYear(user.currentLevel)}`}
                  {user.currentLevel && (user.promotion || user.age) && ' • '}
                  {user.promotion}
                  {user.promotion && user.age && ', '}
                  {user.age && `${user.age} ${t('user.profile.age_years')}`}
                </p>
              )}
              <p className="text-sm text-gray-500">
                {t('user.profile.pronouns')}: {getPronounDisplay(user.pronouns)} •{' '}
                {t('user.profile.member_since')} {user.memberSince}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                {t('user.profile.preferred_genres')}:{' '}
                {formatPreferredGenres(user.preferredGenres, lang)}
              </p>
            </div>

            {/* Stats Row */}
            <ProfileStats
              totalGroups={user.totalGroups}
              instrumentCount={user.instrumentCount}
              eventsAttended={user.eventsAttended}
            />

            {/* Badges */}
            <div className="mt-1">
              <BadgeDisplay
                role={user.role}
                badges={user.badges}
                isLookingForGroup={user.isLookingForGroup}
                pronouns={user.pronouns}
                roleCustomColors={user.roleColors}
              />
            </div>

            {/* Bio */}
            {user.bio && user.bio.trim() && (
              <div>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 italic rounded-xl">
                  {user.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
