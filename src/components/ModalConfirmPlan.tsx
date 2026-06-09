import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { CreditCard } from 'lucide-react';

export interface PlanData {
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  originalPrice?: number; // для годовой подписки со скидкой
}

interface ModalConfirmPlanProps {
  isOpen: boolean;
  onClose: () => void;
  planData?: PlanData | null;
  selectedPlan?: PlanData | null;
  onConfirm: () => void;
  notice?: string | null;
}

export function ModalConfirmPlan({
  isOpen,
  onClose,
  planData,
  selectedPlan,
  onConfirm,
  notice,
}: ModalConfirmPlanProps) {
  const [isAgreed, setIsAgreed] = useState(false);

  const plan = selectedPlan ?? planData ?? null;

  if (!plan) return null;

  const handleConfirm = () => {
    if (isAgreed) {
      onConfirm();
    }
  };

  const handleClose = () => {
    setIsAgreed(false);
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const getPeriodText = (period: 'monthly' | 'yearly') => {
    return period === 'monthly' ? 'Ежемесячно' : 'Ежегодно';
  };

  const getSavingsText = () => {
    if (plan.period === 'yearly' && plan.originalPrice) {
      const savings = plan.originalPrice - plan.price;
      return `Экономия ${formatPrice(savings)} ₽ в год`;
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 space-y-3">
          <DialogTitle className="text-xl">
            Подтверждение тарифа
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Проверьте детали выбранного тарифа и подтвердите оплату
          </DialogDescription>
        </DialogHeader>

        {/* Plan Info */}
        <div className="px-6 pb-6">
          {notice && (
            <div className="mb-4 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              {notice}
            </div>
          )}
          <div className="bg-card border border-border rounded-xl p-5 mb-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {getPeriodText(plan.period)}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold">
                  {formatPrice(plan.price)} ₽
                </div>
                {plan.period === 'yearly' && plan.originalPrice && (
                  <div className="text-sm text-muted-foreground line-through">
                    {formatPrice(plan.originalPrice)} ₽
                  </div>
                )}
              </div>
            </div>

            {getSavingsText() && (
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                {getSavingsText()}
              </Badge>
            )}
          </div>

          {/* Agreement section */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="agree"
                checked={isAgreed}
                onCheckedChange={(checked) => setIsAgreed(checked === true)}
                className="mt-1"
              />
              <label htmlFor="agree" className="text-sm leading-relaxed cursor-pointer">
                Я принимаю{' '}
                <a 
                  href="/offer" 
                  className="text-primary underline hover:no-underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  условия оферты
                </a>
                {' '}и{' '}
                <a 
                  href="#" 
                  className="text-primary underline hover:no-underline"
                  onClick={(e) => e.preventDefault()}
                >
                  политику возвратов
                </a>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isAgreed}
              className="flex-1 gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Оплатить
            </Button>
          </div>

          {/* Footer info */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground leading-relaxed">
              <div className="mb-2">Реквизиты для оплаты:</div>

              <div className="mt-2">Наименование:</div>
              <div className="font-medium text-foreground/80">
                Индивидуальный предприниматель Салтыкова Валерия Валерьевна
              </div>

              <div className="mt-2">ИНН:</div>
              <div className="font-medium text-foreground/80">540303308700</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
