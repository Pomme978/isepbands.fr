'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useI18n } from '@/locales/client';
import LangLink from '@/components/common/LangLink';
import { User } from 'next-auth';
import { RecentActivity } from '@/components/home/RecentActivity';
import { ActivityType } from '@/types/activity';

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
    type: 'new_member',
    timestamp: new Date('2025-10-16'),
    description: 'Hier nous avons tondu le gazon de NDL ! C\'était incroyable, merci isep bandssss',
    user: {
      name: 'Sarah LÉVY',
      avatar: '/avatars/sarah.jpg',
      role: 'Vice Présidente'
    },
    isSystemMessage: true
  },

  // Message système - nouveau membre
  {
    id: '2',
    type: 'new_member',
    timestamp: new Date('2025-10-16T12:30:00'),
    description: 'Solène DIE vient de rejoindre ISEP BANDS',
    isSystemMessage: true
  },

  // Post d'un membre du bureau avec images
  {
    id: '3',
    type: 'post_with_image',
    user: {
      name: 'Sarah LÉVY',
      avatar: '/avatars/sarah.jpg',
      role: 'Vice Présidente'
    },
    timestamp: new Date('2025-10-16T22:30:00'),
    description: 'Mangez, c\'est bon de manger.',
    images: [
      '/posts/food1.jpg',
      '/posts/food2.jpg'
    ]
  },

  // Message système - nouveau groupe créé
  {
    id: '4',
    type: 'new_group',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    description: 'Un nouveau groupe "Jazz Ensemble" a été créé',
    groupName: 'Jazz Ensemble',
    isSystemMessage: true
  },

  // Post du président
  {
    id: '5',
    type: 'post',
    user: {
      name: 'Julie LAMBERT',
      avatar: '/avatars/julie.jpg',
      role: 'Présidente'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    description: 'Rappel important : les répétitions se terminent à 22h maximum. Merci de respecter les horaires pour les voisins !'
  },

  // Message système - nouvel événement
  {
    id: '6',
    type: 'event',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    description: 'Un nouvel événement "Concert de Fin d\'Année 2024" a été programmé',
    eventTitle: 'Concert de Fin d\'Année 2024',
    isSystemMessage: true
  },


  // Post du trésorier
  {
    id: '9',
    type: 'post',
    user: {
      name: 'Alex MARTIN',
      avatar: '/avatars/alex.jpg',
      role: 'Trésorier'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    description: 'Les cotisations pour le semestre sont maintenant ouvertes. N\'oubliez pas de payer avant la fin du mois pour garder votre accès aux studios.'
  },

  // Message système - nouveau membre
  {
    id: '10',
    type: 'new_member',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    description: 'Thomas BERNARD a rejoint l\'association',
    isSystemMessage: true
  }
];

// Les rôles possibles pour les membres du bureau qui peuvent poster
export const BUREAU_ROLES = [
  'Présidente',
  'Vice Présidente',
  'Secrétaire',
  'Trésorier',
  'Responsable Événements',
  'Responsable Communication',
  'Responsable Matériel'
];

export default function HomeLoggedIn({ user, lang, onLogout, loading }: HomeLoggedInProps) {
  const t = useI18n();

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name?.split(' ')[0] || 'Sarah'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Actions rapides */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                {/* User Profile Section */}
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.image || '/avatars/default.jpg'} />
                    <AvatarFallback className="">
                      {user.name?.charAt(0) || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name || 'Sarah LÉVY'}</h3>
                    <p className="text-sm text-gray-600">2 ans, A1</p>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full mt-1">
                      Vice-Présidente
                    </span>
                  </div>
                </div>

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
                <h4 className="font-semibold text-gray-900 mb-6">Dernières Activités</h4>
                <RecentActivity activities={mockActivities} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
