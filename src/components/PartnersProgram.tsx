import React from 'react';
import { Button } from './ui/button';
import { Reveal, RevealItem } from './landing/Reveal';

interface PartnersProgramProps {
  onApply?: () => void;
}

const STEPS = [
  {
    num: '01',
    title: 'Регистрируешься',
    desc: 'Заявка через форму — бесплатно. После одобрения получаешь личный кабинет партнёра.',
  },
  {
    num: '02',
    title: 'Получаешь ссылку',
    desc: 'Уникальная реферальная ссылка. Делишься в TG-канале, рассылке, на консультациях.',
  },
  {
    num: '03',
    title: 'Получаешь 5%',
    desc: 'С первого пополнения каждого приведённого клиента — на твой партнёрский баланс.',
  },
];

const EXAMPLES = [
  { paid: 1000, commission: 50 },
  { paid: 1500, commission: 75, highlighted: true },
  { paid: 3000, commission: 150 },
  { paid: 5000, commission: 250 },
];

const ICON_LINK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="6" width="18" height="12" rx="2.5" fill="currentColor" fillOpacity="0.22" stroke="none" />
    <rect x="3" y="6" width="18" height="12" rx="2.5" />
    <path d="M7 12 H17" />
    <path d="M13 9 L17 12 L13 15" />
  </svg>
);

const ICON_USER = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="4" fill="currentColor" fillOpacity="0.22" stroke="none" />
    <circle cx="12" cy="9" r="4" />
    <path d="M3 21 C3 17, 7 14.5, 12 14.5 C17 14.5, 21 17, 21 21" fill="currentColor" fillOpacity="0.22" stroke="none" />
    <path d="M3 21 C3 17, 7 14.5, 12 14.5 C17 14.5, 21 17, 21 21" />
  </svg>
);

const ICON_WALLET = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="14" rx="2.5" fill="currentColor" fillOpacity="0.22" stroke="none" />
    <rect x="2" y="6" width="20" height="14" rx="2.5" />
    <path d="M2 10 H22" />
    <circle cx="17" cy="15" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);

const STEP_ICONS = [ICON_USER, ICON_LINK, ICON_WALLET];

