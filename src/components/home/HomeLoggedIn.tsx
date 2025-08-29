'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Avatar from '@/components/common/Avatar';
import LangLink from '@/components/common/LangLink';
import { User } from 'next-auth';
import { RecentActivity } from '@/components/home/RecentActivity';
import type { ActivityType } from '@/types/activity';
import { useActivityHistory } from '@/hooks/useActivityHistory';
import { ActivityHistoryModal } from '@/components/common/ActivityHistoryModal';
import Loading from '@/components/ui/Loading';
import { calculateGraduationYear } from '@/utils/schoolUtils';
interface HomeLoggedInProps {
  user: User;
  lang: string;
  onLogout: () => Promise<void>;
  loading: boolean;
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
  promotion?: string;
  birthDate?: string;
  primaryRole?: string;
  isLookingForGroup?: boolean;
  pronouns?: string;
}

// Utility function to calculate age
const calculateAge = (birthDate: string | null | undefined): number | null => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  return monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()) ? age - 1 : age;
};

export default function HomeLoggedIn({ user, lang, onLogout, loading }: HomeLoggedInProps) {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch club feed activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoadingFeed(true);
        setFeedError(null);

        // Try to fetch from public club feed API
        const response = await fetch('/api/clubfeed');
        if (response.ok) {
          const data = await response.json();

          // Transform API data to ActivityType format
          const transformedActivities: ActivityType[] =
            data.activities?.map(
              (activity: {
                id: string;
                type: string;
                createdAt: string;
                title: string;
                description?: string;
                userName?: string;
                userAvatar?: string;
                userRole?: string;
              }) => ({
                id: activity.id,
                type: activity.type === 'custom' ? 'post' : activity.type,
                timestamp: new Date(activity.createdAt),
                title: activity.title, // Titre séparé
                description: activity.description || '', // Description séparée (peut être vide)
                user: activity.userName
                  ? {
                      name: activity.userName,
                      avatar: activity.userAvatar || '/avatars/default.jpg',
                      role: activity.userRole || null, // Use real role from API
                    }
                  : undefined,
                isSystemMessage: activity.type !== 'custom',
              }),
            ) || [];

          // Use only real data from the API
          setActivities(transformedActivities);
        } else {
          // If API fails, show empty state
          console.warn('Failed to fetch club feed');
          setActivities([]);
        }
      } catch (error) {
        console.error('Error fetching club feed:', error);
        // Show empty state on error
        setActivities([]);
        setFeedError('Impossible de charger les dernières actualités');
      } finally {
        setIsLoadingFeed(false);
      }
    };

    fetchActivities();
  }, []);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        setIsLoadingProfile(true);
        const response = await fetch(`/api/profile/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setUserProfile({
              id: data.data.id,
              firstName: data.data.firstName,
              lastName: data.data.lastName,
              email: data.data.email,
              photoUrl: data.data.photoUrl,
              promotion: data.data.promotion,
              birthDate: data.data.birthDate,
              primaryRole: data.data.primaryRole,
              isLookingForGroup: data.data.isLookingForGroup,
              pronouns: data.data.pronouns,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  // Hook pour gérer l'historique des activités
  const activityHistory = useActivityHistory({
    activities: activities,
    title: 'Historique des activités - Accueil',
  });

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {userProfile?.firstName || user.name?.split(' ')[0] || 'User'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Actions rapides */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                {/* User Profile Section */}
                {isLoadingProfile ? (
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-4 mb-6">
                    <Avatar
                      src={userProfile?.photoUrl || user.image}
                      name={
                        userProfile
                          ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}`
                          : user.name || 'Utilisateur'
                      }
                      size="lg"
                    />
                    <div className="space-y-0">
                      <h3 className="font-semibold text-lg">
                        {userProfile
                          ? `${userProfile.firstName} ${userProfile.lastName}`
                          : user.name || 'User'}
                      </h3>
                      {userProfile && userProfile.promotion && (
                        <p className="text-sm text-gray-600">
                          Promotion {calculateGraduationYear(userProfile.promotion)}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mb-3">
                        {userProfile && userProfile.promotion && (
                          <>
                            {userProfile.promotion}
                            {calculateAge(userProfile.birthDate) &&
                              `, ${calculateAge(userProfile.birthDate)} ans`}
                          </>
                        )}
                      </p>
                      {userProfile?.primaryRole && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {userProfile.primaryRole}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <h4 className="font-semibold text-gray-900 mb-4">Actions rapides</h4>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    asChild
                  >
                    <LangLink href={`/${lang}/profile`}>Mon profil</LangLink>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    asChild
                  >
                    <LangLink href={`/${lang}/groups`}>Mes groupes</LangLink>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    asChild
                  >
                    <LangLink href={`/${lang}/admin`}>Admin</LangLink>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    asChild
                  >
                    <LangLink href={`/${lang}/settings`}>Paramètres</LangLink>
                  </Button>
                </div>

                {/* Logout Button */}
                <div className="mt-8 pt-6 border-t">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onLogout}
                    disabled={loading}
                    className="w-full cursor-pointer"
                  >
                    {loading ? 'Déconnexion...' : 'Logout'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Dernières Actualités</h2>
                  {feedError && <span className="text-sm text-amber-600">Mode hors ligne</span>}
                </div>

                {isLoadingFeed ? (
                  <div className="flex items-center justify-center py-8">
                    <Loading text="Chargement des actualités..." size="sm" />
                  </div>
                ) : (
                  <RecentActivity
                    activities={activities}
                    onShowHistory={activityHistory.openHistory}
                    showHistoryButton={true}
                    maxItems={6}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal d'historique */}
        <ActivityHistoryModal {...activityHistory.modalProps} />
      </div>
    </div>
  );
}
