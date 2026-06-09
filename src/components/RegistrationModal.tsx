import React, { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ExternalLink, Loader2, Smartphone } from 'lucide-react';
import { QRCodeComponent } from './QRCodeComponent';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationComplete: () => void;
}

interface StartAuthResponse {
  auth_key: string;
  deeplink: string;
}

export function RegistrationModal({ isOpen, onClose, onRegistrationComplete }: RegistrationModalProps) {
  void onRegistrationComplete;
  const [deeplink, setDeeplink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthLink = useCallback(
    async (openBotAfter: boolean) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/session/telegram/start', {
          method: 'POST',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to start Telegram authentication');
        }

        const data: StartAuthResponse = await response.json();
        setDeeplink(data.deeplink);

        if (openBotAfter) {
          window.open(data.deeplink, '_blank', 'noopener');
        }
      } catch (fetchError) {
        console.error('Failed to start Telegram registration flow:', fetchError);
        setError('Не удалось связаться с сервером. Попробуйте ещё раз.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      fetchAuthLink(false).catch(error => {
        console.error('Unable to prepare Telegram registration link:', error);
      });
    } else {
      setDeeplink(null);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen, fetchAuthLink]);

  const handleOpenTelegramBot = async () => {
    if (isLoading) {
      return;
    }

    if (deeplink) {
      window.open(deeplink, '_blank', 'noopener');
      return;
    }

    await fetchAuthLink(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <DialogTitle>Регистрация</DialogTitle>
            <Badge variant="secondary" className="bg-muted/50">
              FREE
            </Badge>
          </div>
          <DialogDescription>
            Чтобы пользоваться сервисом, зарегистрируйтесь через Telegram-бота.
          </DialogDescription>
        </DialogHeader>
        
        <div className="pt-2 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : (
                <Smartphone className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Привяжите аккаунт через Telegram</h3>
              <p className="text-sm text-muted-foreground">
                Отсканируйте QR или перейдите по ссылке. После подтверждения в боте мы создадим ваш профиль автоматически.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <QRCodeComponent value={deeplink ?? 'https://t.me/'} size={160} />
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleOpenTelegramBot}
              className="w-full gap-2"
              variant="outline"
              disabled={isLoading}
            >
              <ExternalLink className="w-4 h-4" />
              {isLoading ? 'Получаем ссылку...' : 'Открыть Telegram-бота'}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              После подтверждения вернитесь на сайт — вход произойдёт автоматически.
            </p>

            {error && (
              <p className="text-xs text-destructive text-center">{error}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}