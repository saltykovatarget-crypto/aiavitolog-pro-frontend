import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

interface DocumentsUpsellModalProps {
  open: boolean;
  onClose: () => void;
  onGoToPricing: () => void;
}

export function DocumentsUpsellModal({ open, onClose, onGoToPricing }: DocumentsUpsellModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent
        className="max-w-md"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Анализ документов</DialogTitle>
          <DialogDescription>
            Загрузка и анализ документов доступны на тарифах Профессиональный и Агентский.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">На тарифах Free и Базовый функция недоступна.</p>

        <DialogFooter className="mt-2">
          <Button onClick={onGoToPricing} className="w-full">Перейти к тарифам</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
