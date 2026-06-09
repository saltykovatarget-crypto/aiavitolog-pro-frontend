import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft, HelpCircle } from 'lucide-react';

interface PricingHeaderProps {
  onNavigateToChat?: () => void;
}

export function PricingHeader({ onNavigateToChat }: PricingHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-[10px] border-b border-border">
      <div className="container max-w-[1100px] mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="http://aiavitologpro.ru/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <span className="font-semibold text-foreground">AI Авитолог PRO</span>
        </a>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground gap-2"
            onClick={onNavigateToChat}
          >
            <ArrowLeft className="w-4 h-4" />
            Назад в чат
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Поддержка
          </Button>
        </nav>
      </div>
    </header>
  );
}
