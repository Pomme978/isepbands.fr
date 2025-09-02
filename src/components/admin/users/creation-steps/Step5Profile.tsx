'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { UserFormData } from '../CreateUserModal';
import { validateImageFile } from '@/utils/imageUpload';

interface Step5ProfileProps {
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
}

export default function Step5Profile({ formData, setFormData }: Step5ProfileProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const updateField = (field: keyof UserFormData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file before storing
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Store file for upload when user is created (not auto-upload)
    setFormData({ ...formData, profilePhoto: file });

    // Create preview using URL.createObjectURL for better performance
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  const removeImage = () => {
    // Clean up preview URL if it exists
    if (previewImage && previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage);
    }

    setFormData({ ...formData, profilePhoto: undefined });
    setPreviewImage(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>

        {/* Profile Photo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>

          <div className="flex items-center space-x-4">
            <div className="relative">
              {previewImage ? (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            <div>
              <input
                type="file"
                id="profilePhoto"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="profilePhoto"
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Upload className="w-3 h-3 mr-1" />
                {previewImage ? 'Change Photo' : 'Upload Photo'}
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Recommended: Square image, at least 200x200px (max 5MB)
              </p>
              {formData.profilePhoto && (
                <p className="text-xs text-orange-600 mt-1">
                  Image sera téléchargée lors de la création
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bio Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => updateField('bio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            placeholder="A short biography..."
            rows={4}
          />
        </div>

        {/* Pronouns Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pronouns</label>
          <select
            value={formData.pronouns}
            onChange={(e) => updateField('pronouns', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="">Select pronouns</option>
            <option value="he/him">he/him (il/lui)</option>
            <option value="she/her">she/her (elle/elle)</option>
            <option value="they/them">they/them (iel/ellui)</option>
            <option value="other">Other (autre)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            This will be displayed on the user&apos;s profile
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg">
        <h4 className="font-medium text-indigo-900 mb-2">Privacy & Communication</h4>
        <ul className="text-sm text-indigo-700 space-y-1">
          <li>• Profile information can be updated later by the user</li>
          <li>• All profiles are visible to association members</li>
          <li>• Bio information appears on the user&apos;s profile page</li>
        </ul>
      </div>
    </div>
  );
}
