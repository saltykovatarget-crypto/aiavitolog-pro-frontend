import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Crown, AlertTriangle, ArrowRight } from 'lucide-react';

import type { UserPlan } from '@/types/user';
import { getPublicPlanLabel } from '@/lib/planLabels';

interface SubscriptionInfoProps {
  status: 'active' | 'free' | 'expired';
  expiryDate?: string | null;
  planName?: string | null;
  planId?: UserPlan | string | null;
  limit?: number | null;
  onChangePlan?: () => void;
}

const numberFormatter = new Intl.NumberFormat('ru-RU');
const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function SubscriptionInfo({
  status,
  expiryDate,
  planName,
  planId,
  limit,
  onChangePlan,
}: SubscriptionInfoProps) {
  const normalizedPlan = (planId ?? '').toString().toLowerCase();
  const planLabel = getPublicPlanLabel(normalizedPlan, planName ?? 'Текущий тариф');
  const formattedLimit = typeof limit === 'number' && Number.isFinite(limit) ? numberFormatter.format(Math.max(limit, 0)) : null;
  const formattedExpiry = expiryDate ? dateFormatter.format(new Date(expiryDate)) : null;

  const info = (() => {
    switch (status) {
      case 'active':
        return {
          icon: Crown,
          iconColor: 'text-accent',
          iconBg: 'bg-accent/10',
          title: formattedExpiry ? `Тариф действует до ${formattedExpiry}` : 'Подписка активна',
          subtitle: `Тариф ${planLabel}`,
          badge: { text: 'Активна', variant: 'secondary' as const, className: 'bg-accent/10 text-accent border-accent/20' },
          button: null,
          description:
            formattedLimit
              ? `Ваш лимит — ${formattedLimit} запросов на период тарифа. После этого периода будет бесплатный тариф.`
              : 'У вас есть полный доступ ко всем функциям AI Авитолог PRO.',
        };
      case 'expired':
        return {
          icon: AlertTriangle,
          iconColor: 'text-destructive',
          iconBg: 'bg-destructive/10',
          title: formattedExpiry ? `Подписка истекла ${formattedExpiry}` : 'Подписка истекла',
          subtitle: `Тариф ${planLabel}`,
          badge: { text: 'Истекла', variant: 'destructive' as const },
          button: { text: 'Продлить подписку', variant: 'default' as const },
          description: 'Продлите подписку, чтобы продолжить использовать функции ассистента и увеличенный лимит запросов.',
        };
      case 'free':
      default:
        return {
          icon: Crown,
          iconColor: 'text-muted-foreground',
          iconBg: 'bg-muted/10',
          title: 'Подписка не активна',
          subtitle: 'Бесплатный тариф',
          badge: { text: 'Free', variant: 'secondary' as const },
          button: { text: 'Обновить тариф', variant: 'default' as const },
          description: 'Бесплатно доступно 15 запросов на аккаунт.',
        };
    }
  })();

  const IconComponent = info.icon;

  const handleButtonClick = () => {
    if (onChangePlan) {
      onChangePlan();
      return;
    }
    try {
      window.location.hash = 'pricing';
    } catch (error) {
      console.error('Failed to navigate to pricing', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${info.iconBg} flex items-center justify-center`}>
          <IconComponent className={`w-5 h-5 ${info.iconColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">Подписка</h3>
            <Badge
              variant={info.badge.variant}
              className={info.badge.className}
            >
              {info.badge.text}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{info.subtitle}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className={`text-lg font-semibold ${status === 'expired' ? 'text-destructive' : ''}`}>
            {info.title}
          </div>
          <p className="text-sm text-muted-foreground mt-2">{info.description}</p>
          {status === 'active' && formattedExpiry && (
            <p className="text-xs text-muted-foreground mt-2">Тариф действует до {formattedExpiry}. После этого будет бесплатный тариф.</p>
          )}
        </div>

        {info.button && (
          <Button
            variant={info.button.variant}
            onClick={handleButtonClick}
            className="w-full gap-2"
          >
            {info.button.text}
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {status === 'active' && (
        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="text-sm font-medium">Ваши преимущества:</h4>
          <div className="space-y-2">
            {[
              formattedLimit ? `Лимит: ${formattedLimit} запросов на период тарифа` : 'Увеличенный лимит запросов',
              'Неограниченные диалоги',
              'Загрузка и анализ файлов',
              'Приоритетная поддержка',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {status === 'free' && (
        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="text-sm font-medium">Обновите тариф и получите:</h4>
          <div className="space-y-2">
            {[
              'Лимит до 3000 запросов на период тарифа',
              'Ответы без задержек',
              'Работу с файлами и шаблонами',
              'Приоритетную поддержку',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
