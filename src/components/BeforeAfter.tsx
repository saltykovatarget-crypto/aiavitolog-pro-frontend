import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Data Types
interface ImageSlot {
  url: string;
  caption: string;
}

interface CaseStudy {
  id: string;
  images: {
    before: ImageSlot;
    after: ImageSlot;
  };
  delta: string;               // "+226%" — отображается на AFTER как бейдж
  metric: string;              // что именно выросло — "контактов", "обращений"
  summary: string;
  accordion: {
    startPoint: string;
    changes: string[];
    conclusion: string;
  };
}

// Case Studies Data
const caseStudies: CaseStudy[] = [
  {
    id: 'case-1',
    images: {
      before: { url: '/cases/case-1-before.jpg', caption: 'Статистика кабинета до внедрения системы' },
      after: { url: '/cases/case-1-after.jpg', caption: 'Статистика после внедрения AI-Авитолог PRO' },
    },
    delta: '+226%',
    metric: 'контактов',
    summary:
      'От ручного ведения к системной модели AI-Авитолог PRO: +226% контактов и рост конверсии с 1,8% до 5% без увеличения бюджета.',
    accordion: {
      startPoint:
        '4 месяца самостоятельной работы.\n\n36 объявлений\n106 контактов\n~1 103 ₽ стоимость контакта\nКонверсия из просмотра в обращение — 1,8%\n\nУслуги размещались без чёткой сегментации. География не была раскрыта. Масштабирования не было — рост зависел от ручных действий и отдельных объявлений.',
      changes: [
        'Проект перевели на 10-шаговую систему AI-Авитолог PRO',
        'Провели анализ спроса и конкурентов',
        'Разложили услуги по сегментам',
        'Расширили структуру через автозагрузку',
        'Переписали заголовки под разные уровни спроса',
        'Запустили тестирование формулировок',
        'Выстроили логику масштабирования',
        'Без увеличения бюджета — работа стала системой, а не набором отдельных действий'
      ],
      conclusion:
        'Результат (3 месяца работы по системе):\n\n346 контактов\n~549 ₽ стоимость контакта\nКонверсия из просмотра в обращение — 5%\n\nРост контактов +226%\nСтоимость контакта снизилась почти в 2 раза\nКонверсия выросла почти в 3 раза\n\nВажно: период не был пиковым по сезонности.\n\nВывод: рост произошёл не из-за увеличения количества объявлений, а за счёт выстроенной структуры и работы с реальным спросом. Конверсия выросла с 1,8% до 5%, поэтому пользователь не просто смотрит, а оставляет обращение. AI-Авитолог PRO переводит проект из ручного режима в управляемую систему масштабирования.'
    }
  },
  {
    id: 'case-2',
    images: {
      before: { url: '/cases/case-2-before.jpg', caption: 'На начало работ аккаунта не было' },
      after: { url: '/cases/case-2-after.jpg', caption: 'Систематизированная структура с ростом' },
    },
    delta: '184 за 1,5 мес',
    metric: 'обращений',
    summary:
      'Самостоятельный запуск на Авито с AI-Авитолог PRO: 184 обращения за 1,5 месяца и 490 активных объявлений.',
    accordion: {
      startPoint:
        'Юрист запускала Авито с нуля.\nБез опыта работы с площадкой Авито.\nБез подрядчиков и команды.\n\nЗадача — сразу выстроить понятную модель работы и не потерять бюджет на хаотичных тестах.',
      changes: [
        'Вся работа велась самостоятельно через AI-Авитолог PRO',
        'Проведён анализ спроса внутри Авито',
        'Структурированы юридические услуги',
        'Сформирована матрица объявлений',
        'Выстроена логика размещения по сегментам',
        'Настроен контроль показателей и корректировка модели',
        'Проект запускался по последовательной системе, а не методом проб и ошибок'
      ],
      conclusion:
        'Результат за 1,5 месяца:\n\n490 активных объявлений\n184 обращения\nСредняя стоимость контакта — около 129 ₽\n\nЗапуск прошёл без хаоса и «слива» бюджета. Модель начала приносить обращения уже в первый период работы.\n\nВывод: даже без опыта работы с Авито можно выстроить управляемую систему, если действовать по понятной модели. AI-Авитолог PRO даёт структуру, в которой предприниматель понимает, что он делает и как управлять результатом.'
    }
  },
  {
    id: 'case-3',
    images: {
      before: { url: '/cases/case-3-before.jpg', caption: 'Низкая конверсия и слабая видимость' },
      after: { url: '/cases/case-3-after.jpg', caption: 'Стабильный рост и высокие показатели' },
    },
    delta: '+57%',
    metric: 'обращений',
    summary:
      'Новая ниша: +57% обращений и снижение стоимости контакта после внедрения AI-Авитолог PRO (при сопоставимом бюджете).',
    accordion: {
      startPoint:
        'Проект запускался в новой категории. Ранее в этой нише системной работы не было.\n\nКатегория конкурентная, с высокой стоимостью контакта.\n\nРезультат до пересборки модели (при сопоставимом бюджете):\n47 контактов\n~538 ₽ средняя стоимость контакта\n\nСтруктура сегментов и логика размещения были выстроены частично, без системной модели масштабирования.',
      changes: [
        'Работу перевели на систему AI-Авитолог PRO',
        'Провели анализ спроса внутри категории',
        'Определили направления с реальным потенциалом',
        'Выстроили сегментацию услуг',
        'Пересобрали структуру объявлений',
        'Внедрили контроль стоимости контакта',
        'Убрали хаотичные действия и ускорили разбор специфики ниши'
      ],
      conclusion:
        'Результат за следующий период:\n\n74 контакта\n~338 ₽ средняя стоимость контакта\n\nРост обращений +57%\nСтоимость контакта снизилась примерно на 200 ₽\nБюджет остался на сопоставимом уровне.\n\nВывод: сложность ниши сама по себе не является проблемой — результат зависит от того, есть ли системный подход к работе со спросом. AI-Авитолог PRO помогает выстроить понятную модель в любой категории на Авито, даже если ранее в этой нише не работали.'
    }
  }
];


