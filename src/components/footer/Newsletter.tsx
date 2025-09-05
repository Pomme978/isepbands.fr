// Newsletter.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import Loading from '@/components/ui/Loading';
import { toast } from 'sonner';
import { useSession } from '@/lib/auth-client';
import { useI18n } from '@/locales/client';

interface NewsletterProps {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
  onSubmit?: (email: string) => void;
}

export function Newsletter({
  title,
  description,
  placeholder,
  buttonText,
  onSubmit,
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);
  const { user } = useSession();
  const t = useI18n();

  useEffect(() => {
    // Check if user recently subscribed (stored in localStorage)
    const recentSubscription = localStorage.getItem('newsletter_subscribed');
    if (recentSubscription) {
      const subscriptionTime = parseInt(recentSubscription);
      const now = Date.now();
      // Consider subscribed if within last 30 days
      if (now - subscriptionTime < 30 * 24 * 60 * 60 * 1000) {
        setIsAlreadySubscribed(true);
      } else {
        localStorage.removeItem('newsletter_subscribed');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error(t('footer.newsletter.errors.emailRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'footer',
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || t('footer.newsletter.success'));
        setEmail('');
        // Store subscription in localStorage
        localStorage.setItem('newsletter_subscribed', Date.now().toString());
        setIsAlreadySubscribed(true);
        // Call legacy onSubmit if provided for backward compatibility
        if (onSubmit) {
          onSubmit(email);
        }
      } else {
        toast.error(data.error || t('footer.newsletter.errors.generalError'));
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(t('footer.newsletter.errors.subscriptionError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show newsletter if user is logged in (any status)
  if (user) {
    // Special message for pending users
    if (user.status === 'PENDING') {
      return (
        <div className="border-t border-gray-200/60 py-6">
          <div className="p-2 md:p-4 w-full">
            <div className="mx-auto text-center max-w-md">
              <p className="text-gray-600 text-sm leading-relaxed">
                {t('footer.newsletter.pendingMessage')}
              </p>
            </div>
          </div>
        </div>
      );
    }
    // For all other logged in users (ACTIVE, etc.), don't show newsletter
    return null;
  }

  // Show message if already subscribed
  if (isAlreadySubscribed) {
    return (
      <div className="border-t border-gray-200 py-8">
        <div className="p-2 md:p-6 w-full">
          <div className="mx-auto text-center">
            <p className="text-green-600 font-medium">{t('footer.newsletter.alreadySubscribed')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 py-8">
      <div className="p-2 md:p-6 w-full">
        <div className=" mx-auto text-center md:text-left flex justify-between items-center flex-col md:flex-row">
          <div className="flex items-center md:items-start justify-center flex-col mb-8 md:mb-0">
            <h3 className="text-gray-900 font-medium text-lg">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
          <form onSubmit={handleSubmit} className="flex items-center space-x-3 w-full max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
            <Button type="submit" className="px-4 py-2 text-white" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loading text="" size="sm" variant="spinner" theme="white" />
              ) : (
                buttonText
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
