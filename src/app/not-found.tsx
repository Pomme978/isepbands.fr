'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Music, Guitar, Mic, Piano, Drum, Volume2, Home } from 'lucide-react';
import LangLink from '@/components/common/LangLink';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentNote, setCurrentNote] = useState(0);

  useEffect(() => {
    const segments = pathname.split('/');
    if (segments[1] !== 'fr' && segments[1] !== 'en') {
      let lang = 'fr';
      if (typeof window !== 'undefined') {
        const navLang = navigator.language.split('-')[0];
        lang = ['fr', 'en'].includes(navLang) ? navLang : 'fr';
      }
      router.replace(`/${lang}${pathname.startsWith('/') ? pathname : '/' + pathname}`);
    }
  }, [pathname, router]);

  // Animation des notes de musique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNote((prev) => (prev + 1) % 8);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const instruments = [
    { icon: Guitar, delay: '0s', color: 'text-primary' },
    { icon: Piano, delay: '0.2s', color: 'text-secondary' },
    { icon: Mic, delay: '0.4s', color: 'text-primary' },
    { icon: Drum, delay: '0.6s', color: 'text-secondary' },
    { icon: Volume2, delay: '0.8s', color: 'text-primary' },
  ];

  const musicalNotes = ['♪', '♫', '♪', '♬', '♩', '♫', '♪', '♬'];

  const funnyMessages = [
    'Cette page a quitté le groupe...',
    'Erreur 404: Note non trouvée',
    "Cette mélodie n'existe pas encore",
    'La partition est incomplète',
    "Ce riff n'est pas dans notre répertoire",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/10 flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* 404 with animated instruments */}
        <div className="mb-8 relative">
          <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary mb-4 relative">
            4
            <span className="inline-block mx-4 relative">
              <span className="text-transparent">0</span>
              <div className="absolute inset-0 flex items-center justify-center">
                {instruments.map((instrument, index) => {
                  const Icon = instrument.icon;
                  return (
                    <Icon
                      key={index}
                      className={`h-16 w-16 ${instrument.color} animate-spin absolute`}
                      style={{
                        animationDelay: instrument.delay,
                        animationDuration: '4s',
                        transform: `rotate(${index * 72}deg) translateY(-30px) rotate(-${index * 72}deg)`,
                      }}
                    />
                  );
                })}
              </div>
            </span>
            4
          </div>

          {/* Animated wave line */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-gradient-to-t from-primary to-secondary rounded-full transition-all duration-300 ${
                    Math.abs(i - currentNote * 2.5) < 2
                      ? 'h-8'
                      : Math.abs(i - currentNote * 2.5) < 4
                        ? 'h-6'
                        : 'h-3'
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Error message */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 animate-pulse">
            {funnyMessages[Math.floor(Date.now() / 3000) % funnyMessages.length]}
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
            Il semblerait que cette page ait fait une fausse note.
            <br />
            <span className="text-sm italic">
              Mais ne t&apos;inquiète pas, on va retrouver le bon accord !
            </span>
          </p>
        </div>

        {/* Action button */}
        <div className="flex justify-center">
          <LangLink href="/fr">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <Home className="w-5 h-5 mr-2" />
              Retour à l&apos;accueil
            </Button>
          </LangLink>
        </div>

        {/* Fun fact */}
        <div className="mt-12 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/20 max-w-lg mx-auto">
          <Music className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="text-sm text-gray-700 italic">
            &quot;En musique, même les erreurs peuvent créer de belles harmonies. Cette page 404 en
            est la preuve !&quot;
          </p>
          <p className="text-xs text-gray-500 mt-2">- L&apos;équipe ISEPBands</p>
        </div>
      </div>
    </div>
  );
}
