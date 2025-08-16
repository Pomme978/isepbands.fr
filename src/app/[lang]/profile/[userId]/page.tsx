'use client';

import React, { useState, useEffect, use } from 'react';
import { useLang } from '@/hooks/useLang';
import BackButton from '@/components/ui/back-button';
import { Guitar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileHeader from '@/components/profile/ProfileHeader';
import EventBanner from '@/components/profile/EventBanner';
import InstrumentsSection from '@/components/profile/InstrumentsSection';
import GroupsSection from '@/components/profile/GroupsSection';
import { useI18n } from '@/locales/client';
import { redirect, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Types API - correspondent exactement à ce que retourne votre API
interface ApiInstrument {
  instrument: {
    id: string;
    name: string;
  };
  skillLevel: string;
  yearsPlaying?: number;
  isPrimary: boolean;
}

interface ApiGroupMembership {
  group: {
    id: string;
    name: string;
    imageUrl: string;
    genre?: string;
    isVerified: boolean;
    isLookingForMembers: boolean;
    members?: { userId: string }[];
    events?: {
      event: {
        id: string;
        name: string;
        type: string;
        date: string;
        location?: string;
      };
    }[];
  };
  role?: string;
  isAdmin: boolean;
}

interface ApiBadge {
  name: string;
}

interface ApiRole {
  role: {
    id: string;
    name: string;
    weight: number;
  };
}

interface ApiUserData {
  id: string;
  firstName: string;
  lastName: string;
  promotion?: string;
  birthDate?: string;
  biography?: string;
  phone?: string;
  email: string;
  photoUrl?: string;
  status: string;
  createdAt: Date;
  emailVerified?: boolean;
  pronouns?: string;
  isLookingForGroup?: boolean;
  badges: ApiBadge[];
  instruments: ApiInstrument[];
  roles: ApiRole[];
  groupMemberships: ApiGroupMembership[];
  totalGroups?: number;
  instrumentCount?: number;
  activeGroups?: number;
  eventsAttended?: number;
  concertsPlayed?: number;
  primaryRole?: string | null;
  isOutOfSchool?: boolean;
}

// Types locaux pour l'UI
interface Instrument {
  id: string;
  name: string;
  level: string;
  icon: React.ComponentType<{ className?: string }>;
  isPrimary: boolean;
  yearsPlaying?: number;
}

interface GroupRole {
  role: string;
  isPrimary: boolean;
}

interface Group {
  id: string;
  name: string;
  image: string;
  roles: GroupRole[];
  joinDate: string;
  isActive: boolean;
  inactiveSince?: string;
  memberCount: number;
  maxMembers: number;
  slug: string;
  concertCount: number;
  genre?: string;
  nextEvent?: {
    type: 'concert' | 'rehearsal' | 'jam' | string;
    date: string;
    venue?: string;
  };
  isRecruiting?: boolean;
}

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [user, setUser] = useState<ApiUserData | null>(null);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const { lang } = useLang();
  const { userId } = use(params);
  const t = useI18n();

  useEffect(() => {
    if (!userId) {
      console.warn("Aucun userId trouvé dans l'URL. Params reçus:", { lang, userId });
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const apiUrl = `/api/profile/${userId}`;
        const res = await fetch(apiUrl);
        const result = await res.json();
        if (!result.success && result.code === 'user_not_found') {
          setUser(null);
        } else if (result.success && result.data) {
          setUser(result.data);
          setInstruments(
            (result.data.instruments || []).map((inst: ApiInstrument) => ({
              id: inst.instrument.id,
              name: inst.instrument.name,
              level: inst.skillLevel,
              icon: Guitar,
              isPrimary: inst.isPrimary,
              yearsPlaying: inst.yearsPlaying,
            })),
          );
          setGroups(
            (result.data.groupMemberships || []).map((gm: ApiGroupMembership) => ({
              id: gm.group.id,
              name: gm.group.name,
              image: gm.group.imageUrl || '',
              roles: [{ role: gm.role || 'Membre', isPrimary: !!gm.isAdmin }],
              joinDate: '',
              isActive: gm.group.isVerified,
              memberCount: gm.group.members?.length || 0,
              maxMembers: 0,
              slug: gm.group.id,
              concertCount:
                gm.group.events?.filter((e) => e.event.type.toLowerCase() === 'concert').length ||
                0,
              genre: gm.group.genre,
              nextEvent: gm.group.events?.[0]?.event
                ? {
                    type: gm.group.events[0].event.type.toLowerCase(),
                    date: gm.group.events[0].event.date,
                    venue: gm.group.events[0].event.location,
                  }
                : undefined,
              isRecruiting: gm.group.isLookingForMembers,
            })),
          );
        }
      } catch (err) {
        setUser(null);
        console.error('Erreur lors du fetch settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [lang, userId]);

  const isUserProfile = true; // TODO: comparer avec l'utilisateur authentifié
  const activeGroups = groups.filter((group) => group.isActive);

  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-8">
          <div className="flex items-center mb-8">
            <Skeleton className="h-10 w-32 rounded" />
          </div>
          <div className="flex gap-6 items-center">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start mt-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
        <div className="w-full text-center mt-8 text-gray-500">{t('common.loading')}</div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 rounded-lg shadow-lg bg-white text-center">
          <svg
            width="64"
            height="64"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="mx-auto mb-4 text-red-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            {t('user.settings.notfound.title')}
          </h2>
          <p className="text-gray-500 mb-6">{t('user.settings.notfound.title')}</p>
          <Button variant="outline" onClick={() => router.push('/')} />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl space-y-6">
        <div className="flex items-center mb-8">
          <BackButton variant="ghost" />
        </div>
        <ProfileHeader
          user={{
            id: user.id,
            username: `${user.firstName} ${user.lastName}`,
            email: user.email,
            image: user.photoUrl || '',
            createdAt: new Date(user.createdAt).toISOString(),
            emailVerified: user.emailVerified || false,
            currentLevel: user.promotion || '',
            dateOfBirth: user.birthDate || '',
            isOutOfSchool: user.isOutOfSchool ?? false,
            promotion: user.promotion || '',
            role: user.primaryRole || t('user.settings.role.default'),
            badges: user.badges?.map((b) => b.name) || [],
            bio: user.biography || '',
            pronouns:
              user.pronouns && ['he/him', 'she/her', 'they/them', 'other'].includes(user.pronouns)
                ? (user.pronouns as 'he/him' | 'she/her' | 'they/them' | 'other')
                : 'other',
            isLookingForGroup: user.isLookingForGroup || false,
            totalGroups: user.totalGroups ?? user.groupMemberships?.length ?? 0,
            eventsAttended: user.eventsAttended ?? 0,
            activeGroups: user.activeGroups ?? activeGroups.length,
            memberSince: new Date(user.createdAt).toISOString(),
            instrumentCount: user.instrumentCount ?? instruments.length,
            concertsPlayed:
              user.concertsPlayed ?? groups.reduce((acc, g) => acc + g.concertCount, 0),
          }}
          isUserProfile={isUserProfile}
        />
        <EventBanner
          groups={activeGroups.map((g) => ({
            ...g,
            nextEvent: g.nextEvent
              ? {
                  ...g.nextEvent,
                  type: ['concert', 'rehearsal', 'jam'].includes(g.nextEvent.type)
                    ? (g.nextEvent.type as 'concert' | 'rehearsal' | 'jam')
                    : 'concert',
                }
              : undefined,
          }))}
          locale={lang}
          onEventClick={() => {}}
        />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          <InstrumentsSection instruments={instruments} />
          <InstrumentsSection instruments={instruments} />
          <GroupsSection
            groups={groups.map((g) => ({
              ...g,
              nextEvent: g.nextEvent
                ? {
                    ...g.nextEvent,
                    type: ['concert', 'rehearsal', 'jam'].includes(g.nextEvent.type)
                      ? (g.nextEvent.type as 'concert' | 'rehearsal' | 'jam')
                      : 'concert',
                  }
                : undefined,
            }))}
            onGroupClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
