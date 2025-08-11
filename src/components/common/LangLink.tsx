'use client';
import Link, { LinkProps } from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';

interface LangLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

export default function LangLink({ href, className, children, ...props }: LangLinkProps) {
  const params = useParams();
  const lang =
    typeof params?.lang === 'string'
      ? params.lang
      : Array.isArray(params?.lang)
        ? params.lang[0]
        : 'fr';

  let finalHref = href;
  if (typeof href === 'string') {
    if (!href.startsWith(`/${lang}`)) {
      finalHref = `/${lang}${href.startsWith('/') ? href : '/' + href}`;
    }
  } else if (typeof href === 'object' && typeof href.pathname === 'string') {
    if (!href.pathname.startsWith(`/${lang}`)) {
      finalHref = {
        ...href,
        pathname: `/${lang}${href.pathname.startsWith('/') ? href.pathname : '/' + href.pathname}`,
      };
    }
  }

  return (
    <Link href={finalHref} {...props} className={className}>
      {children}
    </Link>
  );
}
