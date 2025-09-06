'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir quitter l'association ISEP Bands ?\n\n" +
        "Votre compte sera archivé et vous perdrez l'accès à la plateforme. " +
        'Les administrateurs seront notifiés de votre départ.\n\n' +
        'Cette action peut être annulée par un administrateur si nécessaire.',
    );

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
        throw new Error('Erreur lors du traitement de votre demande');
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Vous avez quitté l'association. Les administrateurs ont été notifiés.");
        // Redirection vers la page de login après 2 secondes
        setTimeout(() => {
          router.push('/fr/login?message=account-archived');
        }, 2000);
      } else {
        throw new Error(result.message || 'Erreur lors du traitement');
      }
    } catch (error) {
      console.error('Error leaving association:', error);
      toast.error(
        error instanceof Error ? error.message : 'Erreur lors du traitement de votre demande',
      );
    } finally {
      setIsLeavingAssociation(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Confidentialité</h1>
        <p className="text-muted-foreground mt-2">Gérez vos paramètres de confidentialité</p>
      </div>

      {/* Quitter l'association */}
      <Card className="border-orange-500">
        <CardHeader>
          <CardTitle className="text-orange-600">Quitter l&apos;association</CardTitle>
          <CardDescription>Se retirer de l&apos;association ISEP Bands</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              En quittant l&lsquo;association, votre compte sera archivé mais vos données seront
              conservées. Les administrateurs seront notifiés de votre départ. Cette action peut
              être annulée par un administrateur si nécessaire.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm font-medium">Quitter l&apos;association entraîne :</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Archivage de votre compte (pas de suppression définitive)</li>
              <li>• Retrait de tous vos rôles et adhésions actives</li>
              <li>• Conservation de votre historique pour les archives</li>
              <li>• Notification automatique aux administrateurs</li>
              <li>• Possibilité de réactivation par un administrateur</li>
            </ul>
          </div>

          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLeaveAssociation}
            disabled={isLeavingAssociation}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLeavingAssociation ? 'Traitement en cours...' : "Quitter l'association ISEP Bands"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
