'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  monthName: string;
  year: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  canGoPrevious?: boolean;
}

export default function CalendarHeader({
  monthName,
  year,
  onPreviousMonth,
  onNextMonth,
  canGoPrevious = true,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <button
        onClick={onPreviousMonth}
        disabled={!canGoPrevious}
        className={`
          p-2 transition-colors rounded-md
          ${
            canGoPrevious
              ? 'text-white hover:text-gray-300 hover:bg-white/10'
              : 'text-gray-600 cursor-not-allowed'
          }
        `}
        aria-label="Previous month"
      >
        <ChevronLeft size={24} />
      </button>

      <h2 className="font-press-start-2p text-white text-lg md:text-xl lg:text-2xl text-center">
        {monthName} {year}
      </h2>

      <button
        onClick={onNextMonth}
        className="p-2 text-white hover:text-gray-300 transition-colors rounded-md hover:bg-white/10"
        aria-label="Next month"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
