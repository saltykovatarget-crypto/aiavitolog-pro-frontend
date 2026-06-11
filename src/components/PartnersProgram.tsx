import React from 'react';
import { Handshake, ArrowRight } from 'lucide-react';
import { Reveal } from './landing/Reveal';

interface PartnersProgramProps {
  onApply?: () => void;
}

/**
 * Компактная полоска-CTA партнёрской программы на лендинге.
 * Полный контент — на отдельной странице #partners-page (PartnersPage.tsx).
 */
export function PartnersProgram({ onApply: _onApply }: PartnersProgramProps) {
  return (
    <section className="py-12 md:py-16 relative overflow-hidden" id="partners">
      <div className="container max-w-[1200px] mx-auto px-5">
        <Reveal>
          <div
            className="rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            style={{
              padding: 24,
              background: 'color-mix(in oklab, #6F42C1 10%, transparent)',
              border: '1px solid color-mix(in oklab, #6F42C1 30%, transparent)',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6F42C1, #9A7FE0)' }}
              >
                <Handshake className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold" style={{ marginBottom: 4 }}>
                  Приведи клиента — получи 5% с его пополнения
                </h3>
                <p className="text-sm text-muted-foreground" style={{ margin: 0 }}>
                  Партнёрская программа для авитологов, блогеров и агентств
                </p>
              </div>
            </div>
            <a
              href="#partners-page"
              className="rounded-full font-semibold text-white whitespace-nowrap inline-flex items-center gap-2 transition-all duration-200 hover:opacity-90"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(90deg, #6F42C1, #9A7FE0)',
                boxShadow: '0 8px 24px rgba(111,66,193,0.3)',
              }}
            >
              Узнать больше
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
