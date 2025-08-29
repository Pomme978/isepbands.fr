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
import { Clock, Sparkles, CheckCircle } from 'lucide-react';

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
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md bg-gradient-to-br from-primary/5 via-white to-primary/10 border border-primary/20"
      >
        <DialogHeader className="text-center pb-2">
          {/* Animated header with icons */}
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <Clock className="h-8 w-8 text-primary animate-pulse" />
              <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm opacity-70 animate-ping"></div>
            </div>
            <Sparkles className="h-6 w-6 text-primary animate-bounce" />
          </div>

          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            🎵 Validation en cours
          </DialogTitle>

          <DialogDescription className="text-center space-y-4 pt-4">
            <div className="text-lg font-medium text-gray-700">
              {name ? (
                <>
                  Bienvenue <span className="text-primary font-semibold">{name}</span> ! 🎸
                </>
              ) : (
                <>Bienvenue dans ISEP Bands ! 🎸</>
              )}
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20 text-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="font-medium">Votre inscription est en cours d&apos;examen</span>
              </div>
              <p className="text-sm">
                Notre équipe administrative valide actuellement votre profil pour rejoindre la
                communauté musicale.
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-primary font-medium">
                <span>Progression</span>
                <span>En cours...</span>
              </div>
              <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full animate-pulse w-2/3"></div>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>Notification par email à la validation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>Délai habituel : 2-3 jours ouvrés</span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button
              variant="default"
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Parfait, j&apos;ai compris ! ✨
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PendingValidationBanner;
