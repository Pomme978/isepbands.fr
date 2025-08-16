'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function PreferencesSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Préférences</h1>
        <p className="text-muted-foreground mt-2">
          Configurez l&#39;affichage et les paramètres de l&#39;interface
        </p>
      </div>

      {/* Langue */}
      <Card>
        <CardHeader>
          <CardTitle>Langue et région</CardTitle>
          <CardDescription>Choisissez votre langue préférée pour l&#39;interface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">Langue de l&#39;interface</Label>
            <RadioGroup defaultValue="fr" className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fr" id="lang-fr" />
                <Label htmlFor="lang-fr">Français</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="lang-en" />
                <Label htmlFor="lang-en">English</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone" className="text-base font-medium">
              Fuseau horaire
            </Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Format d'affichage */}
      <Card>
        <CardHeader>
          <CardTitle>Format d&#39;affichage</CardTitle>
          <CardDescription>Personnalisez l&#39;affichage des dates et informations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">Format des dates</Label>
            <RadioGroup defaultValue="dd/mm/yyyy" className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dd/mm/yyyy" id="date-eu" />
                <Label htmlFor="date-eu">DD/MM/YYYY (15/03/2024)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mm/dd/yyyy" id="date-us" />
                <Label htmlFor="date-us">MM/DD/YYYY (03/15/2024)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yyyy-mm-dd" id="date-iso" />
                <Label htmlFor="date-iso">YYYY-MM-DD (2024-03-15)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Format des heures</Label>
            <RadioGroup defaultValue="24h" className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24h" id="time-24" />
                <Label htmlFor="time-24">24 heures (18:30)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12h" id="time-12" />
                <Label htmlFor="time-12">12 heures (6:30 PM)</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Interface</CardTitle>
          <CardDescription>Personnalisez l&#39;affichage des listes et contenus</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="compact-lists" className="text-base font-medium">
                Listes compactes
              </Label>
              <p className="text-sm text-muted-foreground">
                Affichage plus dense des groupes et événements
              </p>
            </div>
            <Switch id="compact-lists" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="show-avatars" className="text-base font-medium">
                Afficher les avatars
              </Label>
              <p className="text-sm text-muted-foreground">
                Photos de profil dans les listes de membres
              </p>
            </div>
            <Switch id="show-avatars" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="items-per-page" className="text-base font-medium">
              Éléments par page
            </Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="10">10 éléments</option>
              <option value="20">20 éléments</option>
              <option value="50">50 éléments</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications système */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications système</CardTitle>
          <CardDescription>Paramètres des notifications dans l&#39;interface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="sound-notifications" className="text-base font-medium">
                Sons de notification
              </Label>
              <p className="text-sm text-muted-foreground">Sons lors de nouvelles notifications</p>
            </div>
            <Switch id="sound-notifications" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="desktop-notifications" className="text-base font-medium">
                Notifications du navigateur
              </Label>
              <p className="text-sm text-muted-foreground">
                Notifications push dans votre navigateur
              </p>
            </div>
            <Switch id="desktop-notifications" />
          </div>
        </CardContent>
      </Card>

      {/* Accessibilité */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibilité</CardTitle>
          <CardDescription>Options pour améliorer l&#39;accessibilité</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="high-contrast" className="text-base font-medium">
                Contraste élevé
              </Label>
              <p className="text-sm text-muted-foreground">Améliore la lisibilité du texte</p>
            </div>
            <Switch id="high-contrast" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="reduce-motion" className="text-base font-medium">
                Réduire les animations
              </Label>
              <p className="text-sm text-muted-foreground">
                Limite les effets visuels et transitions
              </p>
            </div>
            <Switch id="reduce-motion" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-size" className="text-base font-medium">
              Taille de police
            </Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="small">Petite</option>
              <option value="normal">Normale</option>
              <option value="large">Grande</option>
              <option value="extra-large">Très grande</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Enregistrer les préférences</Button>
      </div>
    </div>
  );
}
