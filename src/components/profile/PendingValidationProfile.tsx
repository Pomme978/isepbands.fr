'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Shield,
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Music,
  Heart,
  MessageSquare,
  Award,
} from 'lucide-react';
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
    phone?: string;
    birthDate?: string;
    promotion?: string;
    biography?: string;
    preferredGenres?: string[] | string | null;
    instruments?: Array<{
      instrument: {
        id: string;
        name?: string;
        nameFr?: string;
        nameEn?: string;
      };
      skillLevel: string;
      yearsPlaying?: number;
      isPrimary: boolean;
    }>;
    registrationRequest?: {
      motivation?: string;
    };
  };
  lang: string;
}

export function PendingValidationProfile({ user, lang }: PendingValidationProfileProps) {
  const router = useRouter();

  // Utilitaires
  const calculateAge = (birthDate: string | null | undefined): number | null => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const skillLevelLabels: Record<string, string> = {
    BEGINNER: 'Débutant',
    INTERMEDIATE: 'Intermédiaire',
    ADVANCED: 'Avancé',
    EXPERT: 'Expert',
  };

  const skillLevelColors: Record<string, string> = {
    BEGINNER: 'bg-green-100 text-green-800',
    INTERMEDIATE: 'bg-blue-100 text-blue-800',
    ADVANCED: 'bg-orange-100 text-orange-800',
    EXPERT: 'bg-red-100 text-red-800',
  };

  const formatPreferredGenres = (genres: string[] | string | null): string[] => {
    if (!genres) return [];
    if (Array.isArray(genres)) return genres;
    if (typeof genres === 'string') {
      try {
        const parsed = JSON.parse(genres);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return genres
          .split(',')
          .map((g) => g.trim())
          .filter(Boolean);
      }
    }
    return [];
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl space-y-6 mx-2 md:mx-auto">
        {/* Header avec titre et icône */}
        <div className="text-center space-y-3 mb-5">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Inscription en cours de validation</h2>
          <p className="text-gray-600">Récapitulatif de votre demande d&apos;inscription</p>
        </div>

        {/* Photo de profil */}
        <div className="flex justify-center items-center mb-0">
          <div className="relative mb-10">
            <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-lg">
              {user.photoUrl ? <AvatarImage src={user.photoUrl} className="object-cover" /> : null}
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
        </div>

        {/* Message de statut */}
        <Card className="bg-primary/15">
          <CardContent className="py-4">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Clock className="h-10 w-10 text-primary" />
              </div>
              <p className="text-gray-700 mb-2 leading-relaxed">
                Bienvenue dans la communauté ISEP Bands ! Votre demande d&apos;inscription a bien
                été reçue et notre équipe examine actuellement votre profil.
              </p>
              <p className="font-medium text-primary">
                Une notification par email vous sera envoyée dès validation sous 2-3 jours ouvrés.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-sm break-all">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{user.phone || 'Non renseigné'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Date de naissance</p>
                  <p className="font-medium">
                    {user.birthDate ? (
                      <>
                        {new Date(user.birthDate).toLocaleDateString('fr-FR')}
                        {calculateAge(user.birthDate) && ` (${calculateAge(user.birthDate)} ans)`}
                      </>
                    ) : (
                      'Non renseigné'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Promotion</p>
                  {user.promotion ? (
                    <Badge variant="outline" className="font-medium text-xs">
                      {user.promotion}
                    </Badge>
                  ) : (
                    <p className="font-medium text-gray-400">Non renseigné</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instruments */}
        {user.instruments && user.instruments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-primary" />
                Mes instruments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.instruments.map((inst, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Music className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="font-medium">
                          {inst.instrument.nameFr || inst.instrument.name || 'Instrument'}
                        </p>
                        {inst.yearsPlaying && (
                          <p className="text-sm text-gray-500">
                            {inst.yearsPlaying} années d&apos;expérience
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-xs ${skillLevelColors[inst.skillLevel] || 'bg-gray-100 text-gray-800'}`}
                      >
                        {skillLevelLabels[inst.skillLevel] || inst.skillLevel}
                      </Badge>
                      {inst.isPrimary && (
                        <Badge variant="outline" className="text-xs border-primary text-primary">
                          Principal
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Genres préférés */}
        {formatPreferredGenres(user.preferredGenres).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Genres musicaux préférés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formatPreferredGenres(user.preferredGenres).map((genre, i) => (
                  <Badge key={i} className="text-sm bg-primary text-white px-3 py-1.5">
                    {genre}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Motivation et Expérience */}
        {(user.registrationRequest?.motivation || user.registrationRequest?.experience) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.registrationRequest?.motivation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Motivation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {user.registrationRequest.motivation}
                  </p>
                </CardContent>
              </Card>
            )}

            {user.registrationRequest?.experience && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Expérience musicale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {user.registrationRequest.experience}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Action */}
        <div className="text-center pt-4">
          <Button variant="outline" onClick={() => router.push(`/${lang}`)}>
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
