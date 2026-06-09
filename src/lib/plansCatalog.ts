export type UiPlanId = 'basic' | 'plus' | 'premium';

export type BillingPeriod = 'monthly' | 'yearly';

export interface UiPlan {
  id: UiPlanId;
  title: string;
  monthlyPriceRub: number;
  yearlyPriceRub: number;
  oldMonthlyPriceRub?: number; // если надо зачёркнутую “до скидки”
  features: string[];
  isPopular?: boolean;
}

// ✅ Сюда копируешь РОВНО те цены, которые уже стоят на главной (Landing)
export const PLANS_CATALOG: UiPlan[] = [
  {
    id: 'basic',
    title: 'Базовый',
    monthlyPriceRub: 1590,
    yearlyPriceRub: 15900,
    features: [
      '100 запросов ассистента',
      'до 2 проектов',
      'Для спокойной и последовательной работы',
    ],
  },
  {
    id: 'plus',
    title: 'Профессиональный',
    monthlyPriceRub: 4290,
    yearlyPriceRub: 42900,
    isPopular: true,
    features: [
      '300 запросов ассистента',
      'до 6 проектов',
      'Для активной работы и нескольких проектов одновременно',
    ],
  },
  {
    id: 'premium',
    title: 'Агентский',
    monthlyPriceRub: 9990,
    yearlyPriceRub: 99900,
    features: [
      '750 запросов ассистента',
      'до 15 проектов',
      'Для большой рабочей нагрузки и масштабирования',
    ],
  },
];

export function formatRub(n: number): string {
  // 6 990 ₽
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`;
}

export function formatPlanPrice(plan: UiPlan, period: BillingPeriod) {
  if (period === 'yearly') {
    return `${formatRub(plan.yearlyPriceRub)}/год`;
  }
  return `${formatRub(plan.monthlyPriceRub)}/мес`;
}
