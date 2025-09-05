'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Clock, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import { useI18n } from '@/locales/client';

export function PendingValidationBanner() {
  const t = useI18n();

  return (
    <Card className="bg-primary/15 mb-8 px-4">
      <CardContent className="px-4">
        <div className="flex md:flew-row flex-col items-center justify-center md:items-start">
          <div className="md:flex-shrink-0">
            <Clock className="h-10 w-10 text-primary md:mb-0 mb-2" />
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h2 className="text-2xl font-bold md:text-left text-center bg-primary bg-clip-text text-transparent">
                {t('page.home.loggedIn.pending.title')}
              </h2>
            </div>

            <p className="text-gray-700 mb-0 text-md leading-relaxed md:text-left text-center">
              {t('page.home.loggedIn.pending.description')}
            </p>
            <p className="font-medium text-primary md:text-left text-center md:mt-0 mt-2">
              {t('page.home.loggedIn.pending.notification')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
