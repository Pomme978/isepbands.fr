'use client';

import { useState } from 'react';
import PendingApprovalCard from './PendingApprovalCard';
import ApprovalModal from './ApprovalModal';
import { Users, Megaphone } from 'lucide-react';
import { formatPromotion } from '@/utils/schoolUtils';

type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
type Pronouns = 'he/him' | 'she/her' | 'they/them' | 'other';

interface RegistrationInstrument {
  instrumentId: number;
  instrumentName: string;
  skillLevel: SkillLevel;
}

interface PendingUser {
  id: string;
  type: 'user';
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentLevel: string; // I1, I2, A1, A2, A3, B1, B2, B3, P1, P2
  dateOfBirth: string;
  isOutOfSchool: boolean;
  pronouns?: Pronouns;
  motivation: string;
  experience: string;
  instruments: RegistrationInstrument[];
  profilePhoto?: string;
  submittedAt: string;
}

interface BandMember {
  userId: string;
  name: string;
  roles: string[]; // Array of roles like ['Guitariste', 'Chœurs']
}

interface PendingBand {
  id: string;
  type: 'band';
  name: string;
  genre: string;
  description: string;
  motivation: string;
  members: BandMember[]; // Updated structure
  maxMembers: number;
  submittedAt: string;
  createdBy: string; // User ID who created the band
}

type PendingItem = PendingUser | PendingBand;

// Mock data - replace with actual API calls
const PENDING_USERS: PendingUser[] = [
  {
    id: '1',
    type: 'user',
    name: 'Alice Martin',
    firstName: 'Alice',
    lastName: 'Martin',
    email: 'alice.martin@edu.isep.fr',
    phone: '+33 6 12 34 56 78',
    currentLevel: 'A2',
    dateOfBirth: '2003-05-15',
    isOutOfSchool: false,
    pronouns: 'she/her',
    motivation:
      "Je suis passionnée de musique depuis mon enfance. J'ai toujours rêvé de faire partie d'un groupe et de partager ma passion avec d'autres étudiants. ISEP Bands me semble être l'opportunité parfaite pour rencontrer des musiciens de mon niveau et créer de la musique ensemble. J'aimerais particulièrement explorer le rock alternatif et peut-être composer nos propres morceaux.",
    experience:
      "J'ai commencé la guitare à 12 ans et je joue depuis 8 ans maintenant. J'ai pris des cours pendant 4 ans puis j'ai continué en autodidacte. Je connais bien les accords, le fingerpicking et j'ai joué dans un petit groupe de lycée où nous reprenions des classiques du rock. J'ai aussi commencé à apprendre le chant pour pouvoir faire les chœurs.",
    instruments: [
      { instrumentId: 1, instrumentName: 'Guitare', skillLevel: 'INTERMEDIATE' },
      { instrumentId: 4, instrumentName: 'Chant', skillLevel: 'BEGINNER' },
    ],
    submittedAt: 'il y a 2 heures',
  },
  {
    id: '2',
    type: 'user',
    name: 'Thomas Dubois',
    firstName: 'Thomas',
    lastName: 'Dubois',
    email: 'thomas.dubois@edu.isep.fr',
    phone: '+33 6 98 76 54 32',
    currentLevel: 'A3',
    dateOfBirth: '2002-11-22',
    isOutOfSchool: false,
    pronouns: 'he/him',
    motivation:
      "La batterie est ma passion depuis le collège. J'aimerais rejoindre ISEP Bands pour pouvoir jouer régulièrement et rencontrer d'autres passionnés de musique. C'est aussi l'occasion pour moi de me détendre après les cours et de partager cette passion avec d'autres étudiants de l'école.",
    experience:
      "Je joue de la batterie depuis 6 ans. J'ai appris au conservatoire pendant 3 ans puis j'ai continué seul. Je maîtrise différents styles : rock, pop, un peu de jazz. J'ai déjà joué en groupe pour quelques concerts locaux et je suis à l'aise avec l'improvisation et les fills.",
    instruments: [{ instrumentId: 3, instrumentName: 'Batterie', skillLevel: 'ADVANCED' }],
    submittedAt: 'il y a 5 heures',
  },
  {
    id: '3',
    type: 'user',
    name: 'Marie Lefebvre',
    firstName: 'Marie',
    lastName: 'Lefebvre',
    email: 'marie.lefebvre@edu.isep.fr',
    phone: '+33 6 55 44 33 22',
    currentLevel: 'I2',
    dateOfBirth: '2004-03-10',
    isOutOfSchool: false,
    pronouns: 'she/her',
    motivation:
      "J'adore le piano et je cherche à élargir mes horizons musicaux. Rejoindre un groupe me permettrait d'apprendre à jouer avec d'autres musiciens et de découvrir de nouveaux styles. Je suis particulièrement intéressée par le jazz et la pop.",
    experience:
      "Je joue du piano depuis 10 ans, d'abord classique puis j'ai évolué vers le jazz et la pop. J'ai quelques notions d'harmonie et je commence à improviser. J'ai participé à quelques récitals au conservatoire.",
    instruments: [
      { instrumentId: 5, instrumentName: 'Piano', skillLevel: 'ADVANCED' },
      { instrumentId: 4, instrumentName: 'Chant', skillLevel: 'INTERMEDIATE' },
    ],
    submittedAt: 'il y a 1 jour',
  },
];

