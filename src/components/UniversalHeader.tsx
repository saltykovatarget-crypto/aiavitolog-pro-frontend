import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sun, Moon, User, Settings, BarChart3, LogOut, Crown, Zap, Menu, X, Send } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '@/lib/auth';
import { useLogout } from '@/lib/logout';
import type { UserPlan } from '@/types/user';
import { PUBLIC_PLAN_LABELS } from '@/lib/planLabels';
import { WalletBalance } from './WalletBalance';
import { TopupModal } from './TopupModal';

type PlanType = 'free' | 'basic' | 'plus' | 'premium';

type UserState = 'not_registered' | 'registered_free' | 'paid_plan';

interface UniversalHeaderProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  onLogin?: () => void;
  onRegistration?: () => void;
  onOpenProfileSettings?: () => void;
  onNavigateToStatistics?: () => void;
  onNavigateToPricing?: () => void;
  onOpenMobileChats?: () => void;
  className?: string;
  showMarketingNavigation?: boolean;
}

const marketingNavItems = [
  { label: 'Кому подойдет', sectionId: 'who-its-for' },
  { label: 'Кейсы', sectionId: 'cases' },
  { label: 'Цены', sectionId: 'pricing' },
  { label: 'Как это работает', sectionId: 'how-it-works' },
  { label: 'Партнёрам', sectionId: 'partners' },
] as const;

const planColors: Record<Exclude<PlanType, 'free'>, string> = {
  basic: 'bg-muted/20 border border-border text-muted-foreground',
  plus: 'bg-accent/20 border border-accent/30 text-accent-foreground',
  premium: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400',
};

const planNames: Record<Exclude<PlanType, 'free'>, string> = {
  basic: PUBLIC_PLAN_LABELS.basic,
  plus: PUBLIC_PLAN_LABELS.plus,
  premium: PUBLIC_PLAN_LABELS.premium,
};

function normalizePlan(plan: UserPlan | undefined): PlanType {
  const normalized = typeof plan === 'string' ? plan.toLowerCase() : 'free';
  switch (normalized) {
    case 'basic':
    case 'plus':
    case 'premium':
      return normalized;
    default:
      return 'free';
  }
}

