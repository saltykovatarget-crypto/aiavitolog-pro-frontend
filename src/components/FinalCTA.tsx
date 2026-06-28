import React from 'react';
import { Button } from './ui/button';
import { Reveal } from './landing/Reveal';

interface FinalCTAProps {
  onNavigateToChat?: () => void;
}

const TRUST = [
  'Деньги не сгорают',
  'Без подписки навсегда',
  'Работает без VPN',
];

export function FinalCTA({ onNavigateToChat }: FinalCTAProps) {
  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="final-cta" className="final-cta-section py-16 md:py-24 relative overflow-hidden">
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(45% 60% at 50% 30%, rgba(111, 66, 193, 0.12), transparent 70%), radial-gradient(35% 35% at 15% 80%, rgba(154, 127, 224, 0.08), transparent 70%)',
        }}
      />

      <div className="container max-w-[1200px] mx-auto px-5 relative">
        <Reveal>
          <div className="final-content">
            {/* AI Pill */}
            <div className="final-eyebrow">
              <span className="final-eyebrow-dot" />
              <span>AI Авитолог PRO · готов к работе</span>
            </div>

            <h2 className="final-h2">
              Готов <span className="final-h2-accent">начать</span>?
            </h2>

            <p className="final-sub">
              50 ₽ бонусом при регистрации. Кошелёк в рублях, без подписок и лимитов.
            </p>

            {/* CTAs */}
            <div className="final-buttons">
              <Button
                onClick={onNavigateToChat}
                size="lg"
                className="hero-cta-primary rounded-full px-8 md:px-10 text-sm md:text-base h-12"
              >
                Начать прямо сейчас →
              </Button>
              <Button
                onClick={scrollToPricing}
                variant="outline"
                size="lg"
                className="rounded-full border-border hover:bg-accent/10 px-8 md:px-10 text-sm md:text-base h-12"
              >
                Как это работает
              </Button>
            </div>

            {/* Trust badges */}
            <div className="final-trust">
              {TRUST.map((t) => (
                <div key={t} className="final-trust-item">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        .final-cta-section {
          isolation: isolate;
        }

        .final-content {
          text-align: center;
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }
        @media (min-width: 768px) {
          .final-content { gap: 24px; }
        }

        .final-eyebrow {
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
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.82);
        }
        .final-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 10px rgba(52, 211, 153, 0.7);
          animation: final-dot-pulse 2s ease-in-out infinite;
        }
        @keyframes final-dot-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(52, 211, 153, 0.7); }
          50% { box-shadow: 0 0 18px rgba(52, 211, 153, 1); }
        }

        .final-h2 {
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #FFFFFF;
          margin: 0;
        }
        .final-h2-accent {
          background: linear-gradient(180deg, #C5B0F0 0%, #6F42C1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 800;
        }

        .final-sub {
          font-size: 15px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.65);
          margin: 0;
          max-width: 560px;
        }
        @media (min-width: 768px) {
          .final-sub { font-size: 17px; }
        }

        .final-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 4px;
          width: 100%;
          max-width: 460px;
        }
        @media (min-width: 640px) {
          .final-buttons {
            flex-direction: row;
            justify-content: center;
            gap: 12px;
            max-width: none;
            width: auto;
          }
        }

        .final-trust {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px 18px;
          margin-top: 8px;
        }
        .final-trust-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.55);
        }
        .final-trust-item svg {
          color: #34d399;
          flex-shrink: 0;
        }
      `}</style>
    </section>
  );
}
