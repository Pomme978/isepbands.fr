'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';

export function MusicSettings() {
  const instruments = [
    { id: 'guitar', name: 'Guitare', level: 'Intermédiaire' },
    { id: 'bass', name: 'Basse', level: 'Débutant' },
  ];

  const availableInstruments = [
    'Guitare',
    'Basse',
    'Batterie',
    'Clavier/Piano',
    'Chant',
    'Violon',
    'Saxophone',
    'Trompette',
    'Autre',
  ];

  const musicStyles = [
    'Rock',
    'Pop',
    'Jazz',
    'Blues',
    'Métal',
    'Punk',
    'Reggae',
    'Funk',
    'Country',
    'Électro',
    'Classique',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Musique</h1>
        <p className="text-muted-foreground mt-2">
          Configurez vos instruments et préférences musicales
        </p>
      </div>

      {/* Instruments */}
      <Card>
        <CardHeader>
          <CardTitle>Mes instruments</CardTitle>
          <CardDescription>Gérez les instruments que vous jouez et votre niveau</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Liste des instruments actuels */}
          <div className="space-y-3">
            {instruments.map((instrument) => (
              <div
                key={instrument.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{instrument.name}</span>
                  <Badge variant="secondary">{instrument.level}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <select className="rounded-md border border-input bg-background px-2 py-1 text-sm">
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Ajouter un instrument */}
          <div className="flex gap-2">
            <select className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Ajouter un instrument</option>
              {availableInstruments.map((inst) => (
                <option key={inst} value={inst.toLowerCase()}>
                  {inst}
                </option>
              ))}
            </select>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disponibilité */}
      <Card>
        <CardHeader>
          <CardTitle>Disponibilité</CardTitle>
          <CardDescription>Indiquez si vous recherchez un groupe et vos créneaux</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="seeking-band">Recherche un groupe</Label>
              <p className="text-sm text-muted-foreground">
                Votre profil apparaîtra dans les recommandations des groupes
              </p>
            </div>
            <Switch id="seeking-band" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Créneaux disponibles</Label>
            <Input id="availability" placeholder="Ex: Samedi après-midi, Mercredi 18h-20h..." />
          </div>

          <Button>Mettre à jour ma disponibilité</Button>
        </CardContent>
      </Card>

      {/* Préférences musicales */}
      <Card>
        <CardHeader>
          <CardTitle>Préférences musicales</CardTitle>
          <CardDescription>Sélectionnez vos styles musicaux préférés</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {musicStyles.map((style) => (
              <div key={style} className="flex items-center space-x-2">
                <Checkbox id={style} />
                <Label htmlFor={style} className="text-sm font-normal">
                  {style}
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="other-styles">Autres styles</Label>
            <Input id="other-styles" placeholder="Précisez d'autres styles que vous aimez..." />
          </div>

          <Button>Enregistrer mes préférences</Button>
        </CardContent>
      </Card>
    </div>
  );
}
