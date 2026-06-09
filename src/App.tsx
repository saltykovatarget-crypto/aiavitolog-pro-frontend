import React from 'react';
import { useAuth } from './lib/auth';
import { handleRestrictedNavigation } from './lib/navigation';
import { Toaster } from './components/ui/sonner';
import { chatRouteForPlan, statsRouteForPlan } from './lib/planRoute';
import { ChatMemoryProvider } from './lib/chatMemory';
import { CookiesConsentBanner } from './components/CookiesConsentBanner';
import { BuildMarker } from './components/BuildMarker';
import { DemoBadge } from './components/DemoBadge';

// Simple components
const LoadingPage = () => (
  <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-4"></div>
      <p className="text-muted-foreground">Загружаем AI Авитолог PRO...</p>
    </div>
  </div>
);

const ErrorPage = ({ onRetry }: { onRetry: () => void }) => (
  <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
    <div className="text-center max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4 text-foreground">Произошла ошибка</h1>
      <p className="text-muted-foreground mb-6">
        Приложение столкнулось с неожиданной ошибкой.
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-brand text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
      >
        Попробовать снова
      </button>
    </div>
  </div>
);

const getInitialPage = () => {
  try {
    const path = window.location.pathname;
    const normPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
    if (path === '/auth/callback') {
      return 'auth/callback';
    }
    if (normPath === '/avito/callback') {
      return 'avito/callback';
    }
    if (path === '/policies/privacy-policy' || path === '/policies/privacy-policy/') {
      return 'policy/privacy-policy';
    }
    if (path === '/cookies' || path === '/cookies/') {
      return 'policy/cookies';
    }
    if (path === '/offer' || path === '/offer/') {
      return 'policy/offer';
    }
    // ✅ Tochka redirects back by "path" (no hash). Support it.
    // Otherwise app falls back to "landing" and never calls /billing/tochka/confirm.
    if (normPath === '/billing/success') {
      return 'billing/success';
    }
    if (normPath === '/billing/fail') {
      return 'billing/fail';
    }
    return window.location.hash.substring(1) || 'landing';
  } catch {
    return 'landing';
  }
};

