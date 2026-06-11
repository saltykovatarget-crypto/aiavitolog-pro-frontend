import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, UserPlus, Link2, Wallet, Check, ArrowDown } from 'lucide-react';
import { Button } from './ui/button';
import { Reveal, RevealItem } from './landing/Reveal';

interface PartnersPageProps {
  onBack?: () => void;
}

const TG_LINK = 'https://t.me/valeriia_avitolog';

const STEPS = [
  {
    icon: UserPlus,
    num: '01',
    title: 'Регистрируешься',
    desc: 'Заявка через форму — бесплатно. После одобрения получаешь личный кабинет партнёра.',
  },
  {
    icon: Link2,
    num: '02',
    title: 'Получаешь ссылку',
    desc: 'Уникальная реферальная ссылка. Делишься в TG-канале, рассылке, на консультациях.',
  },
  {
    icon: Wallet,
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

const CONDITIONS = [
  {
    title: '5% с первого пополнения',
    text: 'Разовая выплата сразу после первого пополнения реферала. Без tier’ов, без условий по объёму, без срока.',
  },
  {
    title: 'Без своих аккаунтов',
    text: 'Приводить можно только новых клиентов. Свои аккаунты и самопополнения не засчитываются.',
  },
  {
    title: 'Выплаты на партнёрский баланс',
    text: 'Начисления видны сразу в кабинете партнёра. Вывод от 1 000 ₽ — на карту, СБП или USDT TRC-20, до 7 рабочих дней.',
  },
  {
    title: 'Прозрачная статистика',
    text: 'В личном кабинете партнёра: кто перешёл, кто пополнил, сколько начислено.',
  },
];

const formatNumber = (n: number) => n.toLocaleString('ru-RU');

export function PartnersPage({ onBack }: PartnersPageProps) {
  // Маркетинговая страница — принудительно тёмная тема (§12 дизайн-системы)
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const goBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBack) {
      onBack();
    } else {
      window.location.hash = '';
    }
  };

  return (
    <div className="dark relative min-h-screen bg-background text-foreground">
      {/* Ambient radial glow (§4.6) */}
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

      {/* Sticky header */}
      <div
        className="sticky top-0 z-30 backdrop-blur-xl"
        style={{
          background: 'color-mix(in oklab, var(--background) 70%, transparent)',
          borderBottom: '1px solid color-mix(in oklab, #6F42C1 15%, transparent)',
        }}
      >
        <div className="container max-w-[1200px] mx-auto px-5 h-14 flex items-center justify-between gap-3">
          <a
            href="#"
            onClick={goBack}
            className="flex min-w-0 items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <img
              src="/cases/favicon/logo-header.png"
              alt="AI Авитолог PRO"
              className="object-contain shrink-0 block"
              style={{ width: 32, height: 32, minWidth: 32, minHeight: 32 }}
            />
            <span className="min-w-0 flex items-center gap-1.5 font-semibold text-foreground">
              <span className="truncate max-w-[110px] md:max-w-none">AI Авитолог</span>
              <span
                className="font-bold text-white px-2 py-1 rounded-md leading-none tracking-wider"
                style={{ fontSize: 11, backgroundColor: '#6F42C1' }}
              >
                PRO
              </span>
            </span>
          </a>
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="rounded-full font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            На главную
          </Button>
        </div>
      </div>

      <main className="relative z-10 container max-w-[1200px] mx-auto px-5 py-16 md:py-24">
        {/* ===== Hero ===== */}
        <Reveal>
          <div className="text-center" style={{ marginBottom: 64 }}>
            {/* Eyebrow chip (§4.1) */}
            <div
              className="inline-flex items-center gap-2"
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                background: 'rgba(20,25,38,0.55)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(111,66,193,0.30)',
                fontSize: 12,
                fontWeight: 700,
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
              Партнёрская программа
            </div>

            {/* H1 с gradient (§4.2) */}
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
                lineHeight: 1.1,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: 16,
              }}
            >
              Приведи клиента —{' '}
              <span
                style={{
                  background: 'linear-gradient(180deg, #C5B0F0 0%, #6F42C1 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                получи 5%
              </span>{' '}
              с его пополнения
            </h1>
            <p
              className="text-muted-foreground mx-auto"
              style={{ fontSize: 16, lineHeight: 1.55, maxWidth: 620, margin: '0 auto' }}
            >
              Для авитологов, блогеров и агентств. 5% с первого пополнения каждого приведённого
              клиента — сразу на партнёрский баланс. Без вложений и обязательных продаж.
            </p>

            <div
              className="flex flex-wrap items-center justify-center"
              style={{ gap: 12, marginTop: 28 }}
            >
              <Button
                asChild
                className="rounded-full px-8 h-12 font-bold"
                style={{ boxShadow: '0 8px 24px rgba(111,66,193,0.3)' }}
              >
                <a href={TG_LINK} target="_blank" rel="noopener noreferrer">
                  Стать партнёром
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-8 h-12 font-semibold"
                onClick={() => {
                  // Не меняем hash — App трактует его как роут
                  document.getElementById('partners-how')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Как это работает
              </Button>
            </div>
          </div>
        </Reveal>

        {/* ===== Big 5% block ===== */}
        <Reveal delay={0.1}>
          <div
            className="rounded-2xl mx-auto flex flex-col md:flex-row items-center text-center md:text-left"
            style={{
              maxWidth: 640,
              padding: 24,
              gap: 24,
              marginBottom: 64,
              background: 'linear-gradient(135deg, rgba(111,66,193,0.16), rgba(154,127,224,0.04))',
              border: '1px solid rgba(154,127,224,0.32)',
              boxShadow: '0 16px 40px -16px rgba(111,66,193,0.4)',
            }}
          >
            <div className="flex items-baseline shrink-0" style={{ gap: 2 }}>
              <span
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  lineHeight: 0.9,
                  letterSpacing: '-0.05em',
                  background: 'linear-gradient(180deg, #C5B0F0 0%, #6F42C1 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                5
              </span>
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(180deg, #C5B0F0 0%, #6F42C1 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                %
              </span>
            </div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em' }}>
                с первого пополнения реферала
              </div>
              <p
                className="text-muted-foreground"
                style={{ fontSize: 14, lineHeight: 1.5, margin: 0, marginTop: 6 }}
              >
                Разовая выплата. Без tier&rsquo;ов, без условий по объёму, без срока. Чем чаще
                приводишь — тем больше зарабатываешь.
              </p>
            </div>
          </div>
        </Reveal>

        {/* ===== Как это работает ===== */}
        <section id="partners-how" style={{ marginBottom: 64 }}>
          <Reveal>
            <h2
              className="text-center"
              style={{
                fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: 28,
              }}
            >
              Как это работает
            </h2>
          </Reveal>
          <Reveal>
            {/* §8: md:grid-cols-3 нет в пре-компилированном CSS — используем md:2 / lg:3 как в ParserReportPage */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <RevealItem key={step.num} index={i} staggerDelay={0.08}>
                    <div
                      className="rounded-2xl h-full"
                      style={{
                        background: 'rgba(20,25,38,0.45)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(111,66,193,0.20)',
                        padding: 24,
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #6F42C1, #9A7FE0)',
                          boxShadow: '0 4px 14px rgba(111,66,193,0.35)',
                          marginBottom: 16,
                        }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: 1.5,
                          color: '#9A7FE0',
                          marginBottom: 8,
                        }}
                      >
                        ШАГ {step.num}
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
                      <p
                        className="text-muted-foreground"
                        style={{ fontSize: 14, lineHeight: 1.55, margin: 0 }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </RevealItem>
                );
              })}
            </div>
          </Reveal>
        </section>

        {/* ===== Сколько ты заработаешь ===== */}
        <section style={{ marginBottom: 64 }}>
          <Reveal>
            <h2
              className="text-center"
              style={{
                fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: 12,
              }}
            >
              Сколько ты заработаешь
            </h2>
            <p
              className="text-center text-muted-foreground mx-auto"
              style={{ fontSize: 14, lineHeight: 1.55, maxWidth: 520, marginBottom: 28 }}
            >
              5% с первого пополнения каждого реферала — на примерах:
            </p>
          </Reveal>
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {EXAMPLES.map((ex, i) => (
                <RevealItem key={ex.paid} index={i} staggerDelay={0.06}>
                  <div
                    className="relative rounded-2xl flex flex-col items-center text-center h-full"
                    style={{
                      padding: '24px 16px',
                      gap: 8,
                      background: ex.highlighted
                        ? 'linear-gradient(180deg, rgba(111,66,193,0.12), rgba(111,66,193,0.03))'
                        : 'rgba(20,25,38,0.45)',
                      border: ex.highlighted
                        ? '1px solid rgba(111,66,193,0.45)'
                        : '1px solid rgba(111,66,193,0.20)',
                    }}
                  >
                    {ex.highlighted && (
                      <div
                        className="absolute whitespace-nowrap text-white"
                        style={{
                          top: -10,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 9,
                          fontWeight: 800,
                          letterSpacing: 1,
                          textTransform: 'uppercase',
                          background: 'linear-gradient(135deg, #6F42C1, #9A7FE0)',
                          boxShadow: '0 4px 14px rgba(111,66,193,0.45)',
                        }}
                      >
                        Чаще всего
                      </div>
                    )}
                    <div
                      className="text-muted-foreground"
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 0.6,
                        textTransform: 'uppercase',
                      }}
                    >
                      Реферал положил
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{formatNumber(ex.paid)} ₽</div>
                    <ArrowDown className="w-4 h-4" style={{ color: 'rgba(154,127,224,0.6)' }} />
                    <div
                      className="text-muted-foreground"
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 0.6,
                        textTransform: 'uppercase',
                      }}
                    >
                      Тебе
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        background: 'linear-gradient(180deg, #C5B0F0 0%, #6F42C1 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      +{formatNumber(ex.commission)} ₽
                    </div>
                  </div>
                </RevealItem>
              ))}
            </div>
          </Reveal>

          {/* Projection */}
          <Reveal delay={0.1}>
            <div
              className="rounded-2xl"
              style={{
                marginTop: 20,
                padding: 24,
                background: 'linear-gradient(135deg, rgba(111,66,193,0.10), rgba(52,211,153,0.04))',
                border: '1px solid rgba(154,127,224,0.22)',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  color: '#9A7FE0',
                  marginBottom: 12,
                }}
              >
                Пример: 50 приведённых клиентов
              </div>
              <div
                className="flex flex-wrap items-center"
                style={{ gap: 12, fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}
              >
                <span>50 рефералов</span>
                <span className="text-muted-foreground" style={{ fontWeight: 400 }}>×</span>
                <span>1 500 ₽</span>
                <span className="text-muted-foreground" style={{ fontWeight: 400 }}>×</span>
                <span>5%</span>
                <span className="text-muted-foreground" style={{ fontWeight: 400 }}>=</span>
                <span style={{ color: '#34d399', fontWeight: 800 }}>3 750 ₽</span>
              </div>
              <p
                className="text-muted-foreground"
                style={{ fontSize: 13, lineHeight: 1.55, margin: 0, marginTop: 12 }}
              >
                Средний чек первого пополнения ≈ 1 500 ₽ (пакет запросов или пополнение под проект).
                Чем больше клиентов — тем больше пассивный заработок.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ===== Условия ===== */}
        <section style={{ marginBottom: 64 }}>
          <Reveal>
            <h2
              className="text-center"
              style={{
                fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: 28,
              }}
            >
              Условия
            </h2>
          </Reveal>
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CONDITIONS.map((c, i) => (
                <RevealItem key={c.title} index={i} staggerDelay={0.06}>
                  <div
                    className="rounded-2xl flex items-start gap-3 h-full"
                    style={{
                      padding: 20,
                      background: 'rgba(20,25,38,0.45)',
                      border: '1px solid rgba(111,66,193,0.20)',
                    }}
                  >
                    <div
                      className="shrink-0 rounded-full flex items-center justify-center"
                      style={{
                        width: 24,
                        height: 24,
                        marginTop: 2,
                        background: 'rgba(52,211,153,0.18)',
                      }}
                    >
                      <Check className="w-3.5 h-3.5" style={{ color: '#34d399' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{c.title}</div>
                      <p
                        className="text-muted-foreground"
                        style={{ fontSize: 13, lineHeight: 1.55, margin: 0 }}
                      >
                        {c.text}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ===== Финальная CTA ===== */}
        <Reveal delay={0.1}>
          <section
            className="relative overflow-hidden rounded-2xl text-center"
            style={{
              padding: '40px 24px',
              background: 'linear-gradient(135deg, #6F42C1 0%, #9A7FE0 100%)',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: `
                  radial-gradient(50% 60% at 80% 30%, rgba(255,255,255,0.10), transparent 65%),
                  radial-gradient(40% 50% at 20% 80%, rgba(255,255,255,0.06), transparent 70%)
                `,
              }}
            />
            <div className="relative z-10">
              <h2
                className="text-white"
                style={{
                  fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  marginBottom: 12,
                }}
              >
                Готов зарабатывать на рекомендациях?
              </h2>
              <p
                className="mx-auto"
                style={{
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: 'rgba(255,255,255,0.88)',
                  maxWidth: 480,
                  margin: '0 auto',
                }}
              >
                Напиши Лере в Telegram — расскажет условия и выдаст партнёрскую ссылку.
              </p>
              <div style={{ marginTop: 24 }}>
                <Button
                  asChild
                  className="rounded-full px-8 h-12 font-bold"
                  style={{
                    background: '#fff',
                    color: '#6F42C1',
                    boxShadow: '0 8px 24px rgba(255,255,255,0.15)',
                  }}
                >
                  <a href={TG_LINK} target="_blank" rel="noopener noreferrer">
                    Стать партнёром
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.7)',
                  margin: 0,
                  marginTop: 16,
                }}
              >
                Без вложений · Без обязательных продаж · Начать можно сегодня
              </p>
            </div>
          </section>
        </Reveal>
      </main>
    </div>
  );
}