const PENDING_BANDS: PendingBand[] = [
  {
    id: '1',
    type: 'band',
    name: 'Electric Dreams',
    genre: 'Rock Électronique',
    description:
      "Nous sommes un groupe qui mélange rock alternatif et éléments électroniques. Notre style s'inspire de Muse, Linkin Park et Imagine Dragons. Nous cherchons à créer une musique énergique et moderne qui fera bouger les foules lors des concerts ISEP.",
    motivation:
      "Notre objectif est de composer nos propres morceaux et de les jouer lors des événements de l'école. Nous sommes motivés et déterminés à créer quelque chose d'unique qui représentera bien l'esprit ISEP.",
    members: [
      { userId: 'user_123', name: 'Paul Durand', roles: ['Guitariste', 'Chant'] },
      {
        userId: 'user_124',
        name: 'Marie Leroy',
        roles: ['Clavier', 'Synthétiseur'],
      },
      { userId: 'user_125', name: 'Lucas Martin', roles: ['Basse'] },
    ],
    maxMembers: 5,
    submittedAt: 'il y a 3 heures',
    createdBy: 'user_123',
  },
  {
    id: '2',
    type: 'band',
    name: 'Midnight Sessions',
    genre: 'Jazz Fusion',
    description:
      "Groupe de jazz fusion composé d'étudiants passionnés. Nous aimons explorer les frontières entre jazz, funk et rock progressif. Nos influences incluent Weather Report, Snarky Puppy et Return to Forever. Nous privilégions l'improvisation et les compositions originales.",
    motivation:
      "Le jazz fusion demande beaucoup de technique et de cohésion. ISEP Bands nous donnerait l'opportunité de travailler ensemble régulièrement et d'accéder à un local de répétition adapté. Nous souhaitons aussi organiser des jam sessions ouvertes pour initier d'autres étudiants à ce style musical riche et complexe.",
    members: [
      { userId: 'user_126', name: 'Sophie Chen', roles: ['Piano'] },
      { userId: 'user_127', name: 'Antoine Moreau', roles: ['Saxophone'] },
      { userId: 'user_128', name: 'Karim Benali', roles: ['Contrebasse'] },
      { userId: 'user_129', name: 'Lisa Wang', roles: ['Batterie'] },
    ],
    maxMembers: 6,
    submittedAt: 'il y a 1 jour',
    createdBy: 'user_126',
  },
];

interface PendingApprovalsProps {
  pendingUsers?: PendingUser[];
  pendingBands?: PendingBand[];
  onApproveUser?: (id: string) => void;
  onRejectUser?: (id: string, reason: string) => void;
  onApproveBand?: (id: string) => void;
  onRejectBand?: (id: string, reason: string) => void;
}

export default function PendingApprovals({
  pendingUsers = PENDING_USERS,
  pendingBands = PENDING_BANDS,
  onApproveUser = (id) => console.log('Approve user:', id),
  onRejectUser = (id, reason) => console.log('Reject user:', id, 'Reason:', reason),
  onApproveBand = (id) => console.log('Approve band:', id),
  onRejectBand = (id, reason) => console.log('Reject band:', id, 'Reason:', reason),
}: PendingApprovalsProps) {
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (item: PendingItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleApprove = (id: string) => {
    if (selectedItem?.type === 'user') {
      onApproveUser(id);
    } else {
      onApproveBand(id);
    }
  };

  const handleReject = (id: string, reason: string) => {
    if (selectedItem?.type === 'user') {
      onRejectUser(id, reason);
    } else {
      onRejectBand(id, reason);
    }
  };

  // Don't render if no pending approvals
  if (pendingUsers.length === 0 && pendingBands.length === 0) {
    return null;
  }

  // Transform data for the cards
  const userItems = pendingUsers.map((user) => {
    const promotion = formatPromotion(user.currentLevel, user.dateOfBirth, user.isOutOfSchool);
    return {
      id: user.id,
      name: user.name,
      type: 'user' as const,
      email: `${promotion.split(',')[0]} - ${user.email}`, // Show promotion + email
      submittedAt: user.submittedAt,
    };
  });

  const bandItems = pendingBands.map((band) => ({
    id: band.id,
    name: band.name,
    type: 'band' as const,
    genre: `${band.genre} • ${band.members.length}/${band.maxMembers} membres`,
    submittedAt: band.submittedAt,
  }));

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Users */}
        {pendingUsers.length > 0 && (
          <PendingApprovalCard
            title="Nouveaux utilisateurs"
            items={userItems}
            onViewDetails={(item) => {
              const user = pendingUsers.find((u) => u.id === item.id);
              if (user) handleViewDetails(user);
            }}
            emptyMessage="Aucun utilisateur en attente"
            icon={Users}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
        )}

        {/* Pending Bands */}
        {pendingBands.length > 0 && (
          <PendingApprovalCard
            title="Nouveaux groupes"
            items={bandItems}
            onViewDetails={(item) => {
              const band = pendingBands.find((b) => b.id === item.id);
              if (band) handleViewDetails(band);
            }}
            emptyMessage="Aucun groupe en attente"
            icon={Megaphone}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
          />
        )}
      </div>

      {/* Approval Modal */}
      <ApprovalModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
}
