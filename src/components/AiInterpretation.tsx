import React from 'react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface AiInterpretationProps {
  onNavigateToChat?: () => void;
}

const STEPS = [
  {
    badge: '01',
    title: 'Запускаешь инструмент',
    description: 'Парсер, анализ рынка, мониторинг — кликаешь, ждёшь результат.',
  },
  {
    badge: '02',
    title: 'Получаешь данные',
    description: 'Цифры, графики, скриншоты, выгрузка XLSX — всё структурировано.',
  },
  {
    badge: '03',
    title: 'AI Авитолог разбирает в чате',
    description: 'Что вижу, что это значит, какой следующий шаг. Без интерпретации цифры — просто цифры.',
  },
];

export function AiInterpretation({ onNavigateToChat }: AiInterpretationProps) {
  return (
    <section className="ai-section py-16 md:py-24" id="ai-interpretation">
      <div className="container max-w-[1200px] mx-auto px-5">

        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight m-0 text-foreground">
            Это не просто инструменты.<br />
            Каждый результат разбирает AI&nbsp;Авитолог
          </h2>
          <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Конкуренты дают данные — и оставляют тебя с ними один на один.
            У нас после каждого прогона AI Авитолог расшифровывает результат в чате
            и ведёт по методологии дальше.
          </p>
        </div>

        <div className="ai-flow">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.badge}>
              <div className="ai-step">
                <div className="ai-step-badge">{step.badge}</div>
                <div className="ai-step-content">
                  <h3 className="text-lg md:text-xl font-semibold leading-tight text-foreground m-0">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed text-muted-foreground m-0 mt-2">
                    {step.description}
                  </p>
                </div>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="ai-arrow" aria-hidden="true">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Quote-like reinforcer */}
        <div className="ai-quote">
          <p>
            «Без интерпретации цифры — просто цифры.
            <br className="hidden md:block" />
            AI Авитолог берёт результат любого инструмента
            и говорит: вот что это значит для твоей ниши, вот что делать дальше.»
          </p>
        </div>

        <div className="text-center mt-10">
          <Button
            size="lg"
            className="hero-cta-primary rounded-full px-8 md:px-10 text-sm md:text-base h-12"
            onClick={onNavigateToChat}
          >
            Попробовать в чате →
          </Button>
        </div>

      </div>

      <style>{`
        .ai-section {
          position: relative;
          isolation: isolate;
        }
        .ai-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(50% 60% at 50% 0%, rgba(111, 66, 193, 0.08), transparent 70%);
          z-index: -1;
          pointer-events: none;
        }

        .ai-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(111, 66, 193, 0.15);
          border: 1px solid rgba(111, 66, 193, 0.3);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #9A7FE0;
        }

        .ai-flow {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: stretch;
        }
        @media (min-width: 1024px) {
          .ai-flow {
            grid-template-columns: 1fr auto 1fr auto 1fr;
            gap: 28px;
            align-items: center;
          }
        }

        .ai-step {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: 100%;
          transition: border-color .15s, transform .15s, box-shadow .15s;
        }
        .ai-step:hover {
          border-color: rgba(111, 66, 193, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(111, 66, 193, 0.15);
        }
        .ai-step-badge {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6F42C1, #9A7FE0);
          color: #fff;
          display: grid;
          place-items: center;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 1px;
          box-shadow: 0 4px 12px rgba(111, 66, 193, 0.35);
        }
        .ai-step-content {
          display: flex;
          flex-direction: column;
        }

        .ai-arrow {
          color: #6F42C1;
          opacity: 0.5;
          display: grid;
          place-items: center;
        }
        @media (max-width: 1023px) {
          .ai-arrow {
            transform: rotate(90deg);
            justify-self: center;
            padding: 4px 0;
          }
        }

        .ai-quote {
          margin: 48px auto 0;
          max-width: 820px;
          padding: 24px 28px;
          background: linear-gradient(135deg, rgba(111, 66, 193, 0.08) 0%, transparent 100%);
          border-left: 3px solid #6F42C1;
          border-radius: 0 12px 12px 0;
        }
        .ai-quote p {
          font-size: 16px;
          line-height: 1.55;
          color: var(--foreground);
          opacity: 0.92;
          margin: 0;
          font-weight: 500;
        }
        @media (min-width: 768px) {
          .ai-quote p {
            font-size: 18px;
            text-align: center;
          }
          .ai-quote {
            border-left: none;
            border-radius: 16px;
            text-align: center;
            background: linear-gradient(135deg, rgba(111, 66, 193, 0.10) 0%, rgba(154, 127, 224, 0.05) 100%);
          }
        }
      `}</style>
    </section>
  );
}
