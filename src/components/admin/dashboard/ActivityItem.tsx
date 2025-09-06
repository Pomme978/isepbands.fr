'use client';

import { useState } from 'react';
import { LucideIcon, ChevronDown, ChevronRight } from 'lucide-react';

interface ActivityItemProps {
  title: string;
  description: string;
  timestamp: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  createdBy?: string;
  metadata?: Record<string, unknown>;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

// Simple markdown-like formatting
const formatText = (text: string) => {
  // Replace **text** with bold, ensuring no extra spaces
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
};

// Format timestamp to relative time (il y a Xh, il y a 3 jours) or full date if > 4 days
const formatRelativeTime = (timestamp: string) => {
  try {
    let activityDate: Date;

    // Try different timestamp formats
    if (timestamp.includes('T') || timestamp.match(/\d{4}-\d{2}-\d{2}/)) {
      // ISO format like "2025-01-06T14:30:00.000Z" or "2025-01-06"
      activityDate = new Date(timestamp);
    } else {
      // French formatted timestamp - try multiple patterns
      // Pattern 1: "5 septembre 15:23" (most common)
      let dateMatch = timestamp.match(/(\d{1,2})\s+(\w+)\s+(\d{1,2}):(\d{2})/);

      if (!dateMatch) {
        // Pattern 2: "5 septembre 2025 15:23"
        dateMatch = timestamp.match(/(\d{1,2})\s+(\w+)\s+(\d{4})\s+(\d{1,2}):(\d{2})/);
      }

      if (!dateMatch) {
        // Pattern 3: "5 septembre" (no time)
        dateMatch = timestamp.match(/(\d{1,2})\s+(\w+)$/);
      }

      if (!dateMatch) {
        return timestamp; // Can't parse, return original
      }

      const monthNames = [
        'janvier',
        'février',
        'mars',
        'avril',
        'mai',
        'juin',
        'juillet',
        'août',
        'septembre',
        'octobre',
        'novembre',
        'décembre',
      ];

      if (dateMatch.length === 3) {
        // Pattern 3: "5 septembre" (no time)
        const [, day, monthName] = dateMatch;
        const monthIndex = monthNames.findIndex((m) =>
          monthName.toLowerCase().includes(m.toLowerCase()),
        );
        if (monthIndex === -1) return timestamp;

        activityDate = new Date(new Date().getFullYear(), monthIndex, parseInt(day), 0, 0);
      } else if (dateMatch.length === 5 && dateMatch[3].length === 4) {
        // Pattern 2: "5 septembre 2025 15:23"
        const [, day, monthName, year, hour, minute] = dateMatch;
        const monthIndex = monthNames.findIndex((m) =>
          monthName.toLowerCase().includes(m.toLowerCase()),
        );
        if (monthIndex === -1) return timestamp;

        activityDate = new Date(
          parseInt(year),
          monthIndex,
          parseInt(day),
          parseInt(hour),
          parseInt(minute),
        );
      } else {
        // Pattern 1: "5 septembre 15:23"
        const [, day, monthName, hour, minute] = dateMatch;
        const monthIndex = monthNames.findIndex((m) =>
          monthName.toLowerCase().includes(m.toLowerCase()),
        );
        if (monthIndex === -1) return timestamp;

        activityDate = new Date(
          new Date().getFullYear(),
          monthIndex,
          parseInt(day),
          parseInt(hour),
          parseInt(minute),
        );
      }
    }

    // Check if date is valid
    if (isNaN(activityDate.getTime())) {
      return timestamp;
    }

    const now = new Date();
    const diffMs = now.getTime() - activityDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    // If more than 4 days, return original timestamp
    if (diffDays > 4) {
      return timestamp;
    }

    // If negative (future date), handle it
    if (diffMs < 0) {
      return timestamp;
    }

    // Format relative time
    if (diffMinutes < 60) {
      if (diffMinutes <= 1) return "À l'instant";
      return `Il y a ${diffMinutes}min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else if (diffDays === 1) {
      // For yesterday, show "Hier à 14:30"
      const hour = activityDate.getHours().toString().padStart(2, '0');
      const minute = activityDate.getMinutes().toString().padStart(2, '0');
      return `Hier à ${hour}:${minute}`;
    } else {
      // For 2+ days, show "Il y a X jours et Yh"
      const remainingHours = diffHours % 24;
      if (remainingHours === 0) {
        return `Il y a ${diffDays} jours`;
      } else {
        return `Il y a ${diffDays} jours et ${remainingHours}h`;
      }
    }
  } catch (error) {
    return timestamp;
  }
};

// Format metadata fields with French labels and proper formatting
const formatMetadataField = (key: string, value: unknown) => {
  // Map of field keys to French labels
  const fieldLabels: Record<string, string> = {
    // User management
    userEmail: 'Email',
    email: 'Email',
    role: 'Rôle attribué',
    promotion: 'Promotion',
    instrumentsCount: 'Instruments',
    badgesCount: 'Badges',
    hasTemporaryPassword: 'Mot de passe temporaire',
    sendWelcomeEmail: 'Email de bienvenue',

    // User status changes
    previousStatus: 'Statut précédent',
    newStatus: 'Nouveau statut',
    rejectionReason: 'Raison du refus',
    updatedFields: 'Champs modifiés',

    // Actions timing
    sendEmail: 'Email envoyé',
    resetAt: 'Réinitialisé le',
    approvedAt: 'Approuvé le',
    rejectedAt: 'Refusé le',
    archivedAt: 'Archivé le',
    deletedAt: 'Supprimé le',
    restoredAt: 'Restauré le',
    loginAt: 'Connecté le',
    firstLoginAt: 'Première connexion le',

    // Archive info
    wasArchivedBy: 'Archivé par',
    previousPhotoUrl: 'Ancienne photo',
    newPhotoUrl: 'Nouvelle photo',
    changes: 'Modifications détaillées',

    // System info
    userAgent: 'Navigateur',
    ip: 'Adresse IP',
    platform: 'Plateforme',
    url: 'URL',

    // Configuration
    badgeKey: 'Clé du badge',
    labelFr: 'Label français',
    labelEn: 'Label anglais',
    isActive: 'Actif',
    sortOrder: 'Ordre',
    actionsCount: 'Actions effectuées',
    success: 'Succès',
  };

  // Map status values to French
  const statusLabels: Record<string, string> = {
    PENDING: 'En attente',
    CURRENT: 'Actuel',
    DELETED: 'Archivé',
    REFUSED: 'Refusé',
    FORMER: 'Ancien',
    GRADUATED: 'Diplômé',
    SUSPENDED: 'Suspendu',
  };

  const label = fieldLabels[key];
  if (!label) return { label: null, displayValue: null };

  let displayValue: string;

  // Format values based on type and content
  if (typeof value === 'boolean') {
    displayValue = value ? 'Oui' : 'Non';
  } else if ((key === 'previousStatus' || key === 'newStatus') && typeof value === 'string') {
    displayValue = statusLabels[value] || value;
  } else if (key === 'updatedFields' && Array.isArray(value)) {
    displayValue = value.join(', ');
  } else if (key === 'changes' && Array.isArray(value)) {
    displayValue = value.join('\n');
  } else if ((key === 'previousPhotoUrl' || key === 'newPhotoUrl') && typeof value === 'string') {
    displayValue = value ? 'Photo présente' : 'Aucune photo';
  } else if (key.endsWith('At') && typeof value === 'string') {
    try {
      displayValue = new Date(value).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      displayValue = String(value);
    }
  } else if (key === 'actionsCount' && typeof value === 'number') {
    displayValue = `${value} action${value > 1 ? 's' : ''}`;
  } else if (key === 'instrumentsCount' && typeof value === 'number') {
    displayValue = value === 0 ? 'Aucun' : `${value} instrument${value > 1 ? 's' : ''}`;
  } else if (key === 'badgesCount' && typeof value === 'number') {
    displayValue = value === 0 ? 'Aucun' : `${value} badge${value > 1 ? 's' : ''}`;
  } else if (key === 'role' && typeof value === 'string') {
    displayValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  } else if (key === 'promotion' && typeof value === 'string') {
    displayValue = value.toUpperCase();
  } else {
    displayValue = String(value);
  }

  return { label, displayValue };
};

export default function ActivityItem({
  title,
  description,
  timestamp,
  icon: Icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
  createdBy,
  metadata,
  isExpanded = false,
  onToggleExpand,
}: ActivityItemProps) {
  // Determine if this is a publication/post (system_announcement with post content)
  const isPost = metadata?.action === 'post_published' || metadata?.postType === 'post';

  // For posts, use the generic title, NOT the post title
  const displayTitle = title;

  // Extract post content if it's a post
  const postContent = isPost ? description.match(/Contenu:\s*(.+)$/s)?.[1]?.trim() : null;

  // Check if there are any expandable details
  const hasMetadataToShow =
    metadata &&
    Object.keys(metadata).filter(
      (key) =>
        ![
          'action',
          'postType',
          'postTitle',
          'publicPostId',
          'userId',
          'id',
          '_id',
          'previousData',
          'newData',
        ].includes(key) &&
        !(key === 'userEmail' && description.includes(String(metadata[key]))) &&
        !(key === 'updatedFields' && description.includes('→')) &&
        // Filter out keys that would result in no displayable content
        formatMetadataField(key, metadata[key]).label !== null &&
        formatMetadataField(key, metadata[key]).displayValue !== null,
    ).length > 0;

  const hasExpandableContent =
    (isPost && postContent && postContent.length > 0) || (!isPost && hasMetadataToShow);

  // Only show expand button if there's actually content to expand
  const shouldShowExpandButton = hasExpandableContent;

  const formattedDescription = formatText(description);

  return (
    <div className="py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 ${iconBgColor} rounded-full flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div className="flex-1 sm:mr-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-gray-900 break-words">{displayTitle}</h3>
                {shouldShowExpandButton && (
                  <button
                    onClick={onToggleExpand}
                    className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
              {/* Show description for both posts and admin actions */}
              <div className="text-sm text-gray-700 leading-relaxed mt-1 break-words">
                <span dangerouslySetInnerHTML={{ __html: formattedDescription }} />
              </div>
            </div>
            <div className="text-left sm:text-right flex-shrink-0 mt-2 sm:mt-0">
              <span className="text-xs text-gray-400 block">{formatRelativeTime(timestamp)}</span>
              {createdBy && (
                <span className="text-xs text-gray-500 block mt-0.5">Par {createdBy}</span>
              )}
            </div>
          </div>

          {/* Expanded content */}
          {isExpanded && hasExpandableContent && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              {isPost ? (
                // For posts, show the post title and content
                <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                  {metadata?.postTitle && (
                    <div className="font-medium text-gray-900">
                      &quot;{metadata.postTitle}&quot;
                    </div>
                  )}
                  {postContent && (
                    <div>
                      <span dangerouslySetInnerHTML={{ __html: formatText(postContent) }} />
                    </div>
                  )}
                </div>
              ) : (
                // For admin actions, show relevant metadata
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">
                    Détails de l&quot;action
                  </h4>
                  <div className="space-y-1 text-xs">
                    {Object.entries(metadata || {}).map(([key, value]) => {
                      // Skip internal/system fields and irrelevant fields
                      if (
                        key.startsWith('_') ||
                        key === 'id' ||
                        key === 'userId' ||
                        key === 'action' ||
                        key === 'postType' ||
                        key === 'postTitle' ||
                        key === 'publicPostId' ||
                        key === 'previousData' ||
                        key === 'newData'
                      )
                        return null;

                      // Skip userEmail if it's already in description
                      if (key === 'userEmail' && description.includes(String(value))) return null;

                      // Skip generic updatedFields if we have specific changes
                      if (key === 'updatedFields' && description.includes('→')) return null;

                      // Handle wasArchivedBy (user ID) - should be resolved on server side
                      if (key === 'wasArchivedBy' && typeof value === 'string') {
                        // Skip if it's just an ID (will be resolved server-side later)
                        if (value.length > 10 && !value.includes(' ')) return null;
                      }

                      // Get French labels and formatted values
                      const { label, displayValue } = formatMetadataField(key, value);

                      if (!label || !displayValue) return null;

                      return (
                        <div
                          key={key}
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0"
                        >
                          <span className="text-gray-600 font-medium">{label}:</span>
                          <span className="text-gray-800 sm:ml-2 sm:max-w-xs break-words sm:text-right">
                            {displayValue}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
