'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Database,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Settings,
  Trash2,
  Plus,
} from 'lucide-react';
import Loading from '@/components/ui/Loading';

interface IntegrityResult {
  success: boolean;
  message: string;
  details?: string[];
}

export default function DatabaseAdminPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<IntegrityResult | null>(null);

  const runDBIntegrity = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/database/integrity', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: "Vérification d'intégrité terminée avec succès",
          details: data.details || [],
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Erreur lors de la vérification d'intégrité",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Erreur de connexion lors de la vérification d'intégrité",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 break-words">
              Administration Base de Données
            </h1>
            <p className="text-base md:text-sm text-gray-600 mt-1">
              Gérez l&apos;intégrité et la maintenance de la base de données
            </p>
          </div>
          <Database className="w-8 h-8 text-primary flex-shrink-0" />
        </div>

        {/* Database Integrity Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Intégrité de la Base de Données</span>
            </CardTitle>
            <CardDescription className="text-base md:text-sm">
              Vérifiez et corrigez l&apos;intégrité de la base de données en créant les éléments
              manquants et en supprimant les doublons.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Action Button */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={runDBIntegrity}
                disabled={isRunning}
                size="lg"
                className="flex items-center space-x-2"
              >
                {isRunning ? (
                  <Loading text="Vérification en cours..." size="sm" />
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Lancer la Vérification d&apos;Intégrité</span>
                  </>
                )}
              </Button>

              {isRunning && (
                <Badge variant="outline" className="animate-pulse">
                  En cours d&apos;exécution
                </Badge>
              )}
            </div>

            {/* Result Display */}
            {result && (
              <Alert
                className={
                  result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }
              >
                <div className="flex items-start space-x-2">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <AlertDescription
                      className={`text-base md:text-sm ${result.success ? 'text-green-800' : 'text-red-800'}`}
                    >
                      <strong>{result.message}</strong>
                    </AlertDescription>
                    {result.details && result.details.length > 0 && (
                      <div className="mt-2">
                        <p className="text-base md:text-sm font-medium mb-1">Détails :</p>
                        <ul className="text-base md:text-sm space-y-1">
                          {result.details.map((detail, index) => (
                            <li key={index} className="flex items-start space-x-1">
                              <span className="text-gray-500">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* What it does */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Plus className="w-5 h-5 text-green-600" />
                <span>Création d&apos;Éléments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-base md:text-sm space-y-2 text-gray-600">
                <li>• Instruments manquants</li>
                <li>• Permissions par défaut</li>
                <li>• Rôles de base</li>
                <li>• Genres musicaux</li>
              </ul>
            </CardContent>
          </Card>

          {/* Clean up */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Trash2 className="w-5 h-5 text-red-600" />
                <span>Nettoyage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-base md:text-sm space-y-2 text-gray-600">
                <li>• Doublons d&apos;instruments</li>
                <li>• Doublons de permissions</li>
                <li>• Doublons de rôles</li>
                <li>• Doublons de genres</li>
              </ul>
            </CardContent>
          </Card>

          {/* Warning */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span>Attention</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base md:text-sm text-gray-600">
                Cette opération peut prendre quelques secondes. Elle est sécurisée mais il est
                recommandé de faire une sauvegarde avant les premières utilisations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
