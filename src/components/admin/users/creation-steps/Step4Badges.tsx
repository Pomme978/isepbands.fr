'use client';

import { useState, useEffect } from 'react';
import { UserFormData } from '../CreateUserModal';
import Loading from '@/components/ui/Loading';

interface Step4BadgesProps {
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
}

interface BadgeDefinition {
  id: number;
  key: string;
  labelFr: string;
  labelEn: string;
  description?: string;
  color: string;
}

export default function Step4Badges({ formData, setFormData }: Step4BadgesProps) {
  const [badges, setBadges] = useState<BadgeDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/badges');
      if (response.ok) {
        const data = await response.json();
        setBadges(data.badges || []);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBadge = (badgeId: number) => {
    const currentBadges = formData.achievementBadges || [];
    const newBadges = currentBadges.includes(badgeId)
      ? currentBadges.filter((b) => b !== badgeId)
      : [...currentBadges, badgeId];

    setFormData({ ...formData, achievementBadges: newBadges });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Badges</h3>
        <p className="text-sm text-gray-600 mb-4">
          Sélectionnez les badges qui reconnaissent les contributions et réalisations de
          l&apos;utilisateur au sein d&apos;ISEP Bands.
        </p>

        {loading ? (
          <div className="text-center py-8">
            <Loading text="Chargement des badges..." size="sm" />
          </div>
        ) : (
          <div className="space-y-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                  formData.achievementBadges.includes(badge.id)
                    ? 'bg-primary/10 border-primary/30'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => toggleBadge(badge.id)}
              >
                <input
                  type="checkbox"
                  checked={formData.achievementBadges.includes(badge.id)}
                  onChange={() => toggleBadge(badge.id)}
                  className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                />
                <div
                  className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: badge.color }}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{badge.labelFr}</h4>
                  {badge.description && (
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  )}
                </div>
              </div>
            ))}
            {badges.length === 0 && (
              <p className="text-center py-8 text-gray-500">
                Aucun badge disponible. Créez-en dans la section Badges de l&apos;administration.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-medium text-purple-900 mb-2">Badge Guidelines</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Badges recognize contributions and achievements within the association</li>
          <li>• Users can see their badges on their profile pages</li>
          <li>• Custom badges should be meaningful and related to their contributions</li>
          <li>• Badges can be modified or removed later from the user&apos;s edit page</li>
        </ul>
      </div>
    </div>
  );
}
