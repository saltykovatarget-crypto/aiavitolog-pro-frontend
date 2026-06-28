import React from 'react';
import { MessageCircle, Search, BarChart3, Image as ImageIcon, Pencil, Radar } from 'lucide-react';
import { Reveal, RevealItem } from './landing/Reveal';

interface WalletInfoProps {
  /** Колбэк при нажатии на CTA (Зарегистрироваться) */
  onRegister?: () => void;
}

interface WalletAction {
  Icon: React.ComponentType<{ className?: string }>;
  name: string;
  price: number;
  hint?: string;
}

const ACTIONS: WalletAction[] = [
  { Icon: MessageCircle, name: 'Ответ AI Авитолога', price: 5 },
  { Icon: Search, name: 'Парсер конкурентов', price: 190, hint: 'AI Авитолог находит точки роста без слива бюджета' },
  { Icon: BarChart3, name: 'Анализ статистики кабинета Авито', price: 50, hint: 'Заливаешь XLS — AI Авитолог разбирает и показывает слабые места' },
  { Icon: ImageIcon, name: 'Генерация фото для объявлений', price: 19 },
  { Icon: Pencil, name: 'Наложение плашки на фото', price: 9 },
  { Icon: Radar, name: 'Проверка позиций объявлений', price: 99 },
];

const PACKAGES = [
  { requests: 100, paid: 390, credit: 500, savings: 22 },
  { requests: 300, paid: 990, credit: 1500, savings: 34, highlighted: true },
  { requests: 500, paid: 1490, credit: 2500, savings: 40 },
];

const COMPARISON = [
  { name: 'Час консультации авитолога', price: '3 000 – 5 000 ₽', highlight: false },
  { name: 'Агентство (месяц работы)', price: 'от 50 000 ₽', highlight: false },
  { name: 'Курсы по Авито', price: '30 000 – 100 000 ₽', highlight: false },
  { name: 'AI Авитолог PRO (один проект)', price: 'от 580 ₽', highlight: true },
];

