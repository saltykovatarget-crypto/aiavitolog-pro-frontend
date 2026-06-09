import React, { useState, useEffect, useCallback } from 'react';
import { WalletBalance } from './WalletBalance';
import { TopupModal } from './TopupModal';
import {
  Loader2,
  Gift,
  Undo2,
  Package,
  CreditCard,
  Search,
  BarChart3,
  Image as ImageIcon,
  Pencil,
  Radar,
  MessageCircle,
} from 'lucide-react';
import { api } from '../lib/api';
import { Reveal, RevealItem } from './landing/Reveal';

interface Transaction {
  id: number;
  type: string;             // topup_regular | topup_package_100 | spend | bonus_signup | refund
  amount_kopecks: number;
  balance_after_kopecks: number;
  description: string;
  related_entity?: string;
  package_type?: string;
  created_at: string;       // ISO datetime
}

// Mock data пока бэк не готов
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 1, type: 'spend', amount_kopecks: -500, balance_after_kopecks: 4500, description: 'Ответ AI Авитолога', created_at: '2026-05-27T10:30:00' },
  { id: 2, type: 'spend', amount_kopecks: -500, balance_after_kopecks: 5000, description: 'Ответ AI Авитолога', created_at: '2026-05-27T10:25:00' },
  { id: 3, type: 'spend', amount_kopecks: -19000, balance_after_kopecks: 5500, description: 'Парсер ниши', created_at: '2026-05-27T10:00:00' },
  { id: 4, type: 'topup_package_100', amount_kopecks: 50000, balance_after_kopecks: 24500, description: 'Пакет 100 запросов', created_at: '2026-05-27T09:30:00', package_type: 'package_100' },
  { id: 5, type: 'bonus_signup', amount_kopecks: 5000, balance_after_kopecks: 5000, description: 'Стартовый бонус', created_at: '2026-05-26T15:00:00' },
];

interface WalletPageProps {
  /** Опционально — endpoint баланса */
  balanceEndpoint?: string;
  /** Опционально — endpoint транзакций */
  transactionsEndpoint?: string;
  /** Mock-режим (показывать MOCK_TRANSACTIONS) */
  useMockData?: boolean;
}

function formatAmount(kopecks: number): string {
  const rub = Math.abs(kopecks) / 100;
  return rub.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
}

function formatDateShort(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  } catch {
    return iso;
  }
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function getTxIcon(tx: Transaction): React.ReactNode {
  const cls = 'w-4 h-4 md:w-5 md:h-5 text-[#C5B0F0]';
  if (tx.type === 'bonus_signup') return <Gift className={cls} />;
  if (tx.type === 'refund') return <Undo2 className={cls} />;
  if (tx.type.startsWith('topup_package')) return <Package className={cls} />;
  if (tx.type === 'topup_regular') return <CreditCard className={cls} />;
  if (tx.description?.toLowerCase().includes('парсер')) return <Search className={cls} />;
  if (tx.description?.toLowerCase().includes('xls')) return <BarChart3 className={cls} />;
  if (tx.description?.toLowerCase().includes('фото')) return <ImageIcon className={cls} />;
  if (tx.description?.toLowerCase().includes('плашк')) return <Pencil className={cls} />;
  if (tx.description?.toLowerCase().includes('позиц')) return <Radar className={cls} />;
  return <MessageCircle className={cls} />;
}

