import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Target, Search, MessageCircle, BarChart3, User, Radar, Image as ImageIcon, Pencil } from 'lucide-react';

type QuickStartIcon = React.ComponentType<{ className?: string }>;
import { Button } from '../ui/button';
import { WalletBalance } from '../WalletBalance';
import { TopupModal } from '../TopupModal';
import { Reveal, RevealItem } from '../landing/Reveal';
import { ToolCard, ToolDefinition, ToolStatus } from './ToolCard';
import { RecentRunCard, RecentRun } from './RecentRunCard';

interface ToolsPageProps {
  /** Колбэк когда юзер хочет вернуться (например, в чат) */
  onBack?: () => void;
  /** Колбэк когда юзер запускает инструмент (создание чата + tool meta) */
  onLaunchTool?: (toolId: string) => void;
  /** Открыть прошлый запуск */
  onOpenRun?: (run: RecentRun) => void;
  /** Mock-баланс в копейках. Если undefined — WalletBalance тянет сам с API */
  balanceKopecks?: number;
  /** Mock-список последних запусков. Если undefined — pull через API */
  recentRuns?: RecentRun[];
}

// === Реальные доступные инструменты ===
const TOOLS_BY_GROUP: Array<{
  groupId: string;
  groupTitle: string;
  groupSubtitle?: string;
  tools: ToolDefinition[];
}> = [
  {
    groupId: 'analysis',
    groupTitle: 'Анализ и диагностика',
    groupSubtitle: 'Понять что происходит на рынке и в твоём кабинете',
    tools: [
      {
        id: 'parser_niche',
        name: 'Парсер ниши',
        description: 'Топ-200 объявлений конкурентов с vision-разбором фото',
        benefits: ['Vision-анализ всех фото', 'Сравнение лидеров', 'Доли рынка'],
        estimatedTime: '~3 минуты',
        priceKopecks: 19000,
        iconSvg: <Search className="w-5 h-5" />,
        status: 'available',
      },
      {
        id: 'xls_analysis',
        name: 'Анализ статистики кабинета',
        description: 'Залей XLS из кабинета Авито — AI разберёт цифры',
        benefits: ['Просмотры, контакты, конверсия', 'Стоимость заявки', 'Что в топе у тебя'],
        estimatedTime: '~1 минута',
        priceKopecks: 5000,
        iconSvg: <BarChart3 className="w-5 h-5" />,
        status: 'available',
      },
      {
        id: 'audit',
        name: 'Аудит объявлений',
        description: 'XLS + парсер ниши + AI-диагностика «что не так и что делать»',
        benefits: ['Сравнение тебя с топом', '3 главные проблемы', 'План действий'],
        estimatedTime: '~5 минут',
        priceKopecks: 59000,
        iconSvg: <Target className="w-5 h-5" />,
        status: 'available',
        badge: 'new',
      },
    ],
  },
  {
    groupId: 'competitive',
    groupTitle: 'Конкурентная разведка',
    tools: [
      {
        id: 'parser_seller',
        name: 'Парсер продавца',
        description: 'Глубокий разбор одного конкретного продавца',
        benefits: ['Все его объявления', 'Сетка цен и контент', 'Vision-разбор фото'],
        estimatedTime: '~5-30 минут',
        priceKopecks: null,
        priceLabel: 'от 90 ₽',
        iconSvg: <User className="w-5 h-5" />,
        status: 'coming_soon',
        badge: 'soon',
      },
    ],
  },
  {
    groupId: 'monitoring',
    groupTitle: 'Мониторинг',
    tools: [
      {
        id: 'position_check',
        name: 'Проверка позиций',
        description: 'Где твои объявления в выдаче Авито прямо сейчас',
        benefits: ['Текущие позиции в топе', 'По нужному городу', 'До 5 объявлений за раз'],
        estimatedTime: '~30 секунд',
        priceKopecks: 9900,
        iconSvg: <Radar className="w-5 h-5" />,
        status: 'available',
      },
    ],
  },
  {
    groupId: 'content',
    groupTitle: 'Контент',
    groupSubtitle: 'Скоро добавим',
    tools: [
      {
        id: 'photo_gen',
        name: 'Генерация фото',
        description: 'AI делает фото-баннеры под Авито',
        priceKopecks: 1900,
        iconSvg: <ImageIcon className="w-5 h-5" />,
        status: 'coming_soon',
        badge: 'soon',
      },
      {
        id: 'photo_overlay',
        name: 'Наложение плашки',
        description: 'Добавь УТП, цену или скидку на фото',
        priceKopecks: 900,
        iconSvg: <Pencil className="w-5 h-5" />,
        status: 'coming_soon',
        badge: 'soon',
      },
    ],
  },
];

