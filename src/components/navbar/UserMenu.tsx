'use client';

import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useSession, useAuth } from '../../lib/auth-client';
import { useRouter } from 'next/navigation';
import LangLink from '../common/LangLink';

export default function UserMenu() {
  const { user } = useSession();
  const { signOut } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex items-center gap-2 md:flex-row flex-col w-full md:w-auto">
        <LangLink
          href="/login"
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition w-full md:w-auto text-center"
        >
          Se connecter
        </LangLink>
        <LangLink
          href="/register"
          className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 border border-primary transition w-full md:w-auto text-center"
        >
          Rejoindre
        </LangLink>
      </div>
    );
  }

  const displayName = (user.email || '').replace(/\b([a-z])/g, (c: string) => c.toUpperCase());
  const band = user.band;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer select-none">
          <Avatar>
            <AvatarFallback>{displayName[0] || user.email[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-end">
            <span className="font-semibold text-sm text-gray-900">{displayName}</span>
            {band && <span className="text-xs text-gray-500">{band}</span>}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Mon profil</DropdownMenuItem>
        <DropdownMenuItem>Mon espace groupe</DropdownMenuItem>
        <DropdownMenuItem>Tableau de bord admin</DropdownMenuItem>
        <DropdownMenuItem>Paramètres</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut(() => router.push('/login'))}>
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
