import React from 'react';
import { Button } from './ui/button';
import { Sun, Moon, MessageSquare, Zap, Menu, User, Settings, BarChart3, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useLogout } from '@/lib/logout';

interface ChatHeaderProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  onNavigateToChat?: () => void;
  onNavigateToPricing?: () => void;
  onNavigateToStatistics?: () => void;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
  isRegistered?: boolean;
  onOpenRegistration?: () => void;
  onOpenLogin?: () => void;
  onOpenProfileSettings?: () => void;
}

export function ChatHeader({ 
  isDark, 
  setIsDark, 
  onNavigateToChat, 
  onNavigateToPricing,
  onNavigateToStatistics,
  onToggleSidebar,
  showSidebarToggle = false,
  isRegistered = false,
  onOpenRegistration,
  onOpenLogin,
  onOpenProfileSettings
}: ChatHeaderProps) {
  const { logout, loading: logoutLoading } = useLogout();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-[10px] h-16">
      <div className="container max-w-[1280px] mx-auto px-5 h-full flex items-center justify-between">
        {/* Left side - Profile/Auth */}
        <div className="flex items-center gap-3">
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                try {
                  onToggleSidebar?.();
                } catch (error) {
                  console.error('Toggle sidebar error:', error);
                }
              }}
              className="md:hidden w-10 h-10 p-0"
            >
              <Menu className="w-4 h-4" />
            </Button>
          )}
          
          {/* Profile dropdown or Registration button */}
          {isRegistered ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-12 h-12 p-0 rounded-full hover:bg-accent hover:bg-accent/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-48 bg-card border-border shadow-card rounded-xl"
              >
                <DropdownMenuItem 
                  className="gap-2 cursor-pointer hover:bg-accent/10 rounded-lg"
                  onClick={() => {
                    try {
                      onOpenProfileSettings?.();
                    } catch (error) {
                      console.error('Profile settings error:', error);
                    }
                  }}
                >
                  <Settings className="w-4 h-4" />
                  Настройки профиля
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="gap-2 cursor-pointer hover:bg-accent/10 rounded-lg"
                  onClick={() => {
                    try {
                      onNavigateToStatistics?.();
                    } catch (error) {
                      console.error('Statistics navigation error:', error);
                    }
                  }}
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
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  try {
                    onOpenLogin?.();
                  } catch (error) {
                    console.error('Login error:', error);
                  }
                }}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <User className="w-4 h-4" />
                Войти
              </Button>
            </div>
          )}
        </div>

        {/* Center - Logo and brand name */}
        <div className="flex items-center gap-3 absolute left-1/2 transform -translate-x-1/2">
          <a
            href="http://aiavitologpro.ru/"
            className="hover:opacity-90 transition-opacity"
          >
            <span className="font-semibold text-foreground">AI Авитолог PRO</span>
          </a>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1 mr-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground gap-2"
              onClick={() => {
                try {
                  onNavigateToChat?.();
                } catch (error) {
                  console.error('Navigation error:', error);
                }
              }}
            >
              <MessageSquare className="w-4 h-4" />
              Чат
            </Button>
            <span className="text-muted-foreground text-sm">•</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground gap-2"
              onClick={() => {
                try {
                  onNavigateToPricing?.();
                } catch (error) {
                  console.error('Navigation error:', error);
                }
              }}
            >
              <Zap className="w-4 h-4" />
              Переключить на Plus
            </Button>
          </nav>
          
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              try {
                setIsDark?.(!isDark);
              } catch (error) {
                console.error('Theme toggle error:', error);
              }
            }}
            className="w-10 h-10 p-0"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          
          {/* Registration button for non-registered users */}
          {!isRegistered && (
            <Button
              onClick={() => {
                try {
                  onOpenRegistration?.();
                } catch (error) {
                  console.error('Registration error:', error);
                }
              }}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <User className="w-4 h-4" />
              Регистрация
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
