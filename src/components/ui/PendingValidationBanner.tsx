import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './dialog';
import { Button } from './button';

interface PendingValidationBannerProps {
  name?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const PendingValidationBanner: React.FC<PendingValidationBannerProps> = ({
  name,
  open = true,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Compte en attente de validation</DialogTitle>
          <DialogDescription>
            {name ? (
              <>
                Bonjour {name}, votre compte est en attente de validation par l&apos;administration.
                <br />
                Vous recevrez un email dès qu&apos;il sera activé.
              </>
            ) : (
              <>
                Votre compte est en attente de validation par l&apos;administration. Vous recevrez
                <br />
                un email dès qu&apos;il sera activé.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="default">OK</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PendingValidationBanner;
