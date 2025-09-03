'use client';

import { useState } from 'react';
import { AlertTriangle, Mail, CheckCircle } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export default function EmailVerificationModal({
  isOpen,
  onClose,
  userEmail,
}: EmailVerificationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleResendEmail = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/send-verification-email', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
        }, 3000);
      } else {
        setErrorMessage(data.error || "Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      setErrorMessage('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {isSuccess ? (
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Email envoyé !</h3>
              <p className="text-sm text-gray-500">
                Un nouvel email de vérification a été envoyé à votre adresse.
              </p>
            </div>
          ) : (
            <>
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Email non vérifié</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-3">
                      Votre adresse email <strong>{userEmail}</strong> n&apos;a pas encore été
                      vérifiée.
                    </p>
                    <p className="text-sm text-gray-500">
                      Pour accéder à toutes les fonctionnalités, veuillez vérifier votre email en
                      cliquant sur le lien reçu dans votre boîte de réception.
                    </p>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleResendEmail}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Renvoyer l&apos;email
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  Fermer
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
