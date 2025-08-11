export interface LangContextProps {
  lang: string;
  setLang: (lang: string) => void;
}
import { createContext } from 'react';
export const LangContext = createContext<LangContextProps | undefined>(undefined);
