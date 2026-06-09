import React, { useState } from 'react';
import { ChatPage } from './ChatPage';
import { ChatProPage } from './ChatProPage';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Sun, Moon } from 'lucide-react';

type DemoMode = 'free-unregistered' | 'free-registered' | 'plus';

export function RegistrationDemo() {
  const [isDark, setIsDark] = useState(true);
  const [demoMode, setDemoMode] = useState<DemoMode>('free-unregistered');

  // Set theme
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const renderCurrentMode = () => {
    switch (demoMode) {
      case 'free-unregistered':
        return (
          <ChatPage 
            isDark={isDark} 
            setIsDark={setIsDark}
            onNavigateToPricing={() => {}} 
          />
        );
      
      case 'free-registered':
        return (
          <ChatPage 
            isDark={isDark} 
            setIsDark={setIsDark}
            onNavigateToPricing={() => {}} 
            initialRegistrationState={true}
          />
        );
      
      case 'plus':
        return (
          <ChatProPage 
            isDark={isDark} 
            setIsDark={setIsDark}
            onNavigateToStatistics={() => {}}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Controls */}
      <div className="sticky top-0 z-50 bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Регистрация - Demo режим</h1>
            
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDark(!isDark)}
              className="w-10 h-10 p-0"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <Card className="p-4">
            <h3 className="font-medium mb-3">Режимы демонстрации</h3>
            <div className="flex gap-3 flex-wrap">
              <Button
                variant={demoMode === 'free-unregistered' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDemoMode('free-unregistered')}
                className="gap-2"
              >
                <Badge variant="secondary" className="bg-muted/50 px-1 py-0">
                  FREE
                </Badge>
                Незарегистрированный
              </Button>
              
              <Button
                variant={demoMode === 'free-registered' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDemoMode('free-registered')}
                className="gap-2"
              >
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 px-1 py-0">
                  FREE
                </Badge>
                Зарегистрированный
              </Button>
              
              <Button
                variant={demoMode === 'plus' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDemoMode('plus')}
                className="gap-2"
              >
                <Badge variant="default" className="bg-gradient-to-r from-brand to-accent text-white border-0 px-1 py-0">
                  Plus
                </Badge>
                Plus подписка
              </Button>
            </div>
            
            <div className="mt-3 text-sm text-muted-foreground">
              <p><strong>Незарегистрированный FREE:</strong> Показывает кнопку "Регистрация" вместо профиля</p>
              <p><strong>Зарегистрированный FREE:</strong> Показывает полное меню профиля</p>
              <p><strong>Plus:</strong> Всегда показывает профиль с полным функционалом</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Current Mode */}
      <div className="relative">
        {renderCurrentMode()}
      </div>
    </div>
  );
}