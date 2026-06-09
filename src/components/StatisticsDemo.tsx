import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart3, Crown, Zap, Star } from 'lucide-react';

interface StatisticsDemoProps {
  onNavigateToStatistics?: () => void;
  onNavigateToStatisticsBasic?: () => void;
  onNavigateToStatisticsPremium?: () => void;
  isDark?: boolean;
  setIsDark?: (isDark: boolean) => void;
}

export function StatisticsDemo({ 
  onNavigateToStatistics, 
  onNavigateToStatisticsBasic, 
  onNavigateToStatisticsPremium,
  isDark = true,
  setIsDark = () => {}
}: StatisticsDemoProps) {
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>(isDark ? 'dark' : 'light');

  const plans = [
    {
      id: 'free',
      name: 'FREE',
      description: 'Базовые возможности',
      tokens: '3 вопроса в день',
      answers: 'Подходит для редких обращений',
      color: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
      icon: BarChart3,
      onClick: onNavigateToStatistics,
      available: true
    },
    {
      id: 'basic',
      name: 'Basic',
      description: 'Для начинающих',
      tokens: '20 вопросов в день',
      answers: 'Комфортный дневной лимит',
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      icon: Zap,
      onClick: onNavigateToStatisticsBasic,
      available: true
    },
    {
      id: 'plus',
      name: 'Plus',
      description: 'Для активных продавцов',
      tokens: '50 вопросов в день',
      answers: 'Можно вести активные диалоги',
      color: 'bg-green-500/10 text-green-600 border-green-500/20',
      icon: Star,
      onClick: onNavigateToStatistics,
      available: true
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Максимальные возможности',
      tokens: '100 вопросов в день',
      answers: 'Подходит командам и интенсивным сценариям',
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      icon: Crown,
      onClick: onNavigateToStatisticsPremium,
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-4">Демо: Статистика по тарифам</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Выберите тарифный план для просмотра соответствующей страницы статистики
          </p>
        </div>

        {/* Theme Switcher */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-1 bg-card border border-border rounded-lg">
            <Button
              variant={!isDark ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setIsDark(false);
                setSelectedTheme('light');
              }}
            >
              Светлая тема
            </Button>
            <Button
              variant={isDark ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setIsDark(true);
                setSelectedTheme('dark');
              }}
            >
              Тёмная тема
            </Button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card key={plan.id} className="bg-card border-border shadow-card hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 rounded-lg ${plan.color} flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <span>{plan.name}</span>
                    <Badge variant="secondary" className={plan.color}>
                      {plan.name}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="font-medium">{plan.tokens}</div>
                    <div className="text-sm text-muted-foreground">{plan.answers}</div>
                  </div>
                  
                  <Button
                    className="w-full"
                    onClick={plan.onClick}
                    disabled={!plan.available}
                  >
                    Открыть статистику
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Особенности реализации</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h4 className="font-medium mb-2">🎨 Персонализация</h4>
                <p className="text-sm text-muted-foreground">
                  Каждый тариф имеет уникальные цвета, иконки и лимиты вопросов в день
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h4 className="font-medium mb-2">📊 Дневные лимиты вопросов</h4>
                <p className="text-sm text-muted-foreground">
                  Free: 3 • Basic: 20 • Plus: 50 • Premium: 100 вопросов
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h4 className="font-medium mb-2">🏷️ Бейджи профиля</h4>
                <p className="text-sm text-muted-foreground">
                  Правильные цвета бейджей для всех тарифов в профиле
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}