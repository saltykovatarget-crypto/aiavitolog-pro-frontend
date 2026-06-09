import React from 'react';

export function AvitoTokenPage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-[10px] border-b border-border">
        <div className="container max-w-[1100px] mx-auto px-5 h-16 flex items-center justify-between">
          <a
            href="http://aiavitologpro.ru/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <span className="font-semibold text-foreground">AI Авитолог PRO</span>
          </a>

          <div className="text-sm md:text-base font-medium text-foreground">
            Токен Авито
          </div>

          {/* spacer to keep centered title visually balanced */}
          <div className="w-[120px]" />
        </div>
      </header>

      <main className="container max-w-[1100px] mx-auto px-5 py-16 md:py-24 lg:py-32">
        <div className="max-w-[880px] mx-auto">
          <div className="hero-shell text-center">
            <div className="space-y-6 md:space-y-8 flex flex-col items-center">
              <h1 className="text-foreground text-3xl md:text-4xl lg:text-5xl leading-[1.08]">
                Пока в разработке
              </h1>

              <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                Страница подключения токена Авито появится здесь позже.
              </p>

              <div className="rounded-[20px] p-4 md:p-5 bg-white/5 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.28)]">
                <img
                  src="/cases/avito-token-placeholder.png"
                  alt="Токен Авито — в разработке"
                  className="w-full max-w-[420px] object-contain mx-auto drop-shadow-[0_0_30px_rgba(154,127,224,0.18)]"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
