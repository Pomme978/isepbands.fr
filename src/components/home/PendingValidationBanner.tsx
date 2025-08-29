'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Clock, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import { useI18n } from '@/locales/client';

export function PendingValidationBanner() {
  const t = useI18n();

  return (
    <Card className="bg-primary/15 mb-8 px-4">
      <CardContent className="px-4">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <Clock className="h-10 w-10 text-primary" />
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h2 className="text-2xl font-bold bg-primary bg-clip-text text-transparent">
                Inscription en cours de validation
              </h2>
            </div>

            <p className="text-gray-700 mb-0 text-md leading-relaxed">
              Bienvenue dans la communauté ISEP Bands ! Votre demande d&apos;inscription a bien été
              reçue et notre équipe examine actuellement votre profil.
              <span className="font-medium text-primary">
                {' '}
                Une notification par email vous sera envoyée dès validation sous 2-3 jours ouvrés.
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
