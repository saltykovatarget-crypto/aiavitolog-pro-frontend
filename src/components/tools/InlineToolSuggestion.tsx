import React from 'react';
import { Button } from '../ui/button';

interface InlineToolSuggestionProps {
  /** ID инструмента, который AI предлагает */
  toolId: string;
  /** Заголовок (например, «Аудит объявлений») */
  title: string;
  /** Короткое описание в одну строку */
  description: string;
  /** Цена в ₽ (для отображения «590 ₽») или строка типа «от 90 ₽» */
  priceLabel: string;
  /** Эмодзи или маленький SVG слева */
  icon?: React.ReactNode;
  /** Запустить инструмент */
  onLaunch?: (toolId: string) => void;
  /** Юзер выбрал «не сейчас» — AI должен это запомнить */
  onDismiss?: (toolId: string) => void;
  className?: string;
}

/**
 * Компактная карточка инструмента, которую AI вставляет в свои сообщения в чате.
 * Меньше, чем основная ToolCard. Используется как inline-предложение.
 */
export function InlineToolSuggestion({
  toolId,
  title,
  description,
  priceLabel,
  icon = '🛠',
  onLaunch,
  onDismiss,
  className = '',
}: InlineToolSuggestionProps) {
  return (
    <div
      className={`
        my-2 max-w-[420px] p-3 rounded-2xl
        bg-gradient-to-br from-[rgba(111,66,193,0.10)] to-[rgba(154,127,224,0.04)]
        border border-[rgba(154,127,224,0.30)]
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-9 h-9 grid place-items-center rounded-lg bg-[rgba(111,66,193,0.20)] text-lg">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 justify-between">
            <div className="text-sm font-bold text-foreground truncate">{title}</div>
            <div
              className="text-sm font-extrabold whitespace-nowrap"
              style={{
                background: 'linear-gradient(180deg, #C5B0F0 0%, #6F42C1 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.01em',
              }}
            >
              {priceLabel}
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 leading-snug">
            {description}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <Button
          size="sm"
          className="flex-1 h-8 rounded-full text-xs bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] text-white"
          onClick={() => onLaunch?.(toolId)}
        >
          Запустить →
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 rounded-full text-xs text-muted-foreground hover:text-foreground"
          onClick={() => onDismiss?.(toolId)}
        >
          Не сейчас
        </Button>
      </div>
    </div>
  );
}
