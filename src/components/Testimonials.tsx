import React from 'react';
import { MessageCircle, ExternalLink } from 'lucide-react';

export function Testimonials() {
  const handleTelegramClick = () => {
    window.open('https://t.me/aiavitologpro', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-dark">
      <div className="container max-w-[1100px] mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Отзывы
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Что говорят пользователи AI Авитолог PRO
          </p>
        </div>

        {/* Telegram Card */}
        <div className="max-w-[800px] mx-auto">
          <button
            onClick={handleTelegramClick}
            className="w-full group bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-10 transition-all duration-300 hover:bg-card/70 hover:border-accent/30 hover:shadow-[0_0_40px_rgba(111,66,193,0.15)] active:scale-[0.99]"
          >
            {/* Top Section */}
            <div className="flex items-start gap-6 mb-8">
              {/* Icon */}
              <div className="flex-shrink-0">
                <MessageCircle className="w-12 h-12 text-accent" />
              </div>

              {/* Text Content */}
              <div className="flex-1 text-left">
                <h3 className="text-xl md:text-2xl font-semibold mb-2">
                  Читайте отзывы в Telegram
                </h3>
                <p className="text-base md:text-lg text-muted-foreground">
                  Реальные истории использования сервиса
                </p>
              </div>

              {/* External Link Icon */}
              <div className="flex-shrink-0">
                <ExternalLink className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-border mb-8" />

            {/* Bottom Text */}
            <div className="text-left">
              <p className="text-sm md:text-base text-muted-foreground">
                Присоединяйтесь к сообществу пользователей и делитесь своим опытом
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
