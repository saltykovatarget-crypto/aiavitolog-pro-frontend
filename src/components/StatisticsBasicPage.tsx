import React, { useCallback, useMemo, useState } from 'react';
import { UniversalHeader } from './UniversalHeader';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { DailyQuestionsChart } from './DailyQuestionsChart';
import { SubscriptionInfo } from './SubscriptionInfo';
import { MyDocuments } from './stats/MyDocuments';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { useAuth } from '@/lib/auth';
import type { UserPlan } from '@/types/user';
import { getPublicPlanLabel } from '@/lib/planLabels';

// Types for different subscription states
export type SubscriptionStatus = 'active' | 'free' | 'expired';

interface StatisticsBasicPageProps {
  onBack?: () => void;
  isDark?: boolean;
  setIsDark?: (isDark: boolean) => void;
  onNavigateToChat?: () => void;
  subscriptionStatus?: SubscriptionStatus;
}

function resolveStatus(plan: UserPlan | string | null | undefined, isPremium: boolean | undefined): SubscriptionStatus {
  const normalized = (plan ?? 'free').toString().toLowerCase();
  if (normalized === 'free') {
    return 'free';
  }
  return isPremium ? 'active' : 'expired';
}

export function StatisticsBasicPage({
  onBack,
  isDark = true,
  setIsDark,
  onNavigateToChat,
  subscriptionStatus,
}: StatisticsBasicPageProps) {
  const [isProfileSettingsModalOpen, setIsProfileSettingsModalOpen] = useState(false);
  const { user } = useAuth();

  const plan = user?.plan ?? 'free';
  const planKey = plan?.toString().toLowerCase();
  const derivedStatus = user
    ? resolveStatus(plan, user?.is_premium)
    : subscriptionStatus ?? 'free';
  const planLabel = getPublicPlanLabel(planKey, 'Текущий тариф');
  const used = user?.daily_questions_used ?? 0;
  const limit =
    user?.daily_questions_limit ??
    (planKey === 'free' ? 15 : planKey === 'basic' ? 600 : planKey === 'plus' ? 1200 : planKey === 'premium' ? 3000 : 0);
  const planUntil = user?.plan_until ?? null;

  const handleUpgrade = useCallback(() => {
    try {
      window.location.hash = 'pricing';
    } catch (error) {
      console.error('Failed to navigate to pricing', error);
    }
  }, []);

  const subscriptionData = useMemo(
    () => ({
      status: derivedStatus,
      planName: planLabel,
    }),
    [derivedStatus, planLabel],
  );

  const handleOpenProfileSettings = () => {
    setIsProfileSettingsModalOpen(true);
  };

  const handleCloseProfileSettings = () => {
    setIsProfileSettingsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Universal Header */}
      <UniversalHeader
        isDark={isDark}
        setIsDark={setIsDark || (() => {})}
        onOpenProfileSettings={handleOpenProfileSettings}
        onNavigateToStatistics={() => {}} // Already on statistics page
      />

      {/* Page Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack || onNavigateToChat}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад в чат
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-xl font-semibold">Статистика</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Tokens and Subscription Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tokens Chart */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-card">
              <DailyQuestionsChart
                plan={plan}
                used={used}
                limit={limit}
                planUntil={planUntil}
                onUpgrade={derivedStatus === 'free' ? handleUpgrade : undefined}
              />
            </div>

            {/* Subscription Info */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-card">
              <SubscriptionInfo
                status={subscriptionData.status}
                expiryDate={planUntil}
                planName={subscriptionData.planName}
                planId={plan}
                limit={limit}
                onChangePlan={handleUpgrade}
              />
            </div>
          </div>

          {/* Files Section */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-card">
            <MyDocuments onGoToPricing={handleUpgrade} />
          </div>
        </div>
      </div>

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileSettingsModalOpen}
        onClose={handleCloseProfileSettings}
        profileData={{
          userId: user?.telegram_id ? `TG_${user.telegram_id}` : (user?.id ?? '—'),
          telegramUsername: user?.telegram_username ? `@${user.telegram_username}` : '—',
          fullName: user?.full_name || user?.username || '—',
          planType: (user?.plan || 'free').toUpperCase() as 'FREE' | 'BASIC' | 'PLUS' | 'PREMIUM'
        }}
      />
    </div>
  );
}
