'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';

export function ProfileSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profil</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos informations personnelles et de contact
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Photo de profil */}
        <Card>
          <CardHeader>
            <CardTitle>Photo de profil</CardTitle>
            <CardDescription>Changez votre photo de profil</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" alt="Photo de profil" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button variant="outline" className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Changer la photo
            </Button>
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Modifiez vos informations de base</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" placeholder="Votre prénom" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" placeholder="Votre nom" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Décrivez-vous en quelques mots..."
                className="min-h-[100px]"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="promo">Promotion</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Sélectionnez votre promo</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="member">Membre actuel</option>
                  <option value="alumni">Ancien membre</option>
                </select>
              </div>
            </div>
            <Button>Enregistrer les modifications</Button>
          </CardContent>
        </Card>
      </div>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Contact et sécurité</CardTitle>
          <CardDescription>Gérez votre email et mot de passe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input id="email" type="email" placeholder="votre@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input id="newPassword" type="password" placeholder="••••••••" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Modifier l&#39;email</Button>
            <Button variant="outline">Changer le mot de passe</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
