"use client";

import { useContext } from "react";
import { TranslationContext } from "./LocaleProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { handleSignOut } from "./actions";

import { LocaleProvider } from "./LocaleProvider";

export default function ClientComponent({
  locale,
  session,
}: {
  locale: string;
  session: any;
}) {
  const { t } = useContext(TranslationContext);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>{t("home.title")}</h1>
      <div className="text-center">
        {session ? (
          <>
            <p>{t("welcome", { name: session.user?.name || session.user?.email })}</p>
            <form action={handleSignOut}>
              <Button type="submit">{t("signOut")}</Button>
            </form>
          </>
        ) : (
          <Button asChild>
            <Link href={`/${locale}/login`}>{t("signIn")}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
