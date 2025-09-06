'use client';

import React, { useMemo, useState, useRef } from 'react';
import { useI18n } from '@/locales/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CustomAvatar from '@/components/common/Avatar';
import { Camera, Info, Trash2 } from 'lucide-react';
import Loading from '@/components/ui/Loading';

// Define interface for user profile data
interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  biography?: string;
  bureauQuote?: string;
  photoUrl?: string | null;
  isLookingForGroup?: boolean;
  pronouns?: string | null;
  promotion?: string | null;
  status?: string;
  birthDate?: string;
  roles?: Array<{ role: { weight: number; name: string } }>;
}

interface ProfileSettingsProps {
  initialProfile?: UserProfile;
  currentUserId?: string;
  formData?: Record<string, unknown>;
  onFormDataChange?: (data: Record<string, unknown>) => void;
  onPendingPhotoChange?: (file: File | null) => void;
}

export function ProfileSettings({
  initialProfile,
  currentUserId,
  formData,
  onFormDataChange,
  onPendingPhotoChange,
}: ProfileSettingsProps) {
  const t = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simple validators aligned with your register page - moved inside component to access t function
  const validatePassword = (value: string) => {
    if (!value) return t('settings.profile.security.validation.required');
    if (
      !/^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/.test(
        value,
      )
    ) {
      return t('settings.profile.security.validation.complexity');
    }
    return '';
  };

  const validateConfirmPassword = (value: string, password: string) => {
    if (!value) return t('settings.profile.security.validation.required');
    if (value !== password) return t('settings.profile.security.validation.mismatch');
    return '';
  };

  // Loading states
  const [isUploadingPhoto] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoMarkedForDeletion, setPhotoMarkedForDeletion] = useState(false);

  // Editable profile fields - synchronized with formData or initialProfile
  const [firstName, setFirstName] = useState(
    formData?.firstName || initialProfile?.firstName || '',
  );
  const [lastName, setLastName] = useState(formData?.lastName || initialProfile?.lastName || '');
  const [bio, setBio] = useState(formData?.biography || initialProfile?.biography || '');
  const [bureauQuote, setBureauQuote] = useState(
    formData?.bureauQuote || initialProfile?.bureauQuote || '',
  );
  const [photoUrl, setPhotoUrl] = useState(formData?.photoUrl || initialProfile?.photoUrl || null);
  const [birthDate, setBirthDate] = useState(
    formData?.birthDate ||
      (initialProfile?.birthDate
        ? (() => {
            const date = new Date(initialProfile.birthDate);
            return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : '';
          })()
        : ''),
  );
  const [pronouns, setPronouns] = useState(formData?.pronouns || initialProfile?.pronouns || '');

  // Report changes to parent
  const handleFieldChange = (field: string, value: string | null | boolean) => {
    if (field === 'firstName') setFirstName(value);
    if (field === 'lastName') setLastName(typeof value === 'string' ? value.toUpperCase() : value);
    if (field === 'biography') setBio(value);
    if (field === 'bureauQuote') setBureauQuote(value);
    if (field === 'photoUrl') setPhotoUrl(value);
    if (field === 'birthDate') setBirthDate(value);
    if (field === 'pronouns') setPronouns(value);

    const updatedData: Record<string, unknown> = {
      firstName: field === 'firstName' ? value : firstName,
      lastName:
        field === 'lastName' ? (typeof value === 'string' ? value.toUpperCase() : value) : lastName,
      biography: field === 'biography' ? value : bio,
      bureauQuote: field === 'bureauQuote' ? value : bureauQuote,
      photoUrl: field === 'photoUrl' ? value : photoUrl,
      birthDate: field === 'birthDate' ? value : birthDate,
      pronouns: field === 'pronouns' ? value : pronouns,
    };

    // Add special flags for photo operations
    if (field === 'photoDeleted') {
      updatedData.photoDeleted = value;
    }
    if (field === 'pendingPhoto') {
      updatedData.pendingPhoto = value;
    }

    onFormDataChange?.(updatedData);
  };

  // Check if user is bureau member (weight >= 70)
  const isBureauMember = useMemo(() => {
    return initialProfile?.roles?.some((ur) => ur.role?.weight >= 70) || false;
  }, [initialProfile?.roles]);

  // Read-only fields from profile data
  const readOnlyEmail = initialProfile?.email || 'prenom.nom@eleve.isep.fr';
  const currentStatus = getStatusDisplay(initialProfile?.status);
  const currentPromotion = initialProfile?.promotion || 'Non définie';

  // Helper function to get status display
  function getStatusDisplay(status?: string): string {
    switch (status) {
      case 'CURRENT':
        return t('settings.profile.association.statusTypes.current');
      case 'FORMER':
        return t('settings.profile.association.statusTypes.former');
      case 'PENDING':
        return t('settings.profile.association.statusTypes.pending');
      default:
        return t('settings.profile.association.statusTypes.member');
    }
  }

  // Password flow
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const showPasswordSection = newPassword.length > 0;

  const passwordChecklist = useMemo(
    () => [
      {
        label: t('settings.profile.security.requirementsList.length'),
        ok: newPassword.length >= 8,
      },
      {
        label: t('settings.profile.security.requirementsList.lowercase'),
        ok: /[a-z]/.test(newPassword),
      },
      {
        label: t('settings.profile.security.requirementsList.uppercase'),
        ok: /[A-Z]/.test(newPassword),
      },
      { label: t('settings.profile.security.requirementsList.number'), ok: /\d/.test(newPassword) },
      {
        label: t('settings.profile.security.requirementsList.special'),
        ok: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword),
      },
    ],
    [newPassword, t],
  );

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUserId) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(t('settings.profile.alerts.invalidFile'));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(t('settings.profile.alerts.fileTooLarge'));
      return;
    }

    // Create preview URL and store file for later upload
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    // Report change to parent to enable save button and provide the file
    handleFieldChange('pendingPhoto', true);
    onPendingPhotoChange?.(file);
  };

  const handleDeletePhoto = () => {
    // Clear any pending photo upload
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onPendingPhotoChange?.(null);

    // Mark photo for deletion (staged deletion)
    setPhotoMarkedForDeletion(true);

    // Update parent with both photoUrl null and photoDeleted flag
    const updatedData: Record<string, unknown> = {
      firstName,
      lastName,
      biography: bio,
      pronouns,
      photoUrl: null,
      photoDeleted: true,
    };

    onFormDataChange?.(updatedData);
  };

  // Clear states after successful save (called by parent)
  React.useEffect(() => {
    // Clear pending photo state if the photoUrl has been updated externally
    if (formData?.photoUrl && formData.photoUrl !== photoUrl && !formData.pendingPhoto) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setPhotoUrl(formData.photoUrl);
      setPhotoMarkedForDeletion(false);
    }
  }, [formData?.photoUrl, formData?.pendingPhoto, photoUrl, previewUrl]);

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
    <div className="relative">
      {/* Simple Header without background */}
      <div className="pb-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('settings.profile.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('settings.profile.subtitle')}</p>
      </div>

      <div className="space-y-8">
        {/* Top grid: Avatar + Basic info */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Photo de profil */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{t('settings.profile.photo.title')}</CardTitle>
              <CardDescription>{t('settings.profile.photo.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <CustomAvatar
                src={photoMarkedForDeletion ? null : previewUrl || photoUrl}
                alt={t('settings.profile.photo.title')}
                name={`${firstName || initialProfile?.firstName || ''} ${lastName || initialProfile?.lastName || ''}`}
                size="xl"
                className="h-24 w-24"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.heic,.heif"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                >
                  {isUploadingPhoto ? (
                    <>
                      <Loading text="" size="sm" centered={false} />
                      {t('settings.profile.photo.uploading')}
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      {t('settings.profile.photo.change')}
                    </>
                  )}
                </Button>
                {(photoUrl || previewUrl) && !photoMarkedForDeletion && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleDeletePhoto}
                    disabled={isUploadingPhoto}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('settings.profile.photo.delete')}
                  </Button>
                )}
                {photoMarkedForDeletion && (
                  <div className="text-sm text-orange-600">
                    {t('settings.profile.photo.deleteMessage')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Infos personnelles */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('settings.profile.personal.title')}</CardTitle>
              <CardDescription>{t('settings.profile.personal.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">{t('settings.profile.personal.firstName')}</Label>
                  <Input
                    id="firstName"
                    placeholder={t('settings.profile.personal.firstNamePlaceholder')}
                    value={firstName}
                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">{t('settings.profile.personal.lastName')}</Label>
                  <Input
                    id="lastName"
                    placeholder={t('settings.profile.personal.lastNamePlaceholder')}
                    value={lastName}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="birthDate">{t('settings.profile.personal.birthDate')}</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => handleFieldChange('birthDate', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pronouns">{t('settings.profile.personal.pronouns')}</Label>
                <Select
                  value={pronouns === '' || pronouns === null ? 'none' : (pronouns as string)}
                  onValueChange={(value) =>
                    handleFieldChange('pronouns', value === 'none' ? '' : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('settings.profile.personal.pronounsPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {t('settings.profile.personal.pronounsOptions.none')}
                    </SelectItem>
                    <SelectItem value="he/him">
                      {t('settings.profile.personal.pronounsOptions.he')}
                    </SelectItem>
                    <SelectItem value="she/her">
                      {t('settings.profile.personal.pronounsOptions.she')}
                    </SelectItem>
                    <SelectItem value="they/them">
                      {t('settings.profile.personal.pronounsOptions.they')}
                    </SelectItem>
                    <SelectItem value="other">
                      {t('settings.profile.personal.pronounsOptions.other')}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {t('settings.profile.personal.pronounsHelp')}
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio">{t('settings.profile.personal.bio')}</Label>
                <Textarea
                  id="bio"
                  placeholder={t('settings.profile.personal.bioPlaceholder')}
                  className="min-h-[120px]"
                  value={bio}
                  onChange={(e) => handleFieldChange('biography', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {t('settings.profile.personal.bioHelp')}
                </p>
              </div>

              {isBureauMember && (
                <div className="space-y-1.5">
                  <Label htmlFor="bureauQuote">{t('settings.profile.personal.bureauQuote')}</Label>
                  <Textarea
                    id="bureauQuote"
                    placeholder={t('settings.profile.personal.bureauQuotePlaceholder')}
                    className="min-h-[80px]"
                    value={bureauQuote}
                    onChange={(e) => {
                      const words = e.target.value
                        .trim()
                        .split(/\s+/)
                        .filter((word) => word.length > 0);
                      if (words.length <= 40) {
                        handleFieldChange('bureauQuote', e.target.value);
                      }
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t('settings.profile.personal.bureauQuoteHelp')}</span>
                    <span
                      className={`${
                        bureauQuote
                          .trim()
                          .split(/\s+/)
                          .filter((word) => word.length > 0).length > 40
                          ? 'text-red-500'
                          : ''
                      }`}
                    >
                      {
                        bureauQuote
                          .trim()
                          .split(/\s+/)
                          .filter((word) => word.length > 0).length
                      }
                      /40 mots
                    </span>
                  </div>
                </div>
              )}
              {/* Note: Save button moved to sticky header */}
              <div className="text-sm text-muted-foreground">
                {t('settings.profile.personal.saveNote')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Org / school data (read-only and clean) */}
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.profile.association.title')}</CardTitle>
            <CardDescription>{t('settings.profile.association.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {/* Email (non modifiable, sans wording "bloqué") */}
            <div className="space-y-1.5">
              <Label htmlFor="email">{t('settings.profile.association.email')}</Label>
              <Input
                id="email"
                type="email"
                value={readOnlyEmail}
                readOnly
                disabled
                aria-disabled="true"
              />
              <p className="text-xs text-muted-foreground">
                {t('settings.profile.association.emailHelp')}
              </p>
            </div>

            {/* Statut (non modifiable) */}
            <div className="space-y-1.5">
              <Label>{t('settings.profile.association.status')}</Label>
              <div className="rounded-md border border-input bg-muted/30 px-3 py-2 text-sm">
                {currentStatus}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('settings.profile.association.statusHelp')}
              </p>
            </div>

            {/* Promotion (texte auto) */}
            <div className="space-y-1.5">
              <Label>{t('settings.profile.association.promotion')}</Label>
              <div className="flex items-center justify-between rounded-md border border-input bg-muted/30 px-3 py-2 text-sm">
                <span>{currentPromotion}</span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Info className="h-3.5 w-3.5" aria-hidden />
                  {t('settings.profile.association.autoUpdate')}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('settings.profile.association.promotionHelp')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Password section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.profile.security.title')}</CardTitle>
            <CardDescription>{t('settings.profile.security.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">{t('settings.profile.security.newPassword')}</Label>
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
                  <Label htmlFor="confirmPassword">
                    {t('settings.profile.security.confirmPassword')}
                  </Label>
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
                <p className="text-sm font-medium mb-2">
                  {t('settings.profile.security.requirements')}
                </p>
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

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {showPasswordSection
                  ? t('settings.profile.security.helpText.complete')
                  : t('settings.profile.security.helpText.start')}
              </div>
              <Button
                onClick={handleUpdatePassword}
                disabled={
                  !showPasswordSection || passwordError !== '' || confirmPasswordError !== ''
                }
                variant="default"
                className={!showPasswordSection ? 'opacity-50' : ''}
              >
                {t('settings.profile.security.updateButton')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
