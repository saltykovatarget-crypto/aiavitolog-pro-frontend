import React, { useEffect, useState } from 'react';
import { UniversalHeader } from './UniversalHeader';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { XCircle, RotateCcw, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { RegistrationModal } from './RegistrationModal';
import { LoginModal } from '@/components/auth/LoginModal';
import { useAuth } from '@/lib/auth';

interface BillingFailPageProps {
  onNavigateToChat?: () => void;
  onNavigateToPricing?: () => void;
  selectedPlan?: string;
}

export function BillingFailPage({ 
  onNavigateToChat = () => {},
  onNavigateToPricing = () => {},
  selectedPlan = ''
}: BillingFailPageProps) {
  const [isDark, setIsDark] = useState(true);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user } = useAuth();

  const handleRetryPayment = () => {
    onNavigateToPricing();
  };

  const handleOpenRegistration = () => {
    setIsRegistrationModalOpen(true);
  };

  const handleCloseRegistration = () => {
    setIsRegistrationModalOpen(false);
  };

  const handleRegistrationComplete = () => {
    setIsRegistrationModalOpen(false);
    onNavigateToChat();
  };

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginComplete = () => {
    setIsLoginModalOpen(false);
  };

  useEffect(() => {
    if (user) {
      setIsLoginModalOpen(false);
      setIsRegistrationModalOpen(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <UniversalHeader
        isDark={isDark}
        setIsDark={setIsDark}
        onLogin={handleOpenLogin}
        onRegistration={handleOpenRegistration}
      />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-card">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>

            {/* Main Content */}
            <div className="space-y-3">
              <h1>Платёж не прошёл</h1>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Платёж отклонён или прерван. Попробуйте снова или выберите другой способ оплаты.
                </p>
                
                {/* Secondary reason */}
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                    Ошибка платежа
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleRetryPayment} 
                size="lg" 
                className="w-full gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Повторить оплату
              </Button>
              
              <Button 
                onClick={onNavigateToChat} 
                variant="outline" 
                size="lg" 
                className="w-full gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Назад в чат
              </Button>
            </div>

            {/* Additional Help */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Если проблема повторяется, попробуйте другую карту или способ оплаты
              </p>
            </div>
          </motion.div>
        </Card>
      </div>

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
    </div>
  );
}