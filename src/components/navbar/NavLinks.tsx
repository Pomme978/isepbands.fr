'use client';

import { usePathname } from 'next/navigation';
import LangLink from '../common/LangLink';
import { Button } from '../ui/button';

const links = [
  { label: 'Accueil', href: '/' },
  { label: "L'Association", href: '/asso' },
  { label: 'Bands', href: '/bands' },
  { label: 'Les Événements', href: '/events' },
  { label: 'Le Bureau', href: '/team' },
];

export default function NavLinks() {
  const pathname = usePathname();

  // Remove language prefix from pathname (/fr/bands -> /bands)
  const cleanPathname = pathname.replace(/^\/[a-z]{2}/, '') || '/';

  return (
    <div className="flex gap-2 md:flex-row flex-col w-full md:w-auto">
      {links.map((link) => {
        const isActive = cleanPathname === link.href;

        return (
          <Button
            key={link.href}
            asChild
            variant="ghost"
            className={`px-3 py-2 text-sm w-full md:w-auto justify-start md:justify-center transition-colors ${
              isActive
                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <LangLink href={link.href}>{link.label}</LangLink>
          </Button>
        );
      })}
    </div>
  );
}
