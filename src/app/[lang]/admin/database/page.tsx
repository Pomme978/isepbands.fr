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
  Activity,
  Clock,
  Zap,
  Shield,
} from 'lucide-react';
import Loading from '@/components/ui/Loading';

interface IntegrityResult {
  success: boolean;
  message: string;
  details?: string[];
  stats?: {
    created: number;
    deleted: number;
    checked: number;
    duration: number;
  };
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
          stats: data.stats || {
            created: 0,
            deleted: 0,
            checked: 0,
            duration: 0
          }
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
                  <Loading text="Vérification en cours..." size="sm" variant="spinner" theme="white" />
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
              <div className="space-y-6">
                {/* Status Header */}
                <div className={`rounded-lg border-2 p-6 ${result.success 
                  ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' 
                  : 'border-red-200 bg-gradient-to-r from-red-50 to-rose-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`rounded-full p-3 ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                        {result.success ? (
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        ) : (
                          <XCircle className="w-8 h-8 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h3 className={`text-xl font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                          {result.success ? 'Vérification Terminée avec Succès' : 'Erreur lors de la Vérification'}
                        </h3>
                        <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                          {result.message}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={result.success ? 'default' : 'destructive'} 
                      className="text-sm px-3 py-1"
                    >
                      {result.success ? 'Succès' : 'Échec'}
                    </Badge>
                  </div>
                </div>

                {/* Statistics Cards */}
                {result.success && result.stats && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Plus className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-green-800">{result.stats.created}</p>
                            <p className="text-sm text-green-600">Éléments créés</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-red-200 bg-red-50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-red-800">{result.stats.deleted}</p>
                            <p className="text-sm text-red-600">Doublons supprimés</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-blue-800">{result.stats.checked}</p>
                            <p className="text-sm text-blue-600">Éléments vérifiés</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-purple-50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Zap className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-purple-800">{result.stats.duration}ms</p>
                            <p className="text-sm text-purple-600">Durée d'exécution</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Detailed Results */}
                {result.details && result.details.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="w-5 h-5" />
                        <span>Détails des Opérations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.details.map((detail, index) => {
                          const isCreation = detail.toLowerCase().includes('créé') || detail.toLowerCase().includes('ajouté');
                          const isDeletion = detail.toLowerCase().includes('supprimé') || detail.toLowerCase().includes('doublons');
                          const isCheck = detail.toLowerCase().includes('vérif') || detail.toLowerCase().includes('contrôl');
                          
                          return (
                            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                              <div className={`p-2 rounded-full ${
                                isCreation ? 'bg-green-100' : 
                                isDeletion ? 'bg-red-100' : 
                                isCheck ? 'bg-blue-100' : 'bg-gray-100'
                              }`}>
                                {isCreation ? (
                                  <Plus className={`w-4 h-4 ${
                                    isCreation ? 'text-green-600' : 
                                    isDeletion ? 'text-red-600' : 
                                    isCheck ? 'text-blue-600' : 'text-gray-600'
                                  }`} />
                                ) : isDeletion ? (
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                ) : (
                                  <Shield className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                              <span className="text-sm font-medium text-gray-800">{detail}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
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
