// app/[locale]/profile/[[...slug]]/page.tsx
'use client';

import { useSession } from '@/lib/auth-client';
import { useI18n } from '@/locales/client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BackButton from '@/components/ui/back-button';
import { User, Mail, Calendar, Camera, Edit2, Save, X } from 'lucide-react';

interface ProfilePageProps {
  params: {
    locale: string;
    slug?: string[];
  };
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
  emailVerified: boolean;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const t = useI18n();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract username from slug if viewing someone else's profile
  const targetUsername = params.slug?.[0];
  const isOwnProfile = !targetUsername;

  useEffect(() => {
    // If not logged in and trying to access own profile, redirect to login
    if (!isPending && !session && isOwnProfile) {
      router.push(`/${params.locale}/login`);
      return;
    }

    if (session) {
      if (isOwnProfile) {
        // Show current user's profile
        setProfileUser(session.user);
        setEditedName(session.user.name || '');
      } else {
        // Fetch other user's profile
        fetchUserProfile(targetUsername);
      }
    }
  }, [session, isPending, targetUsername, isOwnProfile, router, params.locale]);

  const fetchUserProfile = async (username: string) => {
    try {
      setLoading(true);
      // You'll need to create this API endpoint
      const response = await fetch(`/api/users/${username}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError(t('profile.errors.userNotFound'));
          return;
        }
        throw new Error('Failed to fetch user');
      }
      const userData = await response.json();
      setProfileUser(userData);
    } catch (err) {
      setError(t('profile.errors.loadFailed'));
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!session || !isOwnProfile) return;

    try {
      setLoading(true);
      // You'll need to create this API endpoint
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setProfileUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(t('profile.errors.updateFailed'));
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isOwnProfile) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);

      // You'll need to create this API endpoint
      const response = await fetch('/api/profile/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const updatedUser = await response.json();
      setProfileUser(updatedUser);
    } catch (err) {
      setError(t('profile.errors.imageUploadFailed'));
      console.error('Error uploading image:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('common.status.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="text-red-500 mb-4">
            <X className="mx-auto h-12 w-12 mb-2" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
          <Button onClick={() => router.back()} variant="outline">
            {t('common.actions.goBack')}
          </Button>
        </Card>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>{t('profile.errors.noData')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton variant="ghost" />
        </div>

        {/* Profile Card */}
        <Card className="p-8">
          {/* Header with title and edit button */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              {isOwnProfile ? t('profile.myProfile') : t('profile.userProfile')}
            </h1>
            {isOwnProfile && (
              <Button
                onClick={() => {
                  if (isEditing) {
                    setIsEditing(false);
                    setEditedName(profileUser.name || '');
                  } else {
                    setIsEditing(true);
                  }
                }}
                variant="outline"
                size="sm"
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </Button>
            )}
          </div>

          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profileUser.image ? (
                  <img
                    src={profileUser.image}
                    alt={profileUser.name || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-gray-400" />
                )}
              </div>
              {isOwnProfile && (
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4" />
                {t('profile.fields.name')}
              </Label>
              {isEditing ? (
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder={t('profile.placeholders.name')}
                />
              ) : (
                <p className="text-lg font-semibold">{profileUser.name || t('profile.noName')}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4" />
                {t('profile.fields.email')}
              </Label>
              <p className="text-lg">{profileUser.email}</p>
              {profileUser.emailVerified ? (
                <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                  {t('profile.emailVerified')}
                </span>
              ) : (
                <span className="inline-block mt-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                  {t('profile.emailNotVerified')}
                </span>
              )}
            </div>

            {/* Join Date */}
            <div>
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4" />
                {t('profile.fields.joinDate')}
              </Label>
              <p className="text-lg">
                {new Date(profileUser.createdAt).toLocaleDateString(params.locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {isOwnProfile && isEditing && (
            <div className="flex gap-3 mt-8 pt-6 border-t">
              <Button onClick={handleSaveProfile} disabled={loading} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {loading ? t('common.status.saving') : t('common.actions.save')}
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setEditedName(profileUser.name || '');
                }}
                variant="outline"
                className="flex-1"
              >
                {t('common.actions.cancel')}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
