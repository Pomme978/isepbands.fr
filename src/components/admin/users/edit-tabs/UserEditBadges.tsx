'use client';

import { useState } from 'react';
import { Plus, X, Edit2 } from 'lucide-react';

interface Badge {
  id: number;
  name: string;
  description?: string;
  color?: string;
  dateAwarded?: string;
  awardedBy?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  badges?: Badge[];
}

interface UserEditBadgesProps {
  user: User;
  setUser: (user: User) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

interface AchievementBadgeTemplate {
  id: string;
  name: string;
  description: string;
  color: string;
}

const ACHIEVEMENT_BADGES: AchievementBadgeTemplate[] = [
  {
    id: 'founding_member',
    name: 'Founding Member',
    description: 'Original member of ISEP Bands',
    color: '#FFD700',
  },
  {
    id: 'former_board_2024',
    name: 'Former Board 2024-25',
    description: 'Board member during 2024-25 academic year',
    color: '#4169E1',
  },
  {
    id: 'concert_performer',
    name: 'Concert Performer',
    description: 'Performed in official ISEP Bands concerts',
    color: '#FF6B35',
  },
  {
    id: 'jam_regular',
    name: 'Jam Session Regular',
    description: 'Active participant in jam sessions',
    color: '#4ECDC4',
  },
  {
    id: 'studio_artist',
    name: 'Studio Recording Artist',
    description: 'Recorded tracks in studio sessions',
    color: '#45B7D1',
  },
  {
    id: 'event_organizer',
    name: 'Event Organizer',
    description: 'Helped organize association events',
    color: '#96CEB4',
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
  { value: '#FFD700', name: 'Gold' },
];

export default function UserEditBadges({
  user,
  setUser,
  setHasUnsavedChanges,
}: UserEditBadgesProps) {
  const [isAddingBadge, setIsAddingBadge] = useState(false);
  const [editingBadge, setEditingBadge] = useState<number | null>(null);
  const [newBadge, setNewBadge] = useState({
    name: '',
    description: '',
    color: '#FF6B35',
  });

  const userBadges = user.badges || [];

  const addAchievementBadge = (template: AchievementBadgeTemplate) => {
    const newBadge: Badge = {
      id: Date.now(), // Temporary ID for frontend
      name: template.name,
      description: template.description,
      color: template.color,
      dateAwarded: new Date().toISOString().split('T')[0],
      awardedBy: 'Admin',
    };

    const updatedBadges = [...userBadges, newBadge];
    setUser({ ...user, badges: updatedBadges });
    setHasUnsavedChanges(true);
  };

  const addCustomBadge = () => {
    if (!newBadge.name.trim()) return;

    const badge: Badge = {
      id: Date.now(), // Temporary ID for frontend
      name: newBadge.name,
      description: newBadge.description,
      color: newBadge.color,
      dateAwarded: new Date().toISOString().split('T')[0],
      awardedBy: 'Admin',
    };

    const updatedBadges = [...userBadges, badge];
    setUser({ ...user, badges: updatedBadges });

    setNewBadge({ name: '', description: '', color: '#FF6B35' });
    setIsAddingBadge(false);
    setHasUnsavedChanges(true);
  };

  const removeBadge = (id: number) => {
    const updatedBadges = userBadges.filter((badge) => badge.id !== id);
    setUser({ ...user, badges: updatedBadges });
    setHasUnsavedChanges(true);
  };

  const updateBadge = (id: number, updates: Partial<Badge>) => {
    const updatedBadges = userBadges.map((badge) =>
      badge.id === id ? { ...badge, ...updates } : badge,
    );
    setUser({ ...user, badges: updatedBadges });
    setHasUnsavedChanges(true);
  };

  const availableAchievementBadges = ACHIEVEMENT_BADGES.filter(
    (template) => !userBadges.some((badge) => badge.name === template.name),
  );

  const getIsAchievementBadge = (badgeName: string) => {
    return ACHIEVEMENT_BADGES.some((template) => template.name === badgeName);
  };

  const BadgeCard = ({ badge }: { badge: Badge }) => {
    const isAchievement = getIsAchievementBadge(badge.name);

    return (
      <div className="p-4 border-2 border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: badge.color || '#FF6B35' }}
            />
            <div>
              <h4 className="font-semibold text-gray-900">{badge.name}</h4>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  isAchievement ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}
              >
                {isAchievement ? 'Achievement' : 'Custom'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {!isAchievement && (
              <button
                onClick={() => setEditingBadge(badge.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => removeBadge(badge.id)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {editingBadge === badge.id && !isAchievement ? (
          <div className="space-y-3">
            <input
              type="text"
              value={badge.name}
              onChange={(e) => updateBadge(badge.id, { name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Badge name"
            />
            <textarea
              value={badge.description || ''}
              onChange={(e) => updateBadge(badge.id, { description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              rows={2}
              placeholder="Badge description"
            />
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Color:</span>
              {BADGE_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateBadge(badge.id, { color: color.value })}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    badge.color === color.value
                      ? 'border-gray-900 scale-110'
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setEditingBadge(null)}
                className="text-sm text-primary hover:text-primary/80"
              >
                Done editing
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{badge.description || 'No description'}</p>
            {badge.dateAwarded && (
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Awarded: {new Date(badge.dateAwarded).toLocaleDateString()}</span>
                <span>By: {badge.awardedBy || 'System'}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Current Badges */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Current Badges ({userBadges.length})
        </h3>

        {userBadges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No badges awarded yet</p>
            <p className="text-sm">Add badges to recognize achievements and contributions</p>
          </div>
        )}
      </div>

      {/* Add Achievement Badges */}
      {availableAchievementBadges.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Award Achievement Badges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableAchievementBadges.map((template) => (
              <button
                key={template.id}
                onClick={() => addAchievementBadge(template)}
                className="p-3 border border-gray-200 rounded-lg text-left hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div
                    className="w-5 h-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: template.color }}
                  />
                  <span className="font-medium text-gray-900">{template.name}</span>
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Badge */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Custom Badges</h3>
          <button
            onClick={() => setIsAddingBadge(true)}
            className="inline-flex items-center px-3 py-1 text-sm bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Custom Badge
          </button>
        </div>

        {isAddingBadge && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Create Custom Badge</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge Name</label>
                <input
                  type="text"
                  value={newBadge.name}
                  onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="e.g., Outstanding Musician"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newBadge.description}
                  onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  rows={2}
                  placeholder="Describe what this badge represents..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Color</label>
                <div className="flex flex-wrap gap-2">
                  {BADGE_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewBadge({ ...newBadge, color: color.value })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newBadge.color === color.value
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
                    value={newBadge.color}
                    onChange={(e) => setNewBadge({ ...newBadge, color: e.target.value })}
                    className="w-8 h-8 border border-gray-200 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">Custom color</span>
                </div>
              </div>

              {/* Preview */}
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: newBadge.color }}
                  />
                  <div>
                    <span className="font-medium text-gray-900">
                      {newBadge.name || 'Badge Name'}
                    </span>
                    <p className="text-sm text-gray-600">
                      {newBadge.description || 'Badge description'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setIsAddingBadge(false);
                    setNewBadge({ name: '', description: '', color: '#FF6B35' });
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addCustomBadge}
                  disabled={!newBadge.name.trim()}
                  className="inline-flex items-center px-4 py-2 text-sm bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Badge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Badge Guidelines */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Badge Guidelines</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • <strong>Achievement badges</strong> recognize specific accomplishments within the
              association
            </li>
            <li>
              • <strong>Custom badges</strong> can be created for unique contributions or special
              recognition
            </li>
            <li>• Badges appear on the user&apos;s profile and are visible to other members</li>
            <li>• Remove badges only when they are no longer accurate or relevant</li>
            <li>• Consider the user&apos;s feelings before removing significant badges</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
