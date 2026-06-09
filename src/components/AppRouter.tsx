import React, { useState, useEffect } from 'react';
import { Landing } from './Landing';
import { ChatPage } from './ChatPage';
import { ChatProPage } from './ChatProPage';
import { PricingPage } from './PricingPage';
import { FlowDemo } from './FlowDemo';
import { StatisticsPage } from './StatisticsPage';
import { StatisticsDemo } from './StatisticsDemo';
import { RegistrationDemo } from './RegistrationDemo';
import { DemoIndex } from './DemoIndex';
import { ProfileSettingsDemo } from './ProfileSettingsDemo';

type Page = 'landing' | 'chat' | 'chat-pro' | 'pricing' | 'flow-demo' | 'statistics' | 'statistics-demo' | 'registration-demo' | 'demo' | 'profile-settings-demo';

export function AppRouter() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    try {
      // Check URL hash for initial page
      const hash = window.location.hash.substring(1);
      if (['landing', 'chat', 'chat-pro', 'pricing', 'flow-demo', 'statistics', 'statistics-demo', 'registration-demo', 'demo', 'profile-settings-demo'].includes(hash)) {
        return hash as Page;
      }
      return 'landing';
    } catch (error) {
      console.error('Error initializing router:', error);
      return 'landing';
    }
  });
  const [isDark, setIsDark] = useState(true);

  // Set dark theme by default
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle hash change for browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      try {
        const hash = window.location.hash.substring(1);
        if (['landing', 'chat', 'chat-pro', 'pricing', 'flow-demo', 'statistics', 'statistics-demo', 'registration-demo', 'demo', 'profile-settings-demo'].includes(hash)) {
          setCurrentPage(hash as Page);
        }
      } catch (error) {
        console.error('Error handling hash change:', error);
        setCurrentPage('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToLanding = () => {
    try {
      setCurrentPage('landing');
      window.location.hash = 'landing';
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  const navigateToChat = () => {
    try {
      setCurrentPage('chat');
      window.location.hash = 'chat';
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  const navigateToChatPro = () => {
    try {
      setCurrentPage('chat-pro');
      window.location.hash = 'chat-pro';
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  const navigateToPricing = () => {
    try {
      setCurrentPage('pricing');
      window.location.hash = 'pricing';
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  const navigateToFlowDemo = () => {
    try {
      setCurrentPage('flow-demo');
      window.location.hash = 'flow-demo';
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  const navigateToStatistics = () => {
    try {
      setCurrentPage('statistics');
      window.location.hash = 'statistics';
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  try {
    switch (currentPage) {
      case 'landing':
        return (
          <Landing 
            onNavigateToChat={navigateToChat}
            onNavigateToPricing={navigateToPricing}
            onNavigateToChatPro={navigateToChatPro}
          />
        );
      
      case 'chat':
        return (
          <ChatPage 
            isDark={isDark} 
            setIsDark={setIsDark}
            onNavigateToPricing={navigateToPricing}
          />
        );
      
      case 'chat-pro':
        return (
          <ChatProPage 
            isDark={isDark} 
            setIsDark={setIsDark}
            onNavigateToStatistics={navigateToStatistics}
          />
        );
      
      case 'pricing':
        return (
          <PricingPage 
            onNavigateToChat={navigateToChat}
            onNavigateToChatPro={navigateToChatPro}
          />
        );
      
      case 'flow-demo':
        return <FlowDemo />;
      
      case 'statistics':
        return (
          <StatisticsPage 
            onBack={navigateToChatPro}
          />
        );
      
      case 'statistics-demo':
        return <StatisticsDemo />;
      
      case 'registration-demo':
        return <RegistrationDemo />;
      
      case 'demo':
        return <DemoIndex />;
      
      case 'profile-settings-demo':
        return <ProfileSettingsDemo />;

      default:
        return (
          <Landing 
            onNavigateToChat={navigateToChat}
            onNavigateToPricing={navigateToPricing}
            onNavigateToChatPro={navigateToChatPro}
          />
        );
    }
  } catch (error) {
    console.error('Error rendering page:', error);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground mb-4">
            Произошла ошибка
          </h1>
          <p className="text-muted-foreground mb-6">
            Попробуйте перезагрузить страницу
          </p>
          <button
            onClick={() => {
              window.location.hash = 'landing';
              window.location.reload();
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }
}