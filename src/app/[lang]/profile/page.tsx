'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
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

// ---- API types (same as your first file) ----
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
}

// ---- UI types (same as your first file) ----
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

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<ApiUserData | null>(null);
  const [instruments, setInstruments] = useState<ApiInstrument[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const { lang } = useLang();
  const router = useRouter();
  const t = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || authLoading) return;

    if (!authUser) {
      router.push(`/${lang}`);
      return;
    }

    const fetchProfile = async () => {
      try {
        const apiUrl = `/api/profile/${authUser.id}`;
        const res = await fetch(apiUrl);
        const result = await res.json();

        if (!result.success && result.code === 'user_not_found') {
          setUser(null);
        } else if (result.success && result.data) {
          const data: ApiUserData = result.data;
          setUser(data);

          // Store raw instruments for the shared component
          setInstruments(data.instruments || []);

          // map groups (same as first file)
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
  }, [authUser, authLoading, mounted, lang, router]);

  // ---- Loading (match look & feel of the first page) ----
  if (!mounted || authLoading || loading) {
    return (
      <BasicLayout showNavbar={true} navbarMode="static" showFooter={true}>
        <ProfileLoadingSkeleton />
      </BasicLayout>
    );
  }

  // ---- Not found (match first page structure) ----
  if (!user) {
    return (
      <BasicLayout showNavbar={true} navbarMode="static" showFooter={true}>
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
      </BasicLayout>
    );
  }

  const activeGroups = groups.filter((g) => g.isActive);

  // Show pending validation profile for PENDING users
  if (user.status === 'PENDING') {
    return (
      <BasicLayout showNavbar={true} navbarMode="static" showFooter={true}>
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
      </BasicLayout>
    );
  }

  return (
    <BasicLayout showNavbar={true} navbarMode="static" showFooter={true}>
      <div className="min-h-screen py-8">
        <div className="max-w-7xl space-y-6">
          {/* Same header content */}
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
              memberSince: new Date(user.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
              }),
              instrumentCount: user.instrumentCount ?? (instruments?.length || 0),
              concertsPlayed:
                user.concertsPlayed ?? groups.reduce((acc, g) => acc + g.concertCount, 0),
            }}
            isUserProfile={true}
          />

          {/* Same EventBanner usage */}
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

          {/* 2-column grid: Instruments, Groups */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <InstrumentsDisplay instruments={instruments} />
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
    </BasicLayout>
  );
}
