import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Home, 
  MessageSquare, 
  BarChart3, 
  CreditCard, 
  Sun, 
  Moon,
  Settings,
  Crown,
  Zap,
  Star
} from 'lucide-react';

interface DevNavigationProps {
  isDark?: boolean;
  setIsDark?: (isDark: boolean) => void;
}

export function DevNavigation({ 
  isDark = true, 
  setIsDark = () => {} 
}: DevNavigationProps) {
  const navigate = (page: string) => {
    window.location.hash = page;
    window.location.reload();
  };

  const pages = [
    {
      category: 'Основные',
      items: [
        { name: 'Лендинг', path: 'landing', icon: Home, description: 'Главная страница' },
        { name: 'Тарифы', path: 'pricing', icon: CreditCard, description: 'Страница тарифов' },
      ]
    },
    {
      category: 'Чаты',
      items: [
        { name: 'Free Chat', path: 'chat', icon: MessageSquare, description: 'Бесплатный чат', badge: 'FREE' },
        { name: 'Basic Chat', path: 'chat-basic', icon: Zap, description: 'Basic чат', badge: 'Basic', color: 'bg-blue-500/10 text-blue-600' },
        { name: 'Plus Chat', path: 'chat-pro', icon: Star, description: 'Plus чат', badge: 'Plus', color: 'bg-green-500/10 text-green-600' },
        { name: 'Premium Chat', path: 'chat-premium', icon: Crown, description: 'Premium чат', badge: 'Premium', color: 'bg-amber-500/10 text-amber-600' },
      ]
    },
    {
      category: 'Статистика',
      items: [
        { name: 'Free Статистика', path: 'statistics', icon: BarChart3, description: 'Доступно 3 вопроса в день', badge: 'FREE' },
        { name: 'Basic Статистика', path: 'statistics-basic', icon: BarChart3, description: 'Лимит 20 вопросов в день', badge: 'Basic', color: 'bg-blue-500/10 text-blue-600' },
        { name: 'Premium Статистика', path: 'statistics-premium', icon: BarChart3, description: 'Лимит 100 вопросов в день', badge: 'Premium', color: 'bg-amber-500/10 text-amber-600' },
        { name: 'Демо Статистики', path: 'statistics-demo', icon: Settings, description: 'Все варианты' },
      ]
    },
    {
      category: 'Платежи',
      items: [
        { name: 'Успешная оплата', path: 'billing/success', icon: BarChart3, description: 'Success page' },
        { name: 'Ошибка оплаты', path: 'billing/fail', icon: BarChart3, description: 'Fail page' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2">AI Авитолог PRO - Dev Navigation</h1>
            <p className="text-muted-foreground">Навигация по всем страницам приложения</p>
          </div>
          
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDark(!isDark)}
            className="flex items-center gap-2"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDark ? 'Светлая' : 'Тёмная'} тема
          </Button>
        </div>

        {/* Pages Grid */}
        <div className="space-y-8">
          {pages.map((category) => (
            <div key={category.category}>
              <h2 className="text-xl font-semibold mb-4">{category.category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.items.map((page) => {
                  const IconComponent = page.icon;
                  return (
                    <Card key={page.path} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(page.path)}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-5 h-5 text-primary" />
                            <CardTitle className="text-base">{page.name}</CardTitle>
                          </div>
                          {page.badge && (
                            <Badge 
                              variant="secondary" 
                              className={page.color || 'bg-gray-500/10 text-gray-600'}
                            >
                              {page.badge}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{page.description}</p>
                        <Button size="sm" className="w-full">
                          Открыть
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Информация</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Тёмная тема установлена по умолчанию</li>
            <li>• Лендинг и Прайсинг всегда в тёмной теме</li>
            <li>• Чаты и Статистика поддерживают переключение тем</li>
            <li>• Каждый тариф имеет свои уникальные лимиты вопросов в день и цвета</li>
            <li>• Настройки темы сохраняются в localStorage</li>
          </ul>
        </div>
      </div>
    </div>
  );
}