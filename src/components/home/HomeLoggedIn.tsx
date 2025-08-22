'use client';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';
import LangLink from '@/components/common/LangLink';
import { User } from 'next-auth';

interface HomeLoggedInProps {
  user: User;
  lang: string;
  onLogout: () => Promise<void>;
  loading: boolean;
}

export default function HomeLoggedIn({ user, lang, onLogout, loading }: HomeLoggedInProps) {
  const t = useI18n();

  return (
    <div className="bg-gray-100 w-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center flex-col">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bonjour {user.name || user.email} ! 👋
        </h1>
        <p className="text-gray-700 text-center mb-4">Bienvenue sur votre tableau de bord</p>
        <p className="text-gray-600 text-center mb-6 max-w-2xl">
          Vous êtes maintenant connecté et pouvez accéder à toutes vos fonctionnalités
          personnalisées.
        </p>

        {/* Actions rapides */}
        <div className="flex gap-4 mb-6">
          <Button asChild>
            <LangLink href={`/${lang}/dashboard`}>Tableau de bord</LangLink>
          </Button>
          <Button variant="outline" asChild>
            <LangLink href={`/${lang}/profile`}>Mon profil</LangLink>
          </Button>
        </div>

        {/* Section déconnexion */}
        <div className="pt-4 border-t border-gray-300">
          <Button type="button" variant="destructive" onClick={onLogout} disabled={loading}>
            {loading ? 'Déconnexion...' : t('auth.logOut')}
          </Button>
        </div>
      </div>
    </div>
  );
}
