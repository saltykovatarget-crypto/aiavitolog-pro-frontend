import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { User, Settings, MessageSquare, AlertTriangle, Loader2 } from 'lucide-react';

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  profileData?: any;
  chats?: any[];
  isLoading?: boolean;
  error?: string;
}

export function ProfileSettingsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<DemoScenario | null>(null);

  const scenarios: DemoScenario[] = [
    {
      id: 'free-user',
      title: 'FREE пользователь',
      description: 'Обычный FREE пользователь с несколькими чатами',
      icon: User,
      profileData: {
        userId: 'TG_847291038',
        telegramUsername: '@avitouser2024',
        fullName: 'Александр Петров',
        planType: 'FREE'
      },
      chats: [
        {
          id: '1',
          name: 'Анализ объявления iPhone',
          lastMessage: 'Проверь модерацию этого объявления',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2', 
          name: 'Оптимизация текста',
          lastMessage: 'Как улучшить заголовок?',
          updatedAt: '2024-01-14T15:20:00Z'
        }
      ]
    },
    {
      id: 'plus-user',
      title: 'PLUS пользователь',
      description: 'Пользователь с подпиской Plus и множеством чатов',
      icon: User,
      profileData: {
        userId: 'TG_957382047',
        telegramUsername: '@propro_user',
        fullName: 'Мария Иванова',
        planType: 'PLUS'
      },
      chats: [
        {
          id: '1',
          name: 'Анализ конкурентов',
          lastMessage: 'Подробный анализ топ-10 объявлений',
          updatedAt: '2024-01-15T14:30:00Z'
        },
        {
          id: '2',
          name: 'Оптимизация для Ranker 3',
          lastMessage: 'Применить рекомендации Ranker 3',
          updatedAt: '2024-01-15T12:20:00Z'
        },
        {
          id: '3',
          name: 'Работа с таблицами',
          lastMessage: 'Анализ данных из Excel файла',
          updatedAt: '2024-01-14T16:45:00Z'
        },
        {
          id: '4',
          name: 'Идеи баннеров',
          lastMessage: 'Создание визуальных концептов',
          updatedAt: '2024-01-14T09:15:00Z'
        },
        {
          id: '5',
          name: 'Командная работа',
          lastMessage: 'Совместный анализ проекта',
          updatedAt: '2024-01-13T11:30:00Z'
        }
      ]
    },
    {
      id: 'no-chats',
      title: 'Нет чатов',
      description: 'Новый пользователь без созданных чатов',
      icon: MessageSquare,
      profileData: {
        userId: 'TG_123456789',
        telegramUsername: '@newuser2024',
        fullName: 'Сергей Новиков',
        planType: 'FREE'
      },
      chats: []
    },
    {
      id: 'loading',
      title: 'Загрузка',
      description: 'Состояние загрузки данных профиля',
      icon: Loader2,
      isLoading: true
    },
    {
      id: 'error',
      title: 'Ошибка',
      description: 'Ошибка при загрузке данных профиля',
      icon: AlertTriangle,
      error: 'Не удалось загрузить данные профиля. Проверьте подключение к интернету.'
    }
  ];

  const openModal = (scenario: DemoScenario) => {
    setCurrentScenario(scenario);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentScenario(null);
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
                Profile Settings Demo
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.hash = 'demo'}
            >
              Назад к Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold mb-4">Настройки профиля</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Демонстрация различных состояний окна настроек профиля пользователя
          </p>
        </div>

        {/* Scenario Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario) => {
            const IconComponent = scenario.icon;
            return (
              <Card key={scenario.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  {/* Icon & Title */}
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className={`w-6 h-6 text-primary ${scenario.id === 'loading' ? 'animate-spin' : ''}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{scenario.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {scenario.description}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-xs text-muted-foreground">
                    {scenario.profileData && (
                      <div className="flex items-center justify-between">
                        <span>Тариф:</span>
                        <Badge 
                          variant={scenario.profileData.planType === 'PLUS' ? 'default' : 'secondary'}
                          className={`text-xs ${
                            scenario.profileData.planType === 'PLUS' 
                              ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {scenario.profileData.planType}
                        </Badge>
                      </div>
                    )}
                    {scenario.chats && (
                      <div className="flex items-center justify-between">
                        <span>Чатов:</span>
                        <span>{scenario.chats.length}</span>
                      </div>
                    )}
                    {scenario.isLoading && (
                      <div className="text-center">
                        <span>Состояние загрузки</span>
                      </div>
                    )}
                    {scenario.error && (
                      <div className="text-center text-destructive">
                        <span>Состояние ошибки</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => openModal(scenario)}
                    className="w-full gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Открыть настройки
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Usage Info */}
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-xl font-semibold mb-6 text-center">Функциональность</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium">Основные возможности:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  Просмотр информации об аккаунте
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  Управление чатами (удаление)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  Удаление аккаунта
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  Связь с поддержкой
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium">Состояния интерфейса:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  FREE и PLUS пользователи
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  Пустое состояние (нет чатов)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  Режим удаления чатов
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  Загрузка и ошибки
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Settings Modal */}
      {currentScenario && (
        <ProfileSettingsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          profileData={currentScenario.profileData}
          chats={currentScenario.chats}
          isLoading={currentScenario.isLoading}
          error={currentScenario.error}
        />
      )}
    </div>
  );
}