import { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ExternalLink, Loader2, Copy, AlertTriangle } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import type { PlanId } from '@/lib/plan';

const LS_TOCHKA_OPERATION_ID = 'tochka_operation_id';

interface PaymentRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: PlanId | null;
  planName?: string;
  periodLabel?: string; // purely UI ("мес"/"год"), backend currently charges monthly
  price?: number;
}

type ModalState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; paymentLink: string; operationId: string }
  | { status: 'error'; message: string };

/**
 * Real payment flow (Tochka acquiring):
 * 1) POST /api/access/orders { plan }
 * 2) Save operationId to localStorage (for /billing/success confirm fallback)
 * 3) Show payment link
 */
export function PaymentRequestModal({
  isOpen,
  onClose,
  planId,
  planName,
  periodLabel,
  price,
}: PaymentRequestModalProps) {
  const [state, setState] = useState<ModalState>({ status: 'idle' });

  const handleClose = () => {
    setState({ status: 'idle' });
    onClose();
  };

  const description = useMemo(() => {
    const parts: string[] = [];
    if (planName) {
      const priceStr = typeof price === 'number' && Number.isFinite(price) ? ` за ${price} ₽` : '';
      parts.push(`Тариф: ${planName}${periodLabel ? ` (${periodLabel})` : ''}${priceStr}.`);
    }
    parts.push('После оплаты вы вернётесь на сайт, а тариф активируется автоматически.');
    return parts.join(' ');
  }, [planName, periodLabel, price]);

  // Safety reset on open (e.g. if parent reuses modal instance or plan changes)
  useEffect(() => {
    if (isOpen) {
      setState({ status: 'idle' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, planId]);

  const createPayment = async () => {
    if (!planId) {
      setState({ status: 'error', message: 'Не выбран тариф. Закройте окно и выберите тариф ещё раз.' });
      return;
    }
    setState({ status: 'loading' });
    try {
      const data = await api.post<{ paymentLink: string; operationId: string }>(`/api/access/orders`, {
        plan: planId,
      });
      try {
        localStorage.setItem(LS_TOCHKA_OPERATION_ID, data.operationId);
      } catch {
        // ignore
      }
      setState({ status: 'ready', paymentLink: data.paymentLink, operationId: data.operationId });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setState({ status: 'error', message: 'Нужно войти в аккаунт, чтобы оплатить тариф.' });
          return;
        }
        if (err.status === 501) {
          setState({ status: 'error', message: 'Оплата ещё не настроена на сервере (не заполнены переменные TOCHKA_*).' });
          return;
        }
      }
      setState({ status: 'error', message: 'Не удалось создать платёж. Попробуйте ещё раз.' });
      console.error('Failed to create Tochka payment', err);
    }
  };

  const openPayment = () => {
    if (state.status !== 'ready') return;
    try {
      window.open(state.paymentLink, '_blank');
    } catch {
      // ignore
    }
  };

  const copyPaymentLink = async () => {
    if (state.status !== 'ready') return;
    try {
      await navigator.clipboard.writeText(state.paymentLink);
    } catch {
      // ignore
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Оплата подписки</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-4">
          {state.status === 'idle' ? (
            <div className="space-y-3">
              <Button className="w-full" onClick={createPayment} disabled={!planId || state.status === 'loading'}>
                Оплатить
              </Button>
            </div>
          ) : null}
          {state.status === 'loading' ? (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Создаём ссылку…
            </div>
          ) : null}

          {state.status === 'error' ? (
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-destructive" />
                <div>
                  <div className="font-medium">Ошибка</div>
                  <div className="text-muted-foreground">{state.message}</div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="secondary" onClick={handleClose}>
                  Закрыть
                </Button>
              </div>
            </div>
          ) : null}

          {state.status === 'ready' ? (
            <>
              <div className="text-xs text-muted-foreground text-center break-all">
                {state.paymentLink}
              </div>

              <div className="flex flex-col gap-2">
                <Button className="w-full gap-2" onClick={openPayment}>
                  <ExternalLink className="w-4 h-4" />
                  Перейти к оплате
                </Button>
                <Button variant="secondary" className="w-full gap-2" onClick={copyPaymentLink}>
                  <Copy className="w-4 h-4" />
                  Скопировать ссылку
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                Если вы уже оплатили и вернулись на сайт — перейдите на страницу успешной оплаты.
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
