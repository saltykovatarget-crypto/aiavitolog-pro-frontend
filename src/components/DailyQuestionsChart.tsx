import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Button } from './ui/button';
import { Crown, LucideIcon, MessageCircle, Star, Zap } from 'lucide-react';

import type { UserPlan } from '@/types/user';
import { PUBLIC_PLAN_LABELS } from '@/lib/planLabels';

type NormalizedPlan = UserPlan | 'default';

interface DailyQuestionsChartProps {
  plan: UserPlan | string | null | undefined;
  used: number | null | undefined;
  limit: number | null | undefined;
  planUntil?: string | null;
  onUpgrade?: () => void;
}

interface PlanStyle {
  icon: LucideIcon;
  accentColor: string;
  accentBg: string;
  availableColor: string;
  label: string;
}

const USED_COLOR = '#94A3B8';

const PLAN_STYLES: Record<NormalizedPlan, PlanStyle> = {
  free: {
    icon: MessageCircle,
    accentColor: 'text-muted-foreground',
    accentBg: 'bg-muted/10',
    availableColor: '#22C55E',
    label: PUBLIC_PLAN_LABELS.free,
  },
  basic: {
    icon: Zap,
    accentColor: 'text-blue-600',
    accentBg: 'bg-blue-500/10',
    availableColor: '#3B82F6',
    label: PUBLIC_PLAN_LABELS.basic,
  },
  plus: {
    icon: Star,
    accentColor: 'text-green-600',
    accentBg: 'bg-green-500/10',
    availableColor: '#22C55E',
    label: PUBLIC_PLAN_LABELS.plus,
  },
  premium: {
    icon: Crown,
    accentColor: 'text-amber-600',
    accentBg: 'bg-amber-500/10',
    availableColor: '#F59E0B',
    label: PUBLIC_PLAN_LABELS.premium,
  },
  default: {
    icon: MessageCircle,
    accentColor: 'text-brand',
    accentBg: 'bg-brand/10',
    availableColor: '#22C55E',
    label: 'текущего тарифа',
  },
};

const numberFormatter = new Intl.NumberFormat('ru-RU');
const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

function normalizePlan(plan: string | null | undefined): NormalizedPlan {
  const normalized = (plan ?? 'free').toString().toLowerCase() as UserPlan;
  if (normalized === 'free' || normalized === 'basic' || normalized === 'plus' || normalized === 'premium') {
    return normalized;
  }
  return 'default';
}

function normalizeCount(value: number | null | undefined, fallback = 0): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(value, 0);
}

export function DailyQuestionsChart({
  plan,
  used,
  limit,
  planUntil,
  onUpgrade,
}: DailyQuestionsChartProps) {
  const normalizedPlan = normalizePlan(plan ?? 'free');
  const style = PLAN_STYLES[normalizedPlan];

  const safeLimit = normalizeCount(limit);
  const safeUsed = Math.min(normalizeCount(used), safeLimit > 0 ? safeLimit : normalizeCount(used));
  const remainingRaw = safeLimit > 0 ? safeLimit - safeUsed : 0;
  const remaining = Math.max(remainingRaw, 0);
  const total = safeUsed + remaining;
  const data = total > 0
    ? [
        { name: 'Использовано', value: safeUsed },
        { name: 'Доступно', value: remaining },
      ]
    : [
        { name: 'Использовано', value: 0 },
        { name: 'Доступно', value: 1 },
      ];

  const colors = [USED_COLOR, style.availableColor];
  const remainingLabel = safeLimit > 0 ? numberFormatter.format(remaining) : '0';
  const subtitle = safeLimit > 0
    ? `${numberFormatter.format(safeUsed)} из ${numberFormatter.format(safeLimit)} запросов использовано.`
    : 'Лимит запросов для этого тарифа ещё не активирован.';

  const formattedPlanUntil = planUntil ? dateFormatter.format(new Date(planUntil)) : null;
  const limitReached = safeLimit > 0 && remaining <= 0;

  const Icon = style.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${style.accentBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${style.accentColor}`} />
        </div>
        <div>
          <h3 className="font-semibold">Лимит запросов</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                startAngle={90}
                endAngle={450}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index] ?? USED_COLOR} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-sm text-muted-foreground mb-1">Осталось</div>
            <div className={`text-lg font-semibold ${limitReached ? 'text-destructive' : ''}`}>
              {remainingLabel}
            </div>
            <div className="text-xs text-muted-foreground">запросов</div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground text-center mt-4 space-y-1">
          {safeLimit > 0 ? (
            <>
              <div>
                Ваш лимит: {numberFormatter.format(safeLimit)} запросов для тарифа {style.label}.
              </div>
              {normalizedPlan !== 'free' && formattedPlanUntil && (
                <div>Тариф действует до {formattedPlanUntil}. После этого будет Free.</div>
              )}
              {normalizedPlan === 'free' && <div>Бесплатно доступно 15 запросов на аккаунт.</div>}
            </>
          ) : (
            <div>Лимит запросов для этого тарифа будет доступен после активации подписки.</div>
          )}
        </div>
      </div>

      {normalizedPlan === 'free' && (
        <div className="bg-muted/40 border border-dashed border-muted-foreground/40 rounded-lg p-4 text-sm text-muted-foreground text-center space-y-3">
          <p>
            Бесплатно доступно 15 запросов на аккаунт. Чтобы получить больше — обновите тариф.
          </p>
          {onUpgrade && (
            <Button size="sm" onClick={onUpgrade} className="mx-auto">
              Обновить тариф
            </Button>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: style.availableColor }}></div>
          <span className="text-muted-foreground">Доступно</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: USED_COLOR }}></div>
          <span className="text-muted-foreground">Использовано</span>
        </div>
      </div>
    </div>
  );
}
