import React from 'react';
import { Image as ImageIcon, Lightbulb, ArrowRight, Download, ExternalLink } from 'lucide-react';
import { ToolPageWrapper } from './tools/ToolPageWrapper';
import { Button } from './ui/button';
import { Reveal, RevealItem } from './landing/Reveal';

interface ParserReportPageProps {
  onBack?: () => void;
}

interface TopAd {
  id: string;
  title: string;
  price: number;
  views: number;
}

interface ParserReportData {
  niche: string;
  total_ads: number;
  competitors: number;
  avg_price: number;
  leader_share: number;
  leader_name: string;
  top_ads: TopAd[];
  insights: string[];
}

const fallback: ParserReportData = {
  niche: 'юрист Москва',
  total_ads: 200,
  competitors: 47,
  avg_price: 3400,
  leader_share: 18,
  leader_name: 'Юр.Бюро Москва',
  top_ads: [
    { id: '1', title: 'Юридические услуги · все вопросы · опыт 15 лет', price: 3500, views: 1240 },
    { id: '2', title: 'Юрист по разводам и алиментам · бесплатная консультация', price: 4200, views: 980 },
    { id: '3', title: 'Адвокат по уголовным делам · защита 24/7', price: 5000, views: 850 },
    { id: '4', title: 'Юрист по недвижимости · сопровождение сделок', price: 3000, views: 720 },
    { id: '5', title: 'Трудовые споры · защита прав работника', price: 2800, views: 640 },
  ],
  insights: [
    'У 4 из 5 лидеров — фото с плашкой "Бесплатная консультация" или ценой. Попробуй добавить такую же.',
    'Средняя цена в нише 3400 ₽, лидеры держат 3000–5000 ₽. Цена ниже 2500 — сигнал "дёшево = плохо" для юр-ниши.',
    'У всех топ-5 в заголовке есть конкретика (тип услуги или гарантия). Размытые заголовки ("Юридические услуги") в топе не встречаются.',
  ],
};

const MOCK_PARSER_REPORT: ParserReportData | undefined = undefined;

const formatNumber = (n: number) => n.toLocaleString('ru-RU');

const gradientTextStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg,#C5B0F0,#6F42C1)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

export function ParserReportPage({ onBack }: ParserReportPageProps) {
  const data = MOCK_PARSER_REPORT ?? fallback;

  const handleOpenInChat = () => {
    window.location.hash = 'chat';
  };

  return (
    <ToolPageWrapper title="Отчёт парсера ниши" onBack={onBack}>
      {/* Hero */}
      <Reveal>
        <div style={{ marginBottom: 40 }}>
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
              color: 'rgba(255,255,255,0.92)',
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
            Парсер ниши · готов · 1 мин 24 сек
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Ниша: <span style={gradientTextStyle}>{data.niche}</span>
          </h2>
          <p className="text-muted-foreground" style={{ fontSize: 15, lineHeight: 1.55, maxWidth: 600 }}>
            AI Авитолог разобрал топ-объявления, смотри что у конкурентов
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <Button
              onClick={handleOpenInChat}
              className="rounded-full px-8 h-12 font-bold"
              style={{ boxShadow: '0 8px 24px rgba(111,66,193,0.3)' }}
            >
              Открыть в чате →
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-8 h-12 font-semibold"
              onClick={() => alert('Скоро — экспорт в PDF')}
            >
              <Download className="w-4 h-4 mr-2" />
              Сохранить PDF
            </Button>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
            {[
              { label: 'Объявлений', value: formatNumber(data.total_ads), color: '#34d399' },
              { label: 'Конкурентов', value: String(data.competitors), color: '#C5B0F0' },
              { label: 'Ср.цена', value: `${formatNumber(data.avg_price)} ₽`, color: '#9A7FE0' },
            ].map((m, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: `${m.color}14`,
                  border: `1px solid ${m.color}40`,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: m.color,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  {m.label}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Метрики */}
      <Reveal>
      <section style={{ marginBottom: 48 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Ключевые метрики</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RevealItem index={0} staggerDelay={0.08}>
            <div
              className="bg-card border border-border"
              style={{ borderRadius: 16, padding: 20 }}
            >
              <div
                className="text-muted-foreground"
                style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Конкурентов
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1 }}>{data.competitors}</div>
              <div className="text-muted-foreground" style={{ fontSize: 12, marginTop: 8 }}>
                активных продавцов
              </div>
            </div>
          </RevealItem>

          <RevealItem index={1} staggerDelay={0.08}>
            <div
              className="bg-card border border-border"
              style={{ borderRadius: 16, padding: 20 }}
            >
              <div
                className="text-muted-foreground"
                style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Средняя цена
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1 }}>
                {formatNumber(data.avg_price)}
                <span className="text-muted-foreground" style={{ fontSize: 16, fontWeight: 500, marginLeft: 4 }}>
                  ₽
                </span>
              </div>
              <div className="text-muted-foreground" style={{ fontSize: 12, marginTop: 8 }}>
                по {data.total_ads} объявлениям
              </div>
            </div>
          </RevealItem>

          <RevealItem index={2} staggerDelay={0.08}>
            <div
              className="bg-card border border-border"
              style={{ borderRadius: 16, padding: 20 }}
            >
              <div
                className="text-muted-foreground"
                style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Лидер
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1 }}>
                {data.leader_share}
                <span className="text-muted-foreground" style={{ fontSize: 16, fontWeight: 500, marginLeft: 4 }}>
                  %
                </span>
              </div>
              <div className="text-muted-foreground" style={{ fontSize: 12, marginTop: 8 }}>
                доля показов · {data.leader_name}
              </div>
            </div>
          </RevealItem>
        </div>
      </section>
      </Reveal>

      {/* Топ-5 объявлений */}
      <Reveal>
      <section style={{ marginBottom: 48 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Топ-5 объявлений</h3>
        <div className="space-y-3">
          {data.top_ads.map((ad, idx) => (
            <RevealItem key={ad.id} index={idx} staggerDelay={0.05}>
            <div
              className="bg-card border border-border"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 16,
                borderRadius: 16,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  width: 72,
                  height: 72,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(111,66,193,0.25) 0%, rgba(154,127,224,0.10) 100%)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#9A7FE0',
                }}
              >
                <ImageIcon style={{ width: 26, height: 26, opacity: 0.6 }} />
                <span
                  style={{
                    position: 'absolute',
                    top: -8,
                    left: -8,
                    width: 24,
                    height: 24,
                    borderRadius: 8,
                    background: '#6F42C1',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {idx + 1}
                </span>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    lineHeight: 1.35,
                    marginBottom: 6,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {ad.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13 }}>
                  <span style={{ fontWeight: 700 }}>{formatNumber(ad.price)} ₽</span>
                  <span className="text-muted-foreground">{formatNumber(ad.views)} просмотров</span>
                </div>
              </div>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="border border-border text-muted-foreground"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  flexShrink: 0,
                  textDecoration: 'none',
                }}
              >
                Открыть на Авито
                <ExternalLink style={{ width: 14, height: 14 }} />
              </a>
            </div>
            </RevealItem>
          ))}
        </div>
      </section>
      </Reveal>

      {/* Инсайты */}
      <Reveal>
      <section style={{ marginBottom: 48 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Что заметил AI Авитолог</h3>
        <div className="space-y-3">
          {data.insights.map((insight, idx) => (
            <RevealItem key={idx} index={idx} staggerDelay={0.07}>
            <div
              className="bg-card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: 20,
                borderRadius: 16,
                border: '1px solid var(--border, rgba(255,255,255,0.08))',
                borderLeft: '3px solid #6F42C1',
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(111,66,193,0.15)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#9A7FE0',
                }}
              >
                <Lightbulb style={{ width: 20, height: 20 }} />
              </div>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  paddingTop: 6,
                  margin: 0,
                }}
              >
                {insight}
              </p>
            </div>
            </RevealItem>
          ))}
        </div>
      </section>
      </Reveal>

      {/* Финальный CTA */}
      <Reveal delay={0.1}>
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 16,
          padding: '32px 36px',
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
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            alignItems: 'flex-start',
          }}
          className="md-cta-row"
        >
          <div style={{ maxWidth: 560 }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0, marginBottom: 8 }}>
              Запустить этот разбор в чат с AI Авитологом?
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.88)', margin: 0 }}>
              Продолжим в чате — построим стратегию входа в нишу по 10-шаговой методологии
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flexShrink: 0 }}>
            <Button
              onClick={handleOpenInChat}
              className="rounded-full px-8 h-12 font-bold"
              style={{
                background: '#fff',
                color: '#6F42C1',
                boxShadow: '0 8px 24px rgba(255,255,255,0.15)',
              }}
            >
              Открыть в чате
              <ArrowRight style={{ width: 16, height: 16, marginLeft: 6 }} />
            </Button>
            <Button
              variant="outline"
              onClick={() => {}}
              className="rounded-full px-8 h-12 font-semibold"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.4)',
                color: '#fff',
              }}
            >
              <Download style={{ width: 16, height: 16, marginRight: 6 }} />
              Сохранить PDF
            </Button>
          </div>
        </div>
      </section>
      </Reveal>
    </ToolPageWrapper>
  );
}
