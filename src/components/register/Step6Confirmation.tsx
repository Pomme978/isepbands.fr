import { RegistrationData } from '@/types/registration';
import { useI18n } from '@/locales/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatPreferredGenres } from '@/utils/genreUtils';
import { calculateAge } from '@/utils/schoolUtils';
import Loading from '@/components/ui/Loading';
import { usePathname } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Music,
  Heart,
  MessageSquare,
  Award,
  CheckCircle,
} from 'lucide-react';

interface Step6ConfirmationProps {
  data: RegistrationData;
  onBack: () => void;
  onSubmit: () => void;
  availableInstruments: { id: number; name: string; nameFr: string; nameEn: string }[];
  isSubmitting?: boolean;
}
export default function Step6Confirmation({
  data,
  onBack,
  onSubmit,
  availableInstruments,
  isSubmitting = false,
}: Step6ConfirmationProps) {
  const t = useI18n();
  const pathname = usePathname();
  const locale = pathname.startsWith('/fr') ? 'fr' : 'en';

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header avec titre et icône */}
      <div className="text-center space-y-3 md:mt-0 -mt-8 mb-5 md:mb-0">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Récapitulatif de votre inscription</h2>
        <p className="text-gray-600">Vérifiez vos informations avant de finaliser votre demande</p>
      </div>

      <div className="space-y-6">
        {/* Photo de profil */}
        <div className="flex justify-center items-center mb-0">
          <div className="relative md:mb-0 mb-10">
            {data.profilePhoto ? (
              <Avatar className="md:w-24 md:h-24 w-32 h-32 border-4 border-primary/20 shadow-lg ">
                <AvatarImage
                  src={URL.createObjectURL(data.profilePhoto)}
                  className="object-cover"
                />
                <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                  {data.firstName.charAt(0)}
                  {data.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="w-32 h-32 border-4 border-gray-200 shadow-lg">
                <AvatarFallback className="text-xl bg-gray-100 text-gray-600 font-bold">
                  {data.firstName.charAt(0)}
                  {data.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            {/* Indicateur de photo */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
              <User className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informations sur 2 colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium">
                    {data.firstName} {data.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-sm break-all">{data.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{data.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Date de naissance</p>
                  <p className="font-medium">
                    {new Date(data.birthDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Âge</p>
                  <p className="font-medium">{calculateAge(data.birthDate)} ans</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Cycle d&apos;études</p>
                  <Badge variant="outline" className="font-medium text-xs">
                    {data.cycle}
                  </Badge>
                </div>
              </div>

              {data.pronouns && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">Pronoms</p>
                    <p className="font-medium">{data.pronouns}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instruments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5 text-primary" />
              Mes instruments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.instruments.map((inst, i) => {
                const instrument = availableInstruments.find((x) => x.id === inst.instrumentId);
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Music className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="font-medium">
                          {locale === 'en'
                            ? instrument?.nameEn || instrument?.name || 'Instrument'
                            : instrument?.nameFr || instrument?.name || 'Instrument'}
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
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Genres préférés */}
        {data.preferredGenres && data.preferredGenres.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Genres musicaux préférés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formatPreferredGenres(data.preferredGenres, 'fr')
                  .split(', ')
                  .map((genre, i) => (
                    <Badge key={i} className="text-sm bg-primary text-white px-3 py-1.5">
                      {genre}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Motivation et Expérience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Motivation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{data.motivation}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Expérience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{data.experience}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex md:flex-row flex-col gap-4 justify-center md:justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="px-6 md:py-2 py-6 md:w-auto w-full"
          disabled={isSubmitting}
        >
          Retour
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          className="px-6 md:py-2 py-6 md:w-auto w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loading size="sm" theme="white" text="" />
              <span className="ml-2">Inscription...</span>
            </>
          ) : (
            <>
              {t('auth.register.confirm')}
              <CheckCircle className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
