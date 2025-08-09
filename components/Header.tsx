"use client";

import Link from "next/link";
import { useState, useContext } from "react"
import { Button } from "@/components/ui/Button"
import { useI18n, useScopedI18n } from '../locales/client'

interface HeaderProps {
  session: any;
  locale: string;
}

export default function Header({ session, locale }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const t = useI18n()

  return (
    <header className="p-4 bg-gray-100 flex justify-between items-center">
      <nav className="flex gap-4">
        <Link href={`/${locale}/`} className="hover:underline">
          {t('navigation.home')}
        </Link>
      </nav>

      <div className="relative">
        {!session ? (
          <Button asChild>
            <Link href={`/${locale}/login`}>
              {t('auth.login.button')}
            </Link>
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              {session.user?.name || session.user?.email}
            </Button>

            {dropdownOpen && (
              <ul
                className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10"
                role="menu"
              >
                <li>
                  <Link
                    href={`/${locale}/profile`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {t('user.profile')}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/logout`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {t('auth.logOut')}
                  </Link>
                </li>
              </ul>
            )}
          </>
        )}
      </div>
    </header>
  );
}