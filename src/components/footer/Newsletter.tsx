// Newsletter.tsx
'use client';

import { useState } from 'react';
import { Button } from '../ui/button';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(email);
    }
    setEmail('');
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
          <Button type="submit" className="px-4 py-2 text-white">
            {buttonText}
          </Button>
        </form>
      </div>
    </div>
  );
}
