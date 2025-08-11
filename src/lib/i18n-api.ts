import { getI18n, getCurrentLocale } from '@/locales/server';
import type { ApiErrorKey } from '@/types/i18n-api-error-keys';

export const SUPPORTED_LANGS = ['fr', 'en'];
export const DEFAULT_LANG = 'fr';

export async function getErrorMessage(
  key: ApiErrorKey,
  lang?: string,
  params?: Record<string, string | number>,
): Promise<string> {
  let locale = lang;
  if (!locale || !SUPPORTED_LANGS.includes(locale)) {
    try {
      locale = await getCurrentLocale();
    } catch {
      locale = DEFAULT_LANG;
    }
  }
  const t = await getI18n();
  const tString: (key: string) => string = t as unknown as (key: string) => string;
  let message = tString(['api', 'errors', key].join('.'));
  if (!message || message === ['api', 'errors', key].join('.')) {
    message = tString('api.errors.unknown');
  }
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      message = message.replace(new RegExp(`{${k}}`, 'g'), String(v));
    });
  }
  return message;
}

export function detectLangFromRequest(
  req: Request | { headers: { get: (name: string) => string | null } },
): string {
  const acceptLang = req.headers.get('accept-language') || '';
  const cookieLang = req.headers.get('cookie')?.match(/NEXT_LOCALE=([a-zA-Z-]+)/)?.[1];
  if (cookieLang && SUPPORTED_LANGS.includes(cookieLang)) return cookieLang;
  const preferred = SUPPORTED_LANGS.find((l) => acceptLang.startsWith(l));
  return preferred || DEFAULT_LANG;
}
