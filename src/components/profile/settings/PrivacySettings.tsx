'use client';

import { useState, useEffect } from 'react';
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
import { Trash2, AlertTriangle } from 'lucide-react';

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
  const [showAvailability, setShowAvailability] = useState(formData?.showAvailability ?? true);
  const [searchable, setSearchable] = useState(formData?.searchable ?? true);
  const [pronouns, setPronouns] = useState<string | null>(formData?.pronouns ?? null);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Confidentialité</h1>
        <p className="text-muted-foreground mt-2">Gérez vos paramètres de confidentialité</p>
      </div>

      {/* Zone de danger */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Zone de danger</CardTitle>
          <CardDescription>Actions irréversibles sur votre compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              La suppression de votre compte est définitive et ne peut pas être annulée. Vous serez
              retiré·e de l&lsquo;association et de tous vos rôles, et l&lsquo;ensemble de votre
              historique associé (groupes, activités, événements) sera effacé, ainsi que vos
              données.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm font-medium">Concrètement, la suppression entraîne :</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Suppression de votre profil et de vos informations</li>
              <li>• Retrait de l&lsquo;association et de tous les rôles/adhésions</li>
              <li>• Effacement de l&lsquo;historique lié (groupes, activités, événements)</li>
              <li>• Action irréversible</li>
            </ul>
          </div>

          <Button variant="destructive" className="w-full justify-start">
            <Trash2 className="mr-2 h-4 w-4" />
            Je quitte définitivement l&apos;asso
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
