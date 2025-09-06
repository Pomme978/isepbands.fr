'use client';

import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/Loading';

interface ChangePasswordFormProps {
  userEmail?: string | null;
  changeToken?: string | null;
  onSuccess?: () => void;
}

export function ChangePasswordForm({ userEmail, changeToken, onSuccess }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password validation
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Au moins 8 caractères');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Au moins une lettre minuscule');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Au moins une lettre majuscule');
    }
    if (!/\d/.test(password)) {
      errors.push('Au moins un chiffre');
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push('Au moins un caractère spécial');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation - current password only required for email auth
    if (!changeToken && !currentPassword.trim()) {
      setError('Le mot de passe actuel est requis');
      return;
    }

    if (!newPassword.trim()) {
      setError('Le nouveau mot de passe est requis');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Only check if passwords are the same when we have current password
    if (!changeToken && currentPassword && currentPassword === newPassword) {
      setError("Le nouveau mot de passe doit être différent de l'actuel");
      return;
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setError('Le mot de passe ne respecte pas les critères de sécurité');
      return;
    }

    setIsLoading(true);

    try {
      const requestBody: {
        newPassword: string;
        token?: string;
        email?: string;
        currentPassword?: string;
      } = {
        newPassword,
      };

      // Use secure token if available, otherwise fallback to email
      if (changeToken) {
        requestBody.token = changeToken;
        // Don't send currentPassword when using token - user is already authenticated
      } else if (userEmail) {
        requestBody.email = userEmail;
        requestBody.currentPassword = currentPassword; // Required for email auth
      }

      const response = await fetch('/api/auth/change-password-first-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      if (data.success) {
        // Password changed successfully
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Password change error:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const currentPasswordErrors = validatePassword(newPassword);
  const isFormValid =
    (changeToken || currentPassword) &&
    newPassword &&
    confirmPassword &&
    newPassword === confirmPassword &&
    currentPasswordErrors.length === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-3">
      {/* Current Password - only show for email authentication */}
      {!changeToken && (
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe actuel
          </label>
          <div className="relative">
            <Input
              id="currentPassword"
              name="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="pr-10"
              placeholder="Entrez votre mot de passe actuel"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* New Password */}
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Nouveau mot de passe
        </label>
        <div className="relative">
          <Input
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="pr-10"
            placeholder="Entrez votre nouveau mot de passe"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {/* Password Requirements */}
        {newPassword && (
          <div className="mt-2 space-y-1">
            <p className="text-xs font-medium text-gray-700">Exigences du mot de passe :</p>
            {validatePassword(newPassword).map((error, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-red-600">{error}</span>
              </div>
            ))}
            {currentPasswordErrors.length === 0 && newPassword.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span className="text-green-600">Mot de passe valide</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirmer le nouveau mot de passe
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pr-10"
            placeholder="Confirmez votre nouveau mot de passe"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {/* Password Match Indicator */}
        {confirmPassword && (
          <div className="mt-1">
            {newPassword === confirmPassword ? (
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span className="text-green-600">Les mots de passe correspondent</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-red-600">Les mots de passe ne correspondent pas</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
            </div>
            <div className="ml-2">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white"
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <Loading text="Changement..." size="sm" variant="spinner" theme="white" />
        ) : (
          'Changer le mot de passe'
        )}
      </Button>
    </form>
  );
}
