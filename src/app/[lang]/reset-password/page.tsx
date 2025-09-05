'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useI18n } from '@/locales/client';
import BackButton from '@/components/ui/back-button';
import { Eye, EyeOff, CheckCircle, AlertCircle, Lock } from 'lucide-react';

export default function ResetPasswordPage() {
  const t = useI18n();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = typeof params.lang === 'string' ? params.lang : 'fr';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const token = searchParams?.get('token');
  const email = searchParams?.get('email');

  useEffect(() => {
    if (!token || !email) {
      router.push(`/${lang}/login`);
    }
  }, [token, email, router, lang]);

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];

    if (pwd.length < 8) {
      errors.push('Au moins 8 caractères');
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('Au moins une majuscule');
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push('Au moins une minuscule');
    }
    if (!/\d/.test(pwd)) {
      errors.push('Au moins un chiffre');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      errors.push('Au moins un caractère spécial');
    }

    return errors;
  };

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);
    setValidationErrors(validatePassword(pwd));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError('Le mot de passe ne respecte pas les critères de sécurité');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return null; // Will redirect
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center relative">
        <div className="absolute md:top-6 top-3 md:left-6 left-0">
          <BackButton variant="ghost" />
        </div>

        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-card rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Mot de passe réinitialisé</h1>
              <p className="text-muted-foreground mb-6">
                Votre mot de passe a été mis à jour avec succès.
              </p>
            </div>

            <div className="text-center">
              <a
                href={`/${lang}/login`}
                className="inline-flex items-center justify-center w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              >
                Se connecter
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center relative">
      <div className="absolute md:top-6 top-3 md:left-6 left-0">
        <BackButton variant="ghost" />
      </div>

      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Nouveau mot de passe</h1>
            <p className="text-muted-foreground">
              Choisissez un mot de passe sécurisé pour votre compte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Votre nouveau mot de passe"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>

              {/* Password requirements */}
              {password && (
                <div className="mt-2 space-y-1">
                  {validationErrors.length > 0 && (
                    <div className="text-xs space-y-1">
                      {[
                        'Au moins 8 caractères',
                        'Au moins une majuscule',
                        'Au moins une minuscule',
                        'Au moins un chiffre',
                        'Au moins un caractère spécial',
                      ].map((requirement, index) => {
                        const isMet = !validationErrors.includes(requirement);
                        return (
                          <div
                            key={index}
                            className={`flex items-center ${isMet ? 'text-green-600' : 'text-red-600'}`}
                          >
                            <span className="mr-2">{isMet ? '✓' : '✗'}</span>
                            {requirement}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Confirmez votre mot de passe"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Les mots de passe ne correspondent pas</p>
              )}
            </div>

            {error && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || validationErrors.length > 0 || password !== confirmPassword}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
