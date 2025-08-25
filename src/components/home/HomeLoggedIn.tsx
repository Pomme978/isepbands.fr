'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CustomAvatar from '@/components/common/Avatar';
import { useI18n } from '@/locales/client';
import LangLink from '@/components/common/LangLink';
import { User } from 'next-auth';
import { RecentActivity } from '@/components/home/RecentActivity';
import type { ActivityType } from '@/types/activity';
import { useActivityHistory } from '@/hooks/useActivityHistory';
import { ActivityHistoryModal } from '@/components/common/ActivityHistoryModal';
import Loading from '@/components/ui/Loading';
import BadgeDisplay from '@/components/profile/BadgeDisplay';
import { getBadgeDisplayName } from '@/utils/badgeUtils';

interface HomeLoggedInProps {
  user: User;
  lang: string;
  onLogout: () => Promise<void>;
  loading: boolean;
}

export const mockActivities: ActivityType[] = [
  // Message système - nouveau membre
  {
    id: '1',
    type: 'post',
    timestamp: new Date('2025-08-16'),
    description: "Hier nous avons tondu le gazon de NDL ! C'était incroyable, merci isep bandssss",
    user: {
      name: 'Sarah LÉVY',
      avatar: '/avatars/sarah.jpg',
      role: 'Vice Présidente',
    },
  },

  // Message système - nouveau membre
  {
    id: '2',
    type: 'new_member',
    timestamp: new Date('2025-08-16T12:30:00'),
    description: 'Solène DIE vient de rejoindre ISEP BANDS',
    isSystemMessage: true,
  },

  // Post d'un membre du bureau avec images
  {
    id: '3',
    type: 'post_with_image',
    user: {
      name: 'Sarah LÉVY',
      avatar: '/avatars/sarah.jpg',
      role: 'Vice Présidente',
    },
    timestamp: new Date('2025-08-16T22:30:00'),
    description: "Mangez, c'est bon de manger.",
    images: ['/posts/food1.jpg', '/posts/food2.jpg'],
  },

  // Message système - nouveau groupe créé
  {
    id: '4',
    type: 'new_group',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    description: 'Un nouveau groupe "Jazz Ensemble" a été créé',
    groupName: 'Jazz Ensemble',
    isSystemMessage: true,
  },

  // Post du président
  {
    id: '5',
    type: 'post',
    user: {
      name: 'Julie LAMBERT',
      avatar: '/avatars/julie.jpg',
      role: 'Présidente',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    description:
      'Rappel important : les répétitions se terminent à 22h maximum. Merci de respecter les horaires pour les voisins !',
  },

  // Message système - nouvel événement
  {
    id: '6',
    type: 'event',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    description: 'Un nouvel événement "Concert de Fin d\'Année 2024" a été programmé',
    eventTitle: "Concert de Fin d'Année 2024",
    isSystemMessage: true,
  },

  // Post du trésorier
  {
    id: '9',
    type: 'post',
    user: {
      name: 'Alex MARTIN',
      avatar: '/avatars/alex.jpg',
      role: 'Trésorier',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    description:
      "Les cotisations pour le semestre sont maintenant ouvertes. N'oubliez pas de payer avant la fin du mois pour garder votre accès aux studios.",
  },

  // Message système - nouveau membre
  {
    id: '10',
    type: 'new_member',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    description: "Thomas BERNARD a rejoint l'association",
    isSystemMessage: true,
  },
];

// Les rôles possibles pour les membres du bureau qui peuvent poster
export const BUREAU_ROLES = [
  'Présidente',
  'Vice Présidente',
  'Secrétaire',
  'Trésorier',
  'Responsable Événements',
  'Responsable Communication',
  'Responsable Matériel',
];

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
  promotion?: string;
  birthDate?: string;
  isOutOfSchool?: boolean;
  primaryRole?: string;
  badges?: string[];
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
  return (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) ? age - 1 : age;
};

export default function HomeLoggedIn({ user, lang, onLogout, loading }: HomeLoggedInProps) {
  const t = useI18n();
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
          const transformedActivities: ActivityType[] = data.activities?.map((activity: any) => ({
            id: activity.id,
            type: activity.type === 'custom' ? 'post' : activity.type,
            timestamp: new Date(activity.createdAt),
            description: activity.title + (activity.description ? `: ${activity.description}` : ''),
            user: activity.userName ? {
              name: activity.userName,
              avatar: activity.userAvatar || '/avatars/default.jpg',
              role: 'Admin', // Could be enhanced to get real role
            } : undefined,
            isSystemMessage: activity.type !== 'custom',
          })) || [];
          
          // Use only real data from the API
          setActivities(transformedActivities);
        } else {
          // If API fails, fallback to mock data
          console.warn('Failed to fetch club feed, using mock data');
          setActivities(mockActivities);
        }
      } catch (error) {
        console.error('Error fetching club feed:', error);
        // Fallback to mock data on error
        setActivities(mockActivities);
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
              isOutOfSchool: data.data.isOutOfSchool,
              primaryRole: data.data.primaryRole,
              badges: data.data.badges || [],
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
      <div className="max-w-7xl mx-auto px-4 py-8">
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
                    <CustomAvatar
                      src={userProfile?.photoUrl || user.image || '/avatars/default.jpg'}
                      name={userProfile ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}` : (user.name || 'Utilisateur')}
                      size="lg"
                    />
                    <div className="space-y-0">
                      <h3 className="font-semibold text-lg">
                        {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : (user.name || 'User')}
                      </h3>
                      <p className="text-sm text-gray-600 mb-5">
                        {userProfile && (
                          <>
                            {!userProfile.isOutOfSchool && userProfile.promotion && (
                              <>
                                {calculateAge(userProfile.birthDate) && `${calculateAge(userProfile.birthDate)} ans, `}
                                {userProfile.promotion}
                              </>
                            )}
                            {userProfile.isOutOfSchool && 'Diplômé·e'}
                          </>
                        )}
                      </p>
                      {userProfile && (
                        <BadgeDisplay
                          role={userProfile.primaryRole || 'Membre'}
                          badges={userProfile.badges || []}
                          isLookingForGroup={userProfile.isLookingForGroup || false}
                          pronouns={(userProfile.pronouns as any) || 'other'}
                          size="sm"
                        />
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
                    className="w-full"
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
                  {feedError && (
                    <span className="text-sm text-amber-600">Mode hors ligne</span>
                  )}
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
