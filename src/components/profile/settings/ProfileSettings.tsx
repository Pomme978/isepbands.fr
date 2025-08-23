'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Info } from 'lucide-react';

// Simple validators aligned with your register page
const validatePassword = (value: string) => {
  if (!value) return 'Ce champ est requis';
  if (
    !/^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/.test(
      value,
    )
  ) {
    return 'Le mot de passe doit contenir au moins 8 caractères, une minuscule, une majuscule, un chiffre et un caractère spécial.';
  }
  return '';
};

const validateConfirmPassword = (value: string, password: string) => {
  if (!value) return 'Ce champ est requis';
  if (value !== password) return 'Les mots de passe ne correspondent pas.';
  return '';
};

export function ProfileSettings() {
  // TODO: hydrate from your user/session store
  const readOnlyEmail = 'prenom.nom@isep.fr';
  const currentStatus = 'Membre actuel';
  const currentPromotion = '2027';

  // Editable profile fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');

  // Password flow
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const showPasswordSection = newPassword.length > 0;

  const passwordChecklist = useMemo(
    () => [
      { label: 'Au moins 8 caractères', ok: newPassword.length >= 8 },
      { label: 'Une lettre minuscule', ok: /[a-z]/.test(newPassword) },
      { label: 'Une lettre majuscule', ok: /[A-Z]/.test(newPassword) },
      { label: 'Un chiffre', ok: /\d/.test(newPassword) },
      {
        label: 'Un caractère spécial',
        ok: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword),
      },
    ],
    [newPassword],
  );

  const handleSaveProfile = () => {
    // TODO: call your API (firstName, lastName, bio)
    // toast.success('Profil mis à jour');
  };

  const handleUpdatePassword = () => {
    const pErr = validatePassword(newPassword);
    const cErr = validateConfirmPassword(confirmPassword, newPassword);
    setPasswordError(pErr);
    setConfirmPasswordError(cErr);
    if (!pErr && !cErr) {
      // TODO: call your API to update password
      // toast.success('Mot de passe mis à jour');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos informations personnelles et vos préférences.
          </p>
        </div>
      </div>

      {/* Top grid: Avatar + Basic info */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Photo de profil */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Photo de profil</CardTitle>
            <CardDescription>Représentez-vous auprès des autres membres.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
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

        {/* Infos personnelles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Mettez à jour votre nom et votre bio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  placeholder="Votre prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  placeholder="Votre nom"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Décrivez-vous en quelques mots..."
                className="min-h-[100px]"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveProfile}>Enregistrer</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Org / school data (read-only and clean) */}
      <Card>
        <CardHeader>
          <CardTitle>Données établissement</CardTitle>
          <CardDescription>Informations synchronisées automatiquement.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {/* Email (non modifiable, sans wording "bloqué") */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              type="email"
              value={readOnlyEmail}
              readOnly
              disabled
              aria-disabled="true"
            />
            <p className="text-xs text-muted-foreground">
              L’adresse est gérée par l’administration ISEP.
            </p>
          </div>

          {/* Statut (non modifiable) */}
          <div className="space-y-1.5">
            <Label>Statut</Label>
            <div className="rounded-md border border-input bg-muted/30 px-3 py-2 text-sm">
              {currentStatus}
            </div>
            <p className="text-xs text-muted-foreground">Champ administré automatiquement.</p>
          </div>

          {/* Promotion (texte auto) */}
          <div className="space-y-1.5">
            <Label>Promotion</Label>
            <div className="flex items-center justify-between rounded-md border border-input bg-muted/30 px-3 py-2 text-sm">
              <span>{currentPromotion}</span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" aria-hidden />
                Mise à jour automatiquement
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Déterminée selon vos informations scolaires.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Password section */}
      <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
          <CardDescription>Mettre à jour votre mot de passe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => {
                  const v = e.target.value;
                  setNewPassword(v);
                  setPasswordError(v ? validatePassword(v) : '');
                  // Revalidate confirm if user changes main password
                  setConfirmPasswordError(
                    confirmPassword ? validateConfirmPassword(confirmPassword, v) : '',
                  );
                }}
                placeholder="••••••••"
              />
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>

            {showPasswordSection && (
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    const v = e.target.value;
                    setConfirmPassword(v);
                    setConfirmPasswordError(validateConfirmPassword(v, newPassword));
                  }}
                  placeholder="••••••••"
                />
                {confirmPasswordError && (
                  <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>
                )}
              </div>
            )}
          </div>

          {/* Checklist visible only when the user starts typing a new password */}
          {showPasswordSection && (
            <div className="rounded-lg border p-3">
              <p className="text-sm font-medium mb-2">Exigences du mot de passe</p>
              <ul className="grid sm:grid-cols-2 gap-1.5 text-sm">
                {passwordChecklist.map((item) => (
                  <li key={item.label} className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-2.5 w-2.5 rounded-full ${
                        item.ok ? 'bg-green-500' : 'bg-muted-foreground/40'
                      }`}
                    />
                    <span className={item.ok ? 'text-foreground' : 'text-muted-foreground'}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleUpdatePassword} disabled={!showPasswordSection}>
              Mettre à jour le mot de passe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
