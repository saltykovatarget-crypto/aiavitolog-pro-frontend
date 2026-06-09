import React, { useState } from 'react';
import { Radio, Loader2 } from 'lucide-react';

interface PositionCheckPanelProps {
  /** Колбэк когда юзер запустил проверку */
  onCheck: (params: { adIds: string[]; city: string }) => Promise<void> | void;
  /** Цена в копейках (по умолчанию 9900 = 99 ₽) */
  priceKopecks?: number;
  /** Текущий баланс для проверки */
  balanceKopecks?: number;
  onRequestTopup?: () => void;
  className?: string;
}

export function PositionCheckPanel({
  onCheck,
  priceKopecks = 9900,
  balanceKopecks,
  onRequestTopup,
  className = '',
}: PositionCheckPanelProps) {
  const [rawIds, setRawIds] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const insufficientFunds = balanceKopecks !== undefined && balanceKopecks < priceKopecks;
  const priceRub = priceKopecks / 100;

  const parseIds = (raw: string): string[] => {
    return raw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const validate = (): string | null => {
    const ids = parseIds(rawIds);
    if (ids.length === 0) return 'Добавь хотя бы один ID объявления';
    for (const id of ids) {
      if (!/^\d{5,}$/.test(id)) {
        return `«${id}» — не похоже на ID Авито (только цифры, минимум 5 символов)`;
      }
    }
    if (!city.trim()) return 'Укажи город';
    if (ids.length > 50) return 'Не больше 50 объявлений за раз';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
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
      await onCheck({ adIds: parseIds(rawIds), city: city.trim() });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось запустить проверку');
    } finally {
      setSubmitting(false);
    }
  };

  const idsCount = parseIds(rawIds).length;

  return (
    <div className={`rounded-2xl border border-[rgba(154,127,224,0.30)] bg-gradient-to-br from-[rgba(111,66,193,0.10)] to-[rgba(154,127,224,0.04)] p-5 md:p-6 ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-11 h-11 grid place-items-center rounded-xl bg-gradient-to-br from-[#6F42C1] to-[#9A7FE0] text-white shadow-[0_4px_14px_rgba(111,66,193,0.35)]">
          <Radio className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-base md:text-lg font-bold text-foreground">Проверка позиций</div>
          <div className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Отчёт по позициям твоих объявлений в выдаче Авито
          </div>
        </div>
      </div>

      {/* ID объявлений */}
      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
        ID объявлений
        {idsCount > 0 && (
          <span className="ml-2 text-foreground font-semibold normal-case tracking-normal">
            ({idsCount} {idsCount === 1 ? 'шт' : idsCount < 5 ? 'шт' : 'шт'})
          </span>
        )}
      </label>
      <textarea
        value={rawIds}
        onChange={(e) => {
          setRawIds(e.target.value);
          if (error) setError(null);
        }}
        placeholder={`12345678\n87654321\n11122233`}
        rows={4}
        className="w-full px-4 py-3 text-sm bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.10)] rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[rgba(111,66,193,0.55)] resize-none font-mono"
      />
      <div className="text-[11px] text-muted-foreground mt-1.5">
        По одному ID в строке (или через запятую). До 50 за раз.
      </div>

      {/* Город */}
      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mt-4 mb-2">
        Город
      </label>
      <input
        type="text"
        value={city}
        onChange={(e) => {
          setCity(e.target.value);
          if (error) setError(null);
        }}
        placeholder="Краснодар"
        className="w-full px-4 py-3 text-sm bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.10)] rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[rgba(111,66,193,0.55)]"
      />

      {error && (
        <div className="mt-3 text-xs text-amber-300/80">{error}</div>
      )}

      {/* Submit */}
      <div className="mt-5">
        {insufficientFunds ? (
          <button
            type="button"
            onClick={onRequestTopup}
            className="w-full h-11 rounded-full inline-flex items-center justify-center gap-2 text-sm font-bold bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] text-white shadow-[0_8px_24px_-8px_rgba(111,66,193,0.55)] hover:brightness-110 transition"
          >
            Пополнить кошелёк ({priceRub} ₽ за проверку) →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || idsCount === 0 || !city.trim()}
            className="w-full h-11 rounded-full inline-flex items-center justify-center gap-2 text-sm font-bold bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] text-white shadow-[0_8px_24px_-8px_rgba(111,66,193,0.55)] hover:brightness-110 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Проверяем…
              </>
            ) : (
              <>
                <Radio className="w-4 h-4" />
                Проверить позиции за {priceRub} ₽
              </>
            )}
          </button>
        )}
      </div>

      <div className="text-[11px] text-muted-foreground text-center mt-3 leading-relaxed">
        Разовая проверка, не подписка. Когда нужно — запустишь снова.
      </div>
    </div>
  );
}
