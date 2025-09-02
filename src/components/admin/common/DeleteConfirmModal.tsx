'use client';

import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  itemName: string;
  confirmButtonText?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  confirmButtonText = 'Supprimer',
}: DeleteConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Item Info */}
          <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-800">
              <strong>Élément à supprimer :</strong> {itemName}
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-6">{description}</p>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loading size="sm" />
                  <span className="ml-2">Suppression...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {confirmButtonText}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}