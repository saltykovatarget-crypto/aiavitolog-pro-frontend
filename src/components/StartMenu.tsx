import React from 'react';

interface StartMenuOption {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  prompt: string;
}

const START_MENU_OPTIONS: StartMenuOption[] = [
  {
    id: 'fix_existing',
    icon: '🎯',
    title: 'У меня есть объявления, мало заявок',
    subtitle: 'Диагностика + починим',
    prompt: 'Помоги разобраться почему мало заявок с моих объявлений',
  },
  {
    id: 'start_from_scratch',
    icon: '🚀',
    title: 'Хочу запустить продажи на Авито с нуля',
    subtitle: 'Соберём стратегию + рекламу шаг за шагом',
    prompt: 'Хочу запустить продажи на Авито с нуля',
  },
  {
    id: 'analyze_stats',
    icon: '📊',
    title: 'Хочу разобраться со статистикой кабинета',
    subtitle: 'Залей XLS — AI найдёт где теряются заявки',
    prompt: 'У меня есть статистика кабинета Авито, помоги разобрать и найти точки роста',
  },
  {
    id: 'check_competitors',
    icon: '🔍',
    title: 'Хочу разобрать конкурентов',
    subtitle: 'AI найдёт точки роста без слива бюджета',
    prompt: 'Хочу разобрать конкурентов и найти где можно вырасти',
  },
  {
    id: 'just_ask',
    icon: '✏️',
    title: 'Просто хочу спросить совет',
    subtitle: 'Задавай вопрос',
    prompt: '',
  },
];

interface StartMenuProps {
  /** Колбэк при выборе ветки. Получает prompt (может быть пустым для "просто спросить"). */
  onSelect: (prompt: string, optionId: string) => void;
  /** Опциональный заголовок (по умолчанию — стандартный) */
  title?: string;
  className?: string;
}

/**
 * Стартовое меню чата — 5 веток входа.
 * Показывается только при новом диалоге.
 */
export function StartMenu({
  onSelect,
  title = 'С чего начнём?',
  className = '',
}: StartMenuProps) {
  return (
    <div className={`w-full max-w-2xl mx-auto px-4 py-8 ${className}`}>
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground m-0">
          {title}
        </h2>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">
          Выбери ветку или задай свой вопрос
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {START_MENU_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.prompt, opt.id)}
            className="group flex items-center gap-4 text-left p-4 md:p-5 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(111,66,193,0.45)] hover:bg-[rgba(111,66,193,0.06)] hover:translate-y-[-1px] transition-all"
          >
            <div className="shrink-0 w-12 h-12 grid place-items-center rounded-xl bg-gradient-to-br from-[#6F42C1] to-[#9A7FE0] text-2xl shadow-[0_4px_14px_rgba(111,66,193,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]">
              {opt.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm md:text-base font-semibold text-foreground leading-snug">
                {opt.title}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">
                {opt.subtitle}
              </div>
            </div>
            <div className="shrink-0 text-muted-foreground group-hover:text-[#9A7FE0] transition">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        💰 Ответ AI — 5 ₽ · Парсер конкурентов — 190 ₽ · Анализ статистики — 50 ₽
      </div>
    </div>
  );
}

export { START_MENU_OPTIONS };