// === Hero-сценарии ===
const QUICK_START_OPTIONS: Array<{
  id: string;
  Icon: QuickStartIcon;
  title: string;
  subtitle: string;
  priceLabel: string;
}> = [
  {
    id: 'audit',
    Icon: Target,
    title: 'Понять почему мало заявок',
    subtitle: 'Аудит твоих объявлений',
    priceLabel: '590 ₽',
  },
  {
    id: 'parser_niche',
    Icon: Search,
    title: 'Изучить конкурентов',
    subtitle: 'Парсер ниши',
    priceLabel: '190 ₽',
  },
  {
    id: 'just_ask',
    Icon: MessageCircle,
    title: 'Просто спросить совет',
    subtitle: 'Новый чат с AI',
    priceLabel: 'от 5 ₽',
  },
];

// === Mock-данные истории (для разработки UI) ===
const MOCK_RECENT_RUNS: RecentRun[] = [
  {
    id: 'r1',
    toolId: 'parser_niche',
    toolName: 'Парсер ниши',
    toolIcon: '🔍',
    contextLabel: 'ворота гаражные · Москва',
    date: '28.05 14:02',
    status: 'success',
    priceKopecks: 19000,
  },
  {
    id: 'r2',
    toolId: 'xls_analysis',
    toolName: 'Анализ XLS',
    toolIcon: '📊',
    contextLabel: 'stats_2026_05.xlsx',
    date: '27.05 11:35',
    status: 'success',
    priceKopecks: 5000,
  },
  {
    id: 'r3',
    toolId: 'position_check',
    toolName: 'Проверка позиций',
    toolIcon: '📡',
    contextLabel: '3 объявления · Москва',
    date: '26.05 17:10',
    status: 'success',
    priceKopecks: 9900,
  },
];

