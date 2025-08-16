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

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="show-instruments" className="text-base font-medium">
                Afficher mes instruments
              </Label>
              <p className="text-sm text-muted-foreground">
                Les autres membres peuvent voir vos instruments
              </p>
            </div>
            <Switch id="show-instruments" defaultChecked />
          </div>

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

      {/* Contact et recrutement */}
      <Card>
        <CardHeader>
          <CardTitle>Contact et recrutement</CardTitle>
          <CardDescription>Gérez comment les autres peuvent vous contacter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="allow-contact" className="text-base font-medium">
                Autoriser les messages
              </Label>
              <p className="text-sm text-muted-foreground">
                Les autres membres peuvent vous envoyer des messages
              </p>
            </div>
            <Switch id="allow-contact" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="band-invitations" className="text-base font-medium">
                Invitations de groupes
              </Label>
              <p className="text-sm text-muted-foreground">
                Les groupes peuvent vous inviter à les rejoindre
              </p>
            </div>
            <Switch id="band-invitations" defaultChecked />
          </div>
        </CardContent>
      </Card>

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
              La suppression de votre compte est définitive et ne peut pas être annulée. Toutes vos
              données seront perdues.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Que se passe-t-il quand vous supprimez votre compte :
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Votre profil et vos informations sont supprimés</li>
              <li>• Vous êtes retiré de tous vos groupes</li>
              <li>• Votre historique d&#39;événements est effacé</li>
              <li>• Cette action est irréversible</li>
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
