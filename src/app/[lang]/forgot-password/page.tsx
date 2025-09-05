'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useI18n } from '@/locales/client';
import BackButton from '@/components/ui/back-button';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const t = useI18n();
  const params = useParams();
  const lang = typeof params.lang === 'string' ? params.lang : 'fr';

  console.log('ForgotPasswordPage rendered, lang:', lang);

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError(t('auth.forgotPassword.emailRequired'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.message || t('auth.forgotPassword.genericError'));
      }
    } catch (error) {
      setError(t('auth.forgotPassword.connectionError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
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
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t('auth.forgotPassword.success.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('auth.forgotPassword.success.description')}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">{t('auth.forgotPassword.success.checkEmail')}</p>
                  <p>{t('auth.forgotPassword.success.linkValid')}</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a href={`/${lang}/login`} className="text-primary hover:underline font-medium">
                {t('auth.forgotPassword.backToLogin')}
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
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t('auth.forgotPassword.title')}
            </h1>
            <p className="text-muted-foreground">{t('auth.forgotPassword.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                {t('auth.forgotPassword.emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={t('auth.forgotPassword.emailPlaceholder')}
                required
              />
            </div>

            {error && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading
                ? t('auth.forgotPassword.submitLoading')
                : t('auth.forgotPassword.submitButton')}
            </button>
          </form>

          <div className="text-center mt-6">
            <a
              href={`/${lang}/login`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('auth.forgotPassword.backToLogin')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
