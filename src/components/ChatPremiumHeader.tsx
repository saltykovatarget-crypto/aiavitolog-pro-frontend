import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sun, Moon, MessageSquare, Menu, User, Settings, BarChart3, LogOut, Crown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useLogout } from '@/lib/logout';

interface ChatPremiumHeaderProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  onNavigateToChat?: () => void;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
  onNavigateToStatistics?: () => void;
  onOpenProfileSettings?: () => void;
}

export function ChatPremiumHeader({
  isDark,
  setIsDark,
  onNavigateToChat,
  onToggleSidebar,
  showSidebarToggle = false,
  onNavigateToStatistics,
  onOpenProfileSettings
}: ChatPremiumHeaderProps) {
  const { logout, loading: logoutLoading } = useLogout();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-[10px] h-16">
      <div className="container max-w-[1280px] mx-auto px-5 h-full flex items-center justify-between">
        {/* Left side - Profile dropdown */}
        <div className="flex items-center gap-3">
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="md:hidden w-10 h-10 p-0"
            >
              <Menu className="w-4 h-4" />
            </Button>
          )}
          
          {/* Profile dropdown - moved to left */}
          <DropdownMenu>
            <DropdownMenuTrigger className="w-12 h-12 p-0 rounded-full hover:bg-accent hover:bg-accent/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand to-accent flex items-center justify-center relative">
                <User className="w-5 h-5 text-primary-foreground" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-accent to-yellow-500 rounded-full flex items-center justify-center">
                  <Crown className="w-2.5 h-2.5 text-background" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-56 bg-card border-border shadow-card rounded-xl"
            >
              <div className="px-3 py-2 border-b border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Badge 
                    variant="default" 
                    className="bg-gradient-to-r from-accent to-yellow-500 text-background border-0 gap-1 px-2 py-1 text-xs"
                  >
                    <Crown className="w-3 h-3" />
                    Premium
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Premium активирован до 18.09.2026
                </p>
              </div>
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

        {/* Center - Logo and brand name */}
        <div className="flex items-center gap-3 absolute left-1/2 transform -translate-x-1/2">
          <a
            href="http://aiavitologpro.ru/"
            className="hover:opacity-90 transition-opacity"
          >
            <span className="font-semibold text-foreground">AI Авитолог PRO</span>
          </a>
          <Badge 
            variant="default" 
            className="bg-gradient-to-r from-accent to-yellow-500 text-background border-0 gap-1 px-2 py-1"
          >
            <Crown className="w-3 h-3" />
            Premium
          </Badge>
        </div>

        {/* Right side - Theme toggle */}
        <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
}
