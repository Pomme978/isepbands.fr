'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LangLink from '@/components/common/LangLink';
import BackButton from '@/components/ui/back-button';
import { SettingsContent } from '@/components/profile/settings/SettingsContent';
import Loading from '@/components/ui/Loading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, User, Music, Shield, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadImageToStorage } from '@/utils/imageUpload';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { cn } from '@/utils/utils';

interface UserSession {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

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

interface SettingsItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const settingsItems: SettingsItem[] = [
  {
    id: 'profile',
    title: 'Profil',
    icon: User,
  },
  {
    id: 'music',
    title: 'Musique',
    icon: Music,
  },
  {
    id: 'privacy',
    title: 'Confidentialité',
    icon: Shield,
  },
];

export default function ProfileSettingsPage() {
  const params = useParams();
  const locale = params.lang as string;
  const [activeSection, setActiveSection] = useState('profile');
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Store all form data from all sections
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);

  // Handle browser back/forward and page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch current user session
        const sessionResponse = await fetch('/api/auth/session', {
          credentials: 'include',
        });
        if (!sessionResponse.ok) {
          throw new Error('Failed to fetch session');
        }

        const sessionData = await sessionResponse.json();
        if (!sessionData?.user) {
          throw new Error('No user session found');
        }

        setUserSession(sessionData);

        // Fetch user profile data
        const profileResponse = await fetch(`/api/profile/${sessionData.user.id}`, {
          credentials: 'include',
        });
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profileData = await profileResponse.json();
        if (!profileData.success) {
          throw new Error(profileData.message || 'Failed to load profile');
        }

        setUserProfile(profileData.data);

