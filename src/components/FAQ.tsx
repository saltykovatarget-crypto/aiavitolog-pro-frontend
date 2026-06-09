import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

const faqs = [
  {
    q: 'Как платить за сервис?',
    a: 'Пополняешь кошелёк один раз — от 100 ₽ или выгодным пакетом (от 390 ₽ за 500 ₽ на кошельке). Дальше деньги списываются с каждого действия: ответ AI Авитолога — 5 ₽, парсер конкурентов — 190 ₽, анализ статистики кабинета — 50 ₽. Никаких подписок.',
  },
  {
    q: 'Сколько стоит попробовать?',
    a: 'Регистрация бесплатна — после неё мы зачисляем 50 ₽ бонусом на твой кошелёк. Этого хватит на 10 ответов AI Авитолога, чтобы попробовать сервис без вложений.',
  },
  {
    q: 'Сгорают ли деньги на кошельке?',
    a: 'Нет. Сроков давности нет — твои деньги лежат на кошельке столько, сколько нужно. Положил 1 000 ₽ — можешь тратить хоть год, хоть три.',
  },
  {
    q: 'Можно ли вернуть деньги?',
    a: 'Да. Возврат неиспользованного остатка — через поддержку. Каждый запрос рассматривается индивидуально, обычно в течение 1–3 рабочих дней.',
  },
  {
    q: 'Нужно ли разбираться в рекламе и аналитике?',
    a: 'Нет. Сервис сам структурирует работу: задаёт правильные вопросы, помогает анализировать данные и даёт конкретные рекомендации. Специальные знания не обязательны.',
  },
  {
    q: 'Это автоматический сервис или я участвую в работе?',
    a: 'Сервис не угадывает и не «делает всё сам». Он анализирует информацию, которую ты предоставляешь: нишу, регион, конкурентов, тексты, статистику, скриншоты. На основе этих данных AI Авитолог помогает принимать более точные решения и ведёт пошагово по методологии.',
  },
  {
    q: 'Как работают пакеты пополнения?',
    a: 'Это пополнение со скидкой. Платишь 390 ₽ — на кошелёк зачисляется 500 ₽ (скидка 22%). Пакет 990 ₽ → 1 500 ₽ (−34%). Пакет 1 490 ₽ → 2 500 ₽ (−40%). Технически это обычные рубли на балансе, никаких лимитов и счётчиков.',
  },
  {
    q: 'Работает ли в России без VPN?',
    a: 'Да. Все платежи через Точка Банк (RUB, российские карты, СБП). AI Авитолог работает на GPT-5.1 через защищённый канал — пользователю VPN не нужен.',
  },
  {
    q: 'Можно ли использовать сервис для нескольких проектов?',
    a: 'Да. Сервис работает по принципу «один кошелёк — все проекты». Внутри чата можно создавать отдельные диалоги под каждый проект. Никаких ограничений по числу проектов нет — платишь только за фактические действия.',
  },
];

export function FAQ() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(45% 50% at 80% 30%, rgba(111, 66, 193, 0.06), transparent 70%)',
        }}
      />
      <div className="container max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight m-0 text-foreground">
            Частые вопросы
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Ответы на самые популярные вопросы о AI Авитолог PRO
          </p>
        </div>
        
        <div className="mt-10 max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 py-2 shadow-card"
              >
                <AccordionTrigger className="text-left text-foreground hover:no-underline hover:text-brand transition-colors">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6">
                  <div className="text-muted-foreground text-sm md:text-base leading-relaxed break-words hyphens-none">
                    {item.a}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
