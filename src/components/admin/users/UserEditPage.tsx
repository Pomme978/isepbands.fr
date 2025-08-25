'use client';

import { useState } from 'react';
import { ArrowLeft, Save, Mail, Lock, User, Shield, Music, Award, Users, Calendar, FileText } from 'lucide-react';
import LangLink from '@/components/common/LangLink';
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

const TABS = [
  { id: 'main', label: 'Main', icon: User },
  { id: 'permissions', label: 'Permissions', icon: Shield },
  { id: 'instruments', label: 'Instruments', icon: Music },
  { id: 'badges', label: 'Badges', icon: Award },
  { id: 'groups', label: 'Groups', icon: Users },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'activity', label: 'Activity Log', icon: FileText }
];

// Mock user data
const MOCK_USER = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@isep.fr',
  avatar: '/avatars/john.jpg',
  promotion: 'I3',
  role: 'President',
  joinDate: '2024-09-01',
  status: 'current',
  bio: 'Passionate about rock music and leading the association...',
  birthDate: '2001-05-15',
  phoneNumber: '+33 6 12 34 56 78'
};

export default function UserEditPage({ userId }: UserEditPageProps) {
  const [activeTab, setActiveTab] = useState('main');
  const [user, setUser] = useState(MOCK_USER);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleSave = async () => {
    console.log('Saving user changes:', user);
    // TODO: Implement API call
    setHasUnsavedChanges(false);
  };

  const handleSendEmail = () => {
    console.log('Opening email modal for user:', user.email);
    // TODO: Implement email modal
  };

  const handleResetPassword = () => {
    setShowPasswordModal(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'main':
        return <UserEditMain user={user} setUser={setUser} setHasUnsavedChanges={setHasUnsavedChanges} />;
      case 'permissions':
        return <UserEditPermissions user={user} setUser={setUser} setHasUnsavedChanges={setHasUnsavedChanges} />;
      case 'instruments':
        return <UserEditInstruments user={user} setUser={setUser} setHasUnsavedChanges={setHasUnsavedChanges} />;
      case 'badges':
        return <UserEditBadges user={user} setUser={setUser} setHasUnsavedChanges={setHasUnsavedChanges} />;
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
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600">{user.promotion} • {user.role}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
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
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className={`inline-flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
              hasUnsavedChanges
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

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
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-sm text-yellow-800 font-medium">
              You have unsaved changes
            </span>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      <PasswordResetModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        userEmail={user.email}
        userName={`${user.firstName} ${user.lastName}`}
      />
    </div>
  );
}