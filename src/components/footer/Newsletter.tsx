// Newsletter.tsx
'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import Loading from '@/components/ui/Loading';
import { toast } from 'sonner';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Veuillez entrer votre email');
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
        toast.success(data.message || 'Inscription réussie !');
        setEmail('');
        // Call legacy onSubmit if provided for backward compatibility
        if (onSubmit) {
          onSubmit(email);
        }
      } else {
        toast.error(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
}
