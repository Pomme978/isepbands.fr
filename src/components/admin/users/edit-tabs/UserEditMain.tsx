'use client';

import { useState, useEffect } from 'react';
import { Upload, X, Eye, EyeOff, Loader2 } from 'lucide-react';
import Avatar from '@/components/common/Avatar';

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
  bio?: string;
  birthDate?: string;
  phoneNumber?: string;
  rejectionReason?: string;
}

interface UserEditMainProps {
  user: User;
  setUser: (user: User) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  onPendingImageChange?: (file: File | null) => void;
}

export default function UserEditMain({
  user,
  setUser,
  setHasUnsavedChanges,
  onPendingImageChange,
}: UserEditMainProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(user.avatar || null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
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
  };

  // New function to handle actual upload during save
  const uploadPendingImage = async (): Promise<string | null> => {
    if (!pendingImageFile) return null;

    try {
      const formData = new FormData();
      formData.append('file', pendingImageFile);

      const response = await fetch('/api/storage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to upload file';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use status text or default message
          errorMessage = response.statusText || `Error ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error('Invalid server response');
      }

      if (!result.success || !result.file?.id) {
        throw new Error('Invalid response data');
      }

      // The storage API returns the database object directly
      // We need to construct the access URL
      const photoUrl = `/api/storage?id=${result.file.id}`;

      // Clear pending file
      setPendingImageFile(null);

      return photoUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

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

    console.log('Setting preview and avatar to null');
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
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <Avatar
                  name={`${user.firstName} ${user.lastName}`}
                  alt={`${user.firstName} ${user.lastName}`}
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
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
                <label
                  htmlFor="profilePhoto"
                  className={`inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md transition-colors ${
                    uploadingImage
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3 mr-1" />
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

              {previewImage && (
                <button
                  onClick={removeImage}
                  className="inline-flex items-center px-4 py-2 bg-white border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3 mr-1" />
                      Delete Avatar
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              type="text"
              value={user.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              type="text"
              value={user.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={user.phoneNumber || ''}
              onChange={(e) => updateField('phoneNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pronouns</label>
            <select
              value={user.pronouns || ''}
              onChange={(e) => updateField('pronouns', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="">Select pronouns</option>
              <option value="he/him">he/him (il/lui)</option>
              <option value="she/her">she/her (elle/elle)</option>
              <option value="they/them">they/them (iel/ellui)</option>
              <option value="other">Other (autre)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
            <input
              type="date"
              value={user.birthDate || ''}
              onChange={(e) => updateField('birthDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Promotion *</label>
            <select
              value={user.promotion}
              onChange={(e) => updateField('promotion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            rows={4}
            placeholder="Brief biography..."
          />
        </div>
      </div>

      {/* Account Status */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">Member Status</label>
            <select
              value={user.status}
              onChange={(e) => updateField('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="current">Current Member</option>
              <option value="former">Former Member</option>
              <option value="graduated">Graduated</option>
              <option value="pending">Pending Approval</option>
              <option value="refused">Refused</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
            <input
              type="date"
              value={user.joinDate}
              onChange={(e) => updateField('joinDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
        </div>

        {/* Suspension/Rejection Reason - Show only for suspended, refused, or deleted users */}
        {(user.status === 'suspended' ||
          user.status === 'refused' ||
          user.status === 'deleted') && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {user.status === 'suspended'
                ? 'Suspension Reason'
                : user.status === 'refused'
                  ? 'Rejection Reason'
                  : 'Deletion Reason'}
            </label>
            <textarea
              value={user.rejectionReason || ''}
              onChange={(e) => updateField('rejectionReason', e.target.value)}
              rows={3}
              placeholder={`Enter the reason for ${user.status}...`}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              This reason will be shown to the user when they try to log in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
