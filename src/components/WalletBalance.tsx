import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, Plus, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

interface WalletBalanceProps {
  /** Колбэк когда юзер хочет пополнить */
  onTopup?: () => void;
  /** Опционально: передать баланс снаружи (mock или внешнее состояние) */
  externalBalanceKopecks?: number;
  /** API endpoint баланса (по умолчанию /api/wallet/balance) */
  endpoint?: string;
  /** Размер: 'sm' для шапки, 'lg' для отдельных страниц */
  size?: 'sm' | 'lg';
}

interface BalanceResponse {
  balance_kopecks: number;
  balance_rub: number;
}

/**
 * Виджет баланса кошелька — для шапки или кабинета.
 *
 * Логика:
 * - Подгружает баланс с API при монтировании
 * - Можно вызвать `refresh()` через ref / событие
 * - Цвета:
 *   • > 50 ₽ — обычный (бренд)
 *   • < 50 ₽ — оранжевый (warning)
 *   • < 5 ₽ — красный + кнопка подсвечена
 *
 * Поддерживает mock через `externalBalanceKopecks` пока бэкенд не готов.
 */
export function WalletBalance({
  onTopup,
  externalBalanceKopecks,
  endpoint = '/api/wallet/balance',
  size = 'sm',
}: WalletBalanceProps) {
  const [balanceKopecks, setBalanceKopecks] = useState<number | null>(
    externalBalanceKopecks ?? null
  );
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (externalBalanceKopecks !== undefined) {
      setBalanceKopecks(externalBalanceKopecks);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<BalanceResponse>(endpoint);
      setBalanceKopecks(data.balance_kopecks);
    } catch (err) {
      // Тихая ошибка — оставляем последнее известное значение или mock
      console.warn('[WalletBalance] failed to fetch:', err);
      if (balanceKopecks === null) {
        // Mock fallback пока бэк не готов
        setBalanceKopecks(4500);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, externalBalanceKopecks, balanceKopecks]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Listen for global "wallet:refresh" event (диспатчат после успешного ответа AI / пополнения)
  useEffect(() => {
    const handler = () => fetchBalance();
    window.addEventListener('wallet:refresh', handler);
    return () => window.removeEventListener('wallet:refresh', handler);
  }, [fetchBalance]);

  const rub = balanceKopecks !== null ? balanceKopecks / 100 : null;
  const isLow = rub !== null && rub < 50;
  const isCritical = rub !== null && rub < 5;

  const colorClass = isCritical
    ? 'text-red-400'
    : isLow
    ? 'text-amber-400'
    : 'text-foreground';

  const iconColorClass = isCritical
    ? 'text-red-400'
    : isLow
    ? 'text-amber-400'
    : 'text-[#9A7FE0]';

  const buttonClass = isCritical
    ? 'bg-gradient-to-br from-[#6F42C1] to-[#9A7FE0] text-white shadow-[0_4px_14px_rgba(111,66,193,0.4)] animate-pulse'
    : 'bg-[rgba(111,66,193,0.12)] hover:bg-[rgba(111,66,193,0.22)] text-[#9A7FE0] border border-[rgba(111,66,193,0.25)]';

  if (size === 'lg') {
    return (
      <div
        className="flex flex-col gap-3 p-5"
        style={{
          background: 'color-mix(in oklab, var(--card) 85%, transparent)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid color-mix(in oklab, #6F42C1 20%, transparent)',
          borderRadius: 20,
        }}
      >
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Текущий баланс
        </div>
        <div className="flex items-baseline gap-2">
          {isCritical && <AlertCircle className="w-5 h-5 text-red-400" />}
          <span className={`text-4xl font-extrabold ${colorClass}`} style={{ letterSpacing: '-0.02em', fontFeatureSettings: '"tnum"' }}>
            {loading && balanceKopecks === null ? '—' : `${rub?.toLocaleString('ru-RU') ?? 0}`}
          </span>
          <span className="text-2xl font-bold text-muted-foreground">₽</span>
        </div>
        <button
          type="button"
          onClick={onTopup}
          className={`mt-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition ${buttonClass}`}
          style={{ boxShadow: '0 8px 24px rgba(111,66,193,0.3)' }}
        >
          <Plus className="w-4 h-4" />
          Пополнить
        </button>
      </div>
    );
  }

  // size === 'sm' (header)
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-muted/30 border border-border"
        title="Баланс кошелька"
      >
        <Wallet className={`w-3.5 h-3.5 ${iconColorClass}`} />
        <span className={`text-sm font-bold ${colorClass}`} style={{ fontFeatureSettings: '"tnum"' }}>
          {loading && balanceKopecks === null ? '—' : `${rub?.toLocaleString('ru-RU') ?? 0}`}
        </span>
        <span className="text-xs text-muted-foreground">₽</span>
      </div>
      <button
        type="button"
        onClick={onTopup}
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition ${buttonClass}`}
        aria-label="Пополнить кошелёк"
      >
        <Plus className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Пополнить</span>
      </button>
    </div>
  );
}
