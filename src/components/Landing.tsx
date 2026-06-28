import React, { useEffect, useState } from 'react';
import { UniversalHeader } from './UniversalHeader';
import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { ToolsCatalog } from './ToolsCatalog';
import { AiInterpretation } from './AiInterpretation';
import { BeforeAfter } from './BeforeAfter';
import { ExpertProfile } from './ExpertProfile';
import { WhoItsFor } from './WhoItsFor';
import { WalletInfo } from './WalletInfo';
import { FAQ } from './FAQ';
import { PartnersProgram } from './PartnersProgram';
import { ArticlesPreview } from './ArticlesPreview';
import { FinalCTA } from './FinalCTA';
import { RegistrationModal } from './RegistrationModal';
import { LoginModal } from '@/components/auth/LoginModal';
import { useAuth } from '@/lib/auth';
import { type PlanId } from '@/lib/plan';
import type { PlanData } from './ModalConfirmPlan';
import { PaymentRequestModal } from './PaymentRequestModal';
import qrValeriia from '../qrlera.png';
import { Footer } from './Footer';

interface LandingProps {
  onNavigateToChat?: () => void;
  onNavigateToPricing?: () => void;
  onNavigateToTools?: () => void;
}

export function Landing({ onNavigateToChat, onNavigateToPricing, onNavigateToTools }: LandingProps) {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId | null>(null);
  const { user } = useAuth();

  // Force dark theme for landing page
  useEffect(() => {
    document.documentElement.classList.add('dark');

    const queryTarget = new URLSearchParams(window.location.search).get('section');
    let storedTarget: string | null = null;

    try {
      storedTarget = sessionStorage.getItem('landing-scroll-target');
    } catch {}

    const target = queryTarget || storedTarget;
    if (!target) return;

    const timer = window.setTimeout(() => {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      try {
        sessionStorage.removeItem('landing-scroll-target');
      } catch {}

      const url = new URL(window.location.href);
      url.searchParams.delete('section');
      window.history.replaceState({}, '', url.pathname + url.hash);
    }, 80);

    return () => window.clearTimeout(timer);
  }, []);

  const handleOpenRegistration = () => {
    setIsRegistrationModalOpen(true);
  };

  const handleCloseRegistration = () => {
    setIsRegistrationModalOpen(false);
  };

  const handleRegistrationComplete = async () => {
    setIsRegistrationModalOpen(false);
    if (selectedPlan) {
      setIsPaymentModalOpen(true);
    }
  };

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginComplete = async () => {
    setIsLoginModalOpen(false);
    if (selectedPlan) {
      setIsPaymentModalOpen(true);
    }
  };

  const handlePlanConfirm = async (planId: PlanId, planData: PlanData) => {
    setSelectedPlan(planData);
    setSelectedPlanId(planId);
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsPaymentModalOpen(true);
  };

  useEffect(() => {
    if (user) {
      setIsLoginModalOpen(false);
      setIsRegistrationModalOpen(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-dark">
      <UniversalHeader
        isDark={true}
        setIsDark={() => {}} // No theme switching on landing
        onLogin={handleOpenLogin}
        onRegistration={handleOpenRegistration}
        showMarketingNavigation
      />
      
      <main>
        <Hero onNavigateToChat={onNavigateToChat} />
        <HowItWorks onNavigateToChat={onNavigateToChat} />
        <ToolsCatalog onNavigateToChat={onNavigateToChat} onNavigateToTools={onNavigateToTools} />
        <AiInterpretation onNavigateToChat={onNavigateToChat} />
        <BeforeAfter />
        <ExpertProfile />
        <WhoItsFor />
        <WalletInfo onRegister={onNavigateToChat} />
        <FAQ />
        <PartnersProgram onApply={onNavigateToChat} />
        <ArticlesPreview />
        <FinalCTA onNavigateToChat={onNavigateToChat} />
      </main>

      <Footer />

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

      <PaymentRequestModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedPlan(null);
          setSelectedPlanId(null);
        }}
        planId={selectedPlanId}
        qrImageSrc={qrValeriia}
        planName={selectedPlan?.name ?? undefined}
        periodLabel={selectedPlan?.period === 'yearly' ? 'год' : 'мес'}
        price={selectedPlan?.price ?? undefined}
      />
    </div>
  );
}
