'use client';

import { useState, useMemo } from 'react';
import { X, RefreshCw, Eye, EyeOff } from 'lucide-react';
import Loading from '@/components/ui/Loading';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
  userName: string;
}

export default function PasswordResetModal({
  isOpen,
  onClose,
  userId,
  userEmail,
  userName,
}: PasswordResetModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [requireChange, setRequireChange] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Password validation - must be before any early returns
  const passwordValidation = useMemo(
    () => [
      { label: 'Au moins 8 caractères', ok: password.length >= 8 },
      { label: 'Une lettre minuscule', ok: /[a-z]/.test(password) },
      { label: 'Une lettre majuscule', ok: /[A-Z]/.test(password) },
      { label: 'Un chiffre', ok: /\d/.test(password) },
      { label: 'Un caractère spécial', ok: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
    ],
    [password],
  );

  const isPasswordValid = passwordValidation.every((item) => item.ok);

  if (!isOpen) return null;

  const generatePassword = () => {
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
    const shuffled = result
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
    setPassword(shuffled);
  };

  const handleReset = async () => {
    if (!password.trim()) {
      alert('Veuillez saisir un mot de passe');
      return;
    }

    if (!isPasswordValid) {
      alert('Le mot de passe ne respecte pas les critères de sécurité');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          sendEmail,
          requireChange,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset password');
      }

      await response.json();

      onClose();
      setPassword('');

      // Show success message
      alert('Password reset successfully!');
    } catch (error) {
      console.error('Password reset error:', error);
      alert(error instanceof Error ? error.message : 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setShowPassword(false);
    setSendEmail(true);
    setRequireChange(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Reset Password</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>User:</strong> {userName}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {userEmail}
            </p>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <button
                type="button"
                onClick={generatePassword}
                className="text-sm text-primary hover:text-primary/80 font-medium flex items-center"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Generate
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password requirements */}
            {password.length > 0 && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Exigences du mot de passe</p>
                <ul className="grid grid-cols-2 gap-1 text-xs">
                  {passwordValidation.map((item) => (
                    <li key={item.label} className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-2 w-2 rounded-full ${
                          item.ok ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                      <span className={item.ok ? 'text-green-700' : 'text-gray-500'}>
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Send email notification</span>
                <p className="text-xs text-gray-500">Notify the user about the password reset</p>
              </div>
            </label>

            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={requireChange}
                onChange={(e) => setRequireChange(e.target.checked)}
                className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Require password change on next login
                </span>
                <p className="text-xs text-gray-500">Force the user to create a new password</p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              disabled={isLoading || !password.trim() || !isPasswordValid}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <Loading text="Resetting..." size="sm" />
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
