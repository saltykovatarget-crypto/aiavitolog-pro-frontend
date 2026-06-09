import React, { useEffect, useRef } from 'react';
import { Paperclip, ArrowUp, Sun, Moon, Wallet, AlertCircle } from 'lucide-react';

interface InputAreaProps {
  message: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  position: 'centered' | 'bottom';
  disabled?: boolean;
  isDark?: boolean;
  setIsDark?: (isDark: boolean) => void;

  // ===== Wallet integration =====
  /** Текущий баланс в копейках. Если undefined — кошелёк UI не показывается (обратная совместимость) */
  balanceKopecks?: number;
  /** Цена одного ответа в копейках (по умолчанию 500 = 5 ₽) */
  pricePerMessageKopecks?: number;
  /** Открыть модалку пополнения */
  onRequestTopup?: () => void;
  /** Колбэк когда нужно показать toast (например, sonner) */
  onShowToast?: (message: string, type?: 'info' | 'warning' | 'error') => void;
}

const LOW_BALANCE_TOAST_THRESHOLD = 2500; // 25 ₽
const TOAST_SHOWN_KEY = 'wallet:lowBalanceToastShownAt';

export function InputArea({
  message,
  onChange,
  onSend,
  onKeyPress,
  position,
  disabled = false,
  isDark,
  setIsDark,
  balanceKopecks,
  pricePerMessageKopecks = 500,
  onRequestTopup,
  onShowToast,
}: InputAreaProps) {
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  // Wallet awareness
  const walletEnabled = balanceKopecks !== undefined;
  const insufficientFunds = walletEnabled && (balanceKopecks as number) < pricePerMessageKopecks;
  const lowBalance = walletEnabled && !insufficientFunds && (balanceKopecks as number) < LOW_BALANCE_TOAST_THRESHOLD;

  // Toast при низком балансе (один раз в сессию)
  const toastFiredRef = useRef(false);
  useEffect(() => {
    if (!lowBalance || toastFiredRef.current) return;
    try {
      const lastShown = sessionStorage.getItem(TOAST_SHOWN_KEY);
      if (lastShown) return;
      sessionStorage.setItem(TOAST_SHOWN_KEY, Date.now().toString());
    } catch {
      // ignore storage errors
    }
    const remaining = Math.floor((balanceKopecks as number) / pricePerMessageKopecks);
    const rub = ((balanceKopecks as number) / 100).toLocaleString('ru-RU');
    onShowToast?.(`⚠️ Осталось ${rub} ₽ — хватит на ${remaining} ${remaining === 1 ? 'ответ' : remaining < 5 ? 'ответа' : 'ответов'}`, 'warning');
    toastFiredRef.current = true;
  }, [lowBalance, balanceKopecks, pricePerMessageKopecks, onShowToast]);

  const baseClasses = `
    transition-all duration-300 ease-out
    ${position === 'centered'
      ? 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-6'
      : 'border-t p-6'
    }
  `;

  const sendDisabled = !message.trim() || disabled || insufficientFunds;

  return (
    <div className={baseClasses}>
      <div className="w-full max-w-[880px] mx-auto px-4 md:px-0">
        {/* Modern messenger input container */}
        <div className={`
          flex items-end gap-3 p-3 md:p-[10px_12px]
          min-h-[52px] md:min-h-[56px]
          bg-card border
          rounded-[14px] md:rounded-[16px]
          shadow-card
          transition-all duration-200 ease-out
          ${insufficientFunds
            ? 'border-amber-500/35 focus-within:border-amber-500/50'
            : 'border-border hover:border-muted focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]'
          }
          ${disabled ? 'opacity-60' : ''}
        `}>
          {/* Attachment button */}
          <button
            className={`
              flex-shrink-0 w-9 h-9 rounded-[10px]
              flex items-center justify-center
              text-muted-foreground transition-all duration-200
              hover:bg-accent hover:text-foreground
              disabled:opacity-60 disabled:cursor-not-allowed
            `}
            disabled={disabled}
            title="Прикрепить"
          >
            <Paperclip className="w-[18px] h-[18px] md:w-5 md:h-5" />
          </button>

          {/* Textarea container */}
          <div className="flex-1 min-w-0">
            <textarea
              placeholder={insufficientFunds ? 'Пополни кошелёк, чтобы продолжить…' : 'Напишите сообщение…'}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!sendDisabled) onKeyPress(e as any);
                }
              }}
              className={`
                w-full min-h-[28px] max-h-[120px]
                bg-transparent border-0 outline-none resize-none
                text-foreground placeholder:text-muted-foreground
                font-normal leading-[24px]
                ${disabled || insufficientFunds ? 'cursor-not-allowed' : ''}
              `}
              rows={1}
              disabled={disabled}
              autoFocus={position === 'centered'}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--scrollbar-thumb) transparent'
              }}
            />
          </div>

          {/* Theme toggle button (only when isDark and setIsDark are provided) */}
          {isDark !== undefined && setIsDark && (
            <button
              className={`
                flex-shrink-0 w-9 h-9 rounded-[10px]
                flex items-center justify-center
                text-muted-foreground transition-all duration-200
                hover:bg-accent hover:text-foreground
                disabled:opacity-60 disabled:cursor-not-allowed
              `}
              disabled={disabled}
              onClick={() => setIsDark(!isDark)}
              title={isDark ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
            >
              {isDark ? (
                <Sun className="w-[18px] h-[18px] md:w-5 md:h-5" />
              ) : (
                <Moon className="w-[18px] h-[18px] md:w-5 md:h-5" />
              )}
            </button>
          )}

          {/* Send button / Topup button */}
          {insufficientFunds ? (
            <button
              type="button"
              onClick={onRequestTopup}
              className="flex-shrink-0 h-9 px-4 rounded-full flex items-center justify-center gap-1.5 text-xs font-bold transition-all
                bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] text-white shadow-[0_4px_14px_rgba(111,66,193,0.4)]
                hover:brightness-110 active:scale-95"
              title="Пополнить кошелёк"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Пополни кошелёк</span>
              <span className="sm:hidden">Пополнить</span>
              <span>→</span>
            </button>
          ) : (
            <button
              className={`
                flex-shrink-0 w-9 h-9 rounded-full
                flex items-center justify-center
                transition-all duration-200 ease-out
                active:scale-95 active:duration-[120ms]
                ${sendDisabled
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80'
                }
              `}
              disabled={sendDisabled}
              onClick={onSend}
            >
              <ArrowUp className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            </button>
          )}
        </div>

        {/* Подпись «5 ₽ за ответ» под полем (только если wallet задан) */}
        {walletEnabled && (
          <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-muted-foreground">
            <div className="inline-flex items-center gap-1.5">
              {insufficientFunds ? (
                <>
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-300/80">
                    Недостаточно средств: на балансе {(balanceKopecks as number / 100).toLocaleString('ru-RU')} ₽
                  </span>
                </>
              ) : lowBalance ? (
                <>
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span>
                    Один ответ — {pricePerMessageKopecks / 100} ₽ · На балансе{' '}
                    <span className="text-amber-300/80">{(balanceKopecks as number / 100).toLocaleString('ru-RU')} ₽</span>
                  </span>
                </>
              ) : (
                <span>Один ответ — {pricePerMessageKopecks / 100} ₽</span>
              )}
            </div>
            {balanceKopecks !== undefined && (
              <button
                type="button"
                onClick={onRequestTopup}
                className="text-[11px] text-[#9A7FE0] hover:text-[#C5B0F0] transition"
              >
                Пополнить →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
