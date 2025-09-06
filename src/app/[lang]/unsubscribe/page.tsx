'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Mail, ArrowRight } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import { toast } from 'sonner';
import LangLink from '@/components/common/LangLink';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [alreadyUnsubscribed, setAlreadyUnsubscribed] = useState(false);

  // Auto-désabonnement si email et token dans URL
  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');

    if (emailParam && tokenParam) {
      handleAutoUnsubscribe(emailParam, tokenParam);
    }
  }, [searchParams]);

  const handleAutoUnsubscribe = async (emailParam: string, tokenParam: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/newsletter/unsubscribe?email=${encodeURIComponent(emailParam)}&token=${encodeURIComponent(tokenParam)}`);
      const data = await response.json();

      if (data.success) {
        setUnsubscribed(true);
        setEmail(emailParam);
        if (data.alreadyUnsubscribed) {
          setAlreadyUnsubscribed(true);
        }
        toast.success(data.message);
      } else {
        setError(data.error || 'Erreur lors du désabonnement');
        toast.error(data.error || 'Erreur lors du désabonnement');
      }
    } catch (err) {
      setError('Erreur de connexion');
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleManualUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Veuillez entrer un email valide');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setUnsubscribed(true);
        if (data.alreadyUnsubscribed) {
          setAlreadyUnsubscribed(true);
        }
        toast.success(data.message);
      } else {
        setError(data.error || 'Erreur lors du désabonnement');
        toast.error(data.error || 'Erreur lors du désabonnement');
      }
    } catch (err) {
      setError('Erreur de connexion');
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loading text="Traitement en cours..." size="lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (unsubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">
              {alreadyUnsubscribed ? 'Déjà désabonné(e)' : 'Désabonnement confirmé'}
            </CardTitle>
            <CardDescription>
              {alreadyUnsubscribed 
                ? `L'adresse ${email} était déjà désabonnée de notre newsletter.`
                : `L'adresse ${email} a été désabonnée avec succès.`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Vous ne recevrez plus nos newsletters. Si vous changez d'avis, 
              vous pouvez toujours vous réabonner sur notre site.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <LangLink href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Retour au site
                </Button>
              </LangLink>
              <LangLink href="/#newsletter" className="flex-1">
                <Button className="w-full">
                  Se réabonner
                </Button>
              </LangLink>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">Se désabonner</CardTitle>
          <CardDescription>
            Nous sommes désolés de vous voir partir. Entrez votre email pour vous désabonner 
            de la newsletter ISEP Bands.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManualUnsubscribe} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre-email@example.com"
                required
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <XCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loading text="Désabonnement..." size="sm" variant="spinner" theme="white" />
              ) : (
                <>
                  Se désabonner
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              En vous désabonnant, vous ne recevrez plus nos newsletters mais votre compte membre 
              (si vous en avez un) restera actif.
            </p>
          </div>

          <div className="mt-4 text-center">
            <LangLink href="/" className="text-sm text-purple-600 hover:text-purple-700">
              Retour au site
            </LangLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}