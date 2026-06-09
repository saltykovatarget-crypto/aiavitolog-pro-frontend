import React from 'react';
import { RevealItem } from './landing/Reveal';

type AudienceKey = 'avitologi' | 'business' | 'marketers';

interface Audience {
  key: AudienceKey;
  tag: string;
  title: string;
  description: string;
  benefits: string[];
  icon: React.ReactNode;
}

// Иконки в едином стиле с ToolsCatalog: 24×24, stroke 2, duotone (fill 0.22 + outline)
const ICON_AVITOLOGI = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* три фигуры — команда */}
    <circle cx="9" cy="8" r="3.5" fill="currentColor" fillOpacity="0.22" stroke="none" />
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20 C2.5 16.5, 5.5 14, 9 14 C12.5 14, 15.5 16.5, 15.5 20" fill="currentColor" fillOpacity="0.22" stroke="none" />
    <path d="M2.5 20 C2.5 16.5, 5.5 14, 9 14 C12.5 14, 15.5 16.5, 15.5 20" />
    <circle cx="17" cy="6" r="2.5" fill="currentColor" fillOpacity="0.22" stroke="none" />
    <circle cx="17" cy="6" r="2.5" />
    <path d="M14.5 13 C14.5 13, 16 12, 17 12 C19.5 12, 21.5 14, 21.5 16.5" />
  </svg>
);

const ICON_BUSINESS = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* портфель с trend */}
    <rect x="3" y="7" width="18" height="13" rx="2" fill="currentColor" fillOpacity="0.22" stroke="none" />
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7 V5 a1 1 0 0 1 1-1 h4 a1 1 0 0 1 1 1 V7" />
    <polyline points="7 16 10 13 13 15 17 11" />
    <polyline points="14 11 17 11 17 14" />
  </svg>
);

const ICON_MARKETERS = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* мишень + центр */}
    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.15" stroke="none" />
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5.5" fill="currentColor" fillOpacity="0.22" stroke="none" />
    <circle cx="12" cy="12" r="5.5" />
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
  </svg>
);

const AUDIENCES: Audience[] = [
  {
    key: 'avitologi',
    tag: 'Авитологи',
    title: 'Авитологам и специалистам по Авито',
    description: 'Для тех, кто уже работает с Авито и хочет быстрее и системнее принимать решения.',
    benefits: [
      'Структурирование анализа ниши, спроса и конкурентов',
      'Упрощение подготовки объявлений и стратегий',
      'Опора на данные, а не субъективные догадки',
    ],
    icon: ICON_AVITOLOGI,
  },
  {
    key: 'business',
    tag: 'Бизнес',
    title: 'Предпринимателям и владельцам бизнеса',
    description: 'Для тех, кто запускает или ведёт продажи на Авито и хочет понимать, что происходит в рекламе.',
    benefits: [
      'Понимание, за счёт чего идут заявки или почему их нет',
      'Контроль подрядчиков и рекламных решений',
      'Масштабирование рабочих связок без хаоса',
    ],
    icon: ICON_BUSINESS,
  },
  {
    key: 'marketers',
    tag: 'Маркетинг',
    title: 'Маркетологам и аналитикам',
    description: 'Для тех, кто отвечает за цифры, эффективность и рост.',
    benefits: [
      'Разбор объявлений через аналитику и гипотезы',
      'Поддержка A/B-тестирования и оптимизации',
      'Принятие решений на основе статистики, а не ощущений',
    ],
    icon: ICON_MARKETERS,
  },
];

function AudienceCard({ audience }: { audience: Audience }) {
  return (
    <div className={`who-card who-card--${audience.key}`}>
      <div className="who-card-head">
        <div className="who-icon">{audience.icon}</div>
        <div className="who-tag">{audience.tag}</div>
      </div>

      <h3 className="who-title">{audience.title}</h3>
      <p className="who-desc">{audience.description}</p>

      <ul className="who-benefits">
        {audience.benefits.map((b) => (
          <li key={b} className="who-benefit">
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WhoItsFor() {
  return (
    <section id="who-its-for" className="py-16 md:py-24 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(55% 50% at 50% 100%, rgba(154, 127, 224, 0.08), transparent 70%), radial-gradient(40% 40% at 10% 20%, rgba(111, 66, 193, 0.06), transparent 70%)',
        }}
      />
      <div className="container max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight m-0 text-foreground">
            Кому подойдет сервис
          </h2>
          <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto break-words hyphens-none">
            AI Авитолог PRO — это профессиональный нейроавитолог для системной работы с Авито, а не генератор случайных советов.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AUDIENCES.map((audience, index) => (
            <RevealItem key={audience.key} index={index} staggerDelay={0.12}>
              <AudienceCard audience={audience} />
            </RevealItem>
          ))}
        </div>
      </div>

      <style>{`
        .who-card {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 28px 26px;
          background: linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005));
          background-color: var(--card);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          overflow: hidden;
          transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
        }
        .who-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(154, 127, 224, 0.4), transparent);
          opacity: 0;
          transition: opacity .3s ease;
        }
        .who-card:hover {
          transform: translateY(-4px);
          border-color: rgba(111, 66, 193, 0.45);
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(111, 66, 193, 0.06);
        }
        .who-card:hover::before { opacity: 1; }
        .who-card:hover .who-icon {
          transform: scale(1.05);
          box-shadow: 0 8px 24px rgba(111, 66, 193, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .who-card-head {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .who-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6F42C1 0%, #9A7FE0 100%);
          color: #FFFFFF;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          box-shadow:
            0 4px 14px rgba(111, 66, 193, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .who-icon svg { width: 24px; height: 24px; }

        .who-tag {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #9A7FE0;
          background: rgba(111, 66, 193, 0.15);
          border: 1px solid rgba(111, 66, 193, 0.30);
          padding: 5px 11px;
          border-radius: 999px;
        }

        .who-title {
          font-size: 18px;
          font-weight: 700;
          line-height: 1.25;
          color: #FFFFFF;
          margin: 4px 0 0;
          letter-spacing: -0.01em;
        }
        @media (min-width: 768px) {
          .who-title { font-size: 20px; }
        }

        .who-desc {
          font-size: 14px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.65);
          margin: 0;
        }
        @media (min-width: 768px) {
          .who-desc { font-size: 15px; }
        }

        .who-benefits {
          list-style: none;
          padding: 16px 0 0;
          margin: auto 0 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .who-benefit {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.82);
        }
        @media (min-width: 768px) {
          .who-benefit { font-size: 14px; }
        }
        .who-benefit svg {
          color: #9A7FE0;
          flex-shrink: 0;
          margin-top: 3px;
        }
      `}</style>
    </section>
  );
}
