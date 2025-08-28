'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState as useReactState } from 'react';
import { useLang } from '@/hooks/useLang';
import BasicLayout from '@/components/layouts/BasicLayout';
import ProfileHeader from '@/components/profile/ProfileHeader';
import EventBanner from '@/components/profile/EventBanner';
import GroupsSection from '@/components/profile/GroupsSection';
import ProfileLoadingSkeleton from '@/components/profile/ProfileLoadingSkeleton';
import { InstrumentsDisplay } from '@/components/profile/shared/InstrumentsDisplay';
import { useI18n } from '@/locales/client';
import { Button } from '@/components/ui/button';
import { PendingValidationProfile } from '@/components/profile/PendingValidationProfile';

// Utility function to calculate age
const calculateAge = (birthDate: string | null | undefined): number | null => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

// ---- API types ----
interface ApiInstrument {
  instrument: {
    id: string;
    name?: string;
    nameFr?: string;
    nameEn?: string;
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
      event: { id: string; name: string; type: string; date: string; location?: string };
    }[];
  };
  role?: string;
  isAdmin: boolean;
}

interface ApiBadge {
  name: string;
}

interface ApiRole {
  role: { id: string; name: string; weight: number };
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
  preferredGenres?: string[] | string | null;
}

// ---- UI types ----
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
  nextEvent?: { type: 'concert' | 'rehearsal' | 'jam' | string; date: string; venue?: string };
  isRecruiting?: boolean;
}

interface ProfilePageContentProps {
  userId?: string; // Si undefined, utilise l'utilisateur connecté
  showBackButton?: boolean;
  wrapInLayout?: boolean; // Si false, ne wrap pas dans BasicLayout
}

export default function ProfilePageContent({
  userId,
  showBackButton = false,
  wrapInLayout = true,
}: ProfilePageContentProps) {
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<ApiUserData | null>(null);
  const [instruments, setInstruments] = useState<ApiInstrument[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const { lang } = useLang();
  const router = useRouter();
  const t = useI18n();
  const [canGoBack, setCanGoBack] = useReactState(false);

  // Vérifier si on peut revenir en arrière
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanGoBack(window.history.length > 1);
    }
  }, []);

  // Détermine quel ID utiliser
  const targetUserId = userId || authUser?.id;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Si pas d'userId spécifique et pas d'utilisateur connecté, rediriger
    if (!userId && (!authUser || authLoading)) {
      if (!authLoading && !authUser) {
        router.push(`/${lang}`);
      }
      return;
    }

    if (!targetUserId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const apiUrl = `/api/profile/${targetUserId}`;
        const res = await fetch(apiUrl);
        const result = await res.json();

        if (!result.success && result.code === 'user_not_found') {
          setUser(null);
        } else if (result.success && result.data) {
          const data: ApiUserData = result.data;
          setUser(data);

          // Store raw instruments for the shared component
          setInstruments(data.instruments || []);

          // map groups
          setGroups(
            (data.groupMemberships || []).map((gm: ApiGroupMembership) => ({
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
        console.error('Erreur lors du fetch profile:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetUserId, authUser, authLoading, mounted, lang, router, userId]);

  // ---- Loading ----
  if (!mounted || authLoading || loading) {
    const content = <ProfileLoadingSkeleton />;
    return wrapInLayout ? (
      <BasicLayout showNavbar={true} navbarMode="static" showFooter={true}>
        {content}
      </BasicLayout>
    ) : (
      content
    );
  }

  // ---- Not found ----
  if (!user) {
    const content = (
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
          <p className="text-gray-500 mb-6">{t('user.settings.notfound.description')}</p>
          <Button variant="outline" onClick={() => router.push(`/${lang}`)}>
            {t('common.back_home') ?? "Retour à l'accueil"}
          </Button>
        </div>
      </div>
    );
    return wrapInLayout ? (
      <BasicLayout showNavbar={true} navbarMode="static" showFooter={true}>
        {content}
      </BasicLayout>
    ) : (
      content
    );
  }

  const activeGroups = groups.filter((g) => g.isActive);

  // Debug: log genres préférés
  console.log('Debug preferredGenres:', {
    raw: user.preferredGenres,
    type: typeof user.preferredGenres,
    isArray: Array.isArray(user.preferredGenres),
  });

  // Show pending validation profile for PENDING users
  if (user.status === 'PENDING') {
    const content = (
      <PendingValidationProfile
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          photoUrl: user.photoUrl,
          createdAt: user.createdAt.toString(),
        }}
        lang={lang}
      />
    );
    return wrapInLayout ? (
      <BasicLayout showNavbar={true} navbarMode="static" showFooter={true}>
        {content}
      </BasicLayout>
    ) : (
      content
    );
  }

  const content = (
    <div className="py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {showBackButton && canGoBack && (
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => router.back()}>
              ← Retour
            </Button>
          </div>
        )}

        {/* Profile Header */}
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
            role: user.primaryRole || 'Membre',
            badges: user.badges || [],
            bio: user.biography || '',
            age: calculateAge(user.birthDate),
            pronouns:
              user.pronouns && ['he/him', 'she/her', 'they/them', 'other'].includes(user.pronouns)
                ? (user.pronouns as 'he/him' | 'she/her' | 'they/them' | 'other')
                : 'other',
            isLookingForGroup: user.isLookingForGroup || false,
            totalGroups: user.totalGroups ?? user.groupMemberships?.length ?? 0,
            eventsAttended: user.eventsAttended ?? 0,
            activeGroups: user.activeGroups ?? activeGroups.length,
            memberSince: new Date(user.createdAt).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
            }),
            instrumentCount: user.instrumentCount ?? (instruments?.length || 0),
            concertsPlayed:
              user.concertsPlayed ?? groups.reduce((acc, g) => acc + g.concertCount, 0),
            preferredGenres: user.preferredGenres
              ? Array.isArray(user.preferredGenres)
                ? user.preferredGenres
                : typeof user.preferredGenres === 'string'
                  ? user.preferredGenres
                      .split(',')
                      .map((g) => g.trim())
                      .filter(Boolean)
                  : null
              : null,
          }}
          isUserProfile={authUser?.id === user.id}
        />

        {/* Event Banner */}
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

        {/* 2-column grid: Instruments à gauche, Groups à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-full">
            <InstrumentsDisplay instruments={instruments} />
          </div>
          <div className="h-full">
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
    </div>
  );

  return wrapInLayout ? (
    <BasicLayout showNavbar={true} navbarMode="static" showFooter={true}>
      {content}
    </BasicLayout>
  ) : (
    content
  );
}