export function PartnersProgram({ onApply }: PartnersProgramProps) {
  return (
    <section id="partners" className="partners-section py-12 md:py-16 relative overflow-hidden">
      {/* Ambient bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(50% 50% at 80% 20%, rgba(111, 66, 193, 0.12), transparent 70%), radial-gradient(45% 50% at 15% 80%, rgba(154, 127, 224, 0.08), transparent 70%)',
        }}
      />

      <div className="container max-w-[1200px] mx-auto px-5">

        {/* Header */}
        <Reveal>
          <div className="text-center mb-8 md:mb-10">
            <div className="partners-eyebrow">
              <span className="partners-eyebrow-dot" />
              <span>Партнёрская программа</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight m-0 text-foreground mt-5">
              Приведи клиента —{' '}
              <span className="partners-h2-accent">получи 5%</span>
            </h2>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              5% с первого пополнения каждого приведённого клиента. Сразу на партнёрский баланс.
              Без условий, без лимитов, без ожидания.
            </p>
          </div>
        </Reveal>

        {/* Big percent block */}
        <Reveal delay={0.1}>
          <div className="partners-big">
            <div className="partners-big-num">
              <span className="partners-big-percent">5</span>
              <span className="partners-big-sign">%</span>
            </div>
            <div className="partners-big-text">
              <div className="partners-big-title">с первого пополнения реферала</div>
              <div className="partners-big-sub">
                Разовая выплата. Без tier'ов, без условий по объёму, без срока.
                Чем чаще приводишь — тем больше зарабатываешь.
              </div>
            </div>
          </div>
        </Reveal>

        {/* Examples table */}
        <Reveal delay={0.15}>
          <div className="partners-examples">
            <div className="partners-examples-label">Сколько ты получишь с одного реферала</div>
            <div className="partners-examples-grid">
              {EXAMPLES.map((ex, i) => (
                <RevealItem key={ex.paid} index={i} staggerDelay={0.08}>
                  <div className={`partners-example ${ex.highlighted ? 'partners-example--popular' : ''}`}>
                    {ex.highlighted && <div className="partners-example-badge">⭐ Чаще всего</div>}
                    <div className="partners-example-row">
                      <span className="partners-example-label-l">Реферал положил</span>
                      <span className="partners-example-paid">{ex.paid.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="partners-example-arrow">↓</div>
                    <div className="partners-example-row">
                      <span className="partners-example-label-l">Тебе</span>
                      <span className="partners-example-commission">+{ex.commission} ₽</span>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </div>
          </div>
        </Reveal>

        {/* How it works */}
        <Reveal delay={0.1}>
          <div className="partners-how">
            <div className="partners-how-title">Как это работает</div>
            <div className="partners-how-grid">
              {STEPS.map((step, i) => (
                <RevealItem key={step.num} index={i} staggerDelay={0.1}>
                  <div className="partners-how-card">
                    <div className="partners-how-icon">{STEP_ICONS[i]}</div>
                    <div className="partners-how-num">{step.num}</div>
                    <div className="partners-how-step-title">{step.title}</div>
                    <p className="partners-how-step-desc">{step.desc}</p>
                  </div>
                </RevealItem>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Earnings projection */}
        <Reveal delay={0.15}>
          <div className="partners-projection">
            <div className="partners-projection-label">Пример: 50 приведённых клиентов</div>
            <div className="partners-projection-eq">
              <span>50 рефералов</span>
              <span className="partners-projection-sep">×</span>
              <span>1 500 ₽</span>
              <span className="partners-projection-sep">×</span>
              <span>5%</span>
              <span className="partners-projection-sep">=</span>
              <span className="partners-projection-result">3 750 ₽</span>
            </div>
            <p className="partners-projection-note">
              Средний чек первого пополнения ≈ 1 500 ₽ (пакет запросов или пополнение под проект).
              Чем больше клиентов — тем больше пассивный заработок.
            </p>
          </div>
        </Reveal>

        {/* Why this model */}
        <Reveal delay={0.1}>
          <div className="partners-why">
            <div className="partners-why-item">
              <div className="partners-why-check">✓</div>
              <div>
                <div className="partners-why-title">Разовая выплата, не lifetime</div>
                <div className="partners-why-text">Получаешь свои 5% сразу. Не ждёшь годами, не зависишь от того, останется ли клиент с нами.</div>
              </div>
            </div>
            <div className="partners-why-item">
              <div className="partners-why-check">✓</div>
              <div>
                <div className="partners-why-title">Без условий и tier'ов</div>
                <div className="partners-why-text">Не нужно «набирать 10 активных». Один клиент привёл — один бонус получил.</div>
              </div>
            </div>
            <div className="partners-why-item">
              <div className="partners-why-check">✓</div>
              <div>
                <div className="partners-why-title">Вывод от 1 000 ₽</div>
                <div className="partners-why-text">На карту, СБП или USDT TRC-20. До 7 рабочих дней.</div>
              </div>
            </div>
            <div className="partners-why-item">
              <div className="partners-why-check">✓</div>
              <div>
                <div className="partners-why-title">Прозрачная статистика</div>
                <div className="partners-why-text">В личном кабинете партнёра: кто перешёл, кто пополнил, сколько начислено.</div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.15}>
          <div className="partners-cta">
            <Button
              size="lg"
              className="hero-cta-primary rounded-full px-8 md:px-10 text-sm md:text-base h-12"
              onClick={onApply}
            >
              Стать партнёром →
            </Button>
            <p className="partners-cta-note">
              Без вложений · Без обязательных продаж · Начать можно сегодня
            </p>
          </div>
        </Reveal>

      </div>

      <style>{`
        .partners-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          background: rgba(20, 25, 38, 0.55);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(154, 127, 224, 0.35);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
        }
        .partners-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 10px rgba(52, 211, 153, 0.7);
          animation: partners-pulse 2s ease-in-out infinite;
        }
        @keyframes partners-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(52, 211, 153, 0.7); }
          50% { box-shadow: 0 0 18px rgba(52, 211, 153, 1); }
        }
        .partners-h2-accent {
          background: linear-gradient(180deg, #C5B0F0 0%, #6F42C1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* ===== Big percent block ===== */
        .partners-big {
          margin: 0 auto 24px;
          max-width: 640px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 24px;
          background: linear-gradient(135deg, rgba(111, 66, 193, 0.16), rgba(154, 127, 224, 0.04));
          border: 1px solid rgba(154, 127, 224, 0.32);
          border-radius: 20px;
          box-shadow: 0 16px 40px -16px rgba(111, 66, 193, 0.4);
        }
        @media (max-width: 639px) {
          .partners-big { flex-direction: column; text-align: center; padding: 22px; gap: 14px; }
        }
        .partners-big-num {
          display: flex;
          align-items: baseline;
          gap: 2px;
          flex-shrink: 0;
        }
        .partners-big-percent {
          font-size: 64px;
          font-weight: 900;
          line-height: 0.9;
          background: linear-gradient(180deg, #C5B0F0 0%, #6F42C1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: -0.05em;
          font-feature-settings: "tnum";
        }
        @media (max-width: 639px) {
          .partners-big-percent { font-size: 52px; }
        }
        .partners-big-sign {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(180deg, #C5B0F0 0%, #6F42C1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: -0.02em;
        }
        @media (max-width: 639px) {
          .partners-big-sign { font-size: 28px; }
        }
        .partners-big-title {
          font-size: 18px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }
        @media (min-width: 768px) {
          .partners-big-title { font-size: 20px; }
        }
        .partners-big-sub {
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.65);
          margin-top: 4px;
        }
        @media (min-width: 768px) {
          .partners-big-sub { font-size: 14px; }
        }

        /* ===== Examples grid ===== */
        .partners-examples {
          margin-top: 20px;
        }
        .partners-examples-label {
          text-align: center;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 18px;
        }
        .partners-examples-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 768px) {
          .partners-examples-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; }
        }
        .partners-example {
          position: relative;
          padding: 18px 16px;
          background: var(--card);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          transition: border-color .2s, transform .2s;
        }
        .partners-example:hover {
          border-color: rgba(154, 127, 224, 0.45);
          transform: translateY(-2px);
        }
        .partners-example--popular {
          background: linear-gradient(180deg, rgba(111, 66, 193, 0.10), rgba(111, 66, 193, 0.02));
          border-color: rgba(111, 66, 193, 0.45);
        }
        .partners-example-badge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          padding: 3px 9px;
          background: linear-gradient(135deg, #6F42C1, #9A7FE0);
          color: #FFFFFF;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          border-radius: 999px;
          box-shadow: 0 4px 14px rgba(111, 66, 193, 0.45);
          white-space: nowrap;
        }
        .partners-example-row {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .partners-example-label-l {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
        }
        .partners-example-paid {
          font-size: 18px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.85);
          font-feature-settings: "tnum";
        }
        .partners-example-arrow {
          font-size: 16px;
          color: rgba(154, 127, 224, 0.55);
        }
        .partners-example-commission {
          font-size: 22px;
          font-weight: 800;
          background: linear-gradient(180deg, #C5B0F0 0%, #6F42C1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: -0.02em;
          font-feature-settings: "tnum";
        }

        /* ===== How it works ===== */
        .partners-how {
          margin-top: 32px;
        }
        .partners-how-title {
          text-align: center;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 18px;
        }
        .partners-how-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 768px) {
          .partners-how-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; }
        }
        .partners-how-card {
          background: var(--card);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: border-color .25s, transform .25s;
        }
        .partners-how-card:hover {
          border-color: rgba(154, 127, 224, 0.35);
          transform: translateY(-2px);
        }
        .partners-how-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6F42C1 0%, #9A7FE0 100%);
          color: #FFFFFF;
          display: grid;
          place-items: center;
          box-shadow: 0 4px 14px rgba(111, 66, 193, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        .partners-how-icon svg { width: 22px; height: 22px; }
        .partners-how-num {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: rgba(154, 127, 224, 0.8);
          margin-top: 4px;
        }
        .partners-how-step-title {
          font-size: 17px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }
        @media (min-width: 768px) {
          .partners-how-step-title { font-size: 18px; }
        }
        .partners-how-step-desc {
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.65);
          margin: 0;
        }

        /* ===== Projection ===== */
        .partners-projection {
          margin-top: 24px;
          padding: 22px 24px;
          background: linear-gradient(135deg, rgba(111, 66, 193, 0.10), rgba(52, 211, 153, 0.04));
          border: 1px solid rgba(154, 127, 224, 0.22);
          border-radius: 16px;
        }
        @media (min-width: 768px) {
          .partners-projection { padding: 26px 30px; }
        }
        .partners-projection-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #9A7FE0;
          margin-bottom: 10px;
        }
        .partners-projection-eq {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }
        @media (min-width: 768px) {
          .partners-projection-eq { font-size: 19px; gap: 14px; }
        }
        .partners-projection-sep {
          color: rgba(255, 255, 255, 0.4);
          font-weight: 400;
        }
        .partners-projection-result {
          color: #34d399;
          font-weight: 800;
          font-feature-settings: "tnum";
        }
        .partners-projection-note {
          font-size: 13px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.65);
          margin: 8px 0 0;
        }

        /* ===== Why ===== */
        .partners-why {
          margin-top: 24px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 768px) {
          .partners-why { grid-template-columns: repeat(2, 1fr); gap: 18px; }
        }
        .partners-why-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
        }
        .partners-why-check {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(52, 211, 153, 0.18);
          color: #34d399;
          display: grid;
          place-items: center;
          font-size: 12px;
          font-weight: 800;
          margin-top: 1px;
        }
        .partners-why-title {
          font-size: 14px;
          font-weight: 700;
          color: #FFFFFF;
        }
        .partners-why-text {
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 2px;
        }

        /* ===== CTA ===== */
        .partners-cta {
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .partners-cta-note {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
          text-align: center;
        }
      `}</style>
    </section>
  );
}
