import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, Loader2, Plus } from 'lucide-react';

interface TopupModalProps {
  open: boolean;
  onClose: () => void;
  /** Текущий баланс в копейках (для шапки модалки) */
  currentBalanceKopecks?: number;
  /** API endpoint создания платежа */
  topupEndpoint?: string;
}

type PackageKey = 'package_100' | 'package_300' | 'package_500';

interface TopupPackage {
  key: PackageKey;
  requests: number;
  paidRub: number;       // что юзер платит
  creditRub: number;     // что зачислится на кошелёк
  savingsPercent: number;
  highlighted?: boolean;
}

const PACKAGES: TopupPackage[] = [
  { key: 'package_100', requests: 100, paidRub: 390, creditRub: 500, savingsPercent: 22 },
  { key: 'package_300', requests: 300, paidRub: 990, creditRub: 1500, savingsPercent: 34, highlighted: true },
  { key: 'package_500', requests: 500, paidRub: 1490, creditRub: 2500, savingsPercent: 40 },
];

const QUICK_AMOUNTS = [100, 200, 500];
const MIN_AMOUNT = 100;

type Tab = 'package' | 'regular';

interface CreatePaymentResponse {
  payment_url: string;
  payment_id: string;
}

export function TopupModal({
  open,
  onClose,
  currentBalanceKopecks = 0,
  topupEndpoint = '/api/wallet/topup',
}: TopupModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<PackageKey | null>('package_300');
  const [customAmount, setCustomAmount] = useState<string>('200');
  const [tab, setTab] = useState<Tab>('package');
  const [submitting, setSubmitting] = useState(false);
  const [waitingPayment, setWaitingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      // reset state on close
      setError(null);
      setSubmitting(false);
      setWaitingPayment(false);
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !waitingPayment) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose, waitingPayment]);

  const balanceRub = currentBalanceKopecks / 100;

  const submit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      let body: Record<string, unknown>;
      if (tab === 'package') {
        if (!selectedPackage) {
          setError('Выберите пакет');
          setSubmitting(false);
          return;
        }
        body = { type: selectedPackage };
      } else {
        const amount = Number(customAmount.replace(/\s/g, ''));
        if (!amount || amount < MIN_AMOUNT) {
          setError(`Минимум ${MIN_AMOUNT} ₽`);
          setSubmitting(false);
          return;
        }
        body = { type: 'regular', amount_kopecks: amount * 100 };
      }

      const res = await fetch(topupEndpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Failed to create payment');
      }

      const data: CreatePaymentResponse = await res.json();

      // Открываем платёжку в новом окне + показываем «Ожидаем оплату...»
      window.open(data.payment_url, '_blank', 'noopener,noreferrer');
      setWaitingPayment(true);

      // Polling баланса каждые 3с — закрываемся при росте баланса
      const start = currentBalanceKopecks;
      const interval = setInterval(async () => {
        try {
          const balRes = await fetch('/api/wallet/balance', { credentials: 'include' });
          if (balRes.ok) {
            const balData = await balRes.json();
            if (balData.balance_kopecks > start) {
              window.dispatchEvent(new CustomEvent('wallet:refresh'));
              clearInterval(interval);
              setWaitingPayment(false);
              onClose();
            }
          }
        } catch {
          // ignore polling errors
        }
      }, 3000);

      // Stop polling after 10 minutes
      setTimeout(() => clearInterval(interval), 10 * 60 * 1000);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Что-то пошло не так';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !waitingPayment) onClose();
      }}
    >
      <div className="relative w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border">
          <div>
            <div className="text-lg font-bold text-foreground">Пополнить кошелёк</div>
            {currentBalanceKopecks > 0 && !waitingPayment && (
              <div className="text-xs text-muted-foreground mt-0.5">
                Сейчас на балансе: <span className="text-foreground font-semibold">{balanceRub.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}
          </div>
          {!waitingPayment && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 inline-grid place-items-center rounded-full hover:bg-[rgba(255,255,255,0.06)] transition"
              aria-label="Закрыть"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {waitingPayment ? (
          /* Waiting for payment */
          <div className="px-6 py-10 flex flex-col items-center text-center gap-4">
            <Loader2 className="w-10 h-10 text-[#9A7FE0] animate-spin" />
            <div className="text-base font-semibold text-foreground">
              Ожидаем оплату…
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Заверши оплату в открывшейся вкладке. Баланс обновится автоматически.
            </p>
            <button
              type="button"
              onClick={() => {
                setWaitingPayment(false);
                onClose();
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline mt-2"
            >
              Уже оплатил → закрыть
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="px-6 pt-4">
              <div className="inline-flex p-1 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]">
                <button
                  type="button"
                  onClick={() => setTab('package')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    tab === 'package'
                      ? 'bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] text-white shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Выгодные пакеты
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab('regular')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    tab === 'regular'
                      ? 'bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] text-white shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Любая сумма
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              {tab === 'package' ? (
                <div className="flex flex-col gap-3">
                  {PACKAGES.map((pkg) => {
                    const selected = selectedPackage === pkg.key;
                    return (
                      <button
                        key={pkg.key}
                        type="button"
                        onClick={() => setSelectedPackage(pkg.key)}
                        className={`relative text-left rounded-xl border p-4 transition ${
                          selected
                            ? 'border-[rgba(111,66,193,0.55)] bg-[rgba(111,66,193,0.10)] shadow-[0_8px_22px_-10px_rgba(111,66,193,0.4)]'
                            : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(154,127,224,0.30)]'
                        }`}
                      >
                        {pkg.highlighted && (
                          <div
                            className="absolute right-3 rounded-full uppercase"
                            style={{
                              top: -10,
                              padding: '3px 9px',
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: 1,
                              background: 'linear-gradient(90deg, #6F42C1, #9A7FE0)',
                              color: '#fff',
                              boxShadow: '0 4px 14px rgba(111, 66, 193, 0.45)',
                            }}
                          >
                            ПОПУЛЯРНЫЙ
                          </div>
                        )}
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-foreground">
                              {pkg.requests} запросов
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              На кошелёк зачислится{' '}
                              <span className="text-foreground font-semibold">
                                {pkg.creditRub.toLocaleString('ru-RU')} ₽
                              </span>
                            </div>
                            <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[rgba(52,211,153,0.12)] text-[#34d399] border border-[rgba(52,211,153,0.25)]">
                              Экономия {pkg.savingsPercent}%
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div
                              className="text-xl font-extrabold leading-none"
                              style={{
                                background:
                                  'linear-gradient(180deg, #9A7FE0 0%, #6F42C1 100%)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                letterSpacing: '-0.02em',
                                fontFeatureSettings: '"tnum"',
                              }}
                            >
                              {pkg.paidRub.toLocaleString('ru-RU')} ₽
                            </div>
                            {selected && (
                              <div className="inline-flex mt-2 items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-[#6F42C1] to-[#9A7FE0] text-white">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="text-xs text-muted-foreground">
                    Произвольная сумма (от {MIN_AMOUNT} ₽). Сколько положишь — столько и зачислится, без скидки.
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={customAmount}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^\d]/g, '');
                        setCustomAmount(v);
                      }}
                      className="w-full px-5 py-4 pr-16 text-2xl font-extrabold bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.10)] rounded-xl text-foreground focus:outline-none focus:border-[rgba(111,66,193,0.55)]"
                      placeholder="200"
                      style={{ fontFeatureSettings: '"tnum"' }}
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">
                      ₽
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {QUICK_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCustomAmount(String(amt))}
                        className="flex-1 px-3 py-2 rounded-full text-xs font-bold bg-[rgba(154,127,224,0.10)] hover:bg-[rgba(154,127,224,0.18)] text-[#C5B0F0] border border-[rgba(154,127,224,0.25)] transition"
                      >
                        {amt} ₽
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 px-3 py-2 rounded-lg text-xs text-red-300 bg-red-500/10 border border-red-500/30">
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 border-t border-border pt-4">
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] text-white font-semibold text-sm shadow-[0_10px_30px_-12px_rgba(111,66,193,0.6)] hover:brightness-110 active:brightness-95 transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Создаём платёж…
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Перейти к оплате
                  </>
                )}
              </button>
              <div className="text-[11px] text-muted-foreground text-center mt-3 leading-relaxed">
                Оплата через Точка Банк. Деньги не сгорают.{' '}
                <br className="hidden sm:block" />
                Возврат — через поддержку.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
