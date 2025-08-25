'use client';

import { Users } from 'lucide-react';

interface UserEditGroupsProps {
  userId: string;
}

export default function UserEditGroups({ userId }: UserEditGroupsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Groups Management</h3>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="flex flex-col items-center">
          <Users className="w-12 h-12 text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Groups Management</h4>
          <p className="text-gray-600 max-w-sm">
            This section will show the user's current and past group memberships, including their roles and administrative permissions within each group.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Coming with the BANDS module (September 25, 2025)
          </div>
        </div>
      </div>
    </div>
  );
}