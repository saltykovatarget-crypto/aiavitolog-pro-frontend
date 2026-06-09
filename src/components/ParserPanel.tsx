import React, { useState } from 'react';
import { Search, Info, Loader2 } from 'lucide-react';

interface ParserPanelProps {
  /** Колбэк когда юзер запустил парсер */
  onStart: (url: string) => Promise<void> | void;
  /** Цена в копейках (по умолчанию 19000 = 190 ₽) */
  priceKopecks?: number;
  /** Текущий баланс для проверки */
  balanceKopecks?: number;
  /** Открыть модалку пополнения если недостаточно */
  onRequestTopup?: () => void;
  className?: string;
}

const AVITO_URL_REGEX = /^https?:\/\/(www\.)?avito\.ru\//i;

export function ParserPanel({
  onStart,
  priceKopecks = 19000,
  balanceKopecks,
  onRequestTopup,
  className = '',
}: ParserPanelProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const insufficientFunds = balanceKopecks !== undefined && balanceKopecks < priceKopecks;
  const priceRub = priceKopecks / 100;

  const validate = (raw: string): string | null => {
    const trimmed = raw.trim();
    if (!trimmed) return 'Вставь ссылку на выдачу Авито';
    if (!AVITO_URL_REGEX.test(trimmed)) return 'Ссылка должна начинаться с https://www.avito.ru/';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate(url);
    if (err) {
      setError(err);
      return;
    }
    if (insufficientFunds) {
      onRequestTopup?.();
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onStart(url.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось запустить парсер');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`rounded-2xl border border-[rgba(154,127,224,0.30)] bg-gradient-to-br from-[rgba(111,66,193,0.10)] to-[rgba(154,127,224,0.04)] p-5 md:p-6 ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-11 h-11 grid place-items-center rounded-xl bg-gradient-to-br from-[#6F42C1] to-[#9A7FE0] text-white shadow-[0_4px_14px_rgba(111,66,193,0.35)]">
          <Search className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-base md:text-lg font-bold text-foreground">Парсер конкурентов</div>
          <div className="text-xs md:text-sm text-muted-foreground mt-0.5">
            AI разбирает топ-200 объявлений и сразу находит точки роста — без слива бюджета
          </div>
        </div>
      </div>

      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
        Ссылка на выдачу Авито
      </label>
      <div className="relative">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(null);
          }}
          placeholder="https://www.avito.ru/..."
          className={`w-full px-4 py-3 pr-3 text-sm bg-[rgba(255,255,255,0.03)] border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none transition ${
            error
              ? 'border-amber-500/50'
              : 'border-[rgba(255,255,255,0.10)] focus:border-[rgba(111,66,193,0.55)]'
          }`}
        />
      </div>
      {error && (
        <div className="mt-2 text-xs text-amber-300/80">{error}</div>
      )}

      {/* Hint toggle */}
      <button
        type="button"
        onClick={() => setShowHint(!showHint)}
        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#9A7FE0] hover:text-[#C5B0F0] transition"
      >
        <Info className="w-3.5 h-3.5" />
        {showHint ? 'Скрыть' : 'Где взять ссылку?'}
      </button>

      {showHint && (
        <div className="mt-3 p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-xs text-muted-foreground leading-relaxed">
          1. Открой <span className="text-foreground font-semibold">avito.ru</span><br />
          2. Введи свой запрос в поиск<br />
          3. Настрой фильтры (город, цена, категория)<br />
          4. Скопируй URL из адресной строки браузера
        </div>
      )}

      {/* Submit */}
      <div className="mt-5">
        {insufficientFunds ? (
          <button
            type="button"
            onClick={onRequestTopup}
            className="w-full h-11 rounded-full inline-flex items-center justify-center gap-2 text-sm font-bold bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] text-white shadow-[0_8px_24px_-8px_rgba(111,66,193,0.55)] hover:brightness-110 transition"
          >
            Пополнить кошелёк ({priceRub} ₽ за прогон) →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !url.trim()}
            className="w-full h-11 rounded-full inline-flex items-center justify-center gap-2 text-sm font-bold bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] text-white shadow-[0_8px_24px_-8px_rgba(111,66,193,0.55)] hover:brightness-110 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Запускаем…
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Запустить парсер за {priceRub} ₽
              </>
            )}
          </button>
        )}
      </div>

      <div className="text-[11px] text-muted-foreground text-center mt-3 leading-relaxed">
        ~1–3 минуты. Результат придёт в чат с AI-разбором.
      </div>
    </div>
  );
}