export function WalletPage({
  balanceEndpoint = '/api/wallet/balance',
  transactionsEndpoint = '/api/wallet/transactions',
  useMockData = false,
}: WalletPageProps) {
  const [balanceKopecks, setBalanceKopecks] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [topupOpen, setTopupOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const VISIBLE_LIMIT = 10;

  const loadData = useCallback(async () => {
    setLoading(true);
    if (useMockData) {
      setBalanceKopecks(4500);
      setTransactions(MOCK_TRANSACTIONS);
      setLoading(false);
      return;
    }
    try {
      const [balData, txData] = await Promise.all([
        api.get<{ balance_kopecks: number }>(balanceEndpoint),
        api.get<any>(transactionsEndpoint),
      ]);
      setBalanceKopecks(balData.balance_kopecks);
      const txs = Array.isArray(txData) ? txData : (txData?.transactions || []);
      setTransactions(txs);
    } catch (err) {
      console.warn('[WalletPage] failed:', err);
      setTransactions(MOCK_TRANSACTIONS);
      setBalanceKopecks(4500);
    } finally {
      setLoading(false);
    }
  }, [balanceEndpoint, transactionsEndpoint, useMockData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const handler = () => loadData();
    window.addEventListener('wallet:refresh', handler);
    return () => window.removeEventListener('wallet:refresh', handler);
  }, [loadData]);

  const visible = showAll ? transactions : transactions.slice(0, VISIBLE_LIMIT);

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: `
            radial-gradient(50% 40% at 50% 0%, rgba(111,66,193,0.10), transparent 60%),
            radial-gradient(40% 30% at 100% 100%, rgba(154,127,224,0.06), transparent 70%)
          `,
        }}
      />
      <div className="relative z-10 container max-w-[760px] mx-auto px-5 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 md:mb-8">
        Кошелёк
      </h1>

      {/* Balance card */}
      <Reveal>
        <WalletBalance
          size="lg"
          externalBalanceKopecks={balanceKopecks}
          onTopup={() => setTopupOpen(true)}
        />
      </Reveal>

      {/* Transactions */}
      <div className="mt-8">
        <Reveal delay={0.05}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-semibold text-foreground">
              История операций
            </h2>
            {transactions.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {transactions.length}{' '}
                {transactions.length === 1 ? 'операция' : transactions.length < 5 ? 'операции' : 'операций'}
              </span>
            )}
          </div>
        </Reveal>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Загружаем историю…</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <div className="text-5xl mb-3">💸</div>
            <div className="text-sm font-semibold text-foreground">Ещё ничего не было</div>
            <div className="text-xs text-muted-foreground mt-1">
              Здесь будут все списания и пополнения
            </div>
          </div>
        ) : (
          <Reveal>
            <div className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden">
              {visible.map((tx, idx) => {
                const isPositive = tx.amount_kopecks > 0;
                return (
                  <RevealItem key={tx.id} index={idx} staggerDelay={0.04}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 ${
                      idx !== visible.length - 1 ? 'border-b border-border/60' : ''
                    } hover:bg-muted/30 transition`}
                  >
                    <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 grid place-items-center rounded-xl bg-gradient-to-br from-[#6F42C1]/20 to-[#9A7FE0]/10">
                      {getTxIcon(tx)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-foreground truncate">
                        {tx.description}
                      </div>
                      <div className="text-[11px] md:text-xs text-muted-foreground mt-0.5">
                        {formatDateShort(tx.created_at)} · {formatTime(tx.created_at)}
                      </div>
                    </div>
                    <div
                      className={`shrink-0 text-right font-bold tabular-nums ${
                        isPositive ? 'text-[#34d399]' : 'text-foreground'
                      }`}
                      style={{ fontFeatureSettings: '"tnum"' }}
                    >
                      <div className="text-sm md:text-base">
                        {isPositive ? '+' : '−'}
                        {formatAmount(tx.amount_kopecks)} ₽
                      </div>
                      <div className="text-[10px] md:text-[11px] text-muted-foreground font-normal mt-0.5">
                        → {formatAmount(tx.balance_after_kopecks)} ₽
                      </div>
                    </div>
                  </div>
                  </RevealItem>
                );
              })}
            </div>
          </Reveal>
        )}

        {!showAll && transactions.length > VISIBLE_LIMIT && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-1 px-5 py-2 rounded-full text-xs font-semibold text-[#9A7FE0] hover:text-[#C5B0F0] hover:bg-[rgba(154,127,224,0.10)] transition"
            >
              Показать ещё{' '}
              <span className="text-muted-foreground">
                ({transactions.length - VISIBLE_LIMIT})
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="mt-8 text-center text-[11px] text-muted-foreground leading-relaxed">
        Деньги не сгорают. Возврат — через поддержку.
      </div>

      <TopupModal
        open={topupOpen}
        onClose={() => setTopupOpen(false)}
        currentBalanceKopecks={balanceKopecks}
      />
      </div>
    </div>
  );
}
