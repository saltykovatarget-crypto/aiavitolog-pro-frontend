import React from 'react';
import { Button } from './ui/button';
import { Reveal, RevealItem } from './landing/Reveal';

interface Step {
  number: string;
  title: string;
  description: string;
}

interface Part {
  id: string;
  partLabel: string;        // "Часть 1"
  rangeLabel: string;       // "Шаги 1–3"
  title: string;            // "Анализ ниши"
  caption: string;          // "Понимаем нишу, прежде чем что-то делать"
  steps: Step[];
}

const PARTS: Part[] = [
  {
    id: 'analysis',
    partLabel: 'Часть 1',
    rangeLabel: 'Шаги 1–3',
    title: 'Анализ ниши',
    caption: 'Понимаем что продаём, кому и почему сейчас.',
    steps: [
      {
        number: '01',
        title: 'Анализ спроса, рынка и конкурентов',
        description: 'Разбираем выдачу: какие услуги или товары ищут, сколько конкурентов, какие офферы используют.',
      },
      {
        number: '02',
        title: 'Стратегия размещения',
        description: 'Под какие сегменты аудитории работать, сколько объявлений создавать, какую модель продвижения использовать.',
      },
      {
        number: '03',
        title: 'Семантика, УТП и офферы',
        description: 'Собираем реальные поисковые запросы Авито и формируем сильное УТП.',
      },
    ],
  },
  {
    id: 'creation',
    partLabel: 'Часть 2',
    rangeLabel: 'Шаги 4–7',
    title: 'Создание объявлений',
    caption: 'Собираем рабочие объявления — те, что продают.',
    steps: [
      {
        number: '04',
        title: 'Заголовки объявлений',
        description: 'Заголовки под реальные поисковые запросы Авито с учётом стадии спроса и алгоритма ранжирования.',
      },
      {
        number: '05',
        title: 'Тексты объявлений',
        description: 'Продающий текст: структура, аргументы доверия и призывы к действию для роста заявок.',
      },
      {
        number: '06',
        title: 'Фото и визуал',
        description: 'ТЗ на визуал: что на первом фото, как построить карусель, какие элементы повышают CTR.',
      },
      {
        number: '07',
        title: 'Профиль и доверие',
        description: 'Усиливаем доверие через оформление профиля, описание, отзывы и подтверждение опыта.',
      },
    ],
  },
  {
    id: 'growth',
    partLabel: 'Часть 3',
    rangeLabel: 'Шаги 8–10',
    title: 'Рост и масштабирование',
    caption: 'Запускаем то, что работает — и масштабируем.',
    steps: [
      {
        number: '08',
        title: 'Запуск и продвижение',
        description: 'Подбираем модель продвижения: CPX, усилители, прогноз просмотров — под категорию и тариф аккаунта.',
      },
      {
        number: '09',
        title: 'Контроль статистики',
        description: 'Анализируем показы, клики, CTR, контакты и стоимость обращения.',
      },
      {
        number: '10',
        title: 'Оптимизация и масштабирование',
        description: 'A/B-тесты, новые объявления, новые сегменты спроса и расширение рабочих связок.',
      },
    ],
  },
];

interface HowItWorksProps {
  onNavigateToChat?: () => void;
}

function StepCard({ number, title, description }: Step) {
  return (
    <div className="step-card">
      <div className="step-card-head">
        <span className="step-chip">Шаг {number}</span>
      </div>
      <h3 className="step-card-title">{title}</h3>
      <p className="step-card-desc">{description}</p>
    </div>
  );
}

function PartBanner({ part, index, total }: { part: Part; index: number; total: number }) {
  return (
    <div className="part-banner">
      <div className="part-banner-left">
        <div className="part-banner-progress">
          <span className="part-banner-num">{String(index + 1).padStart(2, '0')}</span>
          <span className="part-banner-divider">/</span>
          <span className="part-banner-total">{String(total).padStart(2, '0')}</span>
        </div>
        <div className="part-banner-bar" aria-hidden="true">
          <div
            className="part-banner-bar-fill"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>
      <div className="part-banner-text">
        <div className="part-banner-meta">
          <span className="part-banner-label">{part.partLabel}</span>
          <span className="part-banner-dot">·</span>
          <span className="part-banner-range">{part.rangeLabel}</span>
        </div>
        <div className="part-banner-title">{part.title}</div>
        <div className="part-banner-caption">{part.caption}</div>
      </div>
    </div>
  );
}

