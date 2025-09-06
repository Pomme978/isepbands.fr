'use client';

import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import LangLink from '@/components/common/LangLink';
import Avatar from '@/components/common/Avatar';
import AdminButton from './AdminButton';

interface ItemInfo {
  avatar?: string;
  title: string;
  subtitle: string;
  currentUserId?: string;
  itemId?: string;
}

interface ActionButton {
  label: string;
  mobileLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
}

interface Tab {
  id: string;
  label: string;
  mobileLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminDetailLayoutProps {
  backHref: string;
  backLabel?: string;
  backMobileLabel?: string;
  itemInfo: ItemInfo;
  warningBanners?: ReactNode[];
  primaryActions?: ActionButton[];
  secondaryActions?: ActionButton[];
  conditionalActions?: ActionButton[];
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children: ReactNode;
  hasUnsavedChanges?: boolean;
  unsavedChangesLabel?: string;
  className?: string;
}

export default function AdminDetailLayout({
  backHref,
  backLabel = 'Back',
  backMobileLabel,
  itemInfo,
  warningBanners = [],
  primaryActions = [],
  secondaryActions = [],
  conditionalActions = [],
  tabs = [],
  activeTab,
  onTabChange,
  children,
  hasUnsavedChanges = false,
  unsavedChangesLabel = 'You have unsaved changes',
  className = '',
}: AdminDetailLayoutProps) {
  const displayBackLabel = backMobileLabel || backLabel;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Warning Banners */}
      {warningBanners.map((banner, index) => (
        <div key={index}>{banner}</div>
      ))}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <LangLink
            href={backHref}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">{backLabel}</span>
            <span className="sm:hidden">{displayBackLabel}</span>
          </LangLink>

          <div className="flex items-center space-x-3">
            {itemInfo.avatar && (
              <Avatar
                src={itemInfo.avatar}
                name={itemInfo.title}
                size="md"
                className="flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                {itemInfo.title}
                {itemInfo.currentUserId && itemInfo.itemId && itemInfo.currentUserId === itemInfo.itemId && (
                  <span className="text-sm sm:text-lg font-normal text-blue-600 ml-2">(moi)</span>
                )}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 truncate">
                {itemInfo.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-2">
          {/* Secondary Actions */}
          {secondaryActions.length > 0 && (
            <div className="flex flex-wrap items-center justify-stretch sm:justify-start gap-2">
              {secondaryActions.map((action, index) => (
                <AdminButton
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant || 'secondary'}
                  size={action.size || 'sm'}
                  icon={action.icon}
                  disabled={action.disabled}
                  loading={action.loading}
                  loadingText={action.loadingText}
                  className={`flex-1 sm:flex-none ${action.className || ''}`}
                >
                  <span className="hidden sm:inline">{action.label}</span>
                  <span className="sm:hidden">{action.mobileLabel || action.label}</span>
                </AdminButton>
              ))}
            </div>
          )}

          {/* Conditional Actions */}
          {conditionalActions.length > 0 && (
            <div className="flex flex-wrap items-center justify-stretch sm:justify-start gap-2">
              {conditionalActions.map((action, index) => (
                <AdminButton
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant || 'secondary'}
                  size={action.size || 'sm'}
                  icon={action.icon}
                  disabled={action.disabled}
                  loading={action.loading}
                  loadingText={action.loadingText}
                  className={`flex-1 sm:flex-none ${action.className || ''}`}
                >
                  <span className="hidden sm:inline">{action.label}</span>
                  <span className="sm:hidden">{action.mobileLabel || action.label}</span>
                </AdminButton>
              ))}
            </div>
          )}

          {/* Primary Actions */}
          {primaryActions.length > 0 && (
            <div className="flex flex-wrap items-center justify-stretch sm:justify-start gap-2">
              {primaryActions.map((action, index) => (
                <AdminButton
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant || 'primary'}
                  size={action.size || 'sm'}
                  icon={action.icon}
                  disabled={action.disabled}
                  loading={action.loading}
                  loadingText={action.loadingText}
                  className={`w-full sm:w-auto ${action.className || ''}`}
                >
                  <span className="hidden sm:inline">{action.label}</span>
                  <span className="sm:hidden">{action.mobileLabel || action.label}</span>
                </AdminButton>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      {tabs && tabs.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-4 sm:py-4 text-sm sm:text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 min-h-[52px] ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.mobileLabel || tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">{children}</div>
        </div>
      ) : (
        /* Content without tabs */
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          {children}
        </div>
      )}

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 shadow-lg z-40">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse flex-shrink-0" />
            <span className="text-xs sm:text-sm text-yellow-800 font-medium">
              {unsavedChangesLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}