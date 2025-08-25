'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Step1Personal from './creation-steps/Step1Personal';
import Step2RolePermissions from './creation-steps/Step2RolePermissions';
import Step3Instruments from './creation-steps/Step3Instruments';
import Step4Badges from './creation-steps/Step4Badges';
import Step5Profile from './creation-steps/Step5Profile';
import Step6Review from './creation-steps/Step6Review';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface UserFormData {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  promotion: string;
  studentStatus: string;

  // Step 2: Role & Permissions
  primaryRole: string;
  fullAccessOverride: boolean;
  permissions: string[];

  // Step 3: Instruments & Skills
  instruments: Array<{
    instrument: string;
    level: string;
  }>;
  yearsExperience: string;
  preferredGenres: string[];

  // Step 4: Badges
  achievementBadges: string[];
  customBadge?: {
    name: string;
    description: string;
    color: string;
  };

  // Step 5: Profile & Bio
  profilePhoto?: File;
  bio: string;
  publicProfile: boolean;
  emailPreferences: {
    newsletter: boolean;
    events: boolean;
    groupInvitations: boolean;
    systemUpdates: boolean;
  };

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
  'Review & Create'
];

export default function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    promotion: 'I1',
    studentStatus: 'current',
    primaryRole: 'Member',
    fullAccessOverride: false,
    permissions: [],
    instruments: [],
    yearsExperience: '',
    preferredGenres: [],
    achievementBadges: [],
    bio: '',
    publicProfile: false,
    emailPreferences: {
      newsletter: true,
      events: true,
      groupInvitations: true,
      systemUpdates: true
    },
    sendWelcomeEmail: true,
    temporaryPassword: generatePassword(),
    requirePasswordChange: true
  });

  if (!isOpen) return null;

  function generatePassword() {
    return Math.random().toString(36).slice(-8);
  }

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
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
      birthDate: '',
      promotion: 'I1',
      studentStatus: 'current',
      primaryRole: 'Member',
      fullAccessOverride: false,
      permissions: [],
      instruments: [],
      yearsExperience: '',
      preferredGenres: [],
      achievementBadges: [],
      bio: '',
      publicProfile: false,
      emailPreferences: {
        newsletter: true,
        events: true,
        groupInvitations: true,
        systemUpdates: true
      },
      sendWelcomeEmail: true,
      temporaryPassword: generatePassword(),
      requirePasswordChange: true
    });
    onClose();
  };

  const handleSubmit = async () => {
    console.log('Creating user:', formData);
    // TODO: Implement API call
    handleClose();
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
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className={`h-1 w-16 mr-1 rounded ${
                    i < currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>

          <span className="text-sm text-gray-500">
            Step {currentStep} of 6
          </span>

          {currentStep < 6 ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center px-4 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary/90"
            >
              Next Step
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Create User
            </button>
          )}
        </div>
      </div>
    </div>
  );
}