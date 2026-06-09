import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface ModalNameChatProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void | Promise<void>;
  initialMessage?: string;
  isSaving?: boolean;
}

export function ModalNameChat({ isOpen, onClose, onConfirm, initialMessage = '', isSaving }: ModalNameChatProps) {
  const [chatName, setChatName] = useState('');

  const handleConfirm = async () => {
    if (isSaving) return;
    const trimmed = chatName.trim();
    if (!trimmed) {
      return;
    }

    try {
      await onConfirm(trimmed);
      setChatName('');
    } catch (error) {
      // Ошибку обрабатывает вызывающая сторона; оставляем имя для повторной попытки
    }
  };

  const generateChatName = () => {
    if (initialMessage) {
      // Generate a simple name from the first message
      const truncated = initialMessage.slice(0, 40);
      return truncated.length < initialMessage.length ? truncated + '...' : truncated;
    }
    return '';
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setChatName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void handleConfirm();
    }
  };

  React.useEffect(() => {
    if (isOpen && initialMessage && !chatName) {
      setChatName(generateChatName());
    }
  }, [isOpen, initialMessage]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[320px] p-6 bg-card border-border shadow-card rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-center mb-2">Название чата</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Введите название для нового чата
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Введите название"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full bg-input-background border-border"
            autoFocus
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              onClick={() => { void handleConfirm(); }}
              className="flex-1"
              disabled={!chatName.trim() || isSaving}
            >
              Ок
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}