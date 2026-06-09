import React, { useState } from 'react';
import { ThumbsDown, Copy, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ThumbDownButtonProps {
  /** ID сообщения AI для отправки сигнала */
  messageId: number | string;
  /** API endpoint (по умолчанию /api/messages/{id}/thumb-down) */
  endpoint?: string;
  /** Опционально — текст сообщения для копирования */
  messageText?: string;
  className?: string;
}

/**
 * Кнопка 👎 под ответами AI.
 * - Без возврата денег
 * - Без объяснений
 * - Сигнал тихо уходит в админку
 * - После клика — заполненная иконка + toast «Спасибо»
 */
export function ThumbDownButton({
  messageId,
  endpoint,
  messageText,
  className = '',
}: ThumbDownButtonProps) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = endpoint ?? `/api/messages/${messageId}/thumb-down`;

  const handleThumbDown = async () => {
    if (sent || submitting) return;
    setSubmitting(true);
    try {
      await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: messageId }),
      });
      setSent(true);
      toast?.('Спасибо, мы учтём', {
        description: 'Сигнал отправлен в админку',
      });
    } catch (e) {
      // Тихо игнорим — это не критичный сигнал
      // Всё равно показываем что отправлено, чтобы юзер не пытался спамить
      setSent(true);
      toast?.('Спасибо, мы учтём');
      console.warn('[ThumbDown] failed to send:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!messageText) return;
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.warn('[Copy] failed:', e);
    }
  };

  return (
    <div className={`inline-flex items-center gap-3 text-xs text-muted-foreground ${className}`}>
      <button
        type="button"
        onClick={handleThumbDown}
        disabled={sent || submitting}
        className={`inline-flex items-center gap-1 transition ${
          sent
            ? 'text-amber-400 cursor-default'
            : 'hover:text-amber-400'
        }`}
        title={sent ? 'Сигнал отправлен' : 'Что-то не так с ответом'}
        aria-label={sent ? 'Сигнал отправлен' : 'Пожаловаться на ответ'}
      >
        <ThumbsDown
          className="w-3.5 h-3.5"
          fill={sent ? 'currentColor' : 'none'}
          strokeWidth={1.8}
        />
        {sent && <span className="text-[11px]">учли</span>}
      </button>

      {messageText && (
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 hover:text-foreground transition"
          title="Скопировать ответ"
          aria-label="Скопировать"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] text-emerald-400">скопировано</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" strokeWidth={1.8} />
              <span className="hidden sm:inline text-[11px]">копировать</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