        // Initialize form data with current values
        setFormData({
          profile: {
            firstName: profileData.data.firstName || '',
            lastName: profileData.data.lastName || '',
            biography: profileData.data.biography || '',
            bureauQuote: profileData.data.bureauQuote || '',
            photoUrl: profileData.data.photoUrl || null,
            birthDate: profileData.data.birthDate
              ? new Date(profileData.data.birthDate).toISOString().split('T')[0]
              : null,
          },
          music: {
            isLookingForGroup: profileData.data.isLookingForGroup || false,
            // Add other music settings here
          },
          privacy: {
            pronouns: profileData.data.pronouns || null,
            // Add other privacy settings here
          },
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');

        // Redirect to login page if session is invalid
        if (
          err instanceof Error &&
          (err.message.includes('session') || err.message.includes('Unauthorized'))
        ) {
          window.location.href = `/${locale}/login`;
          return;
        }

        // Redirect to home page for other errors after a delay
        setTimeout(() => {
          window.location.href = `/${locale}`;
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [locale]);

  // Update form data from child components
  const updateFormData = (section: string, data: Record<string, unknown>) => {
    setFormData((prev: Record<string, unknown>) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
    setHasUnsavedChanges(true);
  };

  // Global save function
  const handleSaveAll = async () => {
    console.log('=== HANDLE SAVE ALL START ===');
    console.log('User session before save:', userSession);
    console.log('Form data to save:', formData);

    if (!userSession) {
      console.log('No user session, aborting save');
      return;
    }

    setIsSaving(true);
    try {
      // First, handle photo changes (upload or deletion)
      let finalPhotoUrl = formData.profile?.photoUrl;

      // Handle photo deletion
      if (formData.profile?.photoDeleted) {
        // Delete the existing photo from storage if it exists
        if (userProfile?.photoUrl && userProfile.photoUrl.includes('/api/storage?id=')) {
          try {
            const { deleteImageFromStorage } = await import('@/utils/imageUpload');
            await deleteImageFromStorage(userProfile.photoUrl);
          } catch (error) {
            console.error('Error deleting photo from storage:', error);
            // Continue with save even if deletion fails
          }
        }
        finalPhotoUrl = null;
      }
      // Handle photo upload
      else if (pendingPhotoFile) {
        try {
          const uploadResult = await uploadImageToStorage(pendingPhotoFile);
          if (uploadResult.success && uploadResult.url) {
            finalPhotoUrl = uploadResult.url;
            // Clear pending file after successful upload
            setPendingPhotoFile(null);
          } else {
            throw new Error(uploadResult.error || 'Photo upload failed');
          }
        } catch (uploadError) {
          console.error('Error uploading photo:', uploadError);
          setSaveError('Erreur lors du téléchargement de la photo');
          setTimeout(() => setSaveError(null), 5000);
          return;
        }
      }

      // Save profile data
      const profileDataToSave = {
        firstName: formData.profile?.firstName,
        lastName: formData.profile?.lastName,
        biography: formData.profile?.biography,
        bureauQuote: formData.profile?.bureauQuote,
        photoUrl: finalPhotoUrl,
        pronouns: formData.privacy?.pronouns,
        birthDate: formData.profile?.birthDate,
      };

      console.log('=== SAVING PROFILE DATA ===');
      console.log('Profile data to save:', profileDataToSave);
      console.log('User ID:', userSession.user.id);

      const profileResponse = await fetch(`/api/profile/${userSession.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileDataToSave),
      });

      console.log('Profile response status:', profileResponse.status);
      console.log('Profile response ok:', profileResponse.ok);

      if (!profileResponse.ok) {
        const profileError = await profileResponse.text();
        console.log('Profile error:', profileError);
        throw new Error(`Failed to save profile: ${profileError}`);
      }

      console.log('Profile saved successfully');

      // Save music data if it exists
      if (formData.music && Object.keys(formData.music).length > 0) {
        console.log('=== SAVING MUSIC DATA ===');
        console.log('Music data to save:', formData.music);

        const musicResponse = await fetch('/api/profile/music', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData.music),
          credentials: 'include', // Ensure cookies are sent
        });

        console.log('Music response status:', musicResponse.status);
        console.log('Music response ok:', musicResponse.ok);

        if (!musicResponse.ok) {
          const musicError = await musicResponse.text();
          console.log('Music save error:', musicError);

          // Handle 401 specifically - session expired
          if (musicResponse.status === 401) {
            console.log('Session expired during music save, redirecting to login');
            window.location.href = `/${locale}/login`;
            return;
          }

          throw new Error(`Failed to save music settings: ${musicError}`);
        }

        console.log('Music saved successfully');
      } else {
        console.log('No music data to save or music data is empty');
      }

      // Update user profile and form data after successful save
      setUserProfile((prev) => (prev ? { ...prev, ...profileDataToSave } : null));
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          photoUrl: finalPhotoUrl,
          pendingPhoto: false,
          photoDeleted: false,
        },
      }));

      setHasUnsavedChanges(false);
      // Show success message with auto-hide
      setSaveSuccess(true);
      setSaveError(null);
      console.log('=== SAVE COMPLETED SUCCESSFULLY ===');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('=== SAVE FAILED ===');
      console.error('Error saving profile:', error);
      setSaveError("Erreur lors de l'enregistrement");
      setSaveSuccess(false);
      setTimeout(() => setSaveError(null), 5000);
    } finally {
      setIsSaving(false);
      console.log('=== HANDLE SAVE ALL END ===');
    }
  };

  if (isLoading) {
    // return <SettingsLoadingSkeleton />; // Commented out for now
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading text="Chargement..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Erreur</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  if (!userSession || !userProfile) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Session expirée</h2>
          <p className="text-muted-foreground mb-4">Veuillez vous reconnecter.</p>
          <Button asChild>
            <LangLink href="/login">Se connecter</LangLink>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar static */}
      <Navbar mode="static" lang={locale} />

      {/* Toast notifications using Alert component */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <Alert className="bg-green-50 border-green-200 max-w-sm">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 ml-2">
              Modifications enregistrées avec succès
            </AlertDescription>
          </Alert>
        </div>
      )}
      {saveError && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <Alert className="bg-red-50 border-red-200 max-w-sm">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 ml-2">{saveError}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header avec navigation sticky */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              {/* Back button à gauche */}
              <div>
                {typeof window !== 'undefined' && window.history.length > 1 && (
                  <BackButton
                    variant="ghost"
                    onClick={() => {
                      if (hasUnsavedChanges) {
                        const confirmLeave = window.confirm(
                          'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?',
                        );
                        if (!confirmLeave) return;
                      }
                      window.history.back();
                    }}
                  />
                )}
              </div>

              {/* Titre au centre */}
              <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>

              {/* Save button à droite */}
              <Button
                onClick={handleSaveAll}
                disabled={!hasUnsavedChanges || isSaving}
                className={cn(
                  hasUnsavedChanges
                    ? 'bg-primary hover:bg-primary/90 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed',
                )}
              >
                {isSaving ? (
                  <>
                    <Loading text="" size="sm" centered={false} />
                    <span className="ml-2 hidden sm:inline">Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Enregistrer</span>
                  </>
                )}
              </Button>
            </div>

            {/* Navigation sections - tabs style */}
            <div className="flex justify-center">
              <nav className="flex space-x-8 border-b border-gray-200 w-full justify-center">
                {settingsItems.map((item) => (
                  <button
                    key={item.id}
                    className={cn(
                      'flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                      activeSection === item.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    )}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Status message */}
            {hasUnsavedChanges && !isSaving && (
              <div className="mt-4 text-center">
                <p className="text-sm text-orange-600">Des modifications non sauvegardées</p>
              </div>
            )}
          </div>

          {/* Contenu des sections */}
          <SettingsContent
            activeSection={activeSection}
            userProfile={userProfile}
            currentUserId={userSession.user.id}
            formData={formData}
            onFormDataChange={updateFormData}
            onPendingPhotoChange={setPendingPhotoFile}
          />
        </div>
      </div>

      {/* Footer static */}
      <Footer />
    </div>
  );
}
