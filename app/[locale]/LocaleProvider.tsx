"use client";

import React, { createContext } from "react";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

// 1) Autoriser les objets imbriqués
type Messages = Record<string, any>;

export const TranslationContext = createContext<{
  t: (key: string, vars?: Record<string, string>) => string;
}>({
  t: (key) => key,
});

// deep getter "a.b.c"
function deepGet(obj: any, path: string) {
  return path.split(".").reduce((acc, k) => (acc != null ? acc[k] : undefined), obj);
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function LocaleProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const messagesMap: Record<string, Messages> = { en, fr };
  const messages = messagesMap[locale] || messagesMap.fr;

  const t = (key: string, vars?: Record<string, string>) => {
    const val = deepGet(messages, key);
    let text = typeof val === "string" ? val : key;

    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(new RegExp(`\\{${escapeRegExp(k)}\\}`, "g"), v);
      }
    }
    return text;
  };

  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
}