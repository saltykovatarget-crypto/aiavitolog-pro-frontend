import { useMemo, useState } from 'react';
import { AlertTriangle, LifeBuoy, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { api, ApiError } from '@/lib/api';

type Variant = 'fab' | 'link';

type State =
  | { status: 'idle' }
  | { status: 'sending' }
  | { status: 'error'; message: string }
  | { status: 'success' };

export function ReportProblemFab({
  variant = 'fab',
  className = '',
  label = 'Сообщить о проблеме',
}: {
  variant?: Variant;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<State>({ status: 'idle' });

  const canSend = useMemo(() => {
    return subject.trim().length > 0 && message.trim().length >= 10 && state.status !== 'sending';
  }, [message, state.status, subject]);

  const close = () => {
    setOpen(false);
    setState({ status: 'idle' });
  };

  const onSubmit = async () => {
    if (!canSend) return;
    setState({ status: 'sending' });
    try {
      await api.post('/api/support/tickets', {
        subject: subject.trim(),
        message: message.trim(),
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
      });
      setState({ status: 'success' });
      setTimeout(() => {
        setSubject('');
        setMessage('');
        close();
      }, 700);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setState({ status: 'error', message: 'Нужно войти в аккаунт, чтобы отправить сообщение.' });
        return;
      }
      setState({ status: 'error', message: 'Не удалось отправить. Попробуйте ещё раз.' });
      // eslint-disable-next-line no-console
      console.error('Failed to send support ticket', err);
    }
  };

  const Trigger = () => {
    if (variant === 'link') {
      return (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={
            'inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors ' +
            className
          }
          aria-label={label}
        >
          <LifeBuoy className="h-4 w-4" />
          <span>{label}</span>
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          'fixed bottom-5 right-5 z-[9999] inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 ' +
          'text-primary-foreground shadow-lg hover:opacity-95 active:opacity-90 ' +
          className
        }
        aria-label={label}
      >
        <LifeBuoy className="h-5 w-5" />
        <span className="text-sm font-medium">{label}</span>
      </button>
    );
  };

  const content = (
    <>
      <Trigger />

      <Dialog open={open} onOpenChange={(value) => (value ? setOpen(true) : close())}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Сообщить о проблеме</DialogTitle>
            <DialogDescription>
              Опишите проблему — мы увидим ваше сообщение в админ-панели.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm">Тема проблемы</div>
              <Input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Например: не активировался тариф после оплаты"
                disabled={state.status === 'sending' || state.status === 'success'}
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm">Описание проблемы</div>
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Что вы делали, что ожидали и что произошло на самом деле…"
                rows={6}
                disabled={state.status === 'sending' || state.status === 'success'}
              />
              <div className="text-xs text-muted-foreground">Минимум 10 символов.</div>
            </div>

            {state.status === 'error' ? (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
                <div className="text-muted-foreground">{state.message}</div>
              </div>
            ) : null}

            {state.status === 'success' ? (
              <div className="rounded-md border border-border bg-muted/30 p-3 text-sm">
                Сообщение отправлено ✅
              </div>
            ) : null}

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={close} disabled={state.status === 'sending'}>
                Отмена
              </Button>
              <Button onClick={onSubmit} disabled={!canSend}>
                {state.status === 'sending' ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Отправляем…
                  </span>
                ) : (
                  'Отправить'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

  // IMPORTANT:
  // - link variant must render in-place (footer / hints), otherwise it "disappears"
  // - fab can stay portaled/fixed if you want (but not required)
  if (variant === 'link') {
    return content;
  }

  // For FAB we keep it simple: render normally as well
  // (DialogContent itself is already portaled by Radix Dialog)
  return content;
}
