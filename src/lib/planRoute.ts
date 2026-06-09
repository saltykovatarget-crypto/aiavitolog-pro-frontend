export type PlanId = 'free' | 'basic' | 'plus' | 'premium';

function normalizePlan(plan: PlanId | string | null | undefined): PlanId {
  const normalized = (plan ?? 'free').toString().toLowerCase();
  switch (normalized) {
    case 'basic':
    case 'plus':
    case 'premium':
      return normalized;
    default:
      return 'free';
  }
}

export function chatRouteForPlan(plan: PlanId | string | null | undefined): string {
  switch (normalizePlan(plan)) {
    case 'basic':
      return 'chat-basic';
    case 'premium':
      return 'chat-premium';
    case 'plus':
      return 'chat-pro';
    default:
      return 'chat';
  }
}

export function statsRouteForPlan(plan: PlanId | string | null | undefined): string {
  switch (normalizePlan(plan)) {
    case 'basic':
      return 'statistics-basic';
    case 'premium':
      return 'statistics-premium';
    case 'plus':
      return 'statistics';
    default:
      return 'statistics-demo';
  }
}
