'use client';

import { useState, useEffect } from 'react';
import { FileText, User, Calendar, MessageSquare, Music, Clock } from 'lucide-react';

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
  const [registrationDetails, setRegistrationDetails] = useState<RegistrationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        console.log('Error fetching registration details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrationDetails();
  }, [userId]);

  const formatSkillLevel = (level: string) => {
    const levels = {
      BEGINNER: 'Débutant',
      INTERMEDIATE: 'Intermédiaire',
      ADVANCED: 'Avancé',
      EXPERT: 'Expert',
    };
    return levels[level as keyof typeof levels] || level;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>

      {/* Section : Détails d'inscription originale */}
      {registrationDetails && (
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
      )}

      {/* Section : Journal d'activité (placeholder) */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="flex flex-col items-center">
          <FileText className="w-12 h-12 text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Journal d&apos;activité</h4>
          <p className="text-gray-600 max-w-sm">
            Cette section affichera un journal complet de toutes les activités de
            l&apos;utilisateur, incluant les connexions, modifications de profil, participation aux
            événements et actions administratives.
          </p>
          <div className="mt-4 text-sm text-gray-500">Système de journalisation à venir</div>
        </div>
      </div>
    </div>
  );
}
