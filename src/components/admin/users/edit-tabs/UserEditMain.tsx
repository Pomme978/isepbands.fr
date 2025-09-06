'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, Mail } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import Loading from '@/components/ui/Loading';
import AdminButton from '../../common/AdminButton';
import { formatPhoneNumber, formatPhoneInput } from '@/utils/phoneUtils';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

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
            <Label>First Name *</Label>
            <Input
              type="text"
              value={user.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Last Name *</Label>
            <Input
              type="text"
              value={user.lastName}
              onChange={(e) => updateField('lastName', e.target.value.toUpperCase())}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={user.email}
              onChange={(e) => updateField('email', e.target.value)}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={formatPhoneInput(user.phoneNumber || '')}
              onChange={(e) => {
                const formatted = formatPhoneInput(e.target.value);
                updateField('phoneNumber', formatted);
              }}
              disabled={isReadOnly}
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div>
            <Label>Pronouns</Label>
            <Select
              value={user.pronouns || undefined}
              onValueChange={(value) => updateField('pronouns', value)}
              disabled={isReadOnly}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select pronouns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="he/him">he/him (il/lui)</SelectItem>
                <SelectItem value="she/her">she/her (elle/elle)</SelectItem>
                <SelectItem value="they/them">they/them (iel/ellui)</SelectItem>
                <SelectItem value="other">Other (autre)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
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
            </Label>
            <Input
              type="date"
              value={user.birthDate || ''}
              onChange={(e) => updateField('birthDate', e.target.value)}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Promotion *</Label>
            <Select
              value={user.promotion}
              onValueChange={(value) => updateField('promotion', value)}
              disabled={isReadOnly}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P1">P1</SelectItem>
                <SelectItem value="P2">P2</SelectItem>
                <SelectItem value="I1">I1</SelectItem>
                <SelectItem value="I2">I2</SelectItem>
                <SelectItem value="A1">A1</SelectItem>
                <SelectItem value="A2">A2</SelectItem>
                <SelectItem value="A3">A3</SelectItem>
                <SelectItem value="B1">B1</SelectItem>
                <SelectItem value="B2">B2</SelectItem>
                <SelectItem value="B3">B3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Label>Bio</Label>
          <Textarea
            value={user.bio || ''}
            onChange={(e) => updateField('bio', e.target.value)}
            disabled={isReadOnly}
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
            <Label>Member Status</Label>
            <Select
              value={user.status}
              onValueChange={(value) => updateField('status', value)}
              disabled={isReadOnly}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Member</SelectItem>
                <SelectItem value="former">Former Member</SelectItem>
                <SelectItem value="pending">Pending Approval</SelectItem>
                <SelectItem value="refused">Refused</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                {(user.status === 'deleted' || user.status === 'DELETED') && (
                  <SelectItem value="deleted">Archived</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <Label>Join Date</Label>
            <Input
              type="date"
              value={user.joinDate}
              onChange={(e) => updateField('joinDate', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Suspension/Rejection Reason - Show only for suspended or refused users */}
        {(user.status === 'suspended' || user.status === 'refused') && (
          <div className="mt-4">
            <Label>{user.status === 'suspended' ? 'Suspension Reason' : 'Rejection Reason'}</Label>
            <Textarea
              value={user.rejectionReason || ''}
              onChange={(e) => updateField('rejectionReason', e.target.value)}
              disabled={isReadOnly}
              rows={3}
              placeholder={`Enter the reason for ${user.status}...`}
              className="resize-none"
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
                  <Checkbox
                    checked={user.emailVerified || false}
                    onCheckedChange={(checked) => {
                      updateField('emailVerified', checked as boolean);
                    }}
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
