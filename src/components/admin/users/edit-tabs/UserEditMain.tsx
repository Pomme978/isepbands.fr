'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, Mail } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import Loading from '@/components/ui/Loading';
import AdminButton from '../../common/AdminButton';
import { formatPhoneNumber, formatPhoneInput } from '@/utils/phoneUtils';
import { toast } from 'sonner';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  promotion: string;
  role: string;
  joinDate: string;
  status: string;
  emailVerified?: boolean;
  bio?: string;
  birthDate?: string;
  phoneNumber?: string;
  rejectionReason?: string;
  isAvailableForBands?: boolean;
  showInstrumentSkills?: boolean;
  lookingForJamPartners?: boolean;
  preferredGenres?: string[];
  pronouns?: string;
}

interface UserEditMainProps {
  user: User;
  setUser: (user: User) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  onPendingImageChange?: (file: File | null) => void;
  isReadOnly?: boolean;
}

export default function UserEditMain({
  user,
  setUser,
  setHasUnsavedChanges,
  onPendingImageChange,
  isReadOnly = false,
}: UserEditMainProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(user.avatar || null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync preview image with user avatar when it changes (e.g., after save or initial load)
  useEffect(() => {
    // Only update preview if there's no pending image file and we're not deleting
    if (!pendingImageFile && user.avatar !== 'PENDING_UPLOAD' && !isDeleting) {
      setPreviewImage(user.avatar || null);
    }
  }, [user.avatar, pendingImageFile, isDeleting]);

  // Remove auto-upload - we'll handle upload on save instead

  const updateField = (field: keyof User, value: string | null) => {
    setUser({ ...user, [field]: value });
    setHasUnsavedChanges(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadingImage(true);
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La taille du fichier ne doit pas dépasser 5 MB.');
      return;
    }

    // Create preview URL for immediate display (staged upload)
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);

    // Store the file for upload when save is clicked
    setPendingImageFile(file);

    // Notify parent about pending image file
    onPendingImageChange?.(file);

    // Just mark that we have unsaved changes, don't trigger upload
    setHasUnsavedChanges(true);
    setUploadingImage(false);
  };

  // New function to handle actual upload during save
  // const uploadPendingImage = async (): Promise<string | null> => { /* unused */ };

  const removeImage = async () => {
    console.log('removeImage called, current avatar:', user.avatar);
    setIsDeleting(true);

    // If there's an existing photo URL, delete it from storage
    if (user.avatar && user.avatar.includes('/api/storage?id=')) {
      const photoId = user.avatar.split('/api/storage?id=')[1];
      console.log('Attempting to delete photo with ID:', photoId);

      if (photoId) {
        try {
          const deleteResponse = await fetch(`/api/storage?id=${photoId}`, {
            method: 'DELETE',
          });

          if (!deleteResponse.ok) {
            const errorText = await deleteResponse.text();
            console.error(
              'Failed to delete photo from storage. Status:',
              deleteResponse.status,
              'Error:',
              errorText,
            );
          } else {
            console.log('Photo deleted successfully from storage');
          }
        } catch (error) {
          console.error('Error deleting photo:', error);
        }
      }
    }

    setPreviewImage(null);
    setPendingImageFile(null);
    onPendingImageChange?.(null);
    updateField('avatar', null);
    setHasUnsavedChanges(true);

    // Reset the deleting flag after a short delay to allow the state to update
    setTimeout(() => setIsDeleting(false), 100);
  };

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

        {/* Profile Photo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <Avatar
                  name={`${user.firstName} ${user.lastName}`}
                  size="lg"
                  className="border-2 border-dashed border-gray-300"
                />
              )}
            </div>

            <div className="space-y-2">
              <div>
                <input
                  type="file"
                  id="profilePhoto"
                  accept="image/*,.heic,.heif"
                  onChange={handleImageUpload}
                  disabled={uploadingImage || isReadOnly}
                  className="hidden"
                />
                <label
                  htmlFor="profilePhoto"
                  className={`inline-flex cursor-pointer items-center justify-center font-medium border px-4 py-1.5 text-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-200 ${
                    uploadingImage || isReadOnly
                      ? 'cursor-not-allowed opacity-50 hover:bg-white hover:border-gray-200'
                      : ''
                  }`}
                >
                  {uploadingImage ? (
                    <Loading text="Uploading..." size="sm" />
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      {previewImage ? 'Change Photo' : 'Upload Photo'}
                    </>
                  )}
                </label>
                {pendingImageFile && !uploadingImage && (
                  <p className="text-sm text-orange-600 mt-1">
                    Image sera téléchargée lors de la sauvegarde
                  </p>
                )}
              </div>

              {previewImage && !isReadOnly && (
                <AdminButton
                  onClick={removeImage}
                  variant="danger"
                  size="sm"
                  icon={X}
                  disabled={isDeleting}
                  loading={isDeleting}
                  loadingText="Removing..."
                >
                  Delete Avatar
                </AdminButton>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              type="text"
              value={user.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              type="text"
              value={user.lastName}
              onChange={(e) => updateField('lastName', e.target.value.toUpperCase())}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => updateField('email', e.target.value)}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={formatPhoneInput(user.phoneNumber || '')}
              onChange={(e) => {
                const formatted = formatPhoneInput(e.target.value);
                updateField('phoneNumber', formatted);
              }}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pronouns</label>
            <select
              value={user.pronouns || ''}
              onChange={(e) => updateField('pronouns', e.target.value)}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <option value="">Select pronouns</option>
              <option value="he/him">he/him (il/lui)</option>
              <option value="she/her">she/her (elle/elle)</option>
              <option value="they/them">they/them (iel/ellui)</option>
              <option value="other">Other (autre)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Date
              {user.birthDate && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (
                  {Math.floor(
                    (new Date().getTime() - new Date(user.birthDate).getTime()) /
                      (1000 * 60 * 60 * 24 * 365.25),
                  )}{' '}
                  ans)
                </span>
              )}
            </label>
            <input
              type="date"
              value={user.birthDate || ''}
              onChange={(e) => updateField('birthDate', e.target.value)}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Promotion *</label>
            <select
              value={user.promotion}
              onChange={(e) => updateField('promotion', e.target.value)}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="I1">I1</option>
              <option value="I2">I2</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="A3">A3</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="B3">B3</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            value={user.bio || ''}
            onChange={(e) => updateField('bio', e.target.value)}
            disabled={isReadOnly}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
            rows={4}
            placeholder="Brief biography..."
          />
        </div>
      </div>

      {/* Account Status */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">Member Status</label>
            <select
              value={user.status}
              onChange={(e) => updateField('status', e.target.value)}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <option value="current">Current Member</option>
              <option value="former">Former Member</option>
              <option value="graduated">Graduated</option>
              <option value="pending">Pending Approval</option>
              <option value="refused">Refused</option>
              <option value="suspended">Suspended</option>
              {(user.status === 'deleted' || user.status === 'DELETED') && (
                <option value="deleted">Archived</option>
              )}
            </select>
          </div>

          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
            <input
              type="date"
              value={user.joinDate}
              onChange={(e) => updateField('joinDate', e.target.value)}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Suspension/Rejection Reason - Show only for suspended or refused users */}
        {(user.status === 'suspended' || user.status === 'refused') && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {user.status === 'suspended' ? 'Suspension Reason' : 'Rejection Reason'}
            </label>
            <textarea
              value={user.rejectionReason || ''}
              onChange={(e) => updateField('rejectionReason', e.target.value)}
              disabled={isReadOnly}
              rows={3}
              placeholder={`Enter the reason for ${user.status}...`}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
            />
            <p className="text-xs text-gray-500 mt-1">
              This reason will be shown to the user when they try to log in.
            </p>
          </div>
        )}
      </div>

      {/* Email Verification Status */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Verification</h3>

        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center">
              {user.emailVerified ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Vérifié</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  <span className="text-sm text-yellow-600 font-medium">Non vérifié</span>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {!isReadOnly && (
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={user.emailVerified || false}
                    onChange={(e) => {
                      updateField('emailVerified', e.target.checked);
                    }}
                    className="rounded border-gray-300 text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-gray-700">Forcer la vérification</span>
                </label>
              )}

              {!user.emailVerified && !isReadOnly && (
                <AdminButton
                  onClick={async () => {
                    try {
                      const response = await fetch(
                        `/api/admin/users/${user.id}/send-verification`,
                        {
                          method: 'POST',
                        },
                      );

                      if (response.ok) {
                        toast.success('Email de vérification envoyé !');
                      } else {
                        const data = await response.json();
                        toast.error(data.error || "Erreur lors de l'envoi");
                      }
                    } catch (error) {
                      toast.error("Erreur lors de l'envoi de l'email");
                    }
                  }}
                  variant="secondary"
                  size="xs"
                  icon={Mail}
                  className="w-full sm:w-auto"
                >
                  <span className="hidden sm:inline">Envoyer email de vérification</span>
                  <span className="sm:hidden">Envoyer email</span>
                </AdminButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
