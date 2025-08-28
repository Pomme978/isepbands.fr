'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Shield, AlertCircle } from 'lucide-react';
import CustomAvatar from '@/components/common/Avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PendingValidationProfileProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    photoUrl?: string;
    createdAt: string;
  };
  lang: string;
}

export function PendingValidationProfile({ user, lang }: PendingValidationProfileProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <CustomAvatar
              src={user.photoUrl || '/avatars/default.jpg'}
              name={`${user.firstName} ${user.lastName}`}
              size="xl"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Pending Status Banner */}
        <Card className="border-amber-200 bg-amber-50 mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-amber-600" />
              <div>
                <CardTitle className="text-xl text-amber-800">
                  Compte en attente de validation
                </CardTitle>
                <p className="text-amber-700 text-sm mt-1">
                  Votre inscription a été soumise le{' '}
                  {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-amber-100 rounded-lg p-4 border-l-4 border-amber-400">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-amber-800 font-medium mb-2">
                      Votre profil est actuellement restreint
                    </p>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Profil visible uniquement par vous et les administrateurs</li>
                      <li>• Impossible de rejoindre des groupes pour le moment</li>
                      <li>• Pas d&apos;accès aux événements en cours</li>
                      <li>• Les paramètres de profil sont en lecture seule</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 font-medium mb-2">Processus de validation</p>
                    <p className="text-sm text-blue-700 mb-2">
                      Notre équipe administrative examine toutes les nouvelles demandes
                      d&apos;inscription. Ce processus prend généralement 2-3 jours ouvrés.
                    </p>
                    <p className="text-sm text-blue-700">
                      Vous recevrez une notification par email dès que votre compte sera activé.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de profil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <div className="p-2 bg-gray-50 rounded border text-gray-600">{user.firstName}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <div className="p-2 bg-gray-50 rounded border text-gray-600">{user.lastName}</div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="p-2 bg-gray-50 rounded border text-gray-600">{user.email}</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Les modifications de profil seront disponibles après la validation de votre compte.
              </p>
              <Button variant="outline" onClick={() => router.push(`/${lang}`)}>
                Retour à l&apos;accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
