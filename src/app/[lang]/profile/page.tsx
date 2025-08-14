// app/[locale]/profile/[[...slug]]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/ui/back-button';
import { Guitar, Piano, Mic, X, Edit2 } from 'lucide-react';
import { formatPromotion } from '@/utils/schoolUtils'; // Import ajouté

// Import profile components
import ProfileHeader from '@/components/profile/ProfileHeader';
import EventBanner from '@/components/profile/EventBanner';
import InstrumentsSection from '@/components/profile/InstrumentsSection';
import GroupsSection from '@/components/profile/GroupsSection';

interface ProfilePageProps {
  params: {
    locale: string;
    slug?: string[];
  };
}

type Pronouns = 'he/him' | 'she/her' | 'they/them' | 'other';

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
  promotion: string; // Sera calculé automatiquement
  role: string;
  badges: string[];
  bio: string;
  pronouns: Pronouns;
  isLookingForGroup: boolean;
  totalGroups: number;
  eventsAttended: number;
  activeGroups: number;
  memberSince: string;
  instrumentCount: number; // Ajouté
  concertsPlayed: number; // Ajouté
}

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
    type: 'concert' | 'rehearsal' | 'jam';
    date: string;
    venue?: string;
  };
  isRecruiting?: boolean;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const router = useRouter();
  const is_user_profile = true; // Set based on auth comparison

  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [profileImage, setProfileImage] = useState('');

  // Mock data mis à jour
  const [profileUser, setProfileUser] = useState<UserProfile>({
    id: '1',
    username: 'NOM Prénom',
    email: 'nom.prenom@isep.fr',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: '2023-09-15',
    emailVerified: true,
    currentLevel: 'I2', // Nouveau
    dateOfBirth: '2005-12-24', // Nouveau
    isOutOfSchool: false, // Nouveau
    promotion: '', // Sera calculé
    role: 'Vice-President',
    badges: ['Bureau 24-25'],
    bio: "Guitariste passionné depuis 8 ans, j'adore le rock alternatif et je cherche toujours à explorer de nouveaux styles musicaux. Disponible pour des projets créatifs !",
    pronouns: 'he/him',
    eventsAttended: 14,
    isLookingForGroup: true,
    totalGroups: 3,
    activeGroups: 1,
    memberSince: 'Septembre 2023',
    instrumentCount: 0, // Sera calculé
    concertsPlayed: 0, // Sera calculé
  });

  const [instruments, setInstruments] = useState<Instrument[]>([
    { id: '1', name: 'Guitare', level: 'Avancé', icon: Guitar, isPrimary: true, yearsPlaying: 8 },
    {
      id: '2',
      name: 'Piano',
      level: 'Intermédiaire',
      icon: Piano,
      isPrimary: false,
      yearsPlaying: 3,
    },
    { id: '3', name: 'Chant', level: 'Débutant', icon: Mic, isPrimary: false, yearsPlaying: 1 },
    {
      id: '4',
      name: 'Basse',
      level: 'Intermédiaire',
      icon: Guitar,
      isPrimary: false,
      yearsPlaying: 2,
    },
  ]);

  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      name: 'Les Meilleurs',
      image:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop&crop=center',
      roles: [
        { role: 'Guitariste', isPrimary: true },
        { role: 'Chœurs', isPrimary: false },
      ],
      joinDate: '27/07/2024',
      isActive: true,
      memberCount: 5,
      maxMembers: 6,
      slug: 'les-meilleurs',
      genre: 'Rock Alternatif',
      nextEvent: {
        type: 'concert',
        date: '15/12/2024',
        venue: 'Salle des Fêtes ISEP',
      },
      isRecruiting: false,
      concertCount: 8,
    },
    {
      id: '2',
      name: 'Les Nuls',
      image:
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=80&h=80&fit=crop&crop=center',
      roles: [{ role: 'Bassiste', isPrimary: true }],
      joinDate: '26/07/2023',
      isActive: false,
      inactiveSince: '15/03/2024',
      memberCount: 3,
      maxMembers: 5,
      concertCount: 4,
      slug: 'les-nuls',
      genre: 'Pop Rock',
    },
    {
      id: '3',
      name: 'Jazz Collective',
      image:
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=80&h=80&fit=crop&crop=center',
      roles: [{ role: 'Pianiste', isPrimary: true }],
      joinDate: '10/01/2024',
      isActive: false,
      inactiveSince: '20/06/2024',
      memberCount: 4,
      maxMembers: 5,
      concertCount: 3,
      slug: 'jazz-collective',
      genre: 'Jazz',
    },
  ]);

  // Calculs automatiques avec useMemo
  const calculatedUser = useMemo(() => {
    const instrumentCount = instruments.length;
    const concertsPlayed = groups.reduce((total, group) => total + group.concertCount, 0);
    const promotion = formatPromotion(
      profileUser.currentLevel,
      profileUser.dateOfBirth,
      profileUser.isOutOfSchool,
    );

    return {
      ...profileUser,
      instrumentCount,
      concertsPlayed,
      promotion,
    };
  }, [profileUser, instruments, groups]);

  // Event handlers
  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditedBio(calculatedUser.bio);
      setProfileImage(calculatedUser.image);
    } else {
      setIsEditing(true);
      setEditedBio(calculatedUser.bio);
      setProfileImage(calculatedUser.image);
    }
  };

  const handleSaveProfile = () => {
    setProfileUser((prev) => ({ ...prev, bio: editedBio, image: profileImage }));
    setIsEditing(false);
    console.log('Saving profile:', {
      bio: editedBio,
      image: profileImage,
      instruments: instruments,
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  };

  const handleGroupClick = (groupSlug: string) => {
    router.push(`/${params.locale}/groups/${groupSlug}`);
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/${params.locale}/events/${eventId}`);
  };

  const addInstrument = () => {
    const newInstrument: Instrument = {
      id: Date.now().toString(),
      name: 'Guitare',
      level: 'Débutant',
      icon: Guitar,
      isPrimary: false,
    };
    setInstruments([...instruments, newInstrument]);
  };

  const removeInstrument = (id: string) => {
    setInstruments(instruments.filter((inst) => inst.id !== id));
  };

  const updateInstrument = (id: string, field: keyof Instrument, value: string | boolean) => {
    setInstruments(
      instruments.map((inst) => (inst.id === id ? { ...inst, [field]: value } : inst)),
    );
  };

  const instrumentOptions = [
    'Guitare',
    'Piano',
    'Chant',
    'Batterie',
    'Basse',
    'Violon',
    'Flûte',
    'Saxophone',
  ];
  const levelOptions = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];

  const activeGroups = groups.filter((group) => group.isActive);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl space-y-6">
        <div className="flex items-center justify-between mb-8">
          {/* Back Button */}
          <div className="">
            <BackButton variant="ghost" />
          </div>

          {is_user_profile && (
            <div className="">
              <Button onClick={handleEditToggle} variant="outline" className="">
                {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit2 className="h-4 w-4 mr-2" />}
                {isEditing ? 'Annuler' : 'Modifier'}
              </Button>
            </div>
          )}
        </div>

        {/* Profile Header */}
        <ProfileHeader
          user={calculatedUser}
          isEditing={isEditing}
          isUserProfile={is_user_profile}
          editedBio={editedBio}
          profileImage={profileImage}
          onSaveProfile={handleSaveProfile}
          onBioChange={setEditedBio}
          onImageUpload={handleImageUpload}
        />

        {/* Event Banner */}
        <EventBanner groups={activeGroups} locale={params.locale} onEventClick={handleEventClick} />

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Instruments Section */}
          <InstrumentsSection
            instruments={instruments}
            isEditing={isEditing}
            instrumentOptions={instrumentOptions}
            levelOptions={levelOptions}
            onAddInstrument={addInstrument}
            onRemoveInstrument={removeInstrument}
            onUpdateInstrument={updateInstrument}
          />

          {/* Groups Section */}
          <GroupsSection groups={groups} onGroupClick={handleGroupClick} />
        </div>
      </div>
    </div>
  );
}
