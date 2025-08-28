'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Mail,
  Lock,
  User,
  Shield,
  Music,
  Award,
  Users,
  Calendar,
  FileText,
  Trash2,
  Archive,
} from 'lucide-react';
import Loading from '@/components/ui/Loading';
import LangLink from '@/components/common/LangLink';
import ViewProfileButton from '../common/ViewProfileButton';
import UnsavedChangesModal from '../common/UnsavedChangesModal';
import Avatar from '@/components/common/Avatar';
import { getPrimaryRoleName, getAllRoleNames } from '@/utils/roleUtils';
import { uploadImageToStorage } from '@/utils/imageUpload';
import UserEditMain from './edit-tabs/UserEditMain';
import UserEditPermissions from './edit-tabs/UserEditPermissions';
import UserEditInstruments from './edit-tabs/UserEditInstruments';
import UserEditBadges from './edit-tabs/UserEditBadges';
import UserEditGroups from './edit-tabs/UserEditGroups';
import UserEditEvents from './edit-tabs/UserEditEvents';
import UserEditActivityLog from './edit-tabs/UserEditActivityLog';
import PasswordResetModal from './PasswordResetModal';

interface UserEditPageProps {
  userId: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  promotion?: string;
  birthDate?: string;
  biography?: string;
  bio?: string;
  phone?: string;
  phoneNumber?: string;
  pronouns?: string;
  isOutOfSchool?: boolean;
  photoUrl?: string;
  avatar?: string;
  status: string;
  isLookingForGroup?: boolean;
  instruments?: UserInstrument[];
  roles?: UserRole[];
  badges?: UserBadge[];
  preferredGenres?: string[];
  createdAt?: string;
  joinDate?: string;
  refusalReason?: string;
}

interface UserInstrument {
  instrument?: { id: string; name: string };
  instrumentId?: string;
  skillLevel: string;
  yearsPlaying?: number;
  isPrimary: boolean;
}

interface UserRole {
  role?: { id: string; name: string; weight: number };
  id?: string;
  roleId?: string;
}

interface UserBadge {
  name: string;
}

const TABS = [
  { id: 'main', label: 'Main', icon: User },
  { id: 'permissions', label: 'Permissions', icon: Shield },
  { id: 'instruments', label: 'Instruments', icon: Music },
  { id: 'badges', label: 'Badges', icon: Award },
  { id: 'groups', label: 'Groups', icon: Users },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'activity', label: 'Activity Log', icon: FileText },
];

