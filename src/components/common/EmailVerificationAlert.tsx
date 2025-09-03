'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import EmailVerificationModal from './EmailVerificationModal';

interface EmailVerificationAlertProps {
  userEmail: string;
  className?: string;
}

export default function EmailVerificationAlert({
  userEmail,
  className = '',
}: EmailVerificationAlertProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={`bg-orange-50 p-4 ${className}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-orange-400" aria-hidden="true" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-orange-800">
              <strong>Email non vérifié</strong> - Votre adresse email n&apos;a pas encore été
              vérifiée.{' '}
              <button
                type="button"
                className="font-medium underline text-orange-800 hover:text-orange-600"
                onClick={() => setIsModalOpen(true)}
              >
                Renvoyer l&apos;email
              </button>
            </p>
          </div>
        </div>
      </div>

      <EmailVerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userEmail={userEmail}
      />
    </>
  );
}
