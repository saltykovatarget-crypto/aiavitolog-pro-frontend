import React, { useState, useEffect } from 'react';
import { Sun, Moon, User } from 'lucide-react';
import { WalletBalance } from '../WalletBalance';
import { TopupModal } from '../TopupModal';
import { Button } from '../ui/button';

interface ToolPageWrapperProps {
  title?: string;
  onBack?: () => void;
  children: React.ReactNode;
}

export function ToolPageWrapper({ onBack, children }: ToolPageWrapperProps) {
  const [topupOpen, setTopupOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {}
  }, [isDark]);

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBack) {
      onBack();
    } else {
      window.location.hash = 'chat';
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
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
      <div
        className="sticky top-0 z-30 backdrop-blur-xl"
        style={{
          background: 'color-mix(in oklab, var(--background) 70%, transparent)',
          borderBottom: '1px solid color-mix(in oklab, #6F42C1 15%, transparent)',
        }}
      >
        <div className="container max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between gap-3">
          {/* Левый блок: бренд-лого + название + бейдж PRO (как в UniversalHeader) */}
          <a
            href="#chat"
            onClick={goHome}
            className="flex min-w-0 items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <img
              src="/cases/favicon/logo-header.png"
              alt="AI Авитолог PRO"
              className="object-contain shrink-0 block"
              style={{
                width: '36px',
                height: '36px',
                maxWidth: '36px',
                maxHeight: '36px',
                minWidth: '36px',
                minHeight: '36px',
              }}
            />
            <span className="min-w-0 flex items-center gap-1.5 font-semibold text-foreground">
              <span className="truncate max-w-[110px] md:max-w-none">AI Авитолог</span>
              <span
                className="text-[11px] font-bold text-white px-2 py-1 rounded-md leading-none tracking-wider"
                style={{ backgroundColor: '#6F42C1' }}
              >
                PRO
              </span>
            </span>
          </a>

          {/* Центр: пусто */}
          <div />

          {/* Правый блок: WalletBalance + переключение темы + аватар */}
          <div className="flex items-center gap-2">
            <WalletBalance size="sm" onTopup={() => setTopupOpen(true)} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDark(!isDark)}
              className="w-9 h-9 p-0"
              aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <button
              type="button"
              onClick={goHome}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] flex items-center justify-center hover:opacity-90 transition"
              aria-label="В чат"
            >
              <User className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
      <main className="relative z-10 container max-w-[1200px] mx-auto px-5 py-8 md:py-10">
        {children}
      </main>
      <TopupModal open={topupOpen} onClose={() => setTopupOpen(false)} />
    </div>
  );
}
