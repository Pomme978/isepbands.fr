'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FullLayout from '@/components/layouts/FullLayout';
import { CheckCircle, XCircle } from 'lucide-react';
import LangLink from '@/components/common/LangLink';

type VerificationState = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  const [state, setState] = useState<VerificationState>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setState('error');
      setMessage('Token de vérification manquant');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setState('success');
          setMessage('Votre email a été vérifié avec succès !');

          // Redirect to home after 3 seconds
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          setState('error');
          setMessage(data.error || "Erreur lors de la vérification de l'email");
        }
      } catch (error) {
        setState('error');
        setMessage('Erreur de connexion. Veuillez réessayer.');
        console.error('Verification error:', error);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <FullLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Vérification Email</h2>
          </div>

          <div className="bg-white py-8 px-6 shadow rounded-lg">
            {state === 'loading' && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Vérification en cours...</p>
              </div>
            )}

            {state === 'success' && (
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email vérifié !</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Vous allez être redirigé automatiquement dans quelques secondes...
                </p>
                <LangLink
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Accéder au site
                </LangLink>
              </div>
            )}

            {state === 'error' && (
              <div className="text-center">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de vérification</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="space-y-3">
                  <LangLink
                    href="/"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Retour à l&apos;accueil
                  </LangLink>
                  <p className="text-sm text-gray-500">
                    Besoin d&apos;aide ? Contactez-nous à{' '}
                    <a href="mailto:contact@isepbands.fr" className="text-primary hover:underline">
                      contact@isepbands.fr
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FullLayout>
  );
}