export function ToolsPage({
  onBack,
  onLaunchTool,
  onOpenRun,
  balanceKopecks,
  recentRuns,
}: ToolsPageProps) {
  const [topupOpen, setTopupOpen] = useState(false);
  const runs = recentRuns ?? MOCK_RECENT_RUNS;

  // Подкорректировать статус инструмента в зависимости от баланса
  const adjustStatus = (tool: ToolDefinition): ToolStatus => {
    if (tool.status === 'coming_soon') return 'coming_soon';
    if (balanceKopecks !== undefined && tool.priceKopecks !== null && balanceKopecks < tool.priceKopecks) {
      return 'insufficient_funds';
    }
    return 'available';
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
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
      {/* === Sticky top bar === */}
      <div
        className="sticky top-0 z-30 backdrop-blur-xl"
        style={{
          background: 'rgba(13,13,26,0.60)',
          borderBottom: '1px solid rgba(111,66,193,0.15)',
        }}
      >
        <div className="container max-w-[1200px] mx-auto px-5 h-14 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>
          <h1 className="text-base md:text-lg font-bold">Инструменты</h1>
          <WalletBalance
            size="sm"
            externalBalanceKopecks={balanceKopecks}
            onTopup={() => setTopupOpen(true)}
          />
        </div>
      </div>

      <main className="relative z-10 container max-w-[1200px] mx-auto px-5 py-8 md:py-10">
        {/* === Hero «Быстрый старт» === */}
        <Reveal>
          <section className="mb-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Что хочешь сделать?</h2>
              <p className="mt-2 text-sm md:text-base text-muted-foreground">
                Самые частые сценарии — в один клик
              </p>
            </div>

            <div className="quick-start-grid">
              {QUICK_START_OPTIONS.map((opt, i) => {
                const Icon = opt.Icon;
                return (
                  <RevealItem key={opt.id} index={i} staggerDelay={0.08}>
                    <button
                      type="button"
                      onClick={() => onLaunchTool?.(opt.id)}
                      className="quick-start-card group relative w-full h-full text-left flex flex-col gap-3 p-5 md:p-6 rounded-2xl"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6F42C1]/20 to-[#9A7FE0]/10 border border-[#9A7FE0]/20 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-[#C5B0F0]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base md:text-lg leading-tight text-white">
                          {opt.title}
                        </div>
                        <div className="mt-1 text-xs md:text-sm text-muted-foreground leading-snug">
                          {opt.subtitle}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-1">
                        <span
                          className="text-base font-extrabold"
                          style={{
                            background: 'linear-gradient(180deg, #C5B0F0 0%, #6F42C1 100%)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                          }}
                        >
                          {opt.priceLabel}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-[#9A7FE0] group-hover:translate-x-0.5 transition" />
                      </div>
                    </button>
                  </RevealItem>
                );
              })}
            </div>

            <style>{`
              .quick-start-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 12px;
              }
              @media (min-width: 768px) {
                .quick-start-grid {
                  grid-template-columns: repeat(3, minmax(0, 1fr));
                  gap: 16px;
                }
              }
              .quick-start-grid > * { height: 100%; }
              .quick-start-card {
                min-height: 176px;
                background: linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005));
                background-color: var(--card);
                border: 1px solid rgba(255, 255, 255, 0.08);
                transition: border-color .2s, transform .2s, box-shadow .2s;
              }
              .quick-start-card:hover {
                border-color: rgba(154, 127, 224, 0.60);
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(111, 66, 193, 0.15);
              }
              @media (min-width: 768px) {
                .quick-start-card { min-height: 192px; }
              }
            `}</style>
          </section>
        </Reveal>

        {/* === Каталог инструментов === */}
        <section className="space-y-10">
          {TOOLS_BY_GROUP.map((group, gIdx) => (
            <Reveal key={group.groupId} delay={gIdx * 0.05}>
              <div>
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <div>
                    <div className="text-[10px] md:text-[11px] font-bold tracking-[1.5px] uppercase text-muted-foreground">
                      {group.groupTitle}
                    </div>
                    {group.groupSubtitle && (
                      <div className="text-xs text-muted-foreground/60 mt-1">
                        {group.groupSubtitle}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {group.tools.map((tool, i) => (
                    <RevealItem key={tool.id} index={i} staggerDelay={0.06}>
                      <ToolCard
                        tool={{ ...tool, status: adjustStatus(tool) }}
                        onLaunch={onLaunchTool}
                        onTopup={() => setTopupOpen(true)}
                        onNotify={(id) => console.log('Уведомить о готовности:', id)}
                      />
                    </RevealItem>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        {/* === История запусков === */}
        {runs.length > 0 && (
          <Reveal delay={0.1}>
            <section className="mt-12 md:mt-16">
              <div className="mb-4 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-muted-foreground">
                    Мои последние запуски
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-[#9A7FE0]">
                  Все запуски →
                </Button>
              </div>
              <div className="space-y-2">
                {runs.slice(0, 5).map((run, i) => (
                  <RevealItem key={run.id} index={i} staggerDelay={0.05}>
                    <RecentRunCard
                      run={run}
                      onOpen={onOpenRun}
                      onRerun={(r) => onLaunchTool?.(r.toolId)}
                    />
                  </RevealItem>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* === Пустой подвал, чтобы дышалось === */}
        <div className="h-16" />
      </main>

      <TopupModal
        open={topupOpen}
        onClose={() => setTopupOpen(false)}
        currentBalanceKopecks={balanceKopecks}
      />
    </div>
  );
}
