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

// Format metadata fields with French labels and proper formatting
const formatMetadataField = (key: string, value: unknown) => {
  // Map of field keys to French labels
  const fieldLabels: Record<string, string> = {
    userEmail: 'Email',
    previousStatus: 'Statut précédent', 
    newStatus: 'Nouveau statut',
    rejectionReason: 'Raison du refus',
    updatedFields: 'Champs modifiés',
    sendEmail: 'Email envoyé',
    resetAt: 'Réinitialisé le',
    approvedAt: 'Approuvé le',
    rejectedAt: 'Refusé le',
    archivedAt: 'Archivé le',
    deletedAt: 'Supprimé le',
    restoredAt: 'Restauré le',
    wasArchivedBy: 'Archivé par',
    previousPhotoUrl: 'Ancienne photo',
    newPhotoUrl: 'Nouvelle photo',
    changes: 'Modifications détaillées',
    badgeKey: 'Clé du badge',
    labelFr: 'Label français',
    labelEn: 'Label anglais',
    platform: 'Plateforme',
    url: 'URL',
    isActive: 'Actif',
    sortOrder: 'Ordre',
    actionsCount: 'Actions effectuées',
    success: 'Succès',
    userAgent: 'Navigateur',
    ip: 'Adresse IP',
    loginAt: 'Connecté le',
    firstLoginAt: 'Première connexion le',
  };

  // Map status values to French
  const statusLabels: Record<string, string> = {
    'PENDING': 'En attente',
    'CURRENT': 'Actuel',
    'DELETED': 'Archivé',
    'REFUSED': 'Refusé',
    'FORMER': 'Ancien',
    'GRADUATED': 'Diplômé',
    'SUSPENDED': 'Suspendu',
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
        minute: '2-digit'
      });
    } catch {
      displayValue = String(value);
    }
  } else if (key === 'actionsCount' && typeof value === 'number') {
    displayValue = `${value} action${value > 1 ? 's' : ''}`;
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
  
  // For posts, only show title initially, description on expand
  // For admin actions, show description initially, metadata on expand
  const shouldShowDescription = !isPost;
  const shouldShowExpandButton = isPost || (metadata && Object.keys(metadata).length > 0);
  
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
          <div className="flex justify-between">
            <div className="flex-1 mr-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                {shouldShowExpandButton && (
                  <button
                    onClick={onToggleExpand}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
              {/* Show description immediately for admin actions, only on expand for posts */}
              {shouldShowDescription && (
                <div className="text-sm text-gray-700 leading-relaxed mt-1">
                  <span dangerouslySetInnerHTML={{ __html: formattedDescription }} />
                </div>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs text-gray-400 block">{timestamp}</span>
              {createdBy && (
                <span className="text-xs text-gray-500 block mt-0.5">Par {createdBy}</span>
              )}
            </div>
          </div>
          
          {/* Expanded content */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              {isPost ? (
                // For posts, show the content/description
                <div className="text-sm text-gray-700 leading-relaxed">
                  <span dangerouslySetInnerHTML={{ __html: formattedDescription }} />
                </div>
              ) : (
                // For admin actions, show relevant metadata
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Détails de l'action</h4>
                  <div className="space-y-1 text-xs">
                    {Object.entries(metadata || {}).map(([key, value]) => {
                      // Skip internal/system fields and irrelevant fields
                      if (key.startsWith('_') || key === 'id' || key === 'userId' || key === 'action' || key === 'postType' || key === 'postTitle' || key === 'publicPostId' || key === 'previousData' || key === 'newData') return null;
                      
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
                        <div key={key} className="flex justify-between items-start">
                          <span className="text-gray-600 font-medium">
                            {label}:
                          </span>
                          <span className="text-gray-800 ml-2 max-w-xs break-words text-right">
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
