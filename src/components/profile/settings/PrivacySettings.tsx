'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Trash2, AlertTriangle, Shield } from 'lucide-react';

export function PrivacySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Confidentialité</h1>
        <p className="text-muted-foreground mt-2">
          Contrôlez la visibilité de votre profil et gérez vos données
        </p>
      </div>

      {/* Visibilité du profil */}
      <Card>
        <CardHeader>
          <CardTitle>Visibilité du profil</CardTitle>
          <CardDescription>Contrôlez qui peut voir vos informations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="profile-public" className="text-base font-medium">
                Profil public
              </Label>
              <p className="text-sm text-muted-foreground">
                Votre profil sera visible par tous les membres
              </p>
            </div>
            <Switch id="profile-public" defaultChecked />
          </div>

          {/* Removed "Afficher mes instruments" */}

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="show-availability" className="text-base font-medium">
                Afficher ma disponibilité
              </Label>
              <p className="text-sm text-muted-foreground">Visible si vous recherchez un groupe</p>
            </div>
            <Switch id="show-availability" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="searchable" className="text-base font-medium">
                Apparaître dans les recherches
              </Label>
              <p className="text-sm text-muted-foreground">
                Votre profil apparaît dans les résultats de recherche
              </p>
            </div>
            <Switch id="searchable" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Removed "Contact et recrutement" section entirely */}

      {/* Gestion des données */}
      <Card>
        <CardHeader>
          <CardTitle>Mes données</CardTitle>
          <CardDescription>Exportez ou supprimez vos données personnelles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Export de données</p>
                <p className="text-sm text-muted-foreground">
                  Téléchargez une copie de toutes vos données personnelles au format JSON
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Exporter mes données
            </Button>
          </div>
        </CardContent>
      </Card>

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
              retiré·e de l’association et de tous vos rôles, et l’ensemble de votre historique
              associé (groupes, activités, événements) sera effacé, ainsi que vos données.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm font-medium">Concrètement, la suppression entraîne :</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Suppression de votre profil et de vos informations</li>
              <li>• Retrait de l’association et de tous les rôles/adhésions</li>
              <li>• Effacement de l’historique lié (groupes, activités, événements)</li>
              <li>• Action irréversible</li>
            </ul>
          </div>

          <Button variant="destructive" className="w-full justify-start">
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer définitivement mon compte
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Enregistrer les paramètres</Button>
      </div>
    </div>
  );
}
