'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  User, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  UserCheck,
  UserX,
  Settings,
  Calendar,
  Shield,
  Edit3,
  Archive,
  LucideIcon 
} from 'lucide-react';
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
            <div className="w-5 h-5 bg-blue-200 rounded-full" />
            <div className="h-5 w-48 bg-gray-200 rounded" />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-64 bg-gray-100 rounded mb-2" />
            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-64 bg-gray-100 rounded mb-2" />
          </div>
        </div>
      ) : registrationDetails && (registrationDetails.motivation || registrationDetails.experience) ? (
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
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-medium text-gray-900">Historique des actions</h4>
        </div>
        {loadingLog ? (
          <div className="space-y-6">
            {/* Skeleton pour 3 activités */}
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex items-start space-x-4 animate-pulse">
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
        ) : activityLog.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune activité enregistrée</p>
            <p className="text-sm">Les actions de l&apos;utilisateur apparaîtront ici</p>
          </div>
        ) : (
          <ol className="relative border-l-2 border-primary/30 ml-4">
            {activityLog.map((log) => {
              const { icon: IconComponent, color } = getActivityIconAndColor(log.type);
              return (
              <li key={log.id} className="mb-8 ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-white border-2 border-gray-200 rounded-full">
                  <IconComponent className={`w-3 h-3 ${color}`} />
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400">
                    {new Date(log.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })} à {new Date(log.createdAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="font-semibold text-gray-900">{log.title}</span>
                  {log.description && (
                    <span className="text-sm text-gray-700">{log.description}</span>
                  )}
                  {(log.createdByName || log.createdBy) && (
                    <span className="text-xs text-gray-500">
                      Par {log.createdByName || 'Système'}
                    </span>
                  )}
                </div>
              </li>
            );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
