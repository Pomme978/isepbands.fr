'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Clock, AlertCircle } from 'lucide-react';
import { useI18n } from '@/locales/client';

export function PendingValidationBanner() {
  const t = useI18n();

  return (
    <Card className="border-amber-200 bg-amber-50 mb-8">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-xl font-semibold text-amber-800">
                Demande d&apos;inscription en cours de validation
              </h2>
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-amber-700 mb-4">
              Votre demande d&apos;inscription à ISEP Bands a bien été reçue et est actuellement en
              cours d&apos;examen par notre équipe administrative. Vous recevrez une notification
              par email dès que votre compte aura été validé.
            </p>
            <div className="bg-amber-100 rounded-lg p-4 border-l-4 border-amber-400">
              <h3 className="font-medium text-amber-800 mb-2">En attendant la validation :</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Votre profil est visible uniquement par vous</li>
                <li>• Vous ne pouvez pas encore rejoindre de groupes</li>
                <li>• L&apos;accès aux événements sera disponible après validation</li>
                <li>• Le processus de validation peut prendre 2-3 jours ouvrés</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
