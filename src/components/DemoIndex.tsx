import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, Users, BarChart3, UserCheck, Settings } from 'lucide-react';

export function DemoIndex() {
  const demos = [
    {
      id: 'profile-settings-demo',
      title: 'Настройки профиля',
      description: 'Модальное окно настроек профиля с управлением чатами и аккаунтом',
      icon: Settings,
      features: ['FREE и PLUS тарифы', 'Управление чатами', 'Удаление аккаунта'],
      hash: '#profile-settings-demo'
    },
    {
      id: 'registration-demo',
      title: 'Система регистрации',
      description: 'Демонстрация процесса регистрации для FREE пользователей через Telegram-бота',
      icon: UserCheck,
      features: ['FREE незарегистрированный', 'FREE зарегистрированный', 'Plus подписка'],
      hash: '#registration-demo'
    },
    {
      id: 'statistics-demo',
      title: 'Страница статистики',
      description: 'Просмотр статистики вопросов, подписки и управления файлами',
      icon: BarChart3,
      features: ['Круговая диаграмма вопросов', 'Информация о подписке', 'Управление файлами'],
      hash: '#statistics-demo'
    },
    {
      id: 'chat-pro',
      title: 'PRO Чат',
      description: 'Полнофункциональная версия чата с PRO возможностями',
      icon: Users,
      features: ['Неограниченные диалоги', 'Загрузка файлов', 'Статистика'],
      hash: '#chat-pro'
    }
  ];

  const handleNavigate = (hash: string) => {
    window.location.hash = hash.substring(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand to-accent"></div>
              <span className="font-semibold">AI Авитолог PRO</span>
              <Badge variant="secondary" className="bg-muted/50">
                Demo
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavigate('#landing')}
            >
              На главную
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold mb-4">Demo страницы</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Интерактивные демонстрации ключевых функций AI Авитолог PRO
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demos.map((demo) => {
            const IconComponent = demo.icon;
            return (
              <Card key={demo.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  {/* Icon & Title */}
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{demo.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {demo.description}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Возможности:</h4>
                    <ul className="space-y-1">
                      {demo.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => handleNavigate(demo.hash)}
                    className="w-full gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Открыть демо
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-xl font-semibold mb-6 text-center">Быстрые ссылки</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => handleNavigate('#landing')}>
              Лендинг
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleNavigate('#chat')}>
              FREE Чат
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleNavigate('#pricing')}>
              Тарифы
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleNavigate('#flow-demo')}>
              Поток работы
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}