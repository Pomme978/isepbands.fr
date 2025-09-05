'use client';

import { useState } from 'react';
import { X, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';

interface ArchiveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => Promise<void>;
  title: string;
  description: string;
  itemName: string;
}

export default function ArchiveConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
}: ArchiveConfirmModalProps) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(reason || undefined);
      handleClose();
    } catch (error) {
      console.error('Error archiving:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Archive className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)]">
          {/* Item Info */}
          <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs sm:text-sm text-orange-800 break-words">
              <strong>Élément à archiver :</strong> {itemName}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 mb-4">{description}</p>

          {/* Optional Reason Field */}
          <div className="mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Raison de l&apos;archivage (optionnelle)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none text-xs sm:text-sm"
              placeholder="Expliquez pourquoi vous archivez cet élément..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loading size="sm" />
                  <span className="ml-2">Archivage...</span>
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4 mr-2" />
                  Archiver
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
