import React, { useState, useEffect } from 'react';
import { ChevronRight, Target, Search, MessageCircle, BarChart3, User, Radar, Image as ImageIcon, Pencil, Sun, Moon } from 'lucide-react';

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
        description: 'Залей XLS из кабинета Авито — AI Авитолог разберёт цифры',
        benefits: ['Просмотры, контакты, конверсия', 'Стоимость заявки', 'Что в топе у тебя'],
        estimatedTime: '~1 минута',
        priceKopecks: 5000,
        iconSvg: <BarChart3 className="w-5 h-5" />,
        status: 'available',
      },
      {
        id: 'audit',
        name: 'Аудит объявлений',
        description: 'XLS + парсер ниши + AI Авитолог-диагностика «что не так и что делать»',
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
        description: 'AI Авитолог делает фото-баннеры под Авито',
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
    subtitle: 'Новый чат с AI Авитологом',
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

  // Theme toggle — синхронизирован с App.tsx через localStorage 'theme'
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {}
  }, [isDark]);

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBack) {
      onBack();
    } else {
      window.location.hash = 'chat';
    }
  };

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
          background: 'color-mix(in oklab, var(--background) 70%, transparent)',
          borderBottom: '1px solid color-mix(in oklab, #6F42C1 15%, transparent)',
        }}
      >
        <div className="container max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between gap-3">
          {/* Левый блок: бренд-лого + название + бейдж PRO (как в UniversalHeader) */}
          <a
            href="#chat"
            onClick={goHome}
            className="flex min-w-0 items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <img
              src="/cases/favicon/logo-header.png"
              alt="AI Авитолог PRO"
              className="object-contain shrink-0 block"
              style={{
                width: '36px',
                height: '36px',
                maxWidth: '36px',
                maxHeight: '36px',
                minWidth: '36px',
                minHeight: '36px',
              }}
            />
            <span className="min-w-0 flex items-center gap-1.5 font-semibold text-foreground">
              <span className="truncate max-w-[110px] md:max-w-none">AI Авитолог</span>
              <span
                className="text-[11px] font-bold text-white px-2 py-1 rounded-md leading-none tracking-wider"
                style={{ backgroundColor: '#6F42C1' }}
              >
                PRO
              </span>
            </span>
          </a>

          {/* Центр: пусто */}
          <div />

          {/* Правый блок: WalletBalance + переключение темы + аватар */}
          <div className="flex items-center gap-2">
            <WalletBalance
              size="sm"
              externalBalanceKopecks={balanceKopecks}
              onTopup={() => setTopupOpen(true)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDark(!isDark)}
              className="w-9 h-9 p-0"
              aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <button
              type="button"
              onClick={goHome}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] flex items-center justify-center hover:opacity-90 transition"
              aria-label="В чат"
            >
              <User className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      <main className="relative z-10 container max-w-[1200px] mx-auto px-5 py-8 md:py-10">
        {/* === Hero «Быстрый старт» === */}
        <Reveal>
          <section className="mb-16 md:mb-20">
            <div className="flex flex-col items-center text-center mb-8">
              <div
                className="inline-flex items-center gap-2"
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: 'color-mix(in oklab, var(--card) 75%, transparent)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid color-mix(in oklab, #6F42C1 30%, transparent)',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--foreground)',
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#34d399',
                    boxShadow: '0 0 12px rgba(52,211,153,0.6)',
                  }}
                />
                Каталог инструментов
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                  lineHeight: 1.1,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  marginBottom: 12,
                }}
              >
                Что хочешь{' '}
                <span className="brand-gradient-text">
                  сделать
                </span>
                ?
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
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
                      className="quick-start-glass-card group relative w-full h-full text-left"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                        padding: 24,
                        background: 'color-mix(in oklab, var(--card) 85%, transparent)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid color-mix(in oklab, #6F42C1 20%, transparent)',
                        borderRadius: 20,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        minHeight: 200,
                      }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 16,
                          background:
                            'linear-gradient(135deg, rgba(111,66,193,0.25), rgba(154,127,224,0.12))',
                          border: '1px solid rgba(154,127,224,0.30)',
                          boxShadow: '0 8px 20px rgba(111,66,193,0.20)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon className="w-7 h-7 text-[#6F42C1] dark:text-[#C5B0F0]" />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            lineHeight: 1.2,
                            marginBottom: 6,
                            color: 'var(--foreground)',
                          }}
                        >
                          {opt.title}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: 'var(--muted-foreground)',
                            lineHeight: 1.5,
                          }}
                        >
                          {opt.subtitle}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: 12,
                          borderTop: '1px solid color-mix(in oklab, var(--border) 60%, transparent)',
                        }}
                      >
                        <span className="brand-gradient-text"
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                          }}
                        >
                          {opt.priceLabel}
                        </span>
                        <ChevronRight className="w-5 h-5 text-[#9A7FE0] group-hover:translate-x-0.5 transition-transform" />
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
              .quick-start-glass-card:hover {
                transform: translateY(-2px);
                border-color: rgba(154,127,224,0.50) !important;
                box-shadow: 0 12px 32px rgba(111,66,193,0.20);
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
                    <div
                      className="brand-gradient-text"
                      style={{
                        display: 'inline-block',
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        marginBottom: 4,
                      }}
                    >
                      {group.groupTitle}
                    </div>
                    {group.groupSubtitle && (
                      <div className="text-xs text-muted-foreground/60">
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
