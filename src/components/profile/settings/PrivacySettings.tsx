'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/locales/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut, AlertTriangle } from 'lucide-react';

interface PrivacyFormData {
  showAvailability?: boolean;
  searchable?: boolean;
  pronouns?: string | null;
}

interface PrivacySettingsProps {
  formData?: PrivacyFormData;
  onFormDataChange?: (data: PrivacyFormData) => void;
}

export function PrivacySettings({ formData, onFormDataChange }: PrivacySettingsProps) {
  const router = useRouter();
  const t = useI18n();
  const [showAvailability, setShowAvailability] = useState(formData?.showAvailability ?? true);
  const [searchable, setSearchable] = useState(formData?.searchable ?? true);
  const [pronouns, setPronouns] = useState<string | null>(formData?.pronouns ?? null);
  const [isLeavingAssociation, setIsLeavingAssociation] = useState(false);

  useEffect(() => {
    if (formData) {
      setShowAvailability(formData.showAvailability ?? true);
      setSearchable(formData.searchable ?? true);
      setPronouns(formData.pronouns ?? null);
    }
  }, [formData]);

  const handleChange = (field: string, value: boolean | string | null) => {
    console.log('=== PRIVACY SETTINGS CHANGE ===');
    console.log('Field:', field);
    console.log('New value:', value);
    console.log('Current pronouns state:', pronouns);

    if (field === 'showAvailability') {
      setShowAvailability(value as boolean);
    } else if (field === 'searchable') {
      setSearchable(value as boolean);
    } else if (field === 'pronouns') {
      setPronouns(value as string | null);
      console.log('Setting pronouns to:', value);
    }

    const newFormData = {
      ...formData,
      [field]: value,
    };

    console.log('New form data:', newFormData);
    onFormDataChange?.(newFormData);
  };

  const handleLeaveAssociation = async () => {
    const confirmed = window.confirm(t('settings.privacy.leaveAssociation.confirm'));

    if (!confirmed) return;

    setIsLeavingAssociation(true);
    try {
      const response = await fetch('/api/profile/leave-association', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(t('settings.messages.associationLeaveError'));
      }

      const result = await response.json();

      if (result.success) {
        toast.success(t('settings.messages.associationLeaveSuccess'));
        // Redirection vers la page de login après 2 secondes
        setTimeout(() => {
          router.push('/fr/login?message=account-archived');
        }, 2000);
      } else {
        throw new Error(result.message || t('settings.messages.associationLeaveError'));
      }
    } catch (error) {
      console.error('Error leaving association:', error);
      toast.error(
        error instanceof Error ? error.message : t('settings.messages.associationLeaveError'),
      );
    } finally {
      setIsLeavingAssociation(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('settings.privacy.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('settings.privacy.subtitle')}</p>
      </div>

      {/* Quitter l'association */}
      <Card className="border-orange-500">
        <CardHeader>
          <CardTitle className="text-orange-600">
            {t('settings.privacy.leaveAssociation.title')}
          </CardTitle>
          <CardDescription>{t('settings.privacy.leaveAssociation.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{t('settings.privacy.leaveAssociation.warning')}</AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {t('settings.privacy.leaveAssociation.consequences')}
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• {t('settings.privacy.leaveAssociation.consequencesList.archive')}</li>
              <li>• {t('settings.privacy.leaveAssociation.consequencesList.roles')}</li>
              <li>• {t('settings.privacy.leaveAssociation.consequencesList.history')}</li>
              <li>• {t('settings.privacy.leaveAssociation.consequencesList.notification')}</li>
              <li>• {t('settings.privacy.leaveAssociation.consequencesList.restore')}</li>
            </ul>
          </div>

          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLeaveAssociation}
            disabled={isLeavingAssociation}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLeavingAssociation
              ? t('settings.privacy.leaveAssociation.processing')
              : t('settings.privacy.leaveAssociation.button')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
