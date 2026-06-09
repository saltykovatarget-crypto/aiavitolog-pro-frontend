import React, { useState, useEffect, useMemo } from 'react';
import { UniversalHeader } from './UniversalHeader';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, Loader2, AlertTriangle, User } from 'lucide-react';
import { motion } from 'motion/react';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { useAuth } from '@/lib/auth';
import { api, ApiError } from '@/lib/api';
import { getPublicPlanLabel } from '@/lib/planLabels';

interface BillingSuccessPageProps {
  onNavigateToChat?: () => void;
  onNavigateToChatBasic?: () => void;
  onNavigateToChatPremium?: () => void;
  onNavigateToChatPro?: () => void;
  onNavigateToStatistics?: () => void;
}

interface PlanData {
  name: string;
  expirationDate: string;
  chatRoute: () => void;
}

type LoadingState = 'loading' | 'success' | 'error';

export function BillingSuccessPage({ 
  onNavigateToChat = () => {},
  onNavigateToChatBasic = () => {},
  onNavigateToChatPremium = () => {},
  onNavigateToChatPro = () => {},
  onNavigateToStatistics = () => {}
}: BillingSuccessPageProps) {
  const [isDark, setIsDark] = useState(true);
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [isProfileSettingsModalOpen, setIsProfileSettingsModalOpen] = useState(false);
  const { user, refreshUser } = useAuth();

  const operationIdFromUrl = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('operationId') || params.get('operation_id') || params.get('op') || null;
    } catch {
      return null;
    }
  }, []);

  const handleOpenProfileSettings = () => {
    setIsProfileSettingsModalOpen(true);
  };

  const handleCloseProfileSettings = () => {
    setIsProfileSettingsModalOpen(false);
  };

  useEffect(() => {
    let cancelled = false;

    // Tochka redirects to /billing/success without hash, but the SPA router
    // can keep a stale hash (e.g. #statistics-demo). It doesn't break payment,
    // but it's visually confusing.
    try {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch {}

    const readFallbackOperationId = () => {
      try {
        return localStorage.getItem('tochka_operation_id');
      } catch {
        return null;
      }
    };

    const operationId = operationIdFromUrl || readFallbackOperationId();
    if (!operationId) {
      setLoadingState('error');
      return;
    }

    // For some payment modes (e.g. SBP), the redirect back to the site may happen
    // before the payment is fully processed. In this case Tochka will return
    // status=CREATED for a short time, and /confirm responds with 409.
    // We retry a bit to avoid "paid but plan is still free" confusion.
    setLoadingState('loading');

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const confirmWithRetry = async () => {
      const maxAttempts = 12; // ~30s total
      const delayMs = 2500;

      for (let attempt = 0; attempt < maxAttempts && !cancelled; attempt += 1) {
        try {
          await api.post('/api/access/tochka/confirm', { operationId });
          if (cancelled) return;

          const profile = await refreshUser().catch(() => null);
          const plan = (profile?.plan ?? 'free').toString().toLowerCase();
          const until = profile?.plan_until ? new Date(profile.plan_until).toLocaleDateString('ru-RU') : '';

          const route =
            plan === 'basic'
              ? onNavigateToChatBasic
              : plan === 'premium'
              ? onNavigateToChatPremium
              : plan === 'plus'
              ? onNavigateToChatPro
              : onNavigateToChat;

          setPlanData({
            name: getPublicPlanLabel(plan, plan),
            expirationDate: until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
            chatRoute: route,
          });
          setLoadingState('success');
          return;
        } catch (err) {
          if (cancelled) return;

          // 409 = payment exists but not yet confirmed (e.g. status=CREATED)
          if (err instanceof ApiError && err.status === 409) {
            await sleep(delayMs);
            continue;
          }
          // 404 = we don't know this operation id for this user
          if (err instanceof ApiError && err.status === 404) {
            setLoadingState('error');
            return;
          }

          console.error('Failed to confirm Tochka payment', err);
          await sleep(delayMs);
        }
      }

      if (!cancelled) setLoadingState('error');
    };

    void confirmWithRetry();

    return () => {
      cancelled = true;
    };
  }, [operationIdFromUrl, refreshUser, onNavigateToChat, onNavigateToChatBasic, onNavigateToChatPremium, onNavigateToChatPro]);

  const renderContent = () => {
    switch (loadingState) {
      case 'loading':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h1>Обрабатываем платёж</h1>
              <p className="text-muted-foreground">
                Подтверждаем активацию тарифа...
              </p>
            </div>
          </motion.div>
        );

      case 'error':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1>Ошибка получения данных</h1>
              <p className="text-muted-foreground">
                План активирован, проверьте профиль
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={onNavigateToStatistics} variant="outline" className="gap-2">
                <User className="w-4 h-4" />
                Открыть профиль
              </Button>
              <Button onClick={onNavigateToChat}>
                Вернуться в чат
              </Button>
            </div>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <div className="space-y-3">
              <h1>Оплата успешна</h1>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-muted-foreground">Тариф</span>
                  <Badge variant="default" className="bg-accent text-primary-foreground border-0">
                    {planData?.name}
                  </Badge>
                  <span className="text-muted-foreground">активирован до</span>
                  <span className="font-medium">{planData?.expirationDate}</span>
                </div>
              </div>
            </div>
            <Button onClick={planData?.chatRoute} size="lg" className="min-w-[200px]">
              Вернуться в чат
            </Button>
            <p className="text-xs text-muted-foreground">
              Письмо с чеком отправлено на вашу почту (если указана)
            </p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <UniversalHeader
        isDark={isDark}
        setIsDark={setIsDark}
        onOpenProfileSettings={handleOpenProfileSettings}
        onNavigateToStatistics={onNavigateToStatistics}
      />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-card">
          {renderContent()}
        </Card>
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
