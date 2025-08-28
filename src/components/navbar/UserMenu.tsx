'use client';

import { Button } from '@/components/ui/button';
import Avatar from '../common/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useSession, useAuth } from '@/lib/auth-client';
import { useRouter, useParams } from 'next/navigation';

export default function UserMenu() {
  const { user } = useSession();
  const { signOut } = useAuth();
  const router = useRouter();
  const params = useParams();

  // Get the current language from params (assuming it's stored as 'lang' or 'locale')
  const currentLang = params?.lang || params?.locale || 'fr'; // default to 'fr' if not found

  if (!user) {
    return (
      <div className="flex items-center justify-end h-10 min-w-0 flex-shrink-0">
        <Button variant="default" size="sm" asChild>
          <a href={`/${currentLang}/login`}>Se connecter</a>
        </Button>
      </div>
    );
  }

  // Get display name from first/last name, fallback to formatted email
  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : (user.email || '').replace(/\b([a-z])/g, (c: string) => c.toUpperCase());
  const band = user.band;

  const handleProfileClick = () => {
    router.push(`/${currentLang}/profile`);
  };

  const handleSettingsClick = () => {
    router.push(`/${currentLang}/profile/settings`);
  };

  const handleAdminClick = () => {
    router.push(`/${currentLang}/admin`);
  };

  const handleGroupSpaceClick = () => {
    // Assuming you have a group space route
    router.push(`/${currentLang}/group`);
  };

  const handleSignOut = () => {
    signOut(() => router.push(`/${currentLang}/login`));
  };

  return (
    <div className="flex items-center justify-end h-10 min-w-0 flex-shrink-0">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 h-10">
            <div className="flex flex-col items-end min-w-0">
              <span className="font-semibold text-sm text-gray-900 truncate max-w-[120px] leading-tight">
                {displayName}
              </span>
              {band && (
                <span className="text-xs text-gray-500 truncate max-w-[120px] leading-tight">
                  {band}
                </span>
              )}
            </div>
            <Avatar
              src={user.photoUrl}
              alt={displayName}
              name={displayName}
              size="sm"
              className="flex-shrink-0"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-60 z-[500] border-0 rounded-none !rounded-b-lg"
          sideOffset={0}
          alignOffset={-24}
          avoidCollisions={true}
          side="bottom"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfileClick}>Mon profil</DropdownMenuItem>
          <DropdownMenuItem onClick={handleGroupSpaceClick}>Mon espace groupe</DropdownMenuItem>
          <DropdownMenuItem onClick={handleAdminClick}>Tableau de bord admin</DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettingsClick}>Paramètres</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>Se déconnecter</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