export function WalletInfo({ onRegister }: WalletInfoProps) {
  return (
    <section id="pricing" className="wallet-info-section py-16 md:py-24 relative overflow-hidden">
      {/* Ambient bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(45% 60% at 50% 30%, rgba(111, 66, 193, 0.12), transparent 70%), radial-gradient(35% 35% at 15% 80%, rgba(154, 127, 224, 0.08), transparent 70%)',
        }}
      />

      <div className="container max-w-[1200px] mx-auto px-5">

        {/* Header */}
        <Reveal>
          <div className="text-center mb-10 md:mb-14">
            <div className="wi-eyebrow">
              <span className="wi-eyebrow-dot" />
              <span>Без подписок · без лимитов · деньги не сгорают</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight m-0 text-foreground mt-5">
              Цены
            </h2>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              Один кошелёк в рублях. Платишь только за то, что используешь.
              Регистрация даёт <span className="text-foreground font-semibold">50 ₽ бонусом</span>.
            </p>
          </div>
        </Reveal>

        {/* Bonus card */}
        <Reveal delay={0.1}>
          <div className="wi-bonus">
            <div className="wi-bonus-emoji">🎁</div>
            <div className="wi-bonus-text">
              <div className="wi-bonus-title">50 ₽ бонусом при регистрации</div>
              <div className="wi-bonus-sub">Хватит на 10 ответов AI Авитолога чтобы попробовать без вложений</div>
            </div>
          </div>
        </Reveal>

        {/* Two columns: Цены | Пакеты */}
        <div className="wi-grid">
          {/* Left: Цены действий */}
          <Reveal direction="up" delay={0.1}>
            <div className="wi-card">
              <div className="wi-card-title">Цены действий</div>
              <div className="wi-actions">
                {ACTIONS.map((a, i) => (
                  <RevealItem key={a.name} index={i} staggerDelay={0.06}>
                    <div className="wi-action">
                      <div className="wi-action-left">
                        <div
                          className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg, #6F42C1, #9A7FE0)' }}
                        >
                          <a.Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="wi-action-text">
                          <span className="wi-action-name">{a.name}</span>
                          {a.hint && <span className="wi-action-hint">{a.hint}</span>}
                        </div>
                      </div>
                      <div className="wi-action-price">
                        <span className="wi-action-amount">{a.price}</span>
                        <span className="wi-action-rub">₽</span>
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right: Пакеты пополнения */}
          <Reveal direction="up" delay={0.2}>
            <div className="wi-card">
              <div className="wi-card-title">Пакеты пополнения</div>
              <div className="wi-packages">
                {PACKAGES.map((p, i) => (
                  <RevealItem key={p.requests} index={i} staggerDelay={0.08}>
                    <div className={`wi-package ${p.highlighted ? 'wi-package--popular' : ''}`}>
                      {p.highlighted && (
                        <div
                          className="wi-package-badge"
                          style={{ background: 'linear-gradient(90deg, #6F42C1, #9A7FE0)', color: '#fff', fontWeight: 700 }}
                        >
                          ПОПУЛЯРНЫЙ
                        </div>
                      )}
                      <div className="wi-package-head">
                        <div className="wi-package-requests">{p.requests} запросов</div>
                        <div className="wi-package-paid">{p.paid.toLocaleString('ru-RU')} ₽</div>
                      </div>
                      <div className="wi-package-foot">
                        <div className="wi-package-credit">
                          На кошелёк: <span className="wi-package-credit-amount">{p.credit.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className="wi-package-savings">−{p.savings}%</div>
                      </div>
                    </div>
                  </RevealItem>
                ))}
                <div className="wi-regular">
                  <div className="wi-regular-label">Или произвольная сумма:</div>
                  <div className="wi-regular-amount">от 100 ₽</div>
                  <div className="wi-regular-note">сколько положишь, столько и зачислится</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Comparison */}
        <Reveal delay={0.15}>
          <div className="wi-compare">
            <div className="wi-compare-title">Сравни с альтернативами</div>
            <div className="wi-compare-rows">
              {COMPARISON.map((row, i) => (
                <RevealItem key={row.name} index={i} staggerDelay={0.07}>
                  <div className={`wi-compare-row ${row.highlight ? 'wi-compare-row--highlight' : ''}`}>
                    <div className="wi-compare-name">{row.name}</div>
                    <div className="wi-compare-price">{row.price}</div>
                  </div>
                </RevealItem>
              ))}
            </div>
            <div className="wi-compare-note">
              Один проект под ключ — пакет 100 запросов + парсер ниши = <b>580 ₽</b>
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.2}>
          <div className="wi-cta">
            <button
              type="button"
              className="hero-cta-primary rounded-full px-8 md:px-10 text-sm md:text-base h-12 inline-flex items-center justify-center font-semibold"
              onClick={onRegister}
            >
              Зарегистрироваться — 50 ₽ на старт →
            </button>
            <div className="wi-cta-note">
              Без карты на старте · оплата только через Точка Банк
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        /* ==== Eyebrow ==== */
        .wi-eyebrow {
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
        .wi-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 10px rgba(52, 211, 153, 0.7);
        }

        /* ==== Bonus card ==== */
        .wi-bonus {
          margin: 8px auto 36px;
          max-width: 560px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          background: linear-gradient(135deg, rgba(52, 211, 153, 0.10), rgba(111, 66, 193, 0.08));
          border: 1px solid rgba(52, 211, 153, 0.25);
          border-radius: 16px;
        }
        .wi-bonus-emoji {
          font-size: 36px;
          flex-shrink: 0;
        }
        .wi-bonus-title {
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }
        @media (min-width: 768px) {
          .wi-bonus-title { font-size: 18px; }
        }
        .wi-bonus-sub {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.65);
          margin-top: 2px;
        }

        /* ==== Grid 2 cols ==== */
        .wi-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          margin-top: 12px;
        }
        @media (min-width: 900px) {
          .wi-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
        }

        .wi-card {
          background: var(--card);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 24px 22px;
        }
        @media (min-width: 768px) {
          .wi-card { padding: 28px 26px; }
        }
        .wi-card-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 16px;
        }

        /* ==== Actions ==== */
        .wi-actions {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .wi-action {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          padding: 12px 0;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.06);
        }
        .wi-action:last-child { border-bottom: none; }
        .wi-action-left {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          min-width: 0;
          flex: 1;
        }
        .wi-action-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .wi-action-name {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.3;
        }
        @media (min-width: 768px) {
          .wi-action-name { font-size: 15px; }
        }
        .wi-action-hint {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.35;
        }
        @media (min-width: 768px) {
          .wi-action-hint { font-size: 12.5px; }
        }
        .wi-action-price {
          flex-shrink: 0;
          padding-top: 2px;
        }
        .wi-action-price {
          display: inline-flex;
          align-items: baseline;
          gap: 2px;
          flex-shrink: 0;
        }
        .wi-action-amount {
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
          font-feature-settings: "tnum";
          letter-spacing: -0.01em;
        }
        .wi-action-rub {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
        }

        /* ==== Packages ==== */
        .wi-packages {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .wi-package {
          position: relative;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          transition: border-color .2s, transform .2s;
        }
        .wi-package:hover {
          border-color: rgba(154, 127, 224, 0.35);
          transform: translateY(-1px);
        }
        .wi-package--popular {
          background: linear-gradient(180deg, rgba(111, 66, 193, 0.10), rgba(111, 66, 193, 0.02));
          border-color: rgba(111, 66, 193, 0.45);
        }
        .wi-package-badge {
          position: absolute;
          top: -10px;
          right: 12px;
          padding: 3px 9px;
          background: linear-gradient(135deg, #6F42C1, #9A7FE0);
          color: #FFFFFF;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          border-radius: 999px;
          box-shadow: 0 4px 14px rgba(111, 66, 193, 0.45);
        }
        .wi-package-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
        }
        .wi-package-requests {
          font-size: 14px;
          font-weight: 700;
          color: #FFFFFF;
        }
        .wi-package-paid {
          font-size: 22px;
          font-weight: 800;
          background: linear-gradient(180deg, #9A7FE0 0%, #6F42C1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: -0.02em;
          font-feature-settings: "tnum";
        }
        .wi-package-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px dashed rgba(255, 255, 255, 0.06);
        }
        .wi-package-credit {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }
        .wi-package-credit-amount {
          color: #FFFFFF;
          font-weight: 700;
        }
        .wi-package-savings {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: #34d399;
          background: rgba(52, 211, 153, 0.14);
          border: 1px solid rgba(52, 211, 153, 0.30);
          padding: 3px 8px;
          border-radius: 999px;
        }

        .wi-regular {
          margin-top: 12px;
          padding: 14px 16px;
          border: 1px dashed rgba(255, 255, 255, 0.10);
          border-radius: 12px;
          background: transparent;
        }
        .wi-regular-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
        }
        .wi-regular-amount {
          font-size: 18px;
          font-weight: 700;
          color: #FFFFFF;
          margin-top: 4px;
        }
        .wi-regular-note {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.55);
          margin-top: 2px;
        }

        /* ==== Comparison ==== */
        .wi-compare {
          margin-top: 32px;
        }
        .wi-compare-title {
          text-align: center;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
          margin-bottom: 18px;
        }
        .wi-compare-rows {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-width: 720px;
          margin: 0 auto;
        }
        .wi-compare-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 18px;
          background: var(--card);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
        }
        .wi-compare-row--highlight {
          background: linear-gradient(135deg, rgba(111, 66, 193, 0.18), rgba(154, 127, 224, 0.06));
          border-color: rgba(111, 66, 193, 0.45);
          box-shadow: 0 8px 24px -10px rgba(111, 66, 193, 0.35);
        }
        .wi-compare-name {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.75);
        }
        @media (min-width: 768px) {
          .wi-compare-name { font-size: 15px; }
        }
        .wi-compare-row--highlight .wi-compare-name {
          color: #FFFFFF;
          font-weight: 700;
        }
        .wi-compare-price {
          font-size: 14px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.65);
          white-space: nowrap;
        }
        .wi-compare-row--highlight .wi-compare-price {
          background: linear-gradient(180deg, #9A7FE0 0%, #6F42C1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 800;
          font-size: 16px;
        }
        .wi-compare-note {
          text-align: center;
          margin-top: 16px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.65);
        }
        .wi-compare-note b {
          color: #FFFFFF;
          font-weight: 800;
          background: linear-gradient(180deg, #C5B0F0, #6F42C1);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* ==== CTA ==== */
        .wi-cta {
          margin-top: 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .wi-cta-note {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </section>
  );
}
