import type { PlanId as AnyPlanId } from './planRoute';

export type PlanId = Exclude<AnyPlanId, 'free'>;

export async function setUserPlan(_plan: PlanId): Promise<never> {
  throw new Error('Прямая смена тарифа отключена. Используйте оплату через /api/access/orders.');
}
