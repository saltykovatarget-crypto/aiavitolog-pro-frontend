import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check } from 'lucide-react';
import { ModalConfirmPlan, PlanData } from './ModalConfirmPlan';
import { RevealItem } from './landing/Reveal';
import type { PlanId } from '@/lib/plan';
import { PLANS_CATALOG, formatRub } from '@/lib/plansCatalog';
import type { UiPlanId } from '@/lib/plansCatalog';
import {
  PRICING_WORKLOAD_FOOTNOTE,
  PRICING_WORKLOAD_SUBTITLE,
  PRICING_WORKLOAD_TITLE,
  WORKLOAD_PLANS_COPY,
} from '@/content/pricingWorkloadCopy';

type PricingPlan = {
  id: UiPlanId;
  name: string;
  price: number;
  features: string[];
  workloadLine?: string;
  fitsTitle?: string;
  requestsLine?: string;
  isPopular: boolean;
};

const plans: PricingPlan[] = PLANS_CATALOG.map((plan) => {
  const copy = WORKLOAD_PLANS_COPY[plan.id as 'basic' | 'plus' | 'premium'];
  return {
    id: plan.id,
    name: plan.title,
    price: plan.monthlyPriceRub,
    // В лендинге вместо "фич" показываем workload-описание тарифа.
    features: copy?.fitsBullets ?? plan.features,
    workloadLine: copy?.workloadLine,
    fitsTitle: copy?.fitsTitle,
    requestsLine: copy?.requestsLine,
    isPopular: !!plan.isPopular,
  };
});

interface PricingProps {
  onNavigateToPricing?: () => void;
  onConfirmPlan?: (planId: PlanId, planData: PlanData) => Promise<void> | void;
  onNavigateToChatBasic?: () => void;
  onNavigateToChatPremium?: () => void;
  onNavigateToChatPro?: () => void;
  showAllPlansButton?: boolean;
}

function PricingCard({
  plan,
  onSelect,
}: {
  plan: PricingPlan;
  onSelect: (plan: PricingPlan) => void;
}) {
  return (
    <div className={plan.isPopular ? 'pricing-card-elevated' : ''}>
      <Card
        className={`bg-card border-border shadow-card relative h-full ${
          plan.isPopular ? 'ring-2 ring-brand' : ''
        }`}
        style={
          plan.isPopular
            ? {
                background:
                  'linear-gradient(180deg, rgba(111,66,193,0.10) 0%, var(--card) 100%)',
                boxShadow:
                  '0 20px 40px -20px rgba(111, 66, 193, 0.45), 0 8px 16px -8px rgba(0,0,0,0.4)',
              }
            : undefined
        }
      >
        {plan.isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="!bg-[#6F42C1] !text-white px-4 py-1 shadow-lg">
              Популярный
            </Badge>
          </div>
        )}

        <CardContent className="p-8 space-y-6 h-full flex flex-col">
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-semibold leading-tight m-0 text-foreground break-words hyphens-none">
              {plan.name}
            </h3>
            {plan.workloadLine ? (
              <p className="text-sm text-muted-foreground">{plan.workloadLine}</p>
            ) : null}
            {plan.requestsLine ? (
              <p className="text-sm font-medium text-foreground/90">{plan.requestsLine}</p>
            ) : null}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span
                  className={`font-semibold text-foreground ${
                    plan.isPopular ? 'text-4xl' : 'text-3xl'
                  }`}
                >
                  {formatRub(plan.price)}
                </span>
                <span className="text-muted-foreground">/мес</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 flex-grow">
            {plan.fitsTitle ? (
              <p className="text-sm font-medium text-foreground/80">{plan.fitsTitle}</p>
            ) : null}
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>

          <Button
            className={`w-full rounded-full ${
              plan.isPopular
                ? 'hero-cta-primary h-12 text-base'
                : 'bg-card border border-border text-foreground hover:!bg-[rgba(154,127,224,0.12)] hover:!border-[rgba(154,127,224,0.28)] active:!bg-[rgba(154,127,224,0.16)]'
            }`}
            variant={plan.isPopular ? 'default' : 'outline'}
            onClick={() => onSelect(plan)}
          >
            {plan.isPopular ? 'Выбрать — это популярный' : 'Выбрать'}
          </Button>
        </CardContent>
      </Card>

      <style>{`
        @media (min-width: 1024px) {
          .pricing-card-elevated {
            transform: translateY(-16px);
            position: relative;
            z-index: 2;
          }
        }
      `}</style>
    </div>
  );
}

export function Pricing({
  onNavigateToPricing,
  onConfirmPlan,
  onNavigateToChatBasic,
  onNavigateToChatPremium,
  onNavigateToChatPro,
  showAllPlansButton = true,
}: PricingProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId | null>(null);

  const handlePlanSelect = (plan: PricingPlan) => {
    const planData: PlanData = {
      name: plan.name,
      price: plan.price,
      period: 'monthly'
    };

    setSelectedPlan(planData);
    switch (plan.id) {
      case 'basic':
        setSelectedPlanId('basic');
        break;
      case 'premium':
        setSelectedPlanId('premium');
        break;
      case 'plus':
      default:
        setSelectedPlanId('plus');
        break;
    }
    setIsModalOpen(true);
  };

  const resetSelection = () => {
    setSelectedPlan(null);
    setSelectedPlanId(null);
  };

  const handleConfirmPlan = async () => {
    if (!selectedPlan || !selectedPlanId) {
      return;
    }

    if (onConfirmPlan) {
      try {
        await onConfirmPlan(selectedPlanId, selectedPlan);
        setIsModalOpen(false);
        resetSelection();
      } catch (error) {
        console.error('Failed to confirm plan from landing pricing', error);
      }
      return;
    }

    setIsModalOpen(false);

    switch (selectedPlanId) {
      case 'basic':
        onNavigateToChatBasic?.();
        break;
      case 'premium':
        onNavigateToChatPremium?.();
        break;
      case 'plus':
      default:
        onNavigateToChatPro?.();
        break;
    }
    resetSelection();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetSelection();
  };

  return (
    <>
      <section id="pricing" className="py-16 md:py-24 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(45% 60% at 50% 40%, rgba(111, 66, 193, 0.10), transparent 70%)',
          }}
        />
        <div className="container max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight m-0 text-foreground">
              {PRICING_WORKLOAD_TITLE}
            </h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto break-words hyphens-none">
              {PRICING_WORKLOAD_SUBTITLE}
            </p>
          </div>
          
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <RevealItem key={index} index={index} staggerDelay={0.12}>
                <PricingCard plan={plan} onSelect={handlePlanSelect} />
              </RevealItem>
            ))}
          </div>
          
          <div className="mt-6 md:mt-7">
            <p className="text-xs text-muted-foreground max-w-3xl mx-auto leading-relaxed text-center">
              {PRICING_WORKLOAD_FOOTNOTE}
            </p>
          </div>

          {showAllPlansButton && onNavigateToPricing ? (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-border hover:bg-accent/10"
                onClick={onNavigateToPricing}
              >
                Посмотреть все тарифы
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      {/* Modal for plan confirmation */}
      <ModalConfirmPlan
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        planData={selectedPlan}
        onConfirm={handleConfirmPlan}
      />
    </>
  );
}
