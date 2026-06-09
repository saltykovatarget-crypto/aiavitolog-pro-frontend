export const PRICING_WORKLOAD_TITLE = 'Выбрать тариф AI Авитолог PRO';

export const PRICING_WORKLOAD_SUBTITLE =
  'Тарифы отличаются рабочей нагрузкой — количеством проектов и запросов ассистента, которые вы используете в работе.';

export const PRICING_WORKLOAD_FOOTNOTE =
  'Лучше выбирать тариф с запасом, чтобы не упереться в лимит по ходу работы.';

export type WorkloadPlanCopy = {
  workloadLine: string;
  fitsTitle: string;
  fitsBullets: string[];
  requestsLine: string;
};

export const WORKLOAD_PLANS_COPY: Record<'basic' | 'plus' | 'premium', WorkloadPlanCopy> = {
  basic: {
    workloadLine: 'до 2 проектов',
    requestsLine: '100 запросов ассистента',
    fitsTitle: 'Подойдёт, если вы:',
    fitsBullets: [
      'работаете со своим бизнесом',
      'ведёте 1–2 проекта',
      'тестируете нишу или новую услугу',
    ],
  },
  plus: {
    workloadLine: 'до 6 проектов',
    requestsLine: '300 запросов ассистента',
    fitsTitle: 'Подойдёт, если вы:',
    fitsBullets: [
      'авитолог или маркетолог',
      'ведёте несколько клиентов',
      'регулярно запускаете и дорабатываете объявления',
    ],
  },
  premium: {
    workloadLine: 'до 15 проектов',
    requestsLine: '750 запросов ассистента',
    fitsTitle: 'Подойдёт, если вы:',
    fitsBullets: [
      'агентство или команда',
      'ведёте много клиентов',
      'масштабируете объявления по регионам',
    ],
  },
};
