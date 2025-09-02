'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ForcePasswordChangeProps {
  userEmail: string;
  hasTemporaryPassword?: boolean;
  onSuccess?: () => void;
}

export function ForcePasswordChange({ 
  userEmail, 
  hasTemporaryPassword = true, 
  onSuccess 
}: ForcePasswordChangeProps) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
    setValidationErrors([]);

    // Client-side validation
    if (!currentPassword.trim()) {
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

    if (currentPassword === newPassword) {
      setError('Le nouveau mot de passe doit être différent de l\'actuel');
      return;
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setValidationErrors(passwordErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/change-password-first-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      if (data.success) {
        // Password changed successfully and user is now logged in
        if (onSuccess) {
          onSuccess();
        } else {
          // Redirect to home page
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Password change error:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = (errors: string[]) => {
    if (errors.length === 0) return 'text-green-600';
    if (errors.length <= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const currentPasswordErrors = validatePassword(newPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Changement de mot de passe requis</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            {hasTemporaryPassword 
              ? "Vous devez changer votre mot de passe temporaire avant de continuer."
              : "Vous devez changer votre mot de passe avant de continuer."
            }
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
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

            {/* Error Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div>Le mot de passe doit contenir :</div>
                  <ul className="mt-1 ml-4 list-disc">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading || 
                !currentPassword || 
                !newPassword || 
                !confirmPassword ||
                newPassword !== confirmPassword ||
                currentPasswordErrors.length > 0
              }
            >
              {isLoading ? 'Changement en cours...' : 'Changer le mot de passe'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}