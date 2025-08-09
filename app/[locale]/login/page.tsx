// app/[locale]/login/page.tsx
import type { Metadata } from 'next';
import { getI18n, getStaticParams } from '../../../locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import LoginForm from './LoginForm'; 

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params; 
  setStaticParamsLocale(locale);
  const t = await getI18n();
  
  return {
    title: `${t('auth.login.button')} | ISEPBANDS`,
  };
}


export function generateStaticParams() {
  return getStaticParams();
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  
  return (
    <LoginForm locale={locale} /> 
  );
}