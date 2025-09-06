'use client';

import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitDisabled?: boolean;
  maxWidth?: string;
  className?: string;
}

export default function ItemModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  onCancel,
  submitLabel = "Sauvegarder",
  cancelLabel = "Annuler",
  isSubmitDisabled = false,
  maxWidth = "max-w-2xl",
  className = "max-h-[90vh] overflow-y-auto"
}: ItemModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${maxWidth} ${className}`}>
        <DialogHeader>
          <DialogTitle className="font-outfit">
            {title}
          </DialogTitle>
        </DialogHeader>

        {children}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitDisabled}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}