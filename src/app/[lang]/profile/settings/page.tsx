'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useI18n } from '@/locales/client';
import LangLink from '@/components/common/LangLink';
import BackButton from '@/components/ui/back-button';
import { SettingsContent } from '@/components/profile/settings/SettingsContent';
import Loading from '@/components/ui/Loading';
import { User, Music, Shield, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadImageToStorage } from '@/utils/imageUpload';
import { cn } from '@/utils/utils';
import { toast } from 'sonner';

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

export default function ProfileSettingsPage() {
  const t = useI18n();
  const params = useParams();
  const locale = params.lang as string;

  const settingsItems: SettingsItem[] = [
    {
      id: 'profile',
      title: t('settings.navigation.profile'),
      icon: User,
    },
    {
      id: 'music',
      title: t('settings.navigation.music'),
      icon: Music,
    },
    {
      id: 'privacy',
      title: t('settings.navigation.privacy'),
      icon: Shield,
    },
  ];
  const [activeSection, setActiveSection] = useState('profile');
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
          throw new Error(t('settings.messages.sessionError'));
        }

        const sessionData = await sessionResponse.json();
        if (!sessionData?.user) {
          throw new Error(t('settings.messages.noUserSession'));
        }

        setUserSession(sessionData);

        // Fetch user profile data
        const profileResponse = await fetch(`/api/profile/${sessionData.user.id}`, {
          credentials: 'include',
        });
        if (!profileResponse.ok) {
          throw new Error(t('settings.messages.profileError'));
        }

        const profileData = await profileResponse.json();
        if (!profileData.success) {
          throw new Error(profileData.message || t('settings.messages.profileLoadError'));
        }

        setUserProfile(profileData.data);

        console.log('=== INITIALIZING FORM DATA ===');
        console.log('Profile data received:', profileData.data);
        console.log('Pronouns from API:', profileData.data.pronouns);

        // Initialize form data with current values
        const initialFormData = {
          profile: {
            firstName: profileData.data.firstName || '',
            lastName: profileData.data.lastName || '',
            biography: profileData.data.biography || '',
            bureauQuote: profileData.data.bureauQuote || '',
            photoUrl: profileData.data.photoUrl || null,
            birthDate: profileData.data.birthDate
              ? new Date(profileData.data.birthDate).toISOString().split('T')[0]
              : null,
            pronouns: profileData.data.pronouns || null,
          },
          music: {
            isLookingForGroup: profileData.data.isLookingForGroup || false,
            // Add other music settings here
          },
          privacy: {
            pronouns: profileData.data.pronouns || null,
            // Add other privacy settings here
          },
        };

        console.log('Initial form data:', initialFormData);
        console.log('Initial pronouns value:', initialFormData.privacy.pronouns);
        setFormData(initialFormData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : t('settings.messages.generalError'));

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
  }, [locale, t]);

  // Update form data from child components
  const updateFormData = (section: string, data: Record<string, unknown>) => {
    console.log('=== UPDATE FORM DATA ===');
    console.log('Section:', section);
    console.log('Data received:', data);
    console.log('Current formData before update:', formData);

    setFormData((prev: Record<string, unknown>) => {
      const newFormData = {
        ...prev,
        [section]: { ...prev[section], ...data },
      };
      console.log('New formData after update:', newFormData);
      return newFormData;
    });

    // Show toast only if there were no unsaved changes before
    if (!hasUnsavedChanges) {
      toast.info(t('settings.messages.unsavedChanges'));
    }
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
          const uploadResult = await uploadImageToStorage(pendingPhotoFile, 'avatars');
          if (uploadResult.success && uploadResult.url) {
            finalPhotoUrl = uploadResult.url;
            // Clear pending file after successful upload
            setPendingPhotoFile(null);
          } else {
            throw new Error(uploadResult.error || t('settings.messages.photoUploadFailed'));
          }
        } catch (uploadError) {
          console.error('Error uploading photo:', uploadError);
          toast.error(t('settings.messages.photoUploadError'));
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
        pronouns: formData.profile?.pronouns || formData.privacy?.pronouns,
        birthDate: formData.profile?.birthDate,
      };

      console.log('=== SAVING PROFILE DATA ===');
      console.log('Profile data to save:', profileDataToSave);
      console.log('User ID:', userSession.user.id);
      console.log('Form data privacy section:', formData.privacy);
      console.log('Pronouns value:', formData.privacy?.pronouns);

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
        throw new Error(t('settings.messages.profileSaveError') + ': ' + profileError);
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

          throw new Error(t('settings.messages.musicSaveError') + ': ' + musicError);
        }

        console.log('Music saved successfully');
      } else {
        console.log('No music data to save or music data is empty');
      }

      // Update user profile and form data after successful save
      const updatedProfile = { ...profileDataToSave };
      console.log('Updating user profile with:', updatedProfile);

      setUserProfile((prev) => (prev ? { ...prev, ...updatedProfile } : null));
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          photoUrl: finalPhotoUrl,
          pendingPhoto: false,
          photoDeleted: false,
        },
        privacy: {
          ...prev.privacy,
          pronouns: updatedProfile.pronouns,
        },
      }));

      console.log('Profile and form data updated');

      setHasUnsavedChanges(false);
      // Show success toast
      toast.success(t('settings.messages.saveSuccess'));
      console.log('=== SAVE COMPLETED SUCCESSFULLY ===');
    } catch (error) {
      console.error('=== SAVE FAILED ===');
      console.error('Error saving profile:', error);
      toast.error(t('settings.messages.saveError'));
    } finally {
      setIsSaving(false);
      console.log('=== HANDLE SAVE ALL END ===');
    }
  };

  if (isLoading) {
    // return <SettingsLoadingSkeleton />; // Commented out for now
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading text={t('settings.common.loading')} size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">{t('settings.common.error')}</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>{t('settings.common.retry')}</Button>
        </div>
      </div>
    );
  }

  if (!userSession || !userProfile) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">{t('settings.common.sessionExpired')}</h2>
          <p className="text-muted-foreground mb-4">{t('settings.common.pleaseReconnect')}</p>
          <Button asChild>
            <LangLink href="/login">{t('settings.common.signIn')}</LangLink>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header avec navigation sticky */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <div className="relative flex items-center mb-6">
              {/* Back button à gauche, position absolue */}
              <div className="absolute left-0">
                {typeof window !== 'undefined' && window.history.length > 1 && (
                  <BackButton
                    variant="ghost"
                    onClick={() => {
                      if (hasUnsavedChanges) {
                        const confirmLeave = window.confirm(t('settings.common.unsavedWarning'));
                        if (!confirmLeave) return;
                      }
                      window.history.back();
                    }}
                  />
                )}
              </div>

              {/* Titre vraiment centré */}
              <div className="w-full text-center">
                <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
              </div>
            </div>

            {/* Navigation sections - tabs style */}
            <div className="flex justify-center">
              <nav className="flex space-x-8 border-gray-200 w-full justify-center">
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

      {/* Floating save button for mobile/scroll visibility */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 fade-in duration-300">
          <Button
            onClick={handleSaveAll}
            disabled={isSaving}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isSaving ? (
              <>
                <Loading text="" size="sm" centered={false} />
                <span className="ml-2">{t('settings.common.saving')}</span>
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                <span>{t('settings.common.save')}</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
