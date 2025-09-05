'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  User,
  MessageSquare,
  Clock,
  CheckCircle,
  UserCheck,
  UserX,
  Settings,
  Calendar,
  Shield,
  Edit3,
  Archive,
  LucideIcon,
  ChevronDown,
  ChevronRight,
  Info,
  LogIn,
  History,
} from 'lucide-react';
import { formatActivityDescription } from '@/services/activityLogService';
import { useAuth } from '@/lib/auth-client';
import { ActivityHistoryModal } from '@/components/common/ActivityHistoryModal';
import { Button } from '@/components/ui/button';
import ActivityItem from '@/components/admin/dashboard/ActivityItem';
interface ActivityLog {
  id: string;
  type: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  createdBy?: string;
  createdByName?: string; // Nom résolu de l'utilisateur
}

interface RegistrationDetails {
  motivation?: string;
  experience?: string;
  createdAt: string;
  instruments: {
    instrumentName: string;
    skillLevel: string;
  }[];
}

interface UserEditActivityLogProps {
  userId: string;
}

export default function UserEditActivityLog({ userId }: UserEditActivityLogProps) {
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [loadingLog, setLoadingLog] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const { user } = useAuth();

  const MAX_DISPLAYED_LOGS = 10;

  const toggleExpanded = (logId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedItems(newExpanded);
  };

  // Helper function pour formater les métadonnées de manière lisible
  const formatMetadata = (metadata: Record<string, unknown>) => {
    if (!metadata || Object.keys(metadata).length === 0) return null;

    const formatValue = (value: unknown): string => {
      if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
      if (typeof value === 'number') return value.toString();
      if (typeof value === 'string') return value;
      if (Array.isArray(value)) return value.join(', ');
      if (typeof value === 'object' && value !== null) {
        try {
          return Object.entries(value as Record<string, unknown>)
            .map(([k, v]) => `${k}: ${String(v)}`)
            .join(', ');
        } catch {
          return String(value);
        }
      }
      return String(value);
    };

    const formatKey = (key: string): string => {
      const keyMap: Record<string, string> = {
        email: 'Email',
        role: 'Rôle',
        promotion: 'Promotion',
        instrumentsCount: "Nombre d'instruments",
        badgesCount: 'Nombre de badges',
        hasTemporaryPassword: 'Mot de passe temporaire',
        sendWelcomeEmail: 'Email de bienvenue envoyé',
        postTitle: 'Titre du post',
        targetUserId: 'Utilisateur cible',
        originalAction: 'Action originale',
        adminAction: 'Action administrateur',
        deletedByOwner: 'Supprimé par le propriétaire',
        deletedByAdmin: 'Supprimé par un admin',
        oldValue: 'Ancienne valeur',
        newValue: 'Nouvelle valeur',
        changes: 'Modifications',
      };
      return keyMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    return Object.entries(metadata)
      .filter(([key]) => !['adminAction', 'originalAction'].includes(key))
      .map(([key, value]) => (
        <div key={key} className="flex flex-col sm:flex-row sm:justify-between py-1">
          <span className="text-sm font-medium text-gray-600 sm:mr-2">{formatKey(key)}:</span>
          <span className="text-sm text-gray-800 break-words">{formatValue(value)}</span>
        </div>
      ));
  };

  // Transform ActivityLog to ActivityType format for the modal
  const transformLogsForModal = (logs: ActivityLog[]) => {
    return logs.map((log) => ({
      id: log.id,
      type: log.type as
        | 'user_approved'
        | 'user_rejected'
        | 'user_created'
        | 'user_archived'
        | 'user_restored'
        | 'profile_updated'
        | 'user_edited'
        | 'role_assigned'
        | 'role_created'
        | 'permissions_updated'
        | 'permission_created'
        | 'event_created'
        | 'event_updated'
        | 'archived'
        | 'unarchived'
        | 'system_settings_updated'
        | 'year_migration'
        | 'system_announcement'
        | 'user_login'
        | 'root_login'
        | string,
      timestamp: new Date(log.createdAt),
      description: log.title,
      user: log.createdByName ? { name: log.createdByName } : undefined,
    }));
  };

  // Helper function pour obtenir l'icône et la couleur selon le type d'activité
  const getActivityIconAndColor = (type: string): { icon: LucideIcon; color: string } => {
    switch (type) {
      case 'user_approved':
        return { icon: UserCheck, color: 'text-green-600' };
      case 'user_rejected':
        return { icon: UserX, color: 'text-red-600' };
      case 'user_created':
        return { icon: User, color: 'text-blue-600' };
      case 'user_archived':
        return { icon: Archive, color: 'text-red-600' };
      case 'user_restored':
        return { icon: UserCheck, color: 'text-green-600' };
      case 'profile_updated':
      case 'user_edited':
        return { icon: Edit3, color: 'text-amber-600' };
      case 'role_assigned':
      case 'role_created':
      case 'permissions_updated':
      case 'permission_created':
        return { icon: Shield, color: 'text-purple-600' };
      case 'event_created':
      case 'event_updated':
        return { icon: Calendar, color: 'text-indigo-600' };
      case 'archived':
      case 'unarchived':
        return { icon: Archive, color: 'text-gray-600' };
      case 'system_settings_updated':
      case 'year_migration':
        return { icon: Settings, color: 'text-blue-500' };
      case 'system_announcement':
        return { icon: Settings, color: 'text-gray-500' };
      case 'user_login':
      case 'root_login':
        return { icon: LogIn, color: 'text-green-500' };
      default:
        return { icon: CheckCircle, color: 'text-primary' };
    }
  };
  const [registrationDetails, setRegistrationDetails] = useState<RegistrationDetails | null>(null);
  const [loadingRegistration, setLoadingRegistration] = useState(true);
  useEffect(() => {
    const fetchActivityLog = async () => {
      try {
        const response = await fetch(`/api/admin/users/${userId}/activity-log`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setActivityLog(data.activities || []);
          }
        }
      } catch (error) {
        // Error fetching activity log
      } finally {
        setLoadingLog(false);
      }
    };
    fetchActivityLog();
  }, [userId]);

  useEffect(() => {
    const fetchRegistrationDetails = async () => {
      try {
        const response = await fetch(`/api/admin/users/${userId}/registration-details`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setRegistrationDetails(data.details);
          }
        }
      } catch (error) {
        // Error fetching registration details
      } finally {
        setLoadingRegistration(false);
      }
    };
    fetchRegistrationDetails();
  }, [userId]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Journal d&apos;activité</h3>

      {/* Section : Détails d'inscription originale */}
      {loadingRegistration ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm animate-pulse">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div className="h-5 w-48 bg-gray-200 rounded" />
          </div>
          <div className="space-y-6">
            {/* Skeleton pour 2 blocs (motivation + expérience) */}
            {[1, 2].map((index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded flex-shrink-0 mt-0.5"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : registrationDetails &&
        (registrationDetails.motivation || registrationDetails.experience) ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-medium text-gray-900">
              Détails d&apos;inscription originale
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {/* Bloc Motivation */}
            {registrationDetails.motivation && (
              <div className="flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 mb-2">Motivation on registration</h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      &quot;{registrationDetails.motivation}&quot;
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* Bloc Expérience musicale */}
            {registrationDetails.experience && (
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 mb-2">Expérience musicale</h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      &quot;{registrationDetails.experience}&quot;
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Section : Timeline d'activité */}
      {loadingLog ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm animate-pulse">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div className="h-5 w-48 bg-gray-200 rounded" />
          </div>
          <div className="space-y-6">
            {/* Skeleton pour 3 activités */}
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-300 rounded w-48"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-100 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-medium text-gray-900">Historique des actions</h4>
            </div>
            {activityLog.length > MAX_DISPLAYED_LOGS && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistoryModal(true)}
                className="flex items-center gap-2"
              >
                <History className="w-4 h-4" />
                Voir tout ({activityLog.length})
              </Button>
            )}
          </div>
          {activityLog.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucune activité enregistrée</p>
              <p className="text-sm">Les actions de l&apos;utilisateur apparaîtront ici</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {activityLog.slice(0, MAX_DISPLAYED_LOGS).map((log) => {
                const { icon: IconComponent, color } = getActivityIconAndColor(log.type);
                const isExpanded = expandedItems.has(log.id);
                const hasMetadata = log.metadata && Object.keys(log.metadata).length > 0;
                const formattedDescription = formatActivityDescription(log, user?.id);

                // Pass raw timestamp to ActivityItem for proper formatting
                const timestamp = log.createdAt;

                // Get appropriate colors based on activity type
                const getActivityColors = (type: string) => {
                  switch (type) {
                    case 'user_approved':
                    case 'user_restored':
                    case 'first_login':
                      return { iconColor: 'text-green-600', iconBgColor: 'bg-green-100' };
                    case 'user_rejected':
                    case 'user_archived':
                      return { iconColor: 'text-red-600', iconBgColor: 'bg-red-100' };
                    case 'profile_updated':
                    case 'user_edited':
                      return { iconColor: 'text-amber-600', iconBgColor: 'bg-amber-100' };
                    case 'role_assigned':
                    case 'permissions_updated':
                      return { iconColor: 'text-purple-600', iconBgColor: 'bg-purple-100' };
                    case 'user_login':
                    case 'root_login':
                      return { iconColor: 'text-blue-600', iconBgColor: 'bg-blue-100' };
                    default:
                      return { iconColor: 'text-gray-600', iconBgColor: 'bg-gray-100' };
                  }
                };

                const colors = getActivityColors(log.type);

                return (
                  <ActivityItem
                    key={log.id}
                    title={log.title}
                    description={formattedDescription || ''}
                    timestamp={timestamp}
                    icon={IconComponent}
                    iconColor={colors.iconColor}
                    iconBgColor={colors.iconBgColor}
                    createdBy={log.createdByName || 'Système'}
                    metadata={hasMetadata ? log.metadata : undefined}
                    isExpanded={isExpanded}
                    onToggleExpand={() => toggleExpanded(log.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal historique complet */}
      <ActivityHistoryModal
        activities={transformLogsForModal(activityLog)}
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Historique complet des activités utilisateur"
      />
    </div>
  );
}
