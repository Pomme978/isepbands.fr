'use client';
import { ReactNode } from 'react';
import BasicLayout from '@/components/layouts/BasicLayout';
import '../../styles/globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return <BasicLayout>{children}</BasicLayout>;
}
