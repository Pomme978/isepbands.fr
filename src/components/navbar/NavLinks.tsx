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
  return (
    <div className="flex gap-2 md:flex-row flex-col w-full md:w-auto">
      {links.map((link) => (
        <Button
          key={link.href}
          asChild
          variant="ghost"
          className="px-3 py-2 text-md w-full md:w-auto justify-start md:justify-center"
        >
          <LangLink href={link.href}>{link.label}</LangLink>
        </Button>
      ))}
    </div>
  );
}
