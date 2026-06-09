import { useState, useEffect } from 'react';
import { UniversalHeader } from './UniversalHeader';
import { PricingCard } from './PricingCard';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { ModalConfirmPlan, PlanData } from './ModalConfirmPlan';
import { RegistrationModal } from './RegistrationModal';
import { LoginModal } from '@/components/auth/LoginModal';
import { PaymentRequestModal } from './PaymentRequestModal';
import { useAuth } from '@/lib/auth';
import { type PlanId } from '@/lib/plan';
import { PLANS_CATALOG, formatRub } from '@/lib/plansCatalog';
import {
  PRICING_WORKLOAD_FOOTNOTE,
  PRICING_WORKLOAD_SUBTITLE,
  PRICING_WORKLOAD_TITLE,
  WORKLOAD_PLANS_COPY,
} from '@/content/pricingWorkloadCopy';

const PLAN_PRIORITY: Record<string, number> = {
  free: 0,
  basic: 1,
  plus: 2,
  premium: 3,
};

interface PricingPageProps {
  onNavigateToChat?: () => void;
}

export function PricingPage({ onNavigateToChat }: PricingPageProps) {
  // Force dark theme for pricing page
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  const billingPeriod = 'monthly' as const;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [downgradeNotice, setDowngradeNotice] = useState<string | null>(null);
  const { user, refreshUser } = useAuth();

  const normalizePlanId = (id: string): PlanId | null => {
    const norm = id === 'pro' ? 'plus' : id;
    return (['basic', 'plus', 'premium'] as const).includes(norm as PlanId)
      ? (norm as PlanId)
      : null;
  };

  const handlePlanSelect = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const normalized = normalizePlanId(planId);
    if (!normalized) return;
    const monthlyPrice = parseFloat(plan.monthlyPrice.replace(/[^\d]/g, ''));
    
    const planData: PlanData = {
      name: plan.title,
      price: monthlyPrice,
      period: billingPeriod,
    };
    
    setSelectedPlan(planData);
    setSelectedPlanId(normalized);

    const currentPlanKey = (user?.plan ?? 'free').toString().toLowerCase();
    const currentPriority = PLAN_PRIORITY[currentPlanKey] ?? 0;
    const nextPriority = PLAN_PRIORITY[normalized] ?? currentPriority;
    if (currentPriority > nextPriority) {
      setDowngradeNotice('Новый тариф вступит в силу после окончания текущей подписки.');
    } else {
      setDowngradeNotice(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    setSelectedPlanId(null);
    setDowngradeNotice(null);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedPlan(null);
    setSelectedPlanId(null);
    setDowngradeNotice(null);
  };

  const handleOpenRegistration = () => {
    setIsRegistrationModalOpen(true);
  };

  const handleCloseRegistration = () => {
    setIsRegistrationModalOpen(false);
  };

  const handleRegistrationComplete = async () => {
    setIsRegistrationModalOpen(false);
    try {
      await refreshUser();
    } catch (error) {
      console.error('Failed to refresh user after registration', error);
    }
    if (!selectedPlanId) return;
    setIsPaymentModalOpen(true);
  };

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginComplete = async () => {
    setIsLoginModalOpen(false);
    try {
      await refreshUser();
    } catch (error) {
      console.error('Failed to refresh user after login', error);
    }
    if (!selectedPlanId) return;
    setIsPaymentModalOpen(true);
  };

  const requestPayment = () => {
    if (!user) {
      setIsModalOpen(false);
      setIsLoginModalOpen(true);
      return;
    }
    setIsModalOpen(false);
    setDowngradeNotice(null);
    setIsPaymentModalOpen(true);
  };

  useEffect(() => {
    if (user) {
      setIsLoginModalOpen(false);
      setIsRegistrationModalOpen(false);
    }
  }, [user]);

  const plans = PLANS_CATALOG.map(p => ({
    id: p.id === 'plus' ? 'pro' : p.id,
    title: p.title,
    monthlyPrice: `${formatRub(p.monthlyPriceRub)}/мес`,
    features: p.features,
    isPopular: !!p.isPopular,
  }));

  return (
    <div className="min-h-screen bg-gradient-dark">
      <UniversalHeader
        isDark={true}
        setIsDark={() => {}} // No theme switching on pricing
        onLogin={handleOpenLogin}
        onRegistration={handleOpenRegistration}
      />
      
      <main className="py-16 md:py-24">
        <div className="container max-w-[1100px] mx-auto px-5">
          {/* Hero Section */}
          <div className="mb-12 text-center space-y-4">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-8">
              <h1 className="text-2xl md:text-3xl font-semibold leading-tight m-0 text-foreground">{PRICING_WORKLOAD_TITLE}</h1>
              <p className="text-base md:text-lg leading-relaxed m-0 text-muted-foreground max-w-2xl mx-auto break-words hyphens-none">
                {PRICING_WORKLOAD_SUBTITLE}
              </p>
            </div>
            {/* Переключатель ежемесячно / ежегодно убран.
                Страница всегда показывает ежемесячный режим как основной. */}
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-4">
            {plans.map((plan) => (
              (() => {
                const normalized = normalizePlanId(plan.id) ?? 'plus';
                const copy = WORKLOAD_PLANS_COPY[normalized];

                return (
                  <PricingCard
                    key={plan.id}
                    title={plan.title}
                    monthlyPrice={plan.monthlyPrice}
                    workloadLine={copy.workloadLine}
                    requestsLine={copy.requestsLine}
                    fitsTitle={copy.fitsTitle}
                    features={copy.fitsBullets}
                    isPopular={plan.isPopular}
                    onSelect={() => handlePlanSelect(plan.id)}
                  />
                );
              })()
            ))}
          </div>

          {/* Footer Note */}
          <div className="text-center mb-4">
            <p className="text-xs text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {PRICING_WORKLOAD_FOOTNOTE}
            </p>
          </div>

          {/* Back to chat link */}
          <div className="text-center">
            <Button 
              variant="ghost" 
              className="gap-2"
              onClick={onNavigateToChat}
            >
              <ArrowLeft className="w-4 h-4" />
              Назад в чат
            </Button>
          </div>
        </div>
      </main>

      {/* Modal for plan confirmation */}
      <ModalConfirmPlan
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        planData={selectedPlan}
        selectedPlan={selectedPlan}
        onConfirm={requestPayment}
        notice={downgradeNotice}
      />

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={handleCloseRegistration}
        onRegistrationComplete={handleRegistrationComplete}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLogin}
        onLoginComplete={handleLoginComplete}
        onOpenRegistration={handleOpenRegistration}
      />

      {/* Payment modal (Tochka acquiring) */}
      <PaymentRequestModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        planId={selectedPlanId}
        planName={selectedPlan?.name ?? undefined}
        periodLabel={(selectedPlan?.period ?? 'monthly') === 'yearly' ? 'год' : 'мес'}
        price={selectedPlan?.price ?? undefined}
      />
    </div>
  );
}
