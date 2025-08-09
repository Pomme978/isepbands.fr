import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

import { SessionProvider } from "@/components/SessionContext";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import '@/lib/fontawesome';
import '@fortawesome/fontawesome-svg-core/styles.css';

import LayoutWrapper from "./LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | ISEPBANDS',
    default: 'ISEPBANDS',
  },
  description: "Site web d'isep bands",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider session={session}>
          <LayoutWrapper session={session} locale={locale}>
            {children}
          </LayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}