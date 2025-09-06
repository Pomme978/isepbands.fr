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
  Info,
  LogIn,
  History,
} from 'lucide-react';
import { formatActivityDescription } from '@/services/activityLogService';
import { useAuth } from '@/lib/auth-client';
import AdminActivitiesModal from '../../dashboard/AdminActivitiesModal';
import ActivityItem from '../../dashboard/ActivityItem';
import { Button } from '@/components/ui/button';
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const { user } = useAuth();

  const MAX_DISPLAYED_LOGS = 5;

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

  // Transform ActivityLog to AdminActivitiesModal format
  const transformLogsForModal = (logs: ActivityLog[]) => {
    return logs.map((log) => {
      const { icon: IconComponent, color } = getActivityIconAndColor(log.type);
      const activityType = getActivityType(log.type);

      return {
        id: log.id,
        title: log.title,
        description: formatActivityDescription(log, user?.id) || log.description || '',
        timestamp: new Date(log.createdAt).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: activityType,
        icon: IconComponent,
        metadata: log.metadata,
        adminAction: log.createdByName
          ? {
              adminName: log.createdByName,
            }
          : undefined,
      };
    });
  };

  // Get activity type for AdminActivitiesModal
  const getActivityType = (type: string): 'success' | 'info' | 'warning' | 'error' | 'default' => {
    switch (type) {
      case 'user_approved':
      case 'user_restored':
      case 'user_created':
        return 'success';
      case 'user_rejected':
      case 'user_archived':
        return 'error';
      case 'profile_updated':
      case 'user_edited':
      case 'role_assigned':
        return 'warning';
      case 'user_login':
      case 'root_login':
        return 'info';
      default:
        return 'default';
    }
  };

  // Get colors for ActivityItem based on type
  const getActivityColors = (type: 'success' | 'info' | 'warning' | 'error' | 'default') => {
    switch (type) {
      case 'success':
        return {
          iconColor: 'text-green-600',
          iconBgColor: 'bg-green-100',
        };
      case 'info':
        return {
          iconColor: 'text-blue-600',
          iconBgColor: 'bg-blue-100',
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-600',
          iconBgColor: 'bg-yellow-100',
        };
      case 'error':
        return {
          iconColor: 'text-red-600',
          iconBgColor: 'bg-red-100',
        };
      default:
        return {
          iconColor: 'text-primary',
          iconBgColor: 'bg-primary/10',
        };
    }
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
    <div className="space-y-8">
      {/* Section : Détails d'inscription originale */}
      {loadingRegistration ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skeleton pour 2 blocs (motivation + expérience) */}
            {[1, 2].map((index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : registrationDetails &&
        (registrationDetails.motivation || registrationDetails.experience) ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-medium text-gray-900">
              Détails d&apos;inscription originale
            </h4>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bloc Motivation */}
            {registrationDetails.motivation && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <h5 className="font-medium text-gray-900">Motivation on registration</h5>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    &quot;{registrationDetails.motivation}&quot;
                  </p>
                </div>
              </div>
            )}
            {/* Bloc Expérience musicale */}
            {registrationDetails.experience && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <h5 className="font-medium text-gray-900">Expérience musicale</h5>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    &quot;{registrationDetails.experience}&quot;
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Section : Timeline d'activité */}
      {loadingLog ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-6">
            {/* Skeleton pour 3 activités */}
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-48 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
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
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              <p>Aucune activité enregistrée</p>
              <p className="text-sm">Les actions de l&apos;utilisateur apparaîtront ici</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activityLog.slice(0, MAX_DISPLAYED_LOGS).map((log) => {
                const { icon: IconComponent, color } = getActivityIconAndColor(log.type);
                const activityType = getActivityType(log.type);
                const formattedDescription =
                  formatActivityDescription(log, user?.id) || log.description || '';
                const timestamp = new Date(log.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                const colors = getActivityColors(activityType);
                const createdBy = log.createdByName || 'Système';

                return (
                  <ActivityItem
                    key={log.id}
                    title={log.title}
                    description={formattedDescription}
                    timestamp={timestamp}
                    icon={IconComponent}
                    iconColor={colors.iconColor}
                    iconBgColor={colors.iconBgColor}
                    createdBy={createdBy}
                    metadata={log.metadata}
                    isExpanded={expandedId === log.id}
                    onToggleExpand={() => setExpandedId(expandedId === log.id ? null : log.id)}
                  />
                );
              })}

              {/* Indication des activités restantes */}
              {activityLog.length > MAX_DISPLAYED_LOGS && (
                <div className="text-center py-4 text-sm text-gray-500">
                  {activityLog.length - MAX_DISPLAYED_LOGS} autre
                  {activityLog.length - MAX_DISPLAYED_LOGS > 1 ? 's' : ''} activité
                  {activityLog.length - MAX_DISPLAYED_LOGS > 1 ? 's' : ''} disponible
                  {activityLog.length - MAX_DISPLAYED_LOGS > 1 ? 's' : ''}.{' '}
                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="text-primary hover:text-primary/80 underline"
                  >
                    Voir tout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal historique complet */}
      <AdminActivitiesModal
        activities={transformLogsForModal(activityLog)}
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Historique complet des activités utilisateur"
      />
    </div>
  );
}
