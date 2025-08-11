import { LanguageSwitcher } from '../common/LanguageSwitcher';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur bg-white/80 border-b">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2 gap-8">
        <Logo />
        <div className="flex-1 flex justify-center">
          <NavLinks />
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <UserMenu />
        </div>
      </nav>
    </header>
  );
}
