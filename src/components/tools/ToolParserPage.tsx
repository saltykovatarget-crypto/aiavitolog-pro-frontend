import React, { useState } from 'react';
import { toast } from 'sonner';
import { Eye, TrendingUp, Target } from 'lucide-react';
import { ToolPageWrapper } from './ToolPageWrapper';
import { Reveal, RevealItem } from '../landing/Reveal';
import { Button } from '../ui/button';

interface ToolParserPageProps {
  onBack?: () => void;
}

const gradientText: React.CSSProperties = {
  background: 'linear-gradient(180deg,#C5B0F0,#6F42C1)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

export function ToolParserPage({ onBack }: ToolParserPageProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!url) return;
    setLoading(true);
    toast.info('Запускаю парсер ниши…');
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    window.location.hash = 'parser-report';
  };

  const features = [
    {
      icon: <Eye style={{ width: 20, height: 20 }} />,
      title: 'Vision-разбор',
      text: 'AI смотрит все 100 фото — видит плашки, ракурсы, контент',
    },
    {
      icon: <TrendingUp style={{ width: 20, height: 20 }} />,
      title: 'Сравнение лидеров',
      text: 'Кто в топе, какие у них цены и заголовки',
    },
    {
      icon: <Target style={{ width: 20, height: 20 }} />,
      title: 'Точки роста',
      text: '3 главных инсайта что добавить чтобы попасть в топ',
    },
  ];

  return (
    <ToolPageWrapper title="Парсер ниши" onBack={onBack}>
      <Reveal>
        <div style={{ marginBottom: 48 }}>
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
            Топ-200 объявлений · vision-разбор
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 12,
              letterSpacing: '-0.02em',
            }}
          >
            Изучи <span style={gradientText}>конкурентов</span> в нише
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: 16, lineHeight: 1.55, maxWidth: 600 }}>
            AI разберёт топ-200 объявлений Авито: цены, фото, заголовки. Через 1-3 минуты пришлёт отчёт с инсайтами.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div
          style={{
            background: 'rgba(20,25,38,0.45)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(111,66,193,0.20)',
            borderRadius: 20,
            padding: '24px 28px',
            marginBottom: 32,
          }}
        >
          <label className="block mb-2 text-sm font-bold">Ссылка на выдачу Авито</label>
          <input
            type="url"
            placeholder="https://www.avito.ru/moskva/uslugi/yurist"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 h-12 rounded-xl bg-background border border-border focus:border-[#9A7FE0] focus:outline-none transition"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Открой Авито, найди свою нишу, скопируй URL.
          </p>

          <Button
            onClick={handleStart}
            disabled={!url || loading}
            className="rounded-full px-8 h-12 mt-5 font-bold w-full sm:w-auto"
            style={{ boxShadow: '0 8px 24px rgba(111,66,193,0.3)' }}
          >
            {loading ? 'Запускаю парсер…' : 'Запустить парсер за 190 ₽ →'}
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <RevealItem key={i} index={i} staggerDelay={0.07}>
              <div className="bg-card border border-border rounded-2xl p-5 h-full">
                <div
                  className="w-10 h-10 rounded-xl border grid place-items-center mb-3"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(111,66,193,0.20) 0%, rgba(154,127,224,0.10) 100%)',
                    borderColor: 'rgba(154,127,224,0.20)',
                    color: '#C5B0F0',
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
    </ToolPageWrapper>
  );
}