export default function App() {
  const [currentPage, setCurrentPage] = React.useState<string>(getInitialPage);
  const { loading: authLoading, user, refreshUser } = useAuth();
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [loadedComponents, setLoadedComponents] = React.useState<any>({});

  // Theme state management
  const [isDark, setIsDark] = React.useState(() => {
    try {
      // Check localStorage first, then system preference, default to dark
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return true; // Default to dark theme
    } catch {
      return true; // Default to dark theme
    }
  });

  // Apply theme changes
  React.useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Theme error:', error);
    }
  }, [isDark]);

  // Handle navigation
  const navigate = React.useCallback((page: string) => {
    try {
      if (handleRestrictedNavigation(page)) {
        setCurrentPage('chat');
        return;
      }

      setCurrentPage(page);

      if (page === 'avito/callback') {
        window.history.pushState({}, '', '/avito/callback');
        return;
      }

      if (page === 'auth/callback') {
        return;
      }

      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
      }

      if (page !== 'landing') {
        window.location.hash = page;
      } else {
        window.location.hash = '';
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, []);

  const goToPlanChat = React.useCallback(() => {
    navigate(chatRouteForPlan(user?.plan || 'free'));
  }, [navigate, user?.plan]);

  const goToPlanStats = React.useCallback(() => {
    navigate(statsRouteForPlan(user?.plan || 'free'));
  }, [navigate, user?.plan]);

  // Load components dynamically
  const loadComponent = React.useCallback(async (componentName: string) => {
    if (loadedComponents[componentName]) {
      return loadedComponents[componentName];
    }

    try {
      let component;
      switch (componentName) {
        case 'Landing':
          const { Landing } = await import('./components/Landing');
          component = Landing;
          break;
        case 'ChatPage':
          const { ChatPage } = await import('./components/ChatPage');
          component = ChatPage;
          break;
        case 'ChatBasicPage':
          const { ChatBasicPage } = await import('./components/ChatBasicPage');
          component = ChatBasicPage;
          break;
        case 'ChatPremiumPage':
          const { ChatPremiumPage } = await import('./components/ChatPremiumPage');
          component = ChatPremiumPage;
          break;
        case 'ChatProPage':
          const { ChatProPage } = await import('./components/ChatProPage');
          component = ChatProPage;
          break;
        case 'PricingPage':
          const { PricingPage } = await import('./components/PricingPage');
          component = PricingPage;
          break;
        case 'StatisticsPage':
          const { StatisticsPage } = await import('./components/StatisticsPage');
          component = StatisticsPage;
          break;
        case 'StatisticsBasicPage':
          const { StatisticsBasicPage } = await import('./components/StatisticsBasicPage');
          component = StatisticsBasicPage;
          break;
        case 'StatisticsPremiumPage':
          const { StatisticsPremiumPage } = await import('./components/StatisticsPremiumPage');
          component = StatisticsPremiumPage;
          break;
        case 'StatisticsDemo':
          const { StatisticsDemo } = await import('./components/StatisticsDemo');
          component = StatisticsDemo;
          break;
        case 'DevNavigation':
          const { DevNavigation } = await import('./components/DevNavigation');
          component = DevNavigation;
          break;
        case 'BillingSuccessPage':
          const { BillingSuccessPage } = await import('./components/BillingSuccessPage');
          component = BillingSuccessPage;
          break;
        case 'BillingFailPage':
          const { BillingFailPage } = await import('./components/BillingFailPage');
          component = BillingFailPage;
          break;
        case 'AuthCallbackPage':
          const { AuthCallbackPage } = await import('./components/AuthCallbackPage');
          component = AuthCallbackPage;
          break;
        case 'AvitoTokenPage':
          const { AvitoTokenPage } = await import('./components/AvitoTokenPage');
          component = AvitoTokenPage;
          break;
        case 'PolicyPage':
          const { PolicyPage } = await import('./components/PolicyPage');
          component = PolicyPage;
          break;
        case 'ToolsPage':
          const { ToolsPage } = await import('./components/tools');
          component = ToolsPage;
          break;
        case 'WalletPage':
          const { WalletPage } = await import('./components/WalletPage');
          component = WalletPage;
          break;
        case 'ToolParserPage':
          const { ToolParserPage } = await import('./components/tools');
          component = ToolParserPage;
          break;
        case 'ToolXlsPage':
          const { ToolXlsPage } = await import('./components/tools');
          component = ToolXlsPage;
          break;
        case 'ToolPositionPage':
          const { ToolPositionPage } = await import('./components/tools');
          component = ToolPositionPage;
          break;
        case 'ParserReportPage':
          const { ParserReportPage } = await import('./components/ParserReportPage');
          component = ParserReportPage;
          break;
        default:
          throw new Error(`Unknown component: ${componentName}`);
      }

      setLoadedComponents(prev => ({
        ...prev,
        [componentName]: component
      }));

      return component;
    } catch (error) {
      console.error(`Error loading component ${componentName}:`, error);
      throw error;
    }
  }, [loadedComponents]);

  // Load initial component
  React.useEffect(() => {
    const loadInitialComponent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const componentName = getComponentName(currentPage);
        await loadComponent(componentName);

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load component:', error);
        setError('Не удалось загрузить компонент');
        setIsLoading(false);
      }
    };

    loadInitialComponent();
  }, [currentPage, loadComponent]);

  React.useEffect(() => {
    const handleLocationChange = () => {
      const nextPage = getInitialPage();
      if (handleRestrictedNavigation(nextPage)) {
        setCurrentPage('chat');
        return;
      }
      setCurrentPage(nextPage);
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  React.useEffect(() => {
    if (handleRestrictedNavigation(currentPage)) {
      setCurrentPage('chat');
    }
    // Effect intentionally runs once on mount to normalise the initial navigation state.
  }, []);

  // Жёсткая нормализация: на любой из страниц чатов/статистики сверяем с планом.
  React.useEffect(() => {
    if (!user?.plan) return;
    const chatPages = new Set(['chat', 'chat-basic', 'chat-premium', 'chat-pro']);
    const statsPages = new Set(['statistics', 'statistics-basic', 'statistics-premium', 'statistics-demo']);

    if (chatPages.has(currentPage)) {
      const target = chatRouteForPlan(user.plan || 'free');
      if (currentPage !== target) {
        navigate(target);
      }
    } else if (statsPages.has(currentPage)) {
      const target = statsRouteForPlan(user.plan || 'free');
      if (currentPage !== target) {
        navigate(target);
      }
    }
  }, [user?.plan, currentPage, navigate]);

  // Подтягиваем актуального пользователя при возврате на вкладку (если тариф сменили «снаружи» — парсингом)
  React.useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshUser().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [refreshUser]);

  const getComponentName = (page: string): string => {
    switch (page) {
      case 'chat': return 'ChatPage';
      case 'chat-basic': return 'ChatBasicPage';
      case 'chat-premium': return 'ChatPremiumPage';
      case 'chat-pro': return 'ChatProPage';
      case 'statistics': return 'StatisticsPage';
      case 'statistics-basic': return 'StatisticsBasicPage';
      case 'statistics-premium': return 'StatisticsPremiumPage';
      case 'statistics-demo': return 'StatisticsDemo';
      case 'dev': return 'DevNavigation';
      case 'pricing': return 'PricingPage';
      case 'billing/success': return 'BillingSuccessPage';
      case 'billing/fail': return 'BillingFailPage';
      case 'auth/callback': return 'AuthCallbackPage';
      case 'avito/callback': return 'AvitoTokenPage';
      case 'policy/privacy-policy':
      case 'policy/cookies':
      case 'policy/offer':
        return 'PolicyPage';
      case 'wallet': return 'WalletPage';
      case 'tool/parser': return 'ToolParserPage';
      case 'tool/xls': return 'ToolXlsPage';
      case 'tool/position': return 'ToolPositionPage';
      case 'parser-report': return 'ParserReportPage';
      case 'tools': return 'ToolsPage';
      default: return 'Landing';
    }
  };

  const commonProps = React.useMemo(() => ({
    onNavigateToChat: goToPlanChat,
    onNavigateToPricing: () => navigate('pricing'),
    onNavigateToChatBasic: () => navigate('chat-basic'),
    onNavigateToChatPremium: () => navigate('chat-premium'),
    onNavigateToChatPro: () => navigate('chat-pro'),
    onNavigateToStatistics: goToPlanStats,
    onNavigateToStatisticsBasic: () => navigate('statistics-basic'),
    onNavigateToStatisticsPremium: () => navigate('statistics-premium'),
    onNavigateToTools: () => navigate('tools'),
    onNavigateToWallet: () => navigate('wallet'),
  }), [goToPlanChat, goToPlanStats, navigate]);

  const renderCurrentPage = () => {
    const componentName = getComponentName(currentPage);
    const Component = loadedComponents[componentName];

    if (!Component) {
      return <LoadingPage />;
    }

    switch (currentPage) {
      case 'chat':
        return (
          <Component
            isDark={isDark}
            setIsDark={setIsDark}
            onNavigateToPricing={commonProps.onNavigateToPricing}
            onNavigateToStatistics={commonProps.onNavigateToStatistics}
            onNavigateToTools={commonProps.onNavigateToTools}
            onNavigateToWallet={commonProps.onNavigateToWallet}
          />
        );
      
      case 'chat-basic':
        return (
          <Component 
            isDark={isDark}
            setIsDark={setIsDark}
            onNavigateToStatistics={commonProps.onNavigateToStatisticsBasic}
          />
        );
      
      case 'chat-premium':
        return (
          <Component 
            isDark={isDark}
            setIsDark={setIsDark}
            onNavigateToStatistics={commonProps.onNavigateToStatisticsPremium}
          />
        );
      
      case 'chat-pro':
        return (
          <Component 
            isDark={isDark}
            setIsDark={setIsDark}
            onNavigateToStatistics={commonProps.onNavigateToStatistics}
          />
        );
      
      case 'statistics':
      case 'statistics-basic':
      case 'statistics-premium':
        return (
          <Component 
            isDark={isDark}
            setIsDark={setIsDark}
            onNavigateToChat={commonProps.onNavigateToChat}
          />
        );
      
      case 'pricing':
        return (
          <Component
            onNavigateToChat={commonProps.onNavigateToChat}
          />
        );
      
      case 'billing/success':
        return (
          <Component 
            onNavigateToChat={commonProps.onNavigateToChat}
            onNavigateToChatBasic={commonProps.onNavigateToChatBasic}
            onNavigateToChatPremium={commonProps.onNavigateToChatPremium}
            onNavigateToChatPro={commonProps.onNavigateToChatPro}
            onNavigateToStatistics={commonProps.onNavigateToStatistics}
          />
        );
      
      case 'billing/fail':
        return (
          <Component 
            onNavigateToChat={commonProps.onNavigateToChat}
            onNavigateToPricing={commonProps.onNavigateToPricing}
          />
        );
      
      case 'statistics-demo':
        return (
          <Component 
            isDark={isDark}
            setIsDark={setIsDark}
            onNavigateToStatistics={commonProps.onNavigateToStatistics}
            onNavigateToStatisticsBasic={commonProps.onNavigateToStatisticsBasic}
            onNavigateToStatisticsPremium={commonProps.onNavigateToStatisticsPremium}
          />
        );
        
      case 'dev':
        return (
          <Component 
            isDark={isDark}
            setIsDark={setIsDark}
          />
        );

      case 'policy/privacy-policy':
        return <Component type="privacy-policy" />;

      case 'policy/cookies':
        return <Component type="cookies" />;

      case 'policy/offer':
        return <Component type="offer" />;
      case 'avito/callback':
        return <Component />;

      case 'tools':
        return (
          <Component
            onBack={commonProps.onNavigateToChat}
            onLaunchTool={(toolId: string) => {
              const routeMap: Record<string, string> = {
                parser_niche: 'tool/parser',
                xls_analysis: 'tool/xls',
                position_check: 'tool/position',
                audit: 'tool/parser',
                just_ask: 'chat',
              };
              navigate(routeMap[toolId] || 'chat');
            }}
          />
        );

      case 'wallet':
        return <Component />;

      case 'tool/parser':
      case 'tool/xls':
      case 'tool/position':
        return <Component onBack={() => navigate('tools')} />;

      case 'parser-report':
        return <Component onBack={() => navigate('tools')} />;

      default:
        return (
          <Component
            onNavigateToChat={commonProps.onNavigateToChat}
            onNavigateToPricing={commonProps.onNavigateToPricing}
          />
        );
    }
  };

  if (error) {
    return (
      <>
        <ErrorPage
          onRetry={() => {
            setError(null);
            setIsLoading(true);
            window.location.reload();
          }}
        />
        <DemoBadge />
        <BuildMarker />
        <CookiesConsentBanner />
        <Toaster richColors position="top-center" />
      </>
    );
  }

  if (authLoading || isLoading) {
    return (
      <>
        <LoadingPage />
        <DemoBadge />
        <BuildMarker />
        <CookiesConsentBanner />
        <Toaster richColors position="top-center" />
      </>
    );
  }

  return (
    <ChatMemoryProvider userId={user?.id} key={user?.id || 'anon'}>
      {renderCurrentPage()}
      <DemoBadge />
      <BuildMarker />
      <CookiesConsentBanner />
      <Toaster richColors position="top-center" />
    </ChatMemoryProvider>
  );
}
