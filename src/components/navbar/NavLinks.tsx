'use client';

import { usePathname } from 'next/navigation';
import LangLink from '../common/LangLink';
import { Button } from '../ui/button';

const links = [
  { label: 'Accueil', href: '/' },
  { label: "L'Association", href: '/club' },
  { label: 'Bands', href: '/bands' },
  { label: 'Les Événements', href: '/events' },
  { label: 'Le Bureau', href: '/team' },
];

interface NavLinksProps {
  variant?: 'default' | 'white';
}

export default function NavLinks({ variant = 'default' }: NavLinksProps) {
  const pathname = usePathname();

  // Remove language prefix from pathname (/fr/bands -> /bands)
  const cleanPathname = pathname.replace(/^\/[a-z]{2}/, '') || '/';

  return (
    <div className="flex gap-2 md:flex-row flex-col w-full md:w-auto">
      {links.map((link) => {
        const isActive = cleanPathname === link.href;

        const buttonClasses =
          variant === 'white'
            ? `px-3 py-2 text-sm w-full md:w-auto justify-start md:justify-center transition-colors text-white ${
                isActive
                  ? 'bg-white/20 hover:bg-white/30'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            : `px-3 py-2 text-sm w-full md:w-auto justify-start md:justify-center transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary hover:bg-primary/20'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`;

        return (
          <Button key={link.href} asChild variant="ghost" className={buttonClasses}>
            <LangLink href={link.href}>{link.label}</LangLink>
          </Button>
        );
      })}
    </div>
  );
}
