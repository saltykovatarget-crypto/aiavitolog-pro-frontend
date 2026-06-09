import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Upload, BarChart3, DollarSign, Award, FileSpreadsheet, X } from 'lucide-react';
import { ToolPageWrapper } from './ToolPageWrapper';
import { Reveal, RevealItem } from '../landing/Reveal';
import { Button } from '../ui/button';

interface ToolXlsPageProps {
  onBack?: () => void;
}

const gradientText: React.CSSProperties = {
  background: 'linear-gradient(180deg,#C5B0F0,#6F42C1)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

export function ToolXlsPage({ onBack }: ToolXlsPageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    toast.success(`Файл «${file.name}» проанализирован — открываю чат`);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    window.location.hash = 'chat';
  };

  const onPick = () => inputRef.current?.click();

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setFile(files[0]);
  };

  const features = [
    {
      icon: <BarChart3 style={{ width: 20, height: 20 }} />,
      title: 'Просмотры и конверсия',
      text: 'Покажу где теряются просмотры и сколько из них реально звонят',
    },
    {
      icon: <DollarSign style={{ width: 20, height: 20 }} />,
      title: 'Стоимость заявки',
      text: 'Посчитаю CPL по каждому объявлению — где слив бюджета',
    },
    {
      icon: <Award style={{ width: 20, height: 20 }} />,
      title: 'Что в топе у тебя',
      text: 'Найду лучшие объявления и подскажу что копировать в новые',
    },
  ];

  return (
    <ToolPageWrapper title="Анализ статистики XLS" onBack={onBack}>
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
            Разбор статистики · 50 ₽
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
            Залей <span style={gradientText}>XLS</span> из кабинета
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: 16, lineHeight: 1.55, maxWidth: 600 }}>
            AI Авитолог найдёт почему теряются заявки: просмотры, конверсия, стоимость заявки.
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
          <input
            ref={inputRef}
            type="file"
            accept=".xls,.xlsx,.csv"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />

          {!file ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                onFiles(e.dataTransfer.files);
              }}
              onClick={onPick}
              role="button"
              tabIndex={0}
              style={{
                border: `1.5px dashed ${dragOver ? '#9A7FE0' : 'rgba(154,127,224,0.30)'}`,
                background: dragOver ? 'rgba(111,66,193,0.08)' : 'rgba(13,13,26,0.35)',
                borderRadius: 16,
                padding: '36px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              <div
                className="grid place-items-center mx-auto mb-4"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background:
                    'linear-gradient(135deg, rgba(111,66,193,0.20) 0%, rgba(154,127,224,0.10) 100%)',
                  border: '1px solid rgba(154,127,224,0.20)',
                  color: '#C5B0F0',
                }}
              >
                <Upload style={{ width: 24, height: 24 }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                Перетащи XLS-файл или нажми кнопку
              </div>
              <div className="text-xs text-muted-foreground mb-5">
                Поддерживаются .xls, .xlsx, .csv из кабинета Авито
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onPick();
                }}
                className="rounded-full px-6 h-11 font-semibold"
              >
                <Upload style={{ width: 16, height: 16, marginRight: 6 }} />
                Выбрать файл
              </Button>
            </div>
          ) : (
            <div>
              <div
                className="flex items-center gap-3 p-4 rounded-xl mb-5"
                style={{
                  background: 'rgba(13,13,26,0.45)',
                  border: '1px solid rgba(154,127,224,0.25)',
                }}
              >
                <div
                  className="grid place-items-center flex-shrink-0"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background:
                      'linear-gradient(135deg, rgba(111,66,193,0.25) 0%, rgba(154,127,224,0.10) 100%)',
                    color: '#C5B0F0',
                  }}
                >
                  <FileSpreadsheet style={{ width: 20, height: 20 }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} КБ
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-muted-foreground hover:text-foreground transition p-1"
                  aria-label="Удалить файл"
                >
                  <X style={{ width: 18, height: 18 }} />
                </button>
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="rounded-full px-8 h-12 font-bold w-full sm:w-auto"
                style={{ boxShadow: '0 8px 24px rgba(111,66,193,0.3)' }}
              >
                {loading ? 'Анализирую…' : 'Анализировать за 50 ₽ →'}
              </Button>
            </div>
          )}
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
