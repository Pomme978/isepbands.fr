'use client';

import { Save, X, AlertTriangle } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  onDiscard: () => void;
  saving?: boolean;
  title?: string;
  message?: string;
}

export default function UnsavedChangesModal({
  isOpen,
  onClose,
  onSave,
  onDiscard,
  saving = false,
  title = 'Unsaved Changes',
  message = 'You have unsaved changes. What would you like to do?',
}: UnsavedChangesModalProps) {
  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      await onSave();
    } catch (error) {
      console.error('Error saving:', error);
      // Keep modal open if save fails
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onDiscard}
            disabled={saving}
            className="px-4 py-2 text-sm text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4 mr-2" />
            Discard Changes
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save & Continue
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