export function HowItWorks({ onNavigateToChat }: HowItWorksProps) {
  return (
    <section id="how-it-works" className="py-16 md:py-24 relative overflow-hidden">
      {/* Ambient bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(45% 50% at 20% 30%, rgba(111, 66, 193, 0.08), transparent 70%), radial-gradient(40% 50% at 85% 70%, rgba(154, 127, 224, 0.06), transparent 70%)',
        }}
      />

      <div className="container max-w-[1200px] mx-auto px-5">

        <Reveal>
          <div className="text-center mb-12 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight m-0 text-foreground">
              Как работает методология
            </h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              10 шагов, разбитые на 3 части. Каждый шаг — понятная задача для опытного авитолога, усиленного AI.
            </p>
          </div>
        </Reveal>

        <div className="parts-wrap">
          {PARTS.map((part, idx) => (
            <div key={part.id} className="part-block">
              <Reveal direction="up" distance={14}>
                <PartBanner part={part} index={idx} total={PARTS.length} />
              </Reveal>
              <div className="steps-grid mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-stretch md:auto-rows-fr">
                {part.steps.map((step, sIdx) => (
                  <RevealItem key={step.number} index={sIdx} staggerDelay={0.07}>
                    <StepCard
                      number={step.number}
                      title={step.title}
                      description={step.description}
                    />
                  </RevealItem>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="text-center mt-14">
            <Button
              size="lg"
              className="hero-cta-primary rounded-full px-8 md:px-10 text-sm md:text-base h-12"
              onClick={onNavigateToChat}
            >
              Начать с первого шага бесплатно →
            </Button>
            <div className="mt-3 text-[12px] text-muted-foreground">
              50 ₽ бонусом при регистрации — хватит на 10 ответов AI
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        .parts-wrap {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }
        @media (min-width: 768px) {
          .parts-wrap { gap: 64px; }
        }

        /* ===== PART BANNER (заменяет огромные фаза-номера) ===== */
        .part-banner {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 22px 24px;
          background: linear-gradient(135deg, rgba(111, 66, 193, 0.10), rgba(154, 127, 224, 0.02));
          border: 1px solid rgba(154, 127, 224, 0.22);
          border-radius: 16px;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .part-banner {
            flex-direction: row;
            align-items: center;
            gap: 28px;
            padding: 24px 28px;
          }
        }

        .part-banner-left {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }
        @media (min-width: 768px) {
          .part-banner-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            min-width: 160px;
            padding-right: 24px;
            border-right: 1px dashed rgba(255, 255, 255, 0.10);
          }
        }

        /* «01 / 03» — компактный счётчик */
        .part-banner-progress {
          display: inline-flex;
          align-items: baseline;
          gap: 2px;
          font-feature-settings: "tnum";
        }
        .part-banner-num {
          font-size: 32px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.03em;
          background: linear-gradient(180deg, #C5B0F0 0%, #6F42C1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        @media (min-width: 768px) {
          .part-banner-num { font-size: 40px; }
        }
        .part-banner-divider {
          font-size: 22px;
          color: rgba(255, 255, 255, 0.25);
          font-weight: 600;
          margin: 0 2px;
        }
        .part-banner-total {
          font-size: 18px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
        }

        /* Прогресс-бар */
        .part-banner-bar {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 999px;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .part-banner-bar { width: 100%; max-width: 140px; }
        }
        .part-banner-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6F42C1, #9A7FE0);
          border-radius: 999px;
          transition: width 0.6s ease-out;
        }

        .part-banner-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }
        .part-banner-meta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(154, 127, 224, 0.95);
        }
        .part-banner-dot { color: rgba(255, 255, 255, 0.30); }
        .part-banner-range { color: rgba(255, 255, 255, 0.6); font-weight: 700; }
        .part-banner-title {
          font-size: 22px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        @media (min-width: 768px) {
          .part-banner-title { font-size: 26px; }
        }
        .part-banner-caption {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.4;
        }
        @media (min-width: 768px) {
          .part-banner-caption { font-size: 15px; }
        }

        /* ===== STEP CARDS (упрощённые) ===== */
        .step-card {
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px 22px;
          background: linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005));
          background-color: var(--card);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          transition: border-color .2s, transform .2s, box-shadow .2s;
        }
        .step-card:hover {
          border-color: rgba(111, 66, 193, 0.40);
          transform: translateY(-2px);
          box-shadow: 0 10px 28px -8px rgba(111, 66, 193, 0.20);
        }

        .step-card-head {
          display: flex;
          align-items: center;
        }
        .step-chip {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #C5B0F0;
          background: rgba(111, 66, 193, 0.15);
          border: 1px solid rgba(111, 66, 193, 0.30);
          border-radius: 999px;
          font-feature-settings: "tnum";
        }
        .step-card:hover .step-chip {
          background: rgba(111, 66, 193, 0.25);
          color: #E0CFFF;
        }

        .step-card-title {
          font-size: 16px;
          font-weight: 700;
          line-height: 1.3;
          color: #FFFFFF;
          margin: 4px 0 0;
          letter-spacing: -0.01em;
        }
        @media (min-width: 768px) {
          .step-card-title { font-size: 17px; }
        }
        .step-card-desc {
          font-size: 13px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.65);
          margin: 0;
        }
        @media (min-width: 768px) {
          .step-card-desc { font-size: 14px; }
        }
      `}</style>
    </section>
  );
}
