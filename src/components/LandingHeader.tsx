import React from 'react';
import { Button } from './ui/button';

interface LandingHeaderProps {
  onNavigateToChat?: () => void;
  onNavigateToPricing?: () => void;
}

export function LandingHeader({ onNavigateToChat, onNavigateToPricing }: LandingHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-[10px] border-b border-border">
      <div className="container max-w-[1100px] mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="http://aiavitologpro.ru/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <img
            src="/cases/favicon/logo-header.png"
            alt="AI Авитолог PRO"
            className="w-14 h-14 object-contain shrink-0"
          />
          <span className="font-semibold text-foreground">AI Авитолог PRO</span>
        </a>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onNavigateToChat}
            className="text-muted-foreground hover:text-foreground"
          >
            Чат
          </Button>
          <Button 
            size="sm"
            className="rounded-full bg-gradient-to-r from-brand to-blue-400 text-primary-foreground hover:opacity-90"
            onClick={onNavigateToPricing}
          >
            Переключить на Plus
          </Button>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            size="sm"
            className="rounded-full bg-gradient-to-r from-brand to-blue-400 text-primary-foreground hover:opacity-90"
            onClick={onNavigateToPricing}
          >
            Plus
          </Button>
        </div>
      </div>
    </header>
  );
}
