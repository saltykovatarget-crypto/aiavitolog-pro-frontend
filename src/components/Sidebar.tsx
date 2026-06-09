import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Plus } from 'lucide-react';

interface ChatItemProps {
  title: string;
  subtitle: string;
  isActive?: boolean;
  onClick?: () => void;
}

function ChatItem({ title, subtitle, isActive = false, onClick }: ChatItemProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        p-3 rounded-xl cursor-pointer transition-all duration-200
        hover:bg-accent/50 
        ${isActive ? 'bg-brand/10 border border-brand/20' : 'bg-card hover:shadow-sm'}
      `}
    >
      <div className="font-medium text-sm leading-5 truncate">{title}</div>
      <div className="text-xs text-muted-foreground mt-1 leading-4 truncate">{subtitle}</div>
    </div>
  );
}

interface SidebarProps {
  isCollapsed?: boolean;
  className?: string;
}

export function Sidebar({ isCollapsed = false, className = '' }: SidebarProps) {
  const chats = [
    {
      id: '1',
      title: 'Анализ ниши окна ПВХ Казань',
      subtitle: 'Конкуренция высокая, но есть...'
    },
    {
      id: '2',
      title: 'ТЗ на фото для грузоперевозок',
      subtitle: 'Создать 10 фотографий для...'
    },
    {
      id: '3',
      title: 'Описания по AIDA - Челябинск',
      subtitle: 'Внимание: Проблемы с...'
    },
    {
      id: '4',
      title: 'Заголовки натяжные потолки',
      subtitle: 'До 50 символов для рекламы...'
    },
    {
      id: '5',
      title: 'План продвижения автосервис',
      subtitle: 'Комплексная стратегия на 3...'
    }
  ];

  if (isCollapsed) {
    return (
      <div className={`w-16 ${className}`}>
        <Card className="p-4 h-full">
          <Button size="sm" className="w-full p-2">
            <Plus className="w-4 h-4" />
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`w-[280px] ${className}`}>
      <Card className="p-4 h-full">
        {/* New chat button */}
        <Button className="w-full rounded-full mb-6 gap-2">
          <Plus className="w-4 h-4" />
          Новый диалог
        </Button>

        {/* Section header */}
        <div className="text-[13px] font-medium uppercase tracking-wide text-muted-foreground mb-4 px-2">
          Чаты
        </div>

        {/* Chat list */}
        <div className="flex flex-col gap-2">
          {chats.map((chat, index) => (
            <ChatItem
              key={chat.id}
              title={chat.title}
              subtitle={chat.subtitle}
              isActive={index === 0}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}