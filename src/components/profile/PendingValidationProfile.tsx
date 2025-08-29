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
    <div className="min-h-screen mt-10 -mb-25">
      <div className="max-w-4xl mx-auto px-4 flex flex-col justify-center items-center">
        {/* Header */}
        <div className="mb-8 bg-white rounded-xl">
          <div className="flex items-center flex-col !justify-center py-10 space-x-4 mb-4">
            <CustomAvatar
              src={user.photoUrl}
              name={`${user.firstName} ${user.lastName}`}
              size="xl"
            />
            <div>
              <h1 className="text-2xl font-bold text-center text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        <Card className="bg-primary/15 mb-8 px-4">
          <CardContent className="px-4">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <Clock className="h-10 w-10 text-primary" />
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h2 className="text-xl font-bold bg-primary bg-clip-text text-transparent">
                    Inscription en cours de validation
                  </h2>
                </div>

                <p className="text-gray-700 mb-0 text-md leading-relaxed">
                  Bienvenue dans la communauté ISEP Bands ! Votre demande d&apos;inscription a bien
                  été reçue et notre équipe examine actuellement votre profil.
                  <span className="font-medium text-primary">
                    {' '}
                    Une notification par email vous sera envoyée dès validation sous 2-3 jours
                    ouvrés.
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Profile Info */}
        <Card className="w-full">
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
