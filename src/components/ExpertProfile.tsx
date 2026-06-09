import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CountUp } from './landing/CountUp';
import { Reveal, RevealItem } from './landing/Reveal';

const EXPERT_STATS = [
  { to: 7, suffix: '+', label: 'лет в Авито-рекламе' },
  { to: 50, suffix: '+', label: 'ниш и категорий' },
  { to: 10, suffix: '', label: 'шагов методологии' },
];

const EXPERT_CREDENTIALS = [
  'Запускала проекты от соло-юристов до агентств',
  'Разобрала сотни ниш — услуги, товары, B2B',
  'Прошла через все обновления алгоритмов Авито',
  'Собственная методология, не теория из курсов',
];

export function ExpertProfile() {
  return (
    <section id="expert" className="expert-section py-16 md:py-24 relative overflow-hidden">
      {/* Ambient bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(45% 50% at 20% 30%, rgba(111, 66, 193, 0.10), transparent 70%), radial-gradient(40% 50% at 85% 70%, rgba(154, 127, 224, 0.07), transparent 70%)',
        }}
      />

      <div className="container max-w-[1200px] mx-auto px-5">

        {/* Section header */}
        <div className="text-center mb-12 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight m-0 text-foreground">
            Кто стоит за AI&nbsp;Авитолог PRO
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Это не очередной AI-генератор от стартаперов.
            За продуктом — практикующий авитолог с реальными кейсами.
          </p>
        </div>

        <div className="expert-grid">

          {/* LEFT: Photo */}
          <div className="expert-photo-wrap">
            <div className="expert-photo-glow" aria-hidden="true" />
            <div className="expert-photo-frame">
              <ImageWithFallback
                src="/expert/valeriia-saltykova.jpg"
                alt="Валерия Салтыкова — создатель AI Авитолог PRO"
                className="expert-photo-img"
              />
              {/* Sticker label */}
              <div className="expert-sticker">
                <div className="expert-sticker-dot" />
                <div>
                  <div className="expert-sticker-name">Валерия Салтыкова</div>
                  <div className="expert-sticker-role">Создатель AI Авитолог PRO</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Content */}
          <div className="expert-content">

            {/* Stats row */}
            <div className="expert-stats">
              {EXPERT_STATS.map((s, i) => (
                <RevealItem key={s.label} index={i} staggerDelay={0.12}>
                  <div className="expert-stat">
                    <div className="expert-stat-value">
                      <CountUp to={s.to} suffix={s.suffix} />
                    </div>
                    <div className="expert-stat-label">{s.label}</div>
                  </div>
                </RevealItem>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="expert-quote">
              «Я устала смотреть, как авитологи дают советы из методичек,
              а предприниматели сливают бюджет на хаос. Поэтому собрала
              всё, что работает, в одну систему — и научила этому AI».
            </blockquote>

            {/* Credentials list */}
            <ul className="expert-creds">
              {EXPERT_CREDENTIALS.map((c) => (
                <li key={c} className="expert-cred">
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
                  <span>{c}</span>
                </li>
              ))}
            </ul>

            {/* Closing line */}
            <p className="expert-closing">
              Сервис регулярно обновляется: Авито меняется — методология
              и AI Авитолог PRO меняются вместе с ним.
            </p>

          </div>
        </div>

      </div>

      <style>{`
        .expert-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 36px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .expert-grid {
            grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
            gap: 56px;
          }
        }

        /* ===== Photo ===== */
        .expert-photo-wrap {
          position: relative;
          max-width: 420px;
          margin: 0 auto;
          width: 100%;
        }
        .expert-photo-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(60% 60% at 50% 50%, rgba(111, 66, 193, 0.35), transparent 70%);
          filter: blur(40px);
          z-index: 0;
        }
        .expert-photo-frame {
          position: relative;
          aspect-ratio: 4 / 5;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: var(--card);
          box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.5);
        }
        .expert-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .expert-sticker {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(14, 17, 24, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
        }
        .expert-sticker-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 12px rgba(52, 211, 153, 0.6);
          flex-shrink: 0;
        }
        .expert-sticker-name {
          font-size: 14px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }
        .expert-sticker-role {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 1px;
        }

        /* ===== Content ===== */
        .expert-content {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* Stats */
        .expert-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 18px;
          background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
        }
        @media (min-width: 640px) {
          .expert-stats { padding: 22px 24px; gap: 16px; }
        }
        .expert-stat {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }
        .expert-stat-value {
          font-size: 28px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.03em;
          background: linear-gradient(180deg, #9A7FE0 0%, #6F42C1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-feature-settings: "tnum";
        }
        @media (min-width: 768px) {
          .expert-stat-value { font-size: 36px; }
        }
        .expert-stat-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.3;
        }
        @media (min-width: 768px) {
          .expert-stat-label { font-size: 12px; }
        }

        /* Quote */
        .expert-quote {
          margin: 0;
          padding: 20px 22px;
          font-size: 16px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.92);
          font-weight: 500;
          font-style: italic;
          background: linear-gradient(135deg, rgba(111, 66, 193, 0.10) 0%, rgba(154, 127, 224, 0.04) 100%);
          border-left: 3px solid #6F42C1;
          border-radius: 0 14px 14px 0;
          letter-spacing: -0.005em;
        }
        @media (min-width: 768px) {
          .expert-quote { font-size: 17px; padding: 22px 26px; }
        }

        /* Credentials */
        .expert-creds {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        @media (min-width: 640px) {
          .expert-creds { grid-template-columns: repeat(2, 1fr); gap: 12px 24px; }
        }
        .expert-cred {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.85);
        }
        .expert-cred svg {
          color: #9A7FE0;
          flex-shrink: 0;
          margin-top: 4px;
        }
        @media (min-width: 768px) {
          .expert-cred { font-size: 15px; }
        }

        /* Closing */
        .expert-closing {
          margin: 0;
          padding-top: 4px;
          font-size: 14px;
          line-height: 1.55;
          color: var(--muted-foreground);
        }
        @media (min-width: 768px) {
          .expert-closing { font-size: 15px; }
        }
      `}</style>
    </section>
  );
}
