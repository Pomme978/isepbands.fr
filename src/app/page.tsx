import { redirect } from 'next/navigation';

declare global {
  var headers: Headers | undefined;
}

const SUPPORTED_LANGS = ['fr', 'en'];

function detectLocale(headers: Headers): string {
  const acceptLang = headers.get('accept-language');
  if (!acceptLang) return 'fr';
  const preferred = acceptLang.split(',')[0].split('-')[0];
  return SUPPORTED_LANGS.includes(preferred) ? preferred : 'fr';
}

export default function Page() {
  if (typeof window === 'undefined') {
    const headers = globalThis.headers as Headers | undefined;
    const lang = headers ? detectLocale(headers) : 'fr';
    redirect(`/${lang}`);
  } else {
    const lang = navigator.language.split('-')[0];
    window.location.replace(`/${SUPPORTED_LANGS.includes(lang) ? lang : 'fr'}`);
    return null;
  }
}
