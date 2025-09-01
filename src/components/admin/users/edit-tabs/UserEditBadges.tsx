'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Edit2 } from 'lucide-react';

interface Badge {
  id: number;
  name: string;
  badgeDefinitionId?: number;
  badgeDefinition?: {
    id: number;
    key: string;
    labelFr: string;
    labelEn: string;
    color: string;
    colorEnd?: string | null;
    gradientDirection: string;
    textColor: string;
    description?: string;
  };
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
  isReadOnly?: boolean;
}

interface BadgeDefinition {
  id: number;
  key: string;
  labelFr: string;
  labelEn: string;
  description?: string;
  color: string;
}

export default function UserEditBadges({
  user,
  setUser,
  setHasUnsavedChanges,
  isReadOnly = false,
}: UserEditBadgesProps) {
  const [badgeDefinitions, setBadgeDefinitions] = useState<BadgeDefinition[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);
  const [isAddingBadge, setIsAddingBadge] = useState(false);
  const [editingBadge, setEditingBadge] = useState<number | null>(null);
  const [selectedBadgeId, setSelectedBadgeId] = useState<number | null>(null);

  // ====================
  // Filtre badges utilisateur (garde tous les badges, legacy inclus)
  // ====================
  const userBadges = (user.badges || []).filter(() => true);

  // ====================
  // Chargement des définitions de badges
  // ====================
  useEffect(() => {
    fetchBadgeDefinitions();
  }, []);

  const fetchBadgeDefinitions = async () => {
    try {
      const response = await fetch('/api/badges');
      if (response.ok) {
        const data = await response.json();
        setBadgeDefinitions(data.badges || []);
      }
    } catch (error) {
    } finally {
      setLoadingBadges(false);
    }
  };

  // ====================
  // Ajout d'un badge
  // ====================
  const addBadge = () => {
    if (!selectedBadgeId) return;

    const selectedBadgeDef = badgeDefinitions.find((b) => b.id === selectedBadgeId);
    if (!selectedBadgeDef) return;

    const newBadge: Badge = {
      id: Date.now(),
      name: selectedBadgeDef.key,
      badgeDefinitionId: selectedBadgeDef.id,
      badgeDefinition: {
        id: selectedBadgeDef.id,
        key: selectedBadgeDef.key,
        labelFr: selectedBadgeDef.labelFr,
        labelEn: selectedBadgeDef.labelEn,
        color: selectedBadgeDef.color,
        description: selectedBadgeDef.description,
        gradientDirection: 'to right',
        textColor: 'white',
      },
      description: selectedBadgeDef.description || '',
      color: selectedBadgeDef.color,
      dateAwarded: new Date().toISOString().split('T')[0],
      awardedBy: 'Admin',
    };

    const updatedBadges = [...userBadges, newBadge];
    setUser({ ...user, badges: updatedBadges });
    setHasUnsavedChanges(true);

    setIsAddingBadge(false);
    setSelectedBadgeId(null);
  };

  // ====================
  // Suppression d'un badge
  // ====================
  const removeBadge = (id: number) => {
    const updatedBadges = userBadges.filter((badge) => badge.id !== id);
    setUser({ ...user, badges: updatedBadges });
    setHasUnsavedChanges(true);
  };

  // ====================
  // Modification d'un badge
  // ====================
  const updateBadge = (id: number, updates: Partial<Badge>) => {
    const updatedBadges = userBadges.map((badge) =>
      badge.id === id ? { ...badge, ...updates } : badge,
    );
    setUser({ ...user, badges: updatedBadges });
    setHasUnsavedChanges(true);
  };

  // ====================
  // Définition des badges disponibles (non utilisés)
  // ====================
  // (Variable inutilisée, retirée)

  // ====================
  // Détermine si le badge est système
  // ====================
  const getIsSystemBadge = (badge: Badge) => {
    return (
      badge.badgeDefinitionId !== undefined ||
      badgeDefinitions.some((badgeDef) => badgeDef.key === badge.name)
    );
  };

  // ====================
  // Composant d'affichage d'un badge
  // ====================
  const BadgeCard = ({ badge }: { badge: Badge }) => {
    const isSystemBadge = getIsSystemBadge(badge);
    const badgeDef =
      badge.badgeDefinition ||
      badgeDefinitions.find((b) => b.id === badge.badgeDefinitionId || b.key === badge.name);


    return (
      <div className="p-4 border-2 border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-300"
              style={{
                backgroundColor: (isSystemBadge && badgeDef?.color) || badge.color || '#FF6B35',
              }}
            />
            <div>
              <h4 className="font-semibold text-gray-900">
                {isSystemBadge ? badgeDef?.labelFr || badge.name : badge.name}
              </h4>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                Badge
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {!isSystemBadge && !isReadOnly && (
              <button
                onClick={() => setEditingBadge(badge.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {!isReadOnly && (
              <button
                onClick={() => removeBadge(badge.id)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {editingBadge === badge.id && !isSystemBadge && !isReadOnly ? (
          <div className="space-y-3">
            <input
              type="text"
              value={badge.name}
              onChange={(e) => updateBadge(badge.id, { name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Nom du badge"
            />
            <textarea
              value={badge.description || ''}
              onChange={(e) => updateBadge(badge.id, { description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              rows={2}
              placeholder="Description du badge"
            />
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Couleur:</span>
              <input
                type="color"
                value={badge.color || '#FF6B35'}
                onChange={(e) => updateBadge(badge.id, { color: e.target.value })}
                className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setEditingBadge(null)}
                className="text-sm text-primary hover:text-primary/80"
              >
                Terminer la modification
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              {isSystemBadge
                ? badgeDef?.description || badge.description || 'Aucune description'
                : badge.description || 'Aucune description'}
            </p>
            {badge.dateAwarded && (
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Décerné le: {new Date(badge.dateAwarded).toLocaleDateString()}</span>
                <span>Par: {badge.awardedBy || 'Système'}</span>
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
          Badges Actuels ({userBadges.length})
        </h3>

        {userBadges.length > 0 ? (
          <div className="space-y-4">
            {userBadges.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {userBadges.map((badge) => {
                    // Use color from badgeDefinition if available, otherwise fallback to badge.color or default
                    const badgeColor = badge.badgeDefinition?.color || badge.color || '#FF6B35';
                    const badgeColorEnd = badge.badgeDefinition?.colorEnd;
                    const gradientDirection =
                      badge.badgeDefinition?.gradientDirection || 'to right';

                    const textColor = badge.badgeDefinition?.textColor || 'white';
                    const displayName = badge.badgeDefinition?.labelFr || badge.name;

                    // Détermine le style de fond (gradient ou couleur unie)
                    const backgroundStyle = badgeColorEnd
                      ? {
                          background: `linear-gradient(${gradientDirection}, ${badgeColor}, ${badgeColorEnd})`,
                        }
                      : { backgroundColor: badgeColor };

                    return (
                      <span
                        key={badge.id}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ease-in-out"
                        style={{
                          ...backgroundStyle,
                          color: textColor,
                        }}
                        title={badge.badgeDefinition?.description || badge.description}
                      >
                        {displayName}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun badge décerné</p>
            <p className="text-sm">
              Ajoutez des badges pour reconnaître les réalisations et contributions
            </p>
          </div>
        )}
      </div>

      {/* Add Badge */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ajouter un Badge</h3>
          {!isReadOnly && (
            <button
              onClick={() => setIsAddingBadge(!isAddingBadge)}
              className={`inline-flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                isAddingBadge
                  ? 'bg-gray-500 text-white hover:bg-gray-600'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              <Plus
                className={`w-3 h-3 mr-1 transition-transform ${isAddingBadge ? 'rotate-45' : ''}`}
              />
              {isAddingBadge ? 'Fermer' : 'Nouveau Badge'}
            </button>
          )}
        </div>

        {isAddingBadge && !isReadOnly && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Sélectionner un Badge</h4>
            <div className="space-y-4">
              {loadingBadges ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Chargement des badges...</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Badges Disponibles
                    </label>
                    {badgeDefinitions.filter(
                      (badgeDef) => !userBadges.some((badge) => badge.name === badgeDef.key),
                    ).length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>Tous les badges sont déjà attribués à cet utilisateur</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                        {badgeDefinitions.map((badgeDef) => {
                          const isAlreadyAssigned = userBadges.some(
                            (badge) =>
                              badge.badgeDefinitionId === badgeDef.id ||
                              badge.name === badgeDef.key,
                          );
                          if (isAlreadyAssigned) return null;

                          const isSelected = selectedBadgeId === badgeDef.id;

                          return (
                            <div
                              key={badgeDef.id}
                              onClick={() => setSelectedBadgeId(badgeDef.id)}
                              className={`p-3 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                                isSelected
                                  ? 'border-primary bg-primary/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"
                                  style={{ backgroundColor: badgeDef.color }}
                                />
                                <div className="min-w-0 flex-1">
                                  <h5 className="font-medium text-gray-900 text-sm truncate">
                                    {badgeDef.labelFr}
                                  </h5>
                                  <p className="text-xs text-gray-500 truncate">
                                    {badgeDef.description || 'Aucune description'}
                                  </p>
                                </div>
                                {isSelected && (
                                  <div className="flex-shrink-0 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setIsAddingBadge(false);
                        setSelectedBadgeId(null);
                      }}
                      className="inline-flex items-center px-4 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={addBadge}
                      disabled={!selectedBadgeId}
                      className="inline-flex items-center px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Ajouter Badge
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Badge Guidelines */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Guide des Badges</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • <strong>Les badges système</strong> reconnaissent des réalisations spécifiques au
              sein de l&apos;association
            </li>
            <li>
              • <strong>Les badges personnalisés</strong> peuvent être créés pour des contributions
              uniques ou une reconnaissance spéciale
            </li>
            <li>
              • Les badges apparaissent sur le profil de l&apos;utilisateur et sont visibles par les
              autres membres
            </li>
            <li>• Ne retirez les badges que lorsqu&apos;ils ne sont plus pertinents ou précis</li>
            <li>
              • Considérez les sentiments de l&apos;utilisateur avant de retirer des badges
              importants
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
