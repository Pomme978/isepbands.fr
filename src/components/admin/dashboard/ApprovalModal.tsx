'use client';

import { useState } from 'react';
import {
  X,
  Check,
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Star,
  MessageSquare,
  Megaphone,
  Music,
  Users as UsersIcon,
  Crown,
} from 'lucide-react';
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
  members: BandMember[];
  maxMembers: number;
  submittedAt: string;
  createdBy: string; // User ID who created the band
}

type PendingItem = PendingUser | PendingBand;

interface ApprovalModalProps {
  item: PendingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

const skillLevelLabels = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
  EXPERT: 'Expert',
};

const skillLevelColors = {
  BEGINNER: 'bg-green-100 text-green-800',
  INTERMEDIATE: 'bg-blue-100 text-blue-800',
  ADVANCED: 'bg-orange-100 text-orange-800',
  EXPERT: 'bg-purple-100 text-purple-800',
};

const pronounsLabels = {
  'he/him': 'Il/Lui',
  'she/her': 'Elle/Elle',
  'they/them': 'Iel/Elleux',
  other: 'Autre',
};

export default function ApprovalModal({
  item,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: ApprovalModalProps) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !item) return null;

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(item.id);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;

    setIsProcessing(true);
    try {
      await onReject(item.id, rejectReason);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setShowRejectForm(false);
    setRejectReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            {item.type === 'user' ? (
              <User className="w-6 h-6 text-primary" />
            ) : (
              <Megaphone className="w-6 h-6 text-primary" />
            )}
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {item.type === 'user'
                  ? "Demande d'inscription utilisateur"
                  : 'Demande de création de groupe'}
              </h2>
              <p className="text-sm text-muted-foreground">Soumis {item.submittedAt}</p>
            </div>
          </div>
          <button onClick={resetModal} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {item.type === 'user' ? <UserDetails user={item} /> : <BandDetails band={item} />}
        </div>

        {/* Actions */}
        <div className="border-t border-border p-6">
          {!showRejectForm ? (
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={isProcessing}
                className="px-6 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Refuser
              </button>
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>{isProcessing ? 'Approbation...' : 'Approuver'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Raison du refus
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Veuillez expliquer la raison du refus..."
                  className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                />
              </div>
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setShowRejectForm(false)}
                  disabled={isProcessing}
                  className="px-6 py-2 text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleReject}
                  disabled={isProcessing || !rejectReason.trim()}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Refus...' : 'Confirmer le refus'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UserDetails({ user }: { user: PendingUser }) {
  const promotion = formatPromotion(user.currentLevel, user.dateOfBirth, user.isOutOfSchool);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-start space-x-6">
        {user.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-foreground">
            {user.firstName} {user.lastName}
          </h3>
          {user.pronouns && (
            <p className="text-sm text-muted-foreground mb-2">{pronounsLabels[user.pronouns]}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <span>{promotion}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{new Date(user.dateOfBirth).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instruments */}
      {user.instruments.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center space-x-2">
            <Music className="w-5 h-5" />
            <span>Instruments</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {user.instruments.map((instrument, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
              >
                <span className="font-medium">{instrument.instrumentName}</span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${skillLevelColors[instrument.skillLevel]}`}
                >
                  {skillLevelLabels[instrument.skillLevel]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivation */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center space-x-2">
          <Star className="w-5 h-5" />
          <span>Motivation</span>
        </h4>
        <div className="p-4 bg-accent/30 rounded-lg">
          <p className="text-foreground whitespace-pre-wrap">{user.motivation}</p>
        </div>
      </div>

      {/* Experience */}
      {user.experience && (
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Expérience musicale</span>
          </h4>
          <div className="p-4 bg-accent/30 rounded-lg">
            <p className="text-foreground whitespace-pre-wrap">{user.experience}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function BandDetails({ band }: { band: PendingBand }) {
  return (
    <div className="space-y-6">
      {/* Band Header */}
      <div>
        <h3 className="text-2xl font-bold text-foreground">{band.name}</h3>
        <p className="text-lg text-muted-foreground mt-1">{band.genre}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
          <span>
            {band.members.length}/{band.maxMembers} membres
          </span>
          <span>•</span>
          <span>Créé par {band.members.find((m) => m.userId === band.createdBy)?.name}</span>
        </div>
      </div>

      {/* Description */}
      {band.description && (
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-3">Description</h4>
          <div className="p-4 bg-accent/30 rounded-lg">
            <p className="text-foreground whitespace-pre-wrap">{band.description}</p>
          </div>
        </div>
      )}

      {/* Members */}
      {band.members.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center space-x-2">
            <UsersIcon className="w-5 h-5" />
            <span>Membres</span>
          </h4>
          <div className="space-y-3">
            {band.members.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-accent/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{member.name}</span>
                      {member.userId === band.createdBy && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{member.roles.join(' • ')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivation */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center space-x-2">
          <Star className="w-5 h-5" />
          <span>Motivation</span>
        </h4>
        <div className="p-4 bg-accent/30 rounded-lg">
          <p className="text-foreground whitespace-pre-wrap">{band.motivation}</p>
        </div>
      </div>
    </div>
  );
}
