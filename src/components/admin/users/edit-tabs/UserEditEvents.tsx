'use client';

import { Calendar } from 'lucide-react';

export default function UserEditEvents() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Events Management</h3>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="flex flex-col items-center">
          <Calendar className="w-12 h-12 text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Events Management</h4>
          <p className="text-gray-600 max-w-sm">
            This section will show the user&apos;s complete event participation history, including
            concerts, jam sessions, rehearsals, and other association events with attendance
            tracking.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Coming with the EVENTS module (October 15, 2025)
          </div>
        </div>
      </div>
    </div>
  );
}
