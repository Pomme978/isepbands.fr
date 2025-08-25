'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, AlertTriangle } from 'lucide-react';

interface PrivacySettingsProps {
  formData?: any;
  onFormDataChange?: (data: any) => void;
}

export function PrivacySettings({ formData, onFormDataChange }: PrivacySettingsProps) {
  const [showAvailability, setShowAvailability] = useState(formData?.showAvailability ?? true);
  const [searchable, setSearchable] = useState(formData?.searchable ?? true);

  useEffect(() => {
    if (formData) {
      setShowAvailability(formData.showAvailability ?? true);
      setSearchable(formData.searchable ?? true);
    }
  }, [formData]);

  const handleChange = (field: string, value: boolean) => {
    if (field === 'showAvailability') {
      setShowAvailability(value);
    } else if (field === 'searchable') {
      setSearchable(value);
    }
    
    onFormDataChange?.({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Confidentialité</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos paramètres de confidentialité
        </p>
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
              retiré·e de l'association et de tous vos rôles, et l'ensemble de votre historique
              associé (groupes, activités, événements) sera effacé, ainsi que vos données.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm font-medium">Concrètement, la suppression entraîne :</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Suppression de votre profil et de vos informations</li>
              <li>• Retrait de l'association et de tous les rôles/adhésions</li>
              <li>• Effacement de l'historique lié (groupes, activités, événements)</li>
              <li>• Action irréversible</li>
            </ul>
          </div>

          <Button variant="destructive" className="w-full justify-start">
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer définitivement mon compte
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}