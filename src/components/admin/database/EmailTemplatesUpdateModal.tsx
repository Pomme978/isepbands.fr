'use client';

import { useState } from 'react';
import { X, RefreshCw, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';

interface TemplateDifference {
  name: string;
  dbVersion: {
    description: string | null;
    subject: string;
    htmlContent: string;
    templateType: string;
    isDefault: boolean;
    variables: unknown;
  };
  sourceVersion: {
    description: string;
    subject: string;
    htmlContent: string;
    templateType: string;
    isDefault: boolean;
    variables: unknown;
  };
}

interface EmailTemplatesUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  differences: TemplateDifference[];
}

export default function EmailTemplatesUpdateModal({
  isOpen,
  onClose,
  onConfirm,
  differences,
}: EmailTemplatesUpdateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error updating templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDetails = (templateName: string) => {
    setShowDetails(showDetails === templateName ? null : templateName);
  };

  const renderFieldDiff = (label: string, dbValue: unknown, sourceValue: unknown) => {
    const isDifferent = JSON.stringify(dbValue) !== JSON.stringify(sourceValue);
    if (!isDifferent) return null;

    // Ne pas afficher les différences pour les champs moins importants
    if (label === 'Type' || label === 'Par défaut') return null;

    return (
      <div className="mb-3 p-3 bg-gray-50 rounded border">
        <div className="font-medium text-gray-800 mb-2">{label} :</div>
        <div className="space-y-2">
          <div>
            <div className="text-xs font-medium text-red-700 mb-1">Version en base</div>
            <div className="text-xs text-gray-700 bg-red-50 p-2 rounded border">
              {typeof dbValue === 'string'
                ? dbValue.length > 200
                  ? `${dbValue.substring(0, 200)}...`
                  : dbValue
                : JSON.stringify(dbValue, null, 2)}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-green-700 mb-1">Version source</div>
            <div className="text-xs text-gray-700 bg-green-50 p-2 rounded border">
              {typeof sourceValue === 'string'
                ? sourceValue.length > 200
                  ? `${sourceValue.substring(0, 200)}...`
                  : sourceValue
                : JSON.stringify(sourceValue, null, 2)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Mise à jour des Templates d&apos;Email
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Warning */}
          <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">
                  Attention : Écrasement des templates
                </h3>
                <p className="text-sm text-orange-700 mb-2">
                  Cette action va écraser {differences.length} template(s) dans la base de données
                  avec les versions des fichiers source. Les modifications personnalisées seront
                  perdues.
                </p>
                <p className="text-xs text-orange-600">
                  Assurez-vous d&apos;avoir sauvegardé vos modifications importantes avant de
                  continuer.
                </p>
              </div>
            </div>
          </div>

          {/* Templates List */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">
              Templates qui seront mis à jour ({differences.length}) :
            </h4>

            {differences.map((diff, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-800">{diff.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDetails(diff.name)}
                    className="text-xs"
                  >
                    {showDetails === diff.name ? 'Masquer' : 'Voir'} les détails
                  </Button>
                </div>

                {showDetails === diff.name && (
                  <div className="mt-4 space-y-3">
                    {renderFieldDiff(
                      'Description',
                      diff.dbVersion.description,
                      diff.sourceVersion.description,
                    )}
                    {renderFieldDiff('Sujet', diff.dbVersion.subject, diff.sourceVersion.subject)}
                    {renderFieldDiff(
                      'Variables',
                      diff.dbVersion.variables,
                      diff.sourceVersion.variables,
                    )}
                    {renderFieldDiff(
                      'Contenu HTML',
                      diff.dbVersion.htmlContent,
                      diff.sourceVersion.htmlContent,
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isLoading ? (
              <>
                <Loading size="sm" />
                <span className="ml-2">Mise à jour...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Confirmer la mise à jour
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