export function UniversalHeader({
  isDark,
  setIsDark,
  onLogin,
  onRegistration,
  onOpenProfileSettings,
  onNavigateToStatistics,
  onNavigateToPricing,
  onOpenMobileChats,
  className = '',
  showMarketingNavigation = false,
}: UniversalHeaderProps) {
  const { user } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();
  const planType = normalizePlan(user?.plan);
  const [isMobileMarketingMenuOpen, setIsMobileMarketingMenuOpen] = useState(false);
  const [topupOpen, setTopupOpen] = useState(false);
  const userState: UserState = user
    ? planType === 'free'
      ? 'registered_free'
      : 'paid_plan'
    : 'not_registered';

  const handleMarketingNavigate = (sectionId: string) => {
    setIsMobileMarketingMenuOpen(false);

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    try {
      sessionStorage.setItem('landing-scroll-target', sectionId);
    } catch {}

    window.location.href = `/?section=${sectionId}`;
  };

  const renderLeftSide = () => (
    <div className="flex min-w-0 items-center gap-2 md:gap-3">
      {onOpenMobileChats && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onOpenMobileChats}
          aria-label="Открыть список чатов"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}
      <a
        href="http://aiavitologpro.ru/"
        className="flex min-w-0 items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <img
          src="/cases/favicon/logo-header.png"
          alt="AI Авитолог PRO"
          className="object-contain shrink-0 block"
          style={{
            width: '48px',
            height: '48px',
            maxWidth: '48px',
            maxHeight: '48px',
            minWidth: '48px',
            minHeight: '48px',
          }}
        />
        <span className="min-w-0 flex items-center gap-1.5 font-semibold text-foreground">
          <span className="truncate max-w-[110px] md:max-w-none">AI Авитолог</span>
          <span
            className="text-[11px] font-bold text-white px-2 py-1 rounded-md leading-none tracking-wider"
            style={{ backgroundColor: '#6F42C1' }}
          >
            PRO
          </span>
        </span>
      </a>
      {userState === 'paid_plan' && planType !== 'free' && (
        <Badge className={`hidden md:inline-flex gap-1 px-2 py-1 ${planColors[planType]}`}>
          <Crown className="w-3 h-3" />
          {planNames[planType]}
        </Badge>
      )}
    </div>
  );

  const renderDesktopCenter = () => {
    if (showMarketingNavigation) {
      return (
        <nav className="flex items-center justify-center gap-6 min-w-0">
          {marketingNavItems.map((item) => (
            <button
              key={item.sectionId}
              type="button"
              onClick={() => handleMarketingNavigate(item.sectionId)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
          <a
            href="https://t.me/traffic_agency_formula"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            title="Канал в Telegram — реальные кейсы и разборы"
          >
            <Send className="w-3.5 h-3.5" />
            Канал
          </a>
        </nav>
      );
    }

    if (userState === 'registered_free' && !showMarketingNavigation) {
      return (
        <WalletBalance size="sm" onTopup={() => setTopupOpen(true)} />
      );
    }
    return null;
  };

  const renderMobileMarketingToggle = () => {
    if (!showMarketingNavigation) {
      return null;
    }

    return (
      <div className="md:hidden absolute left-[60%] top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMarketingMenuOpen((prev) => !prev)}
          className="gap-2 px-3"
          aria-expanded={isMobileMarketingMenuOpen}
          aria-label="Открыть меню"
        >
          {isMobileMarketingMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>
    );
  };

  const renderThemeToggle = () => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsDark(!isDark)}
      className="w-10 h-10 p-0"
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );

  const renderRightSide = () => {
    if (userState === 'not_registered') {
      return (
        <>
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogin}
                className="gap-2"
              >
                <User className="w-4 h-4" />
                Войти
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegistration}
                className="gap-2"
              >
                <User className="w-4 h-4" />
                Регистрация
              </Button>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogin ?? onRegistration}
              aria-label="Войти"
              className="w-10 h-10 p-0"
            >
              <User className="w-4 h-4" />
            </Button>
          </div>
        </>
      );
    }

    return (
      <div className="flex items-center gap-2">

        <DropdownMenu>
          <DropdownMenuTrigger className="w-10 h-10 p-0 rounded-full hover:bg-accent hover:bg-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand to-accent flex items-center justify-center relative">
              <User className="w-4 h-4 text-primary-foreground" />
              {userState === 'paid_plan' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-brand to-accent rounded-full flex items-center justify-center">
                  <Crown className="w-2 h-2 text-primary-foreground" />
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-card border-border shadow-card rounded-xl"
          >
            {userState === 'paid_plan' && planType !== 'free' && (
              <div className="px-3 py-2 border-b border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`gap-1 px-2 py-1 text-xs ${planColors[planType]}`}>
                    <Crown className="w-3 h-3" />
                    {planNames[planType]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {planNames[planType]} активирован
                </p>
              </div>
            )}

            <DropdownMenuItem
              className="gap-2 cursor-pointer hover:bg-accent/10 rounded-lg"
              onClick={onOpenProfileSettings}
            >
              <Settings className="w-4 h-4" />
              Настройки профиля
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer hover:bg-accent/10 rounded-lg"
              onClick={onNavigateToStatistics}
            >
              <BarChart3 className="w-4 h-4" />
              Статистика
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              className="gap-2 cursor-pointer hover:bg-accent/10 rounded-lg text-destructive focus:text-destructive"
              onClick={logout}
              disabled={logoutLoading}
            >
              <LogOut className="w-4 h-4" />
              {logoutLoading ? 'Выходим...' : 'Выход из аккаунта'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  const renderMobileCenterButton = () => {
    if (userState === 'not_registered') {
      return (
        <div className="md:hidden w-full px-5 py-3 border-b border-border bg-card/50 backdrop-blur-[10px]">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onLogin}
              variant="outline"
              size="sm"
              className="w-full gap-2 border-accent/30 text-accent hover:bg-accent/10"
            >
              <User className="w-4 h-4" />
              Войти
            </Button>

            <Button
              onClick={onRegistration}
              size="sm"
              className="w-full gap-2 bg-gradient-to-r from-brand to-accent text-primary-foreground hover:opacity-90"
            >
              <User className="w-4 h-4" />
              Регистрация
            </Button>
          </div>
        </div>
      );
    }

    if (userState === 'registered_free') {
      return (
        <div className="md:hidden w-full px-5 py-3 border-b border-border bg-card/50 backdrop-blur-[10px] flex justify-center">
          <WalletBalance size="sm" onTopup={() => setTopupOpen(true)} />
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <header className={`sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-[10px] h-16 ${className}`}>
        <div className="container relative max-w-[1280px] mx-auto px-3 md:px-5 h-full flex min-w-0 items-center justify-between gap-2 md:gap-4">
          {renderLeftSide()}

          <div className="hidden md:block">
            {renderDesktopCenter()}
          </div>

          {renderMobileMarketingToggle()}

          {renderRightSide()}
        </div>
      </header>

      {showMarketingNavigation && isMobileMarketingMenuOpen && (
        <div className="md:hidden w-full border-b border-border bg-card/95 backdrop-blur-[10px]">
          <div className="container max-w-[1280px] mx-auto px-5 py-4">
            <nav className="flex flex-col gap-1">
              {marketingNavItems.map((item) => (
                <button
                  key={item.sectionId}
                  type="button"
                  onClick={() => handleMarketingNavigate(item.sectionId)}
                  className="rounded-lg px-3 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
                >
                  {item.label}
                </button>
              ))}
              <a
                href="https://t.me/traffic_agency_formula"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-3 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground inline-flex items-center gap-2"
                onClick={() => setIsMobileMarketingMenuOpen(false)}
              >
                <Send className="w-4 h-4" />
                Канал в Telegram
              </a>
            </nav>
          </div>
        </div>
      )}

      {renderMobileCenterButton()}

      <TopupModal open={topupOpen} onClose={() => setTopupOpen(false)} />
    </>
  );
}
