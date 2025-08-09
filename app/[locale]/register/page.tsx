// app/[locale]/register/page.tsx (SERVEUR - SIMPLE)
import type { Metadata } from 'next';
import { getI18n, getStaticParams } from '../../../locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import RegisterForm from './RegisterForm';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();
  
  return {
    title: `${t('auth.register.title_top')} | ISEPBANDS`,
  };
}

export function generateStaticParams() {
  return getStaticParams();
}

// ✅ Page serveur simple qui passe juste la locale
export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  
  return <RegisterForm locale={locale} />;
}