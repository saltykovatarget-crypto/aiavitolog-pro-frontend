import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface HeroProps {
  onNavigateToChat?: () => void;
}

export function Hero({ onNavigateToChat }: HeroProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section py-12 md:py-16 lg:py-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="hero-bg-glow" aria-hidden="true" />

      <div className="container max-w-[1140px] mx-auto px-5 relative">
        <div className={`hero-grid ${animate ? 'hero-in' : ''}`}>

          {/* LEFT: text */}
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              <span>🎁 50 ₽ бонусом при регистрации</span>
            </div>

            <h1 className="hero-h1">
              Реклама на Авито<br />
              <span className="hero-h1-accent">от&nbsp;580&nbsp;₽</span>
            </h1>

            <p className="hero-lead">
              AI Авитолог PRO — ИИ-ассистент, проводит по 10-шаговой методологии:
              от анализа ниши до стабильного потока заявок.
            </p>

            <p className="hero-sub">
              Без подписок и лимитов. Платишь только за то, что используешь.<br />
              Деньги не сгорают. Работает в России без VPN.
            </p>

            <div className="hero-buttons">
              <Button
                size="lg"
                className="hero-cta-primary rounded-full px-8 md:px-10 text-sm md:text-base h-12"
                onClick={onNavigateToChat}
              >
                Начать — 50 ₽ на старт →
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-border hover:bg-accent/10 px-8 md:px-10 text-sm md:text-base h-12"
                onClick={() => scrollToSection('pricing')}
              >
                Как это работает
              </Button>
            </div>

            <div className="hero-compare">
              <span className="hero-compare-line">
                <span className="hero-compare-strike">Час консультации авитолога — 3 000 ₽</span>
              </span>
              <span className="hero-compare-line">
                <span className="hero-compare-strike">Агентство — от 50 000 ₽</span>
              </span>
              <span className="hero-compare-line hero-compare-line--win">
                AI Авитолог PRO — <b>от 580 ₽</b>
              </span>
            </div>
          </div>

          {/* RIGHT: product window */}
          <div className="hero-right">
            {/* Floating ambient badges */}
            <div className="hero-float hero-float--top-right" aria-hidden="true">
              <div className="hero-float-card">
                <div className="hero-float-dot hero-float-dot--green" />
                <div>
                  <div className="hero-float-label">Парсер</div>
                  <div className="hero-float-value">200 объявлений</div>
                </div>
              </div>
            </div>
            <div className="hero-float hero-float--bottom-left" aria-hidden="true">
              <div className="hero-float-card">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                <div>
                  <div className="hero-float-label">CTR</div>
                  <div className="hero-float-value">+187%</div>
                </div>
              </div>
            </div>

            <div className="window-frame">
              <div className="window-titlebar">
                <span className="window-dot window-dot--red" />
                <span className="window-dot window-dot--yellow" />
                <span className="window-dot window-dot--green" />
                <span className="window-url">aiavitologpro.ru / chat</span>
              </div>

              {/* Live product mockup */}
              <div className="mockup-body">
                {/* Sidebar */}
                <aside className="mockup-sidebar">
                  <div className="mockup-side-title">Методология · 10 шагов</div>
                  <ul className="mockup-steps">
                    <li className="mockup-step mockup-step--done"><span>✓</span>Анализ спроса</li>
                    <li className="mockup-step mockup-step--active"><span>2</span>Стратегия размещения</li>
                    <li className="mockup-step"><span>3</span>Семантика и УТП</li>
                    <li className="mockup-step"><span>4</span>Заголовки</li>
                    <li className="mockup-step mockup-step--muted"><span>5</span>Тексты объявлений</li>
                  </ul>
                </aside>

                {/* Chat */}
                <main className="mockup-chat">
                  <div className="mockup-msg mockup-msg--user">
                    Запускаю услуги юриста в Москве. Что важно проверить перед стартом?
                  </div>

                  <div className="mockup-msg mockup-msg--ai">
                    <div className="mockup-ai-head">
                      <span className="mockup-ai-avatar">AI</span>
                      <span className="mockup-ai-name">AI Авитолог</span>
                    </div>
                    Запустил парсер по нише <b>«юрист Москва»</b>. Вот что вижу:
                  </div>

                  {/* Parser card */}
                  <div className="mockup-parser-card">
                    <div className="mockup-parser-head">
                      <div className="mockup-parser-icon">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      </div>
                      <div className="mockup-parser-title">Парсер ниши · готов</div>
                      <div className="mockup-parser-tag">200 шт</div>
                    </div>
                    <div className="mockup-parser-stats">
                      <div className="mockup-stat">
                        <div className="mockup-stat-label">Конкурентов</div>
                        <div className="mockup-stat-value">47</div>
                      </div>
                      <div className="mockup-stat">
                        <div className="mockup-stat-label">Ср. цена</div>
                        <div className="mockup-stat-value">3 400 ₽</div>
                      </div>
                      <div className="mockup-stat">
                        <div className="mockup-stat-label">Лидер</div>
                        <div className="mockup-stat-value mockup-stat-value--brand">18%</div>
                      </div>
                    </div>
                    <div className="mockup-parser-bar" aria-hidden="true">
                      <div className="mockup-parser-bar-fill" />
                    </div>
                  </div>

                  <div className="mockup-msg mockup-msg--ai mockup-msg--compact">
                    <span className="mockup-typing"><span/><span/><span/></span>
                    AI Авитолог разбирает результат и формирует стратегию…
                  </div>
                </main>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .hero-section {
          isolation: isolate;
        }
        .hero-bg-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(60% 60% at 80% 20%, rgba(111, 66, 193, 0.18), transparent 60%),
            radial-gradient(50% 50% at 20% 80%, rgba(154, 127, 224, 0.10), transparent 70%);
          z-index: -1;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 2.5rem;
          align-items: center;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity .6s ease, transform .6s ease;
          min-width: 0;
        }
        .hero-grid > * { min-width: 0; }
        .hero-in {
          opacity: 1;
          transform: translateY(0);
        }
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.1fr);
            gap: 3.5rem;
          }
        }

        .hero-left {
          text-align: center;
        }
        @media (min-width: 1024px) {
          .hero-left { text-align: left; }
        }

        /* Eyebrow chip */
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          margin-bottom: 18px;
          background: rgba(20, 25, 38, 0.55);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(52, 211, 153, 0.30);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: rgba(255, 255, 255, 0.92);
        }
        .hero-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 10px rgba(52, 211, 153, 0.7);
          animation: hero-eyebrow-pulse 2s ease-in-out infinite;
        }
        @keyframes hero-eyebrow-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(52, 211, 153, 0.7); }
          50% { box-shadow: 0 0 18px rgba(52, 211, 153, 1); }
        }

        .hero-h1 {
          font-size: clamp(2rem, 4.5vw, 3.25rem);
          line-height: 1.05;
          color: var(--foreground);
          margin: 0 0 1.5rem;
          letter-spacing: -0.02em;
          font-weight: 600;
        }
        .hero-h1-accent {
          background: linear-gradient(180deg, #C5B0F0 0%, #6F42C1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 800;
        }

        /* Comparison rows */
        .hero-compare {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 22px;
          padding-top: 22px;
          border-top: 1px dashed rgba(255, 255, 255, 0.08);
          max-width: 420px;
        }
        @media (max-width: 1023px) {
          .hero-compare {
            margin-left: auto;
            margin-right: auto;
            text-align: left;
          }
        }
        .hero-compare-line {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.55);
          display: flex;
          align-items: baseline;
        }
        .hero-compare-strike {
          text-decoration: line-through;
          text-decoration-color: rgba(255, 0, 80, 0.4);
        }
        .hero-compare-line--win {
          color: #FFFFFF;
          font-weight: 600;
          padding-top: 4px;
          margin-top: 2px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 14px;
        }
        .hero-compare-line--win b {
          background: linear-gradient(180deg, #C5B0F0 0%, #6F42C1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 800;
        }
        .hero-lead {
          font-size: clamp(1.05rem, 1.7vw, 1.25rem);
          line-height: 1.55;
          color: var(--muted-foreground);
          margin: 0 0 0.875rem;
          max-width: 560px;
        }
        @media (min-width: 1024px) {
          .hero-lead { margin-left: 0; margin-right: 0; }
        }
        @media (max-width: 1023px) {
          .hero-lead { margin-left: auto; margin-right: auto; }
        }
        .hero-sub {
          font-size: 1rem;
          line-height: 1.55;
          color: var(--muted-foreground);
          opacity: 0.75;
          margin: 0 0 2rem;
          max-width: 500px;
        }
        @media (max-width: 1023px) {
          .hero-sub { margin-left: auto; margin-right: auto; }
        }

        .hero-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          justify-content: center;
        }
        @media (min-width: 640px) {
          .hero-buttons { flex-direction: row; }
        }
        @media (min-width: 1024px) {
          .hero-buttons { justify-content: flex-start; }
        }

        /* Window frame */
        .hero-right {
          position: relative;
          isolation: isolate;
          min-width: 0;
          max-width: 100%;
        }
        .hero-right::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(60% 50% at 50% 50%, rgba(111, 66, 193, 0.35), transparent 70%);
          filter: blur(48px);
          z-index: -1;
          pointer-events: none;
        }

        .window-frame {
          background: #0E1118;
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 12px;
          overflow: hidden;
          box-shadow:
            0 30px 60px -20px rgba(0, 0, 0, 0.6),
            0 18px 30px -15px rgba(111, 66, 193, 0.25);
          transform: rotate(0deg);
          transition: transform .4s ease;
        }
        @media (min-width: 1024px) {
          .window-frame:hover {
            transform: translateY(-4px);
          }
        }

        .window-titlebar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          background: #141926;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .window-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }
        .window-dot--red    { background: #ff5f57; }
        .window-dot--yellow { background: #febc2e; }
        .window-dot--green  { background: #28c840; }
        .window-url {
          margin-left: auto;
          margin-right: auto;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }

        /* ===== MOCKUP ===== */
        .mockup-body {
          display: grid;
          grid-template-columns: 1fr;
          background: #0E1118;
          min-height: 440px;
        }
        @media (min-width: 640px) {
          .mockup-body {
            grid-template-columns: 180px 1fr;
          }
        }
        @media (min-width: 1024px) {
          .mockup-body {
            grid-template-columns: 200px 1fr;
            min-height: 480px;
          }
        }

        .mockup-sidebar {
          display: none;
          padding: 18px 14px;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          background: linear-gradient(180deg, rgba(111, 66, 193, 0.06), transparent 50%);
        }
        @media (min-width: 640px) {
          .mockup-sidebar { display: block; }
        }
        .mockup-side-title {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
          margin-bottom: 14px;
        }
        .mockup-steps {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .mockup-step {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 9px;
          border-radius: 8px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.3;
        }
        .mockup-step span {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          display: grid;
          place-items: center;
          font-size: 10px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .mockup-step--done {
          color: rgba(255, 255, 255, 0.55);
        }
        .mockup-step--done span {
          background: rgba(52, 211, 153, 0.18);
          color: #34d399;
        }
        .mockup-step--active {
          background: rgba(111, 66, 193, 0.18);
          color: #FFFFFF;
          font-weight: 600;
        }
        .mockup-step--active span {
          background: linear-gradient(135deg, #6F42C1, #9A7FE0);
          color: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(111, 66, 193, 0.18);
        }
        .mockup-step--muted {
          opacity: 0.5;
        }

        .mockup-chat {
          padding: 18px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .mockup-chat { padding: 22px 22px; gap: 14px; }
        }

        .mockup-msg {
          font-size: 13px;
          line-height: 1.5;
          padding: 10px 14px;
          border-radius: 12px;
          max-width: 92%;
        }
        .mockup-msg--user {
          align-self: flex-end;
          background: linear-gradient(135deg, #6F42C1, #7A4FD0);
          color: #FFFFFF;
          border-bottom-right-radius: 4px;
        }
        .mockup-msg--ai {
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          color: rgba(255, 255, 255, 0.92);
          border-bottom-left-radius: 4px;
        }
        .mockup-msg--ai b {
          color: #9A7FE0;
          font-weight: 600;
        }
        .mockup-msg--compact {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.55);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
        }
        .mockup-ai-head {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }
        .mockup-ai-avatar {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          background: linear-gradient(135deg, #6F42C1, #9A7FE0);
          color: #FFFFFF;
          font-size: 9px;
          font-weight: 800;
          display: grid;
          place-items: center;
        }
        .mockup-ai-name {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.65);
        }

        /* Typing animation */
        .mockup-typing {
          display: inline-flex;
          gap: 3px;
        }
        .mockup-typing span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #9A7FE0;
          animation: mockup-typing 1.2s infinite ease-in-out;
        }
        .mockup-typing span:nth-child(2) { animation-delay: 0.2s; }
        .mockup-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes mockup-typing {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }

        /* Parser card */
        .mockup-parser-card {
          align-self: stretch;
          background: linear-gradient(180deg, rgba(111, 66, 193, 0.08), rgba(111, 66, 193, 0.02));
          border: 1px solid rgba(111, 66, 193, 0.25);
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mockup-parser-head {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .mockup-parser-icon {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: linear-gradient(135deg, #6F42C1, #9A7FE0);
          color: #FFFFFF;
          display: grid;
          place-items: center;
        }
        .mockup-parser-title {
          font-size: 12px;
          font-weight: 700;
          color: #FFFFFF;
          flex: 1;
        }
        .mockup-parser-tag {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 7px;
          border-radius: 5px;
          background: rgba(52, 211, 153, 0.15);
          color: #34d399;
          letter-spacing: 0.5px;
        }
        .mockup-parser-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .mockup-stat {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 8px 9px;
        }
        .mockup-stat-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
          margin-bottom: 2px;
        }
        .mockup-stat-value {
          font-size: 15px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }
        .mockup-stat-value--brand {
          background: linear-gradient(180deg, #9A7FE0, #6F42C1);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .mockup-parser-bar {
          height: 3px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 999px;
          overflow: hidden;
        }
        .mockup-parser-bar-fill {
          width: 88%;
          height: 100%;
          background: linear-gradient(90deg, #6F42C1, #9A7FE0);
          border-radius: 999px;
          animation: mockup-fill 2.4s ease-out forwards;
        }
        @keyframes mockup-fill {
          from { width: 0; }
          to { width: 88%; }
        }

        /* Floating ambient badges */
        .hero-float {
          position: absolute;
          z-index: 2;
          pointer-events: none;
          animation: hero-float-bob 4s ease-in-out infinite;
        }
        .hero-float--top-right {
          top: -18px;
          right: -16px;
          animation-delay: 0.3s;
        }
        .hero-float--bottom-left {
          bottom: -18px;
          left: -16px;
          animation-delay: 1.1s;
        }
        @keyframes hero-float-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .hero-float-card {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 14px;
          background: rgba(20, 25, 38, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 12px;
          box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.5);
        }
        .hero-float-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .hero-float-dot--green {
          background: #34d399;
          box-shadow: 0 0 12px rgba(52, 211, 153, 0.6);
        }
        .hero-float-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
        }
        .hero-float-value {
          font-size: 13px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }
        @media (max-width: 639px) {
          .hero-float { display: none; }
        }

        .window-image {
          display: block;
          width: 100%;
          height: auto;
        }
      `}</style>
    </section>
  );
}
