import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { WalletBalance } from '../WalletBalance';
import { TopupModal } from '../TopupModal';

interface ToolPageWrapperProps {
  title: string;
  onBack?: () => void;
  children: React.ReactNode;
}

export function ToolPageWrapper({ title, onBack, children }: ToolPageWrapperProps) {
  const [topupOpen, setTopupOpen] = useState(false);
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
          background: 'rgba(13,13,26,0.60)',
          borderBottom: '1px solid rgba(111,66,193,0.15)',
        }}
      >
        <div className="container max-w-[1200px] mx-auto px-5 h-14 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад в инструменты
          </button>
          <h1 className="text-base md:text-lg font-bold">{title}</h1>
          <WalletBalance size="sm" onTopup={() => setTopupOpen(true)} />
        </div>
      </div>
      <main className="relative z-10 container max-w-[1200px] mx-auto px-5 py-8 md:py-10">
        {children}
      </main>
      <TopupModal open={topupOpen} onClose={() => setTopupOpen(false)} />
    </div>
  );
}
