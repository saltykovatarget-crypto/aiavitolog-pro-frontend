import React from 'react';
import { SafeText } from './SafeText';

interface Chat {
  id: string;
  title: string;
  isActive?: boolean;
}

interface ChatListProps {
  chats: Chat[];
  onChatSelect?: (chatId: string) => void;
}

export function ChatList({ chats, onChatSelect }: ChatListProps) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Разделительная линия */}
      <div className="border-t border-border mb-4"></div>
      
      {/* Контейнер для чатов с фиксированной высотой и скроллом */}
      <div className="flex-1 overflow-y-auto rounded-lg bg-card/30 border border-border/50 min-h-[200px] max-h-[400px] custom-scrollbar">
        {chats.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">Новые чаты будут здесь</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`
                  p-2 text-sm rounded-lg cursor-pointer transition-colors
                  ${chat.isActive 
                    ? 'bg-brand/10 text-brand border border-brand/20' 
                    : 'text-foreground hover:bg-accent/20'
                  }
                `}
                onClick={() => onChatSelect?.(chat.id)}
              >
                <SafeText value={chat.title} maxLen={120} fallback="Без названия" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}