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
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';

interface UserMenuProps {
  variant?: 'default' | 'white';
}

export default function UserMenu({ variant = 'default' }: UserMenuProps) {
  const { user } = useSession();
  const { signOut } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get the current language from params (assuming it's stored as 'lang' or 'locale')
  const currentLang = params?.lang || params?.locale || 'fr'; // default to 'fr' if not found

  if (!user) {
    return (
      <div className="flex items-center justify-end h-10 min-w-0 flex-shrink-0">
        <Button
          variant={variant === 'white' ? 'outline' : 'default'}
          size="sm"
          asChild
          className={
            variant === 'white'
              ? 'border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/60 hover:text-white'
              : ''
          }
        >
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

  // Check if user has admin permissions (based on role weight >= 70)
  const isAdmin =
    user.isRoot || user.isFullAccess || user.roles?.some((userRole) => userRole.role.weight >= 70);

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

  const handleSignOut = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push(`/${currentLang}/login`);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const triggerClasses =
    variant === 'white'
      ? 'flex items-center gap-3 p-1 rounded-md hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 h-10'
      : 'flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 h-10';

  const nameClasses =
    variant === 'white'
      ? 'font-semibold text-sm text-white truncate max-w-[120px] leading-tight'
      : 'font-semibold text-sm text-gray-900 truncate max-w-[120px] leading-tight';

  const bandClasses =
    variant === 'white'
      ? 'text-xs text-white/60 truncate max-w-[120px] leading-tight'
      : 'text-xs text-gray-500 truncate max-w-[120px] leading-tight';

  return (
    <div className="flex items-center justify-end h-10 min-w-0 flex-shrink-0">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className={triggerClasses}>
            <div className="flex flex-col items-end min-w-0">
              <span className={nameClasses}>{displayName}</span>
              {band && <span className={bandClasses}>{band}</span>}
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
          className="w-60 z-50 border-0 rounded-none !rounded-b-lg"
          sideOffset={0}
          alignOffset={-24}
          avoidCollisions={true}
          side="bottom"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
            Mon profil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleGroupSpaceClick} className="cursor-pointer">
            Mon espace groupe
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem onClick={handleAdminClick} className="cursor-pointer">
              Tableau de bord admin
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
            Paramètres
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-red-600 focus:text-red-600 hover:bg-red-50"
          >
            <div className="flex items-center space-x-2">
              {isLoggingOut && <Spinner size="sm" color="gray" />}
              <span>{isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
