import { useContext } from 'react';
import { LangContext } from '../contexts/LangContext';

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within a LangProvider');
  return ctx;
}
