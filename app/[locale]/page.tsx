// app/[locale]/page.tsx (VERSION CORRIGÉE)
import { getI18n, getStaticParams } from '../../locales/server'
import { setStaticParamsLocale } from 'next-international/server'
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { handleSignOut } from "./actions";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>; // ✅ Promise pour Next.js 15+
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();
  
  return {
    title: t('navigation.home')+" | ISEPBANDS",
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  
  const t = await getI18n();

  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>{t("page.home.title")}</h1>
      <div className="text-center">
        {session ? (
          <>
            <p>{t("welcome", { name: session.user?.name || session.user?.email })}</p>
            <form action={handleSignOut}>
              <Button type="submit">{t("auth.logOut")}</Button>
            </form>
          </>
        ) : (
          <Button asChild>
            <Link href={`/${locale}/login`}>{t("auth.logIn")}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}