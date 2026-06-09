import React, { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Switch } from './ui/switch';
import { ChevronDown, Zap } from 'lucide-react';
import { useLogout } from '@/lib/logout';

interface HeaderProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  plan?: 'basic' | 'pro';
}

export function Header({ isDark, setIsDark, plan = 'basic' }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { logout, loading: logoutLoading } = useLogout();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-[10px] h-16">
      <div className="container max-w-[1280px] mx-auto px-5 h-full flex items-center justify-between">
        {/* Logo */}
        <a
          href="http://aiavitologpro.ru/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <span className="font-semibold text-foreground">AI Авитолог PRO</span>
        </a>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Файлы
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Поддержка
          </Button>
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Model chip */}
          <Badge variant="secondary" className="gap-2">
            Модель: GPT-4 mini
          </Badge>

          {/* Upgrade button - only show for basic plan */}
          {plan === 'basic' && (
            <Button size="sm" className="gap-2">
              <Zap className="w-4 h-4" />
              Переключить на Plus
            </Button>
          )}

          {/* Profile dropdown */}
          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 p-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>АВ</AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-3 border-b">
                <div className="font-medium">Анна Владимирова</div>
                <div className="text-sm text-muted-foreground">@anna_vladimorova</div>
                <div className="text-xs text-muted-foreground mt-1">
                  План: {plan === 'basic' ? 'Базовый (GPT-4 mini)' : 'Plus (GPT-4)'}
                </div>
              </div>
              
              <DropdownMenuItem>Изменить план</DropdownMenuItem>
              <DropdownMenuItem>Статистика</DropdownMenuItem>
              <DropdownMenuItem>Файлы</DropdownMenuItem>
              <DropdownMenuItem>Настройки</DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Тема: {isDark ? 'Тёмная' : 'Светлая'}</span>
                  <Switch 
                    checked={isDark} 
                    onCheckedChange={setIsDark}
                  />
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="text-destructive" onClick={logout} disabled={logoutLoading}>
                {logoutLoading ? 'Выходим...' : 'Выйти'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
