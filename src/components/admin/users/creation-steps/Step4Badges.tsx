'use client';

import { useState } from 'react';
import { UserFormData } from '../CreateUserModal';

interface Step4BadgesProps {
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
}

const ACHIEVEMENT_BADGES = [
  { id: 'founding_member', label: 'Founding Member', description: 'Original member of ISEP Bands' },
  {
    id: 'former_board_2024',
    label: 'Former Board 2024-25',
    description: 'Board member during 2024-25 academic year',
  },
  {
    id: 'concert_performer',
    label: 'Concert Performer',
    description: 'Performed in official ISEP Bands concerts',
  },
  {
    id: 'jam_regular',
    label: 'Jam Session Regular',
    description: 'Active participant in jam sessions',
  },
  {
    id: 'studio_artist',
    label: 'Studio Recording Artist',
    description: 'Recorded tracks in studio sessions',
  },
  {
    id: 'event_organizer',
    label: 'Event Organizer',
    description: 'Helped organize association events',
  },
];

const BADGE_COLORS = [
  { value: '#FF6B35', name: 'Orange' },
  { value: '#4ECDC4', name: 'Teal' },
  { value: '#45B7D1', name: 'Blue' },
  { value: '#96CEB4', name: 'Green' },
  { value: '#FFEAA7', name: 'Yellow' },
  { value: '#DDA0DD', name: 'Purple' },
  { value: '#FFB6C1', name: 'Pink' },
  { value: '#D3D3D3', name: 'Silver' },
];

export default function Step4Badges({ formData, setFormData }: Step4BadgesProps) {
  const [showCustomBadge, setShowCustomBadge] = useState(false);

  const toggleBadge = (badgeId: string) => {
    const currentBadges = formData.achievementBadges || [];
    const newBadges = currentBadges.includes(badgeId)
      ? currentBadges.filter((b) => b !== badgeId)
      : [...currentBadges, badgeId];

    setFormData({ ...formData, achievementBadges: newBadges });
  };

  const updateCustomBadge = (field: string, value: string) => {
    const customBadge = formData.customBadge || { name: '', description: '', color: '#FF6B35' };
    setFormData({
      ...formData,
      customBadge: { ...customBadge, [field]: value },
    });
  };

  const removeCustomBadge = () => {
    setFormData({ ...formData, customBadge: undefined });
    setShowCustomBadge(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Achievement Badges</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select badges that recognize the user&apos;s contributions and achievements within ISEP
          Bands.
        </p>

        <div className="space-y-3">
          {ACHIEVEMENT_BADGES.map((badge) => (
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
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{badge.label}</h4>
                <p className="text-sm text-gray-600">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Custom Badge</h3>
          {!showCustomBadge && !formData.customBadge && (
            <button
              onClick={() => setShowCustomBadge(true)}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              + Add Custom Badge
            </button>
          )}
        </div>

        {(showCustomBadge || formData.customBadge) && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge Name</label>
              <input
                type="text"
                value={formData.customBadge?.name || ''}
                onChange={(e) => updateCustomBadge('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="e.g., Exceptional Musician"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge Description
              </label>
              <textarea
                value={formData.customBadge?.description || ''}
                onChange={(e) => updateCustomBadge('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="Describe what this badge represents..."
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badge Color</label>
              <div className="flex flex-wrap gap-2">
                {BADGE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateCustomBadge('color', color.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.customBadge?.color === color.value
                        ? 'border-gray-900 scale-110'
                        : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="color"
                  value={formData.customBadge?.color || '#FF6B35'}
                  onChange={(e) => updateCustomBadge('color', e.target.value)}
                  className="w-8 h-8 border border-gray-200 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600">Custom color picker</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={removeCustomBadge}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Remove Custom Badge
              </button>
            </div>
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
