'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface AdminTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: ReactNode;
  hasUnsavedChanges?: boolean;
}

export default function AdminTabs({
  tabs,
  activeTab,
  onTabChange,
  children,
  hasUnsavedChanges = false,
}: AdminTabsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">{children}</div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-sm text-yellow-800 font-medium">You have unsaved changes</span>
          </div>
        </div>
      )}
    </div>
  );
}
