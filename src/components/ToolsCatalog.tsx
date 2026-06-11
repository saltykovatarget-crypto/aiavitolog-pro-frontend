import React from 'react';
import { Button } from './ui/button';
import { RevealItem } from './landing/Reveal';

interface ToolsCatalogProps {
  onNavigateToChat?: () => void;
  onNavigateToTools?: () => void;
}

type ToolStatus = 'active' | 'beta' | 'soon';

interface ToolDef {
  id: string;
  step: string;
  name: string;
  description: string;
  status: ToolStatus;
  icon: React.ReactNode;
}

// === ICON SET ===
// Единый стиль: 24x24, stroke 2, round caps, дуотон через rgba fill + outline.
// Каждая иконка = filled background-фигура (низкая opacity) + outline-деталь.

const TOOLS: ToolDef[] = [
  {
    id: 'parser',
    step: 'Шаг 1',
    name: 'Парсер конкурентов',
    description: 'AI Авитолог разбирает топ-200 объявлений и находит точки роста. Сразу видно где конкуренты сильны, а где можно вырасти без слива бюджета. Запустить за 190 ₽.',
    status: 'active',
    icon: (
      // Парсер: окно списка с подсветкой строк и magnifier
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="3.5" width="14" height="14" rx="2.5" fill="currentColor" fillOpacity="0.22" stroke="none" />
        <line x1="5.5" y1="7.5" x2="13.5" y2="7.5" />
        <line x1="5.5" y1="10.5" x2="11" y2="10.5" />
        <line x1="5.5" y1="13.5" x2="12.5" y2="13.5" />
        <circle cx="17" cy="16.5" r="4" />
        <line x1="20" y1="19.5" x2="22" y2="21.5" />
      </svg>
    ),
  },
  {
    id: 'market-analysis',
    step: 'Шаг 2',
    name: 'Анализ статистики кабинета',
    description: 'Заливаешь XLS-выгрузку из кабинета Авито → AI Авитолог находит слабые места где теряются заявки. Анализ за 50 ₽.',
    status: 'beta',
    icon: (
      // Анализ рынка: 3 столбца + восходящая стрелка
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="14" width="4" height="7" rx="1" fill="currentColor" fillOpacity="0.22" stroke="none" />
        <rect x="10" y="9" width="4" height="12" rx="1" fill="currentColor" fillOpacity="0.22" stroke="none" />
        <rect x="17" y="4" width="4" height="17" rx="1" fill="currentColor" fillOpacity="0.22" stroke="none" />
        <rect x="3" y="14" width="4" height="7" rx="1" />
        <rect x="10" y="9" width="4" height="12" rx="1" />
        <rect x="17" y="4" width="4" height="17" rx="1" />
      </svg>
    ),
  },
  {
    id: 'photo-editor',
    step: 'Шаг 6',
    name: 'Фото-баннер и редактор',
    description: 'AI Авитолог генерирует баннеры и обложки по образцу лидеров ниши. Редактор фото прямо в сервисе. Скоро доступно.',
    status: 'soon',
    icon: (
      // Фото-баннер: рамка + горы + AI-sparkle
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="15" rx="2" fill="currentColor" fillOpacity="0.22" stroke="none" />
        <rect x="3" y="4" width="18" height="15" rx="2" />
        <circle cx="8" cy="9" r="1.4" fill="currentColor" stroke="none" />
        <path d="M3 16 L9 11 L13 14 L17 10 L21 14" />
        <path d="M19 3 L19.6 4.6 L21.2 5.2 L19.6 5.8 L19 7.4 L18.4 5.8 L16.8 5.2 L18.4 4.6 Z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'positions-monitor',
    step: 'Шаг 9',
    name: 'Мониторинг позиций',
    description: 'Отслеживает позиции твоих объявлений в выдаче Авито: показы, клики, изменения по дням.',
    status: 'beta',
    icon: (
      // Мониторинг: line chart с pin-маркером
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21 V5" />
        <path d="M3 21 H22" />
        <path d="M5 17 L9 12 L13 14 L17 8 L21 10 L21 21 L5 21 Z" fill="currentColor" fillOpacity="0.22" stroke="none" />
        <polyline points="5 17 9 12 13 14 17 8 21 10" />
        <circle cx="17" cy="8" r="2.2" fill="currentColor" stroke="none" />
        <circle cx="17" cy="8" r="3.8" stroke="currentColor" strokeOpacity="0.5" />
      </svg>
    ),
  },
];

export function ToolsCatalog({ onNavigateToChat, onNavigateToTools }: ToolsCatalogProps) {
  const goToTools = onNavigateToTools ?? (() => { window.location.hash = 'tools'; });
  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="tools">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 100% 0%, rgba(111, 66, 193, 0.08), transparent 70%), radial-gradient(50% 50% at 0% 100%, rgba(154, 127, 224, 0.06), transparent 70%)',
        }}
      />
      <div className="container max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight m-0 text-foreground">
            Инструменты сервиса
          </h2>
          <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Каждый инструмент решает задачу одного шага методологии. Можно проходить шаги в чате с AI Авитологом или использовать инструменты отдельно.
          </p>
        </div>

        <div className="tools-grid">
          {TOOLS.map((tool, i) => (
            <RevealItem key={tool.id} index={i} staggerDelay={0.1}>
              <div
                className={`tool-card tool-card--${tool.status}`}
                onClick={goToTools}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goToTools(); }}
              >
              <div className="tool-card-head">
                <div className="tool-icon">{tool.icon}</div>
                <div className="tool-step">{tool.step}</div>
              </div>

              <h3 className="tool-name">{tool.name}</h3>
              <p className="tool-desc">{tool.description}</p>

              <div className="tool-footer">
                {tool.status === 'active' && (
                  <>
                    <span className="tool-badge tool-badge--active">Доступен</span>
                    <Button
                      size="sm"
                      className="hero-cta-primary rounded-full px-5 text-sm"
                      onClick={(e) => { e.stopPropagation(); goToTools(); }}
                    >
                      Попробовать
                    </Button>
                  </>
                )}
                {tool.status === 'beta' && (
                  <>
                    <span className="tool-badge tool-badge--beta">В&nbsp;разработке</span>
                    <button
                      className="tool-notify-btn"
                      type="button"
                      onClick={(e) => { e.stopPropagation(); goToTools(); }}
                    >
                      Сообщить о запуске →
                    </button>
                  </>
                )}
                {tool.status === 'soon' && (
                  <>
                    <span className="tool-badge tool-badge--soon">Скоро</span>
                    <button
                      className="tool-notify-btn"
                      type="button"
                      onClick={(e) => { e.stopPropagation(); goToTools(); }}
                    >
                      Сообщить о запуске →
                    </button>
                  </>
                )}
              </div>
              </div>
            </RevealItem>
          ))}
        </div>

        {/* Большая кнопка — все инструменты */}
        <div className="text-center mt-10 md:mt-14">
          <Button
            size="lg"
            onClick={goToTools}
            className="rounded-full px-8 h-12 font-bold"
            style={{
              background: 'linear-gradient(135deg, #6F42C1 0%, #9A7FE0 100%)',
              color: '#fff',
              boxShadow: '0 8px 24px rgba(111,66,193,0.3)',
            }}
          >
            Все инструменты →
          </Button>
        </div>
      </div>

      <style>{`
        .tools-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 640px) {
          .tools-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .tools-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .tool-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 300px;
          transition: border-color .15s, transform .15s, box-shadow .15s;
        }
        .tool-card--active {
          border-color: rgba(111, 66, 193, 0.35);
        }
        .tool-card--active:hover {
          border-color: var(--brand);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(111, 66, 193, 0.18);
        }
        .tool-card--beta {
          border-color: rgba(245, 158, 11, 0.25);
        }
        .tool-card--soon {
          opacity: 0.72;
        }

        .tool-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .tool-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6F42C1 0%, #9A7FE0 100%);
          color: #FFFFFF;
          display: grid;
          place-items: center;
          box-shadow:
            0 4px 14px rgba(111, 66, 193, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        .tool-icon svg { width: 22px; height: 22px; }
        .tool-card--soon .tool-icon {
          background: linear-gradient(135deg, rgba(111, 66, 193, 0.35) 0%, rgba(154, 127, 224, 0.35) 100%);
          box-shadow: none;
        }
        .tool-step {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--muted-foreground);
        }

        .tool-name {
          font-size: 18px;
          font-weight: 600;
          color: var(--foreground);
          margin: 8px 0 0;
          line-height: 1.25;
        }
        @media (min-width: 768px) {
          .tool-name { font-size: 20px; }
        }
        .tool-desc {
          font-size: 14px;
          line-height: 1.6;
          color: var(--muted-foreground);
          margin: 0;
          flex: 1;
        }
        @media (min-width: 768px) {
          .tool-desc { font-size: 15px; }
        }

        .tool-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-top: 18px;
          margin-top: 8px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .tool-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .5px;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 5px;
        }
        .tool-badge--active {
          background: rgba(16, 185, 129, 0.18);
          color: #34d399;
        }
        .tool-badge--beta {
          background: rgba(245, 158, 11, 0.18);
          color: #fbbf24;
        }
        .tool-badge--soon {
          background: rgba(255, 255, 255, 0.06);
          color: var(--muted-foreground);
        }
        .tool-notify-btn {
          background: transparent;
          border: none;
          color: var(--muted-foreground);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        .tool-notify-btn:hover { color: #9A7FE0; }
      `}</style>
    </section>
  );
}
