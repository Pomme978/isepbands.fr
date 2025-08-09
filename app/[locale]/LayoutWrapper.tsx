'use client';

import { usePathname } from 'next/navigation';
import { I18nProviderClient } from '../../locales/client';
import Header from "../../components/Header";

interface LayoutWrapperProps {
  children: React.ReactNode;
  session: any;
  locale: string;
}

export default function LayoutWrapper({ children, session, locale }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Pages à exclure du header/footer principal
  const excludedPaths = ['/admin', '/login', '/register'];
  
  // Vérifie si on doit masquer le header et footer
  const shouldHideHeaderFooter = excludedPaths.some(path => 
    pathname.startsWith(path) || 
    pathname.includes(`/${path.slice(1)}`)
  );

  return (
    <I18nProviderClient locale={locale}>
      {!shouldHideHeaderFooter && <Header session={session} locale={locale} />}
      {children}
      {/* Footer ici si vous en avez un */}
    </I18nProviderClient>
  );
}