export default function UserEditPage({ userId }: UserEditPageProps) {
  const [activeTab, setActiveTab] = useState('main');
  const [user, setUser] = useState<User | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  // Fetch current user session
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const session = await response.json();
          setCurrentUserId(session.user?.id || null);
        }
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/users/${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        console.log('Fetched user data:', data.user);
        // Map API fields to component expected fields
        const mappedUser = {
          ...data.user,
          avatar: data.user.photoUrl, // Map photoUrl to avatar for compatibility
          phoneNumber: data.user.phone, // Map phone to phoneNumber for compatibility
          joinDate: data.user.createdAt
            ? new Date(data.user.createdAt).toISOString().split('T')[0]
            : '', // Format join date
          // Format birthDate for date input
          birthDate: data.user.birthDate
            ? new Date(data.user.birthDate).toISOString().split('T')[0]
            : '',
          // Map biography to bio for the component
          bio: data.user.biography || '',
          // Convert status to lowercase for the form component
          status: data.user.status ? data.user.status.toLowerCase() : 'current',
        };
        console.log('Mapped user data:', mappedUser);
        setUser(mappedUser);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch user');
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      // First, check if we need to upload a pending image
      let finalPhotoUrl = user.avatar;
      if (pendingImageFile) {
        try {
          // Upload the pending image using reusable utility
          const uploadResult = await uploadImageToStorage(pendingImageFile);
          if (uploadResult.success && uploadResult.url) {
            finalPhotoUrl = uploadResult.url;
            // Clear the pending file after successful upload
            setPendingImageFile(null);
          } else {
            console.error('Upload failed:', uploadResult.error);
            // Optionally show error to user or continue with save
          }
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          // Continue with save even if upload fails
        }
      }

      const requestBody = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        promotion: user.promotion,
        birthDate: user.birthDate, // Will be converted to Date in API
        biography: user.bio || user.biography, // Handle both field names
        phone: user.phoneNumber || user.phone, // Map phoneNumber back to phone
        pronouns: user.pronouns,
        isOutOfSchool: user.isOutOfSchool,
        photoUrl: finalPhotoUrl === '' || finalPhotoUrl === null ? null : finalPhotoUrl, // Map avatar back to photoUrl, handle null and empty string
        status: user.status,
        isLookingForGroup: user.isLookingForGroup,
        instruments: user.instruments?.map((inst: UserInstrument) => {
          console.log('Mapping instrument for API:', inst);
          return {
            instrumentId: inst.instrument?.id || inst.instrumentId,
            skillLevel: inst.skillLevel,
            yearsPlaying: inst.yearsPlaying,
            isPrimary: inst.isPrimary,
          };
        }),
        roleIds: user.roles
          ?.map((role: UserRole) => {
            console.log('Processing role:', role);
            const roleId = role.role?.id || role.id || role.roleId;
            console.log('Extracted roleId:', roleId, typeof roleId);
            return roleId;
          })
          .filter((id) => id !== undefined && id !== null),
        badges: user.badges?.map((badge: UserBadge) => ({
          name: badge.name,
        })),
        preferredGenres: user.preferredGenres || [],
      };

      console.log('Request body being sent:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          console.log('Failed to parse error response as JSON:', e);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        console.log('API error response:', errorData);
        const errorMessage = errorData.message || errorData.error || 'Failed to save user';
        if (errorData.details) {
          console.log('Validation details:', errorData.details);
        }
        throw new Error(errorMessage);
      }

      const updatedData = await response.json();
      // Map API fields to component expected fields
      const mappedUser = {
        ...updatedData.user,
        avatar: updatedData.user.photoUrl, // Map photoUrl to avatar for compatibility
        phoneNumber: updatedData.user.phone, // Map phone to phoneNumber for compatibility
        joinDate: updatedData.user.createdAt
          ? new Date(updatedData.user.createdAt).toISOString().split('T')[0]
          : '',
        // Format birthDate for date input
        birthDate: updatedData.user.birthDate
          ? new Date(updatedData.user.birthDate).toISOString().split('T')[0]
          : '',
        // Map biography to bio for the component
        bio: updatedData.user.biography || '',
        // Convert status to lowercase for the form component
        status: updatedData.user.status ? updatedData.user.status.toLowerCase() : 'current',
      };
      setUser(mappedUser);
      setHasUnsavedChanges(false);
      // Clear pending image file after successful save
      setPendingImageFile(null);

      // Show success message (you might want to add a toast system)
      console.log('User saved successfully');
    } catch (error) {
      console.error('Error saving user:', error);
      setError(error instanceof Error ? error.message : 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleSendEmail = () => {
    if (!user) return;
    console.log('Opening email modal for user:', user.email);
    // TODO: Implement email modal
  };

  const handleResetPassword = () => {
    setShowPasswordModal(true);
  };

  const handleViewProfile = () => {
    if (hasUnsavedChanges) {
      setPendingNavigation(`/profile/${userId}`);
      setShowUnsavedModal(true);
    } else {
      window.open(`/profile/${userId}`, '_blank');
    }
  };

  const handleSaveAndNavigate = async () => {
    try {
      await handleSave();
      if (pendingNavigation) {
        window.open(pendingNavigation, '_blank');
      }
      setShowUnsavedModal(false);
      setPendingNavigation(null);
    } catch (error) {
      console.error('Error saving before navigation:', error);
    }
  };

  const handleDiscardAndNavigate = () => {
    if (pendingNavigation) {
      window.open(pendingNavigation, '_blank');
    }
    setShowUnsavedModal(false);
    setPendingNavigation(null);
  };

  const handleDeleteUser = async () => {
    if (!user) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      // Redirect to users list after successful deletion
      window.location.href = '/admin/users';
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleArchiveUser = async () => {
    if (!user) return;

    try {
      setDeleting(true); // Reuse the same loading state
      const response = await fetch(`/api/admin/users/${userId}/archive`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to archive user');
      }

      // Refresh the page to show the updated status
      window.location.reload();
    } catch (error) {
      console.error('Error archiving user:', error);
      setError(error instanceof Error ? error.message : 'Failed to archive user');
    } finally {
      setDeleting(false);
      setShowArchiveConfirm(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'main':
        return (
          <UserEditMain
            user={user}
            setUser={setUser}
            setHasUnsavedChanges={setHasUnsavedChanges}
            onPendingImageChange={setPendingImageFile}
          />
        );
      case 'permissions':
        return (
          <UserEditPermissions
            user={user}
            setUser={setUser}
            setHasUnsavedChanges={setHasUnsavedChanges}
          />
        );
      case 'instruments':
        return (
          <UserEditInstruments
            user={user}
            setUser={setUser}
            setHasUnsavedChanges={setHasUnsavedChanges}
          />
        );
      case 'badges':
        return (
          <UserEditBadges
            user={user}
            setUser={setUser}
            setHasUnsavedChanges={setHasUnsavedChanges}
          />
        );
      case 'groups':
        return <UserEditGroups userId={userId} />;
      case 'events':
        return <UserEditEvents userId={userId} />;
      case 'activity':
        return <UserEditActivityLog userId={userId} />;
      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-12">
        <Loading text="Loading user..." size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
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
            <h3 className="text-sm font-medium text-red-800">Error loading user</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <div className="mt-4">
          <LangLink
            href="/admin/users"
            className="text-sm text-red-600 hover:text-red-500 font-medium"
          >
            ← Back to Users
          </LangLink>
        </div>
      </div>
    );
  }

  // No user found
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">User not found</p>
        <LangLink
          href="/admin/users"
          className="text-primary hover:text-primary/80 font-medium mt-2 inline-block"
        >
          ← Back to Users
        </LangLink>
      </div>
    );
  }

  // Get display names for roles using utils
  const primaryRoleDisplay = getPrimaryRoleName(user.roles, user.pronouns, 'fr');
  const allRolesDisplay = getAllRoleNames(user.roles, user.pronouns, 'fr');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <LangLink
            href="/admin/users"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Users
          </LangLink>

          <div className="flex items-center space-x-3">
            <Avatar
              src={user.avatar || user.photoUrl}
              name={`${user.firstName} ${user.lastName}`}
              size="md"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
                {currentUserId === user.id && (
                  <span className="text-lg font-normal text-blue-600 ml-2">(moi)</span>
                )}
              </h1>
              <p className="text-gray-600">
                {user.promotion} • {allRolesDisplay}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ViewProfileButton userId={userId} onClick={handleViewProfile} variant="button" />

          <button
            onClick={handleSendEmail}
            className="inline-flex items-center px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </button>

          <button
            onClick={handleResetPassword}
            className="inline-flex items-center px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Lock className="w-4 h-4 mr-2" />
            Reset Password
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center px-4 py-2 text-sm bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete User
          </button>

          <button
            onClick={() => setShowArchiveConfirm(true)}
            className="inline-flex items-center px-4 py-2 text-sm bg-white border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Archive className="w-4 h-4 mr-2" />
            Archive User
          </button>

          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || saving}
            className={`inline-flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
              hasUnsavedChanges && !saving
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {saving ? (
              <Loading text="" size="sm" centered={false} />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Pending User Warning */}
      {user.status === 'PENDING' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">⚠️ User Not Approved Yet</h3>
              <p className="text-sm text-yellow-700 mt-1">
                This user has not been approved yet. You can edit their information, but they cannot
                log in until their registration is reviewed and approved.
              </p>
              <div className="mt-3">
                <button
                  onClick={() => {
                    /* TODO: Open review modal */
                  }}
                  className="inline-flex items-center px-3 py-1 text-xs bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
                >
                  Review Registration Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refused User Warning */}
      {user.status === 'REFUSED' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">❌ Registration Refused</h3>
              <p className="text-sm text-red-700 mt-1">
                This user&apos;s registration was refused. They cannot log in to the platform.
              </p>
              {user.refusalReason && (
                <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-700">
                  <strong>Reason:</strong> {user.refusalReason}
                </div>
              )}
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => {
                    /* TODO: Restore user function */
                  }}
                  className="inline-flex items-center px-3 py-1 text-xs bg-green-100 border border-green-300 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                >
                  Restore Account
                </button>
                <button
                  onClick={() => {
                    /* TODO: Archive user function */
                  }}
                  className="inline-flex items-center px-3 py-1 text-xs bg-gray-100 border border-gray-300 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Archive User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">{renderTabContent()}</div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-sm text-yellow-800 font-medium">You have unsaved changes</span>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        userId={userId}
        userEmail={user.email}
        userName={`${user.firstName} ${user.lastName}`}
      />

      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={() => {
          setShowUnsavedModal(false);
          setPendingNavigation(null);
        }}
        onSave={handleSaveAndNavigate}
        onDiscard={handleDiscardAndNavigate}
        saving={saving}
        title="Unsaved Changes"
        message="You have unsaved changes. Would you like to save them before viewing the profile?"
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete{' '}
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              ? This action cannot be undone and will remove:
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <ul className="text-sm text-red-800 space-y-1">
                <li>• All user profile data</li>
                <li>• Role assignments and permissions</li>
                <li>• Group memberships</li>
                <li>• Event participation history</li>
                <li>• Badges and achievements</li>
                <li>• Uploaded files and photos</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleting}
                className="inline-flex items-center px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loading text="" size="sm" centered={false} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <Archive className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Archive User</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to archive{' '}
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              ? Archiving will:
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Set user status to &quot;DELETED&quot;</li>
                <li>• Prevent the user from logging in</li>
                <li>• Keep all data for potential restoration</li>
                <li>• Move user to archived users section</li>
                <li>• This action can be reversed later</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowArchiveConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleArchiveUser}
                disabled={deleting}
                className="inline-flex items-center px-4 py-2 text-sm text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loading text="" size="sm" centered={false} />
                    Archiving...
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
