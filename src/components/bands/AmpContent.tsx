'use client';

import { ReactNode } from 'react';

interface AmpContentProps {
  children: ReactNode;
}

export default function AmpContent({ children }: AmpContentProps) {
  return (
    <div className="w-full py-6 md:py-8 overflow-x-hidden" style={{ backgroundColor: '#1F2937' }}>
      <div className="w-full max-w-7xl mx-auto px-3 md:px-4">
        <div
          className="w-full min-h-[200px] p-6 md:p-8 rounded-2xl flex justify-center items-center flex-col overflow-x-hidden"
          style={{ backgroundColor: '#F9FAFB' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
