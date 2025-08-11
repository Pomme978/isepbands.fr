import LangLink from '../common/LangLink';
import { Button } from '../ui/button';

const links = [
  { label: 'Accueil', href: '/' },
  { label: "L'Association", href: '/association' },
  { label: 'Bands', href: '/bands' },
  { label: 'Les Événements', href: '/evenements' },
];

export default function NavLinks() {
  return (
    <div className="flex gap-2">
      {links.map((link) => (
        <Button key={link.href} asChild variant="ghost" className="px-3 py-2 text-base font-medium">
          <LangLink href={link.href}>{link.label}</LangLink>
        </Button>
      ))}
    </div>
  );
}
