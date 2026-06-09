import type { UserPlan } from '@/types/user';

export type DisplayPlan = UserPlan | string | null | undefined;

export const PUBLIC_PLAN_LABELS = {
  free: 'Free',
  basic: 'Базовый',
  plus: 'Профессиональный',
  premium: 'Агентский',
} as const;

export const UPGRADE_CTA_LABEL = 'Обновить тариф';

export function getPublicPlanLabel(plan: DisplayPlan, fallback = 'Текущий тариф'): string {
  const normalized = (plan ?? '').toString().toLowerCase();
  return PUBLIC_PLAN_LABELS[normalized as keyof typeof PUBLIC_PLAN_LABELS] ?? fallback;
}
