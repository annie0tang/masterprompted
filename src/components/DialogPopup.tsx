import React from 'react';
import { Dialog, DialogClose, DialogFooter, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const DialogPopup: React.FC<DialogPopupProps> = ({
  isOpen,
  onClose,
  title,
  description,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-foreground">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
            {secondaryAction && (
              <Button
                variant="outline"
                onClick={secondaryAction.onClick}
                className="w-full sm:w-auto"
              >
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                onClick={primaryAction.onClick}
                className="w-full sm:w-auto"
              >
                {primaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPopup;