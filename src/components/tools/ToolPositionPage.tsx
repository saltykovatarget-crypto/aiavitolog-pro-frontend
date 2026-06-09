import React, { useState } from 'react';
import { Radar, Clock, RefreshCw } from 'lucide-react';
import { ToolPageWrapper } from './ToolPageWrapper';
import { Reveal, RevealItem } from '../landing/Reveal';
import { Button } from '../ui/button';

interface ToolPositionPageProps {
  onBack?: () => void;
}

interface PositionResult {
  id: string;
  title: string;
  position: number;
  city: string;
}

const FALLBACK_RESULTS: PositionResult[] = [
  { id: '12345678', title: 'Ворота гаражные распашные', position: 3, city: 'Москва' },
  { id: '87654321', title: 'Ворота секционные автоматические', position: 7, city: 'Москва' },
  { id: '11122233', title: 'Калитки металлические под ключ', position: 12, city: 'Москва' },
];

// Используется через className="brand-gradient-text" (адаптивно по теме)

export function ToolPositionPage({ onBack }: ToolPositionPageProps) {
  const [ids, setIds] = useState('');
  const [city, setCity] = useState('');
  const [results, setResults] = useState<PositionResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!ids.trim() || !city.trim()) return;
    setLoading(true);
    setResults(null);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setResults(FALLBACK_RESULTS);
  };

  const features = [
    {
      icon: <Radar style={{ width: 20, height: 20 }} />,
      title: 'По нужному городу',
      text: 'Проверю позиции в конкретном городе — поиск Авито разный по регионам',
    },
    {
      icon: <Clock style={{ width: 20, height: 20 }} />,
      title: 'За 30 секунд',
      text: 'Не нужно ждать — мгновенно покажу где ты сейчас в выдаче',
    },
    {
      icon: <RefreshCw style={{ width: 20, height: 20 }} />,
      title: 'Разовая проверка',
      text: 'Платишь только когда нужно — не подписка',
    },
  ];

  return (
    <ToolPageWrapper title="Проверка позиций" onBack={onBack}>
      <Reveal>
        <div style={{ marginBottom: 48 }}>
          <div
            className="inline-flex items-center gap-2"
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              background: 'color-mix(in oklab, var(--card) 75%, transparent)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid color-mix(in oklab, #6F42C1 30%, transparent)',
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--foreground)',
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
            Где ты в выдаче · 99 ₽
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 12,
              letterSpacing: '-0.02em',
            }}
          >
            Проверь <span className="brand-gradient-text">позиции</span> своих объявлений
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: 14, lineHeight: 1.55, maxWidth: 600 }}>
            Узнай где твои объявления в поиске Авито прямо сейчас. До 50 ID за раз.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div
          style={{
            background: 'color-mix(in oklab, var(--card) 85%, transparent)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid color-mix(in oklab, #6F42C1 20%, transparent)',
            borderRadius: 20,
            padding: '24px 28px',
            marginBottom: 32,
          }}
        >
          <label className="block mb-2 text-sm font-bold">ID объявлений</label>
          <textarea
            value={ids}
            onChange={(e) => setIds(e.target.value)}
            placeholder={'12345678\n87654321\n11122233'}
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-[#9A7FE0] focus:outline-none transition resize-none font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-2 mb-5">
            По одному ID в строке. Максимум 50.
          </p>

          <label className="block mb-2 text-sm font-bold">Город</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Москва"
            className="w-full px-4 h-12 rounded-xl bg-background border border-border focus:border-[#9A7FE0] focus:outline-none transition"
          />

          <Button
            onClick={handleCheck}
            disabled={!ids.trim() || !city.trim() || loading}
            className="rounded-full px-8 h-12 mt-5 font-bold w-full sm:w-auto"
            style={{ boxShadow: '0 8px 24px rgba(111,66,193,0.3)' }}
          >
            {loading ? 'Проверяю позиции…' : 'Проверить позиции за 99 ₽ →'}
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <RevealItem key={i} index={i} staggerDelay={0.07}>
              <div className="bg-card border border-border rounded-2xl p-5 h-full">
                <div
                  className="w-10 h-10 rounded-xl border grid place-items-center mb-3 brand-icon-color"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(111,66,193,0.20) 0%, rgba(154,127,224,0.10) 100%)',
                    borderColor: 'rgba(154,127,224,0.30)',
                  }}
                >
                  {f.icon}
                </div>
                <div className="font-bold mb-1">{f.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{f.text}</div>
              </div>
            </RevealItem>
          ))}
        </div>
      </Reveal>

      {loading && (
        <div className="mt-8 text-center text-muted-foreground text-sm">
          Проверяю позиции в выдаче…
        </div>
      )}

      {results && (
        <Reveal>
          <div className="mt-10">
            <h3 className="text-lg font-bold mb-4">Результаты</h3>
            <div className="space-y-3">
              {results.map((r, i) => (
                <RevealItem key={r.id} index={i} staggerDelay={0.05}>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
                    <div>
                      <div className="font-semibold">{r.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        ID {r.id} · {r.city}
                      </div>
                    </div>
                    <div className="brand-gradient-text text-2xl font-extrabold">
                      #{r.position}
                    </div>
                  </div>
                </RevealItem>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </ToolPageWrapper>
  );
}
