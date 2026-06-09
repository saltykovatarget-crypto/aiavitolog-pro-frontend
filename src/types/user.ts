export type UserPlan = 'free' | 'basic' | 'plus' | 'premium' | (string & {});

export interface UserProfile {
  id: string;
  telegram_id: number | null;
  telegram_username: string | null;
  full_name: string | null;
  username: string | null;
  photo_url: string | null;
  plan: UserPlan;
  plan_until: string | null;
  is_premium: boolean;
  daily_questions_used: number;
  daily_questions_limit: number;
  daily_questions_resets_at: string | null;
}
