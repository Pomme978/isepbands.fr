'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Shield, AlertCircle, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    <div className="py-4">
      <div className="max-w-4xl mx-auto px-4 flex flex-col justify-center items-center">
        {/* Header */}
        <div className="mb-8 bg-white rounded-xl">
          <div className="flex items-center flex-col justify-center p-10 mb-4">
            {/* Photo de profil avec le même style que Step6Confirmation */}
            <div className="relative mb-6">
              <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-lg">
                {user.photoUrl ? (
                  <AvatarImage
                    src={user.photoUrl}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {/* Indicateur de photo */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
                <User className="w-3 h-3 text-white" />
              </div>
            </div>
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
            <div className="flex md:flew-row flex-col items-center justify-center md:items-start">
              <div className="md:flex-shrink-0">
                <Clock className="h-10 w-10 text-primary md:mb-0 mb-2" />
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h2 className="text-2xl font-bold md:text-left text-center bg-primary bg-clip-text text-transparent">
                    Inscription en cours de validation
                  </h2>
                </div>

                <p className="text-gray-700 mb-0 text-md leading-relaxed md:text-left text-center">
                  Bienvenue dans la communauté ISEP Bands ! Votre demande d&apos;inscription a bien été
                  reçue et notre équipe examine actuellement votre profil.
                </p>
                <p className="font-medium text-primary md:text-left text-center md:mt-0 mt-2">
                  {' '}
                  Une notification par email vous sera envoyée dès validation sous 2-3 jours ouvrés.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Profile Info */}
        <Card className="w-full h-auto relative ">
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
