'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import Step1Personal from './creation-steps/Step1Personal';
import Step2RolePermissions from './creation-steps/Step2RolePermissions';
import Step3Instruments from './creation-steps/Step3Instruments';
import Step4Badges from './creation-steps/Step4Badges';
import Step5Profile from './creation-steps/Step5Profile';
import Step6Review from './creation-steps/Step6Review';
import { cleanPhoneNumber } from '@/utils/phoneUtils';
import { uploadImageToStorage } from '@/utils/imageUpload';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated?: () => void;
}

export interface UserFormData {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  promotion: string;

  // Step 2: Role & Permissions
  primaryRole: string;
  isFullAccess: boolean;

  // Step 3: Instruments & Skills
  instruments: Array<{
    instrument: string;
    level: string;
    yearsPlaying?: number;
    isPrimary?: boolean;
  }>;
  preferredGenres: string[];

  // Step 4: Badges
  achievementBadges: number[];
  customBadge?: {
    name: string;
    description: string;
    color: string;
  };

  // Step 5: Profile & Bio
  profilePhoto?: File;
  bio: string;
  pronouns: 'he/him' | 'she/her' | 'they/them' | 'other' | '';

  // Step 6: Account Setup
  sendWelcomeEmail: boolean;
  temporaryPassword: string;
  requirePasswordChange: boolean;
}

const STEP_TITLES = [
  'Personal Information',
  'Association Role & Permissions',
  'Instruments & Skills',
  'Badges & Recognition',
  'Profile & Bio',
  'Review & Create',
];

export default function CreateUserModal({ isOpen, onClose, onUserCreated }: CreateUserModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    promotion: 'I1',
    primaryRole: 'Member',
    isFullAccess: false,
    instruments: [],
    preferredGenres: [],
    achievementBadges: [],
    bio: '',
    pronouns: '' as const,
    sendWelcomeEmail: true,
    temporaryPassword: generatePassword(),
    requirePasswordChange: true,
  });

  if (!isOpen) return null;

  function generatePassword() {
    // Generate a stronger password that meets requirements
    const lowercase = 'abcdefghijkmnpqrstuvwxyz';
    const uppercase = 'ABCDEFGHJKMNPQRSTUVWXYZ';
    const numbers = '23456789';
    const specials = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let result = '';
    // Ensure at least one of each type
    result += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    result += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    result += specials.charAt(Math.floor(Math.random() * specials.length));

    // Fill the rest randomly
    const allChars = lowercase + uppercase + numbers + specials;
    for (let i = 4; i < 12; i++) {
      result += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the password
    return result
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  const validateStep1 = (): boolean => {
    return !!(
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.birthDate &&
      formData.promotion
    );
  };

  const validatePassword = (): boolean => {
    const password = formData.temporaryPassword;
    return !!(
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    );
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      setCreateError(
        'Please fill in all required fields (First Name, Last Name, Email, Birth Date, Promotion)',
      );
      return;
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      setCreateError(null); // Clear any previous errors when moving forward
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthDate: '',
      promotion: 'I1',
      primaryRole: 'Member',
      isFullAccess: false,
      instruments: [],
      preferredGenres: [],
      achievementBadges: [],
      bio: '',
      pronouns: '' as const,
      sendWelcomeEmail: true,
      temporaryPassword: generatePassword(),
      requirePasswordChange: true,
    });
    onClose();
  };

  const handleSubmit = async () => {
    // Final validation before submission
    if (!validateStep1()) {
      setCreateError(
        'Please fill in all required fields (First Name, Last Name, Email, Birth Date, Promotion)',
      );
      setCurrentStep(1); // Go back to first step to fix errors
      return;
    }

    if (!validatePassword()) {
      setCreateError(
        'Le mot de passe temporaire ne respecte pas les critères de sécurité requis. Veuillez en générer un nouveau.',
      );
      setCurrentStep(6); // Go back to review step to fix password
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      // Handle optional photo upload
      let photoUrl = null;
      if (formData.profilePhoto) {
        try {
          const uploadResult = await uploadImageToStorage(formData.profilePhoto);
          if (uploadResult.success && uploadResult.url) {
            photoUrl = uploadResult.url;
          } else {
            // Photo upload failed, but continue without photo
            console.warn('Photo upload failed:', uploadResult.error);
            photoUrl = null;
          }
        } catch (uploadError) {
          // Photo upload error, but continue without photo
          console.warn('Error uploading photo:', uploadError);
          photoUrl = null;
        }
      }

      // Transform form data for API
      const apiData = {
        firstName: formData.firstName,
        lastName: formData.lastName, // API will handle uppercase transformation
        email: formData.email,
        phone: cleanPhoneNumber(formData.phone), // Clean formatted phone number for storage
        birthDate: formData.birthDate,
        promotion: formData.promotion,
        primaryRole: formData.primaryRole, // Send as-is, API will handle mapping
        isFullAccess: formData.isFullAccess,
        instruments: formData.instruments.map((inst) => ({
          instrument: inst.instrument, // Already in technical format (e.g., 'electric_guitar')
          level: inst.level.toUpperCase() as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT',
          isPrimary: inst.isPrimary || false,
        })),
        preferredGenres: formData.preferredGenres || [],
        achievementBadges: formData.achievementBadges,
        bio: formData.bio || '',
        pronouns: formData.pronouns || undefined,
        photoUrl: photoUrl || undefined, // Include uploaded photo URL or undefined
        temporaryPassword: formData.temporaryPassword,
        sendWelcomeEmail: formData.sendWelcomeEmail,
        requirePasswordChange: formData.requirePasswordChange,
      };

      // Remove undefined values
      const cleanApiData = Object.fromEntries(
        Object.entries(apiData).filter(([, value]) => value !== undefined),
      );

      console.log('Sending API data:', cleanApiData);

      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanApiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);

        // If it's a validation error, show details
        if (errorData.details) {
          console.error('Validation details:', errorData.details);
          throw new Error(`Validation error: ${JSON.stringify(errorData.details)}`);
        }

        throw new Error(errorData.error || 'Failed to create user');
      }

      const result = await response.json();
      console.log('User created successfully:', result);

      // Trigger refresh and close modal
      if (onUserCreated) {
        onUserCreated();
      }

      // Always close and reset the modal after successful creation
      handleClose();
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Failed to create user');
      console.error('Error creating user:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Personal formData={formData} setFormData={setFormData} />;
      case 2:
        return <Step2RolePermissions formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step3Instruments formData={formData} setFormData={setFormData} />;
      case 4:
        return <Step4Badges formData={formData} setFormData={setFormData} />;
      case 5:
        return <Step5Profile formData={formData} setFormData={setFormData} />;
      case 6:
        return <Step6Review formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create New User - Step {currentStep}: {STEP_TITLES[currentStep - 1]}
            </h2>
            <div className="flex mt-2">
              {Array.from({ length: 6 }, (_unused, i) => (
                <div
                  key={i}
                  className={`h-1 w-16 mr-1 rounded ${
                    i < currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">{renderStep()}</div>

        {/* Error Message */}
        {createError && (
          <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{createError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isCreating}
            className="inline-flex items-center px-4 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3 h-3 mr-1" />
            Back
          </button>

          <span className="text-sm text-gray-500">Step {currentStep} of 6</span>

          {currentStep < 6 ? (
            <button
              onClick={handleNext}
              disabled={isCreating}
              className="inline-flex items-center px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next Step
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isCreating}
              className="inline-flex items-center px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? (
                <Loading text="Creating..." size="sm" variant="spinner" theme="white" />
              ) : (
                'Create User'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
