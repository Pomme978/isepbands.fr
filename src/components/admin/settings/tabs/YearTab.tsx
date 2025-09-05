'use client';

import { useState } from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';
import Loading from '@/components/ui/Loading';

interface YearTabProps {
  currentYear: string;
  onSave: (year: string) => Promise<void>;
  saving: boolean;
}

export default function YearTab({ currentYear, onSave, saving }: YearTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if current month is August (migration allowed)
  const isAugust = new Date().getMonth() === 7;

  const handleMigrateYear = async () => {
    if (!isAugust) {
      setError("La migration d'année n'est possible qu'en août");
      return;
    }

    const confirmed = confirm(
      `Êtes-vous sûr de vouloir migrer vers l'année ${parseInt(currentYear) + 1} ? ` +
        "Cette action archivera les données de l'année en cours et créera une nouvelle année scolaire.",
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/admin/settings/migrate-year', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la migration');
      }

      const newYear = (parseInt(currentYear) + 1).toString();
      await onSave(newYear);
      setSuccess(`Migration vers l'année ${newYear} réussie`);
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      console.error('Failed to migrate year:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la migration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Gestion de l&apos;année scolaire</h2>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-400 rounded-full mr-3 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <p className="text-sm text-green-800">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Année scolaire en cours
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={currentYear}
              readOnly
              className="w-32 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
            />
            <span className="text-sm text-gray-600">
              {currentYear}-{parseInt(currentYear) + 1}
            </span>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-start space-x-4">
            <AlertTriangle
              className={`w-5 h-5 mt-0.5 ${isAugust ? 'text-green-600' : 'text-amber-600'}`}
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">
                Migration vers l&apos;année suivante
              </h3>
              {isAugust ? (
                <div>
                  <p className="text-sm text-green-700 mb-4">
                    ✅ Migration disponible (nous sommes en août)
                  </p>
                  <button
                    onClick={handleMigrateYear}
                    disabled={isLoading || saving}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {isLoading || saving ? (
                      <Loading text="" size="sm" variant="spinner" theme="white" />
                    ) : (
                      <Calendar className="w-4 h-4 mr-2" />
                    )}
                    Migrer vers {parseInt(currentYear) + 1}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-amber-700">
                  ⚠️ La migration n&apos;est possible qu&apos;en août. Cette action archivera
                  l&apos;année en cours et créera une nouvelle année scolaire.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