// Case Card Component
function CaseCard({ caseStudy }: { caseStudy: CaseStudy }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-6">
      {/* Before/After Screenshots with decorations */}
      <div className="ba-pair">
        {/* Before */}
        <motion.div
          className="ba-side ba-side--before"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="ba-label ba-label--before">
            <span className="ba-dot ba-dot--before" />
            До
          </div>
          <div className="ba-image-frame ba-image-frame--before">
            <ImageWithFallback
              src={caseStudy.images.before.url}
              alt="До внедрения системы"
              className="ba-image"
            />
          </div>
          <p className="ba-caption">{caseStudy.images.before.caption}</p>
        </motion.div>

        {/* Arrow divider — visible only on md+ */}
        <div className="ba-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>

        {/* After */}
        <motion.div
          className="ba-side ba-side--after"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
        >
          <div className="ba-label ba-label--after">
            <span className="ba-dot ba-dot--after" />
            После
          </div>
          <div className="ba-image-frame ba-image-frame--after">
            <ImageWithFallback
              src={caseStudy.images.after.url}
              alt="После внедрения системы"
              className="ba-image"
            />
            {/* Floating delta badge */}
            <motion.div
              className="ba-delta"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.55 }}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <div className="ba-delta-text">
                <div className="ba-delta-value">{caseStudy.delta}</div>
                <div className="ba-delta-label">{caseStudy.metric}</div>
              </div>
            </motion.div>
          </div>
          <p className="ba-caption">{caseStudy.images.after.caption}</p>
        </motion.div>
      </div>

      {/* Summary - Fixed 2 Lines Max */}
      <div className="text-center">
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto">{caseStudy.summary}</p>
      </div>

      {/* Collapsible Accordion */}
      <div className="border-t border-border pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-brand hover:text-brand/80 transition-colors"
        >
          {isExpanded ? (
            <>
              Свернуть разбор кейса <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Показать разбор кейса <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4 max-w-3xl mx-auto">
                {/* Start Point */}
                <div>
                  <h5 className="text-sm font-semibold text-foreground mb-2">Стартовая точка</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">{caseStudy.accordion.startPoint}</p>
                </div>

                {/* Changes */}
                <div>
                  <h5 className="text-sm font-semibold text-foreground mb-2">Что изменили</h5>
                  <ul className="space-y-1.5">
                    {caseStudy.accordion.changes.map((change, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                        <span className="text-brand mt-1 flex-shrink-0">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Conclusion */}
                <div>
                  <h5 className="text-sm font-semibold text-foreground mb-2">Вывод</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">{caseStudy.accordion.conclusion}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Main Component
export function BeforeAfter() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? caseStudies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === caseStudies.length - 1 ? 0 : prev + 1));
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -20 : 20,
      opacity: 0
    })
  };

  return (
    <section id="cases" className="py-16 md:py-24 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(50% 50% at 15% 30%, rgba(111, 66, 193, 0.07), transparent 70%), radial-gradient(45% 45% at 85% 75%, rgba(56, 189, 248, 0.05), transparent 70%)',
        }}
      />
      <div className="container max-w-[1200px] mx-auto px-5">
        {/* Compact Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight m-0 text-foreground">
            Кейсы роста на Авито после перехода на систему AI-Авитолог PRO
          </h2>
          <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Листай — смотри ДО/ПОСЛЕ и результат
          </p>
        </div>

        {/* Carousel */}
        <div className="relative mt-10 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <CaseCard caseStudy={caseStudies[currentIndex]} />
            </motion.div>
          </AnimatePresence>

          {caseStudies.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="before-after-arrow before-after-arrow--left w-10 h-10 flex items-center justify-center rounded-full border border-border bg-card hover:bg-accent/10 transition-colors shadow-lg z-10"
                aria-label="Предыдущий кейс"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={handleNext}
                className="before-after-arrow before-after-arrow--right w-10 h-10 flex items-center justify-center rounded-full border border-border bg-card hover:bg-accent/10 transition-colors shadow-lg z-10"
                aria-label="Следующий кейс"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </>
          )}
        </div>

        {/* Pagination Dots */}
        {caseStudies.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            {caseStudies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-brand w-8' : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Перейти к кейсу ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        /* ===== Before/After Pair ===== */
        .ba-pair {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: stretch;
        }
        @media (min-width: 768px) {
          .ba-pair {
            grid-template-columns: 1fr auto 1fr;
            gap: 18px;
            align-items: center;
          }
        }

        .ba-side {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 0;
        }

        .ba-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .ba-label--before { color: rgba(255, 255, 255, 0.55); }
        .ba-label--after { color: #34d399; }
        .ba-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .ba-dot--before {
          background: rgba(255, 255, 255, 0.45);
        }
        .ba-dot--after {
          background: #34d399;
          box-shadow: 0 0 10px rgba(52, 211, 153, 0.7);
          animation: ba-dot-pulse 2s ease-in-out infinite;
        }
        @keyframes ba-dot-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(52, 211, 153, 0.7); }
          50% { box-shadow: 0 0 18px rgba(52, 211, 153, 0.95); }
        }

        .ba-image-frame {
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 14px;
          overflow: hidden;
          background: #0E1118;
          aspect-ratio: 16 / 9;
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
        }
        .ba-image-frame--before {
          opacity: 0.85;
        }
        .ba-image-frame--before:hover {
          opacity: 1;
          transform: translateY(-3px);
          box-shadow: 0 18px 40px -15px rgba(0, 0, 0, 0.55);
        }
        .ba-image-frame--after {
          border-color: rgba(52, 211, 153, 0.32);
          box-shadow:
            0 0 0 1px rgba(52, 211, 153, 0.06),
            0 18px 40px -15px rgba(52, 211, 153, 0.18);
        }
        .ba-image-frame--after:hover {
          transform: translateY(-3px);
          border-color: rgba(52, 211, 153, 0.55);
          box-shadow:
            0 0 0 1px rgba(52, 211, 153, 0.12),
            0 24px 50px -15px rgba(52, 211, 153, 0.28);
        }
        .ba-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
        }

        /* Floating delta badge over After image */
        .ba-delta {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 14px 9px 11px;
          background: rgba(14, 17, 24, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(52, 211, 153, 0.45);
          border-radius: 12px;
          box-shadow: 0 12px 30px -8px rgba(0, 0, 0, 0.55), 0 0 24px rgba(52, 211, 153, 0.15);
          color: #34d399;
        }
        .ba-delta-text {
          line-height: 1;
        }
        .ba-delta-value {
          font-size: 14px;
          font-weight: 800;
          color: #34d399;
          letter-spacing: -0.01em;
          font-feature-settings: "tnum";
        }
        .ba-delta-label {
          font-size: 9px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-top: 3px;
        }

        .ba-caption {
          font-size: 12px;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.55);
          margin: 0;
        }

        /* Arrow divider between BEFORE and AFTER */
        .ba-arrow {
          display: none;
          align-items: center;
          justify-content: center;
          color: rgba(154, 127, 224, 0.6);
          align-self: center;
        }
        @media (min-width: 768px) {
          .ba-arrow {
            display: flex;
            margin-top: 26px; /* match label height to align with images */
          }
        }
        .ba-arrow svg {
          animation: ba-arrow-pulse 2.4s ease-in-out infinite;
        }
        @keyframes ba-arrow-pulse {
          0%, 100% { transform: translateX(0); opacity: 0.6; }
          50% { transform: translateX(4px); opacity: 1; }
        }

      `}</style>
    </section>
  );
}
