import React from 'react';
import { Button } from '../ui/button';
import { Clock, Wrench, Check } from 'lucide-react';

export type ToolStatus = 'available' | 'insufficient_funds' | 'coming_soon' | 'launching';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  benefits?: string[];
  estimatedTime?: string;
  priceKopecks: number | null;        // null = «от Х ₽» или «бесплатно»
  priceLabel?: string;                // для случаев типа «от 90 ₽» или «Бесплатно»
  iconEmoji?: string;
  iconSvg?: React.ReactNode;
  badge?: 'new' | 'hit' | 'soon' | null;
  status: ToolStatus;
}

interface ToolCardProps {
  tool: ToolDefinition;
  /** Колбэк при клике «Запустить» */
  onLaunch?: (toolId: string) => void;
  /** Колбэк при клике «Подробнее» */
  onDetails?: (toolId: string) => void;
  /** Колбэк «Пополнить кошелёк» (для insufficient_funds) */
  onTopup?: () => void;
  /** Колбэк «Уведомить» (для coming_soon) */
  onNotify?: (toolId: string) => void;
  className?: string;
}

const BADGE_STYLES: Record<NonNullable<ToolDefinition['badge']>, { label: string; cls: string }> = {
  new:  { label: 'НОВОЕ',  cls: 'bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] text-white' },
  hit:  { label: 'ХИТ',   cls: 'bg-[#6F42C1]/20 text-[#C5B0F0] border border-[#6F42C1]/40' },
  soon: { label: 'СКОРО', cls: 'bg-white/10 text-white/70 border border-white/15' },
};

function formatPrice(t: ToolDefinition): string {
  if (t.priceLabel) return t.priceLabel;
  if (t.priceKopecks === null) return '—';
  if (t.priceKopecks === 0) return 'Бесплатно';
  return `${(t.priceKopecks / 100).toLocaleString('ru-RU')} ₽`;
}

export function ToolCard({
  tool,
  onLaunch,
  onDetails,
  onTopup,
  onNotify,
  className = '',
}: ToolCardProps) {
  const isComingSoon = tool.status === 'coming_soon';
  const isInsufficient = tool.status === 'insufficient_funds';
  const isLaunching = tool.status === 'launching';

  return (
    <div
      className={`
        relative flex flex-col gap-4 p-5 md:p-6
        bg-card border border-border rounded-2xl
        transition-all duration-200
        ${isComingSoon ? 'opacity-70' : 'hover:border-[#9A7FE0]/40 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(111,66,193,0.35)]'}
        ${className}
      `}
    >
      {/* Бейдж в углу */}
      {tool.badge && (
        <div className={`absolute -top-2 right-4 text-[10px] font-bold px-2 py-1 rounded-full ${BADGE_STYLES[tool.badge].cls}`}>
          {BADGE_STYLES[tool.badge].label}
        </div>
      )}

      {/* Иконка + заголовок */}
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-12 h-12 grid place-items-center rounded-xl bg-gradient-to-br from-[#6F42C1]/20 to-[#9A7FE0]/10 border border-[#9A7FE0]/20 text-[#C5B0F0]">
          {tool.iconSvg ?? <Wrench className="w-5 h-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-bold text-foreground leading-tight">
            {tool.name}
          </h3>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground leading-snug">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Бенефиты + время */}
      {(tool.benefits?.length || tool.estimatedTime) && (
        <div className="flex flex-col gap-1 text-[11px] md:text-xs text-muted-foreground">
          {tool.benefits?.map((b) => (
            <div key={b} className="inline-flex items-center gap-1.5">
              <Check className="w-3 h-3 text-[#34d399] shrink-0" /> {b}
            </div>
          ))}
          {tool.estimatedTime && (
            <div className="inline-flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-muted-foreground shrink-0" /> {tool.estimatedTime}
            </div>
          )}
        </div>
      )}

      {/* Цена */}
      <div className="mt-auto">
        <div className="text-2xl md:text-[28px] font-extrabold leading-none"
             style={{
               background: 'linear-gradient(180deg, #C5B0F0 0%, #6F42C1 100%)',
               WebkitBackgroundClip: 'text',
               backgroundClip: 'text',
               color: 'transparent',
               letterSpacing: '-0.02em',
             }}>
          {formatPrice(tool)}
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex items-center gap-2 mt-1">
        {isComingSoon ? (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-full text-xs"
            onClick={() => onNotify?.(tool.id)}
          >
            Уведомить меня
          </Button>
        ) : isInsufficient ? (
          <Button
            size="sm"
            className="flex-1 rounded-full text-xs bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] text-white"
            onClick={onTopup}
          >
            Пополнить кошелёк
          </Button>
        ) : (
          <Button
            size="sm"
            className="flex-1 rounded-full text-xs bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] text-white"
            onClick={() => onLaunch?.(tool.id)}
            disabled={isLaunching}
          >
            {isLaunching ? 'Запускаем…' : 'Запустить →'}
          </Button>
        )}
        {onDetails && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-xs px-3"
            onClick={() => onDetails(tool.id)}
          >
            Подробнее
          </Button>
        )}
      </div>
    </div>
  );
}
