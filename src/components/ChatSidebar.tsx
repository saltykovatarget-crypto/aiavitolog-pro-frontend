import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Plus, Sun, Moon, BarChart3, Trash2, Wrench, ChevronRight, Send, Wallet } from 'lucide-react';
import { SafeText } from './SafeText';
import { sanitizeUserText } from '@/lib/safe';

interface ChatSummary {
  id: string;
  title: string;
}

interface ChatSidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
  chats?: ChatSummary[];
  activeChatId?: string | null;
  onChatSelect?: (chatId: string) => void;
  onAddChat?: () => void;
  onDeleteChat?: (chatId: string) => void;
  isDark?: boolean;
  setIsDark?: (isDark: boolean) => void;
  onNavigateToStatistics?: () => void;
  onNavigateToPricing?: () => void;
  onNavigateToTools?: () => void;
  onNavigateToWallet?: () => void;
  showUpgradeButton?: boolean;
}

export function ChatSidebar({
  className = '',
  isCollapsed = false,
  chats = [],
  activeChatId,
  onChatSelect,
  onAddChat,
  onDeleteChat,
  isDark,
  setIsDark,
  onNavigateToStatistics,
  onNavigateToTools,
  onNavigateToWallet,
}: ChatSidebarProps) {

  // Mobile collapsed state
  if (isCollapsed) {
    return null; // Hidden on mobile
  }

  return (
    <div className={`w-[260px] lg:w-[260px] md:w-[220px] flex-shrink-0 ${className}`}>
      <Card className="p-4 h-full flex flex-col shadow-card">
        {/* New chat button */}
        <Button
          className="w-full rounded-full gap-2"
          onClick={onAddChat}
        >
          <Plus className="w-4 h-4" />
          Новый чат
        </Button>

        {/* Tools CTA — moved to top for visibility */}
        {onNavigateToTools && (
          <Button
            variant="outline"
            className="w-full justify-start gap-3 border-[#6F42C1]/40 hover:border-[#6F42C1] hover:bg-[#6F42C1]/10 mt-2"
            onClick={onNavigateToTools}
          >
            <Wrench className="w-4 h-4 text-[#9A7FE0]" />
            Инструменты
            <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
          </Button>
        )}

        {/* Chat List */}
        <div className="flex-1 mt-6 mb-6 overflow-y-auto space-y-2 pr-1">
          {chats.length === 0 ? (
            <div className="text-sm text-muted-foreground">Новые чаты будут здесь</div>
          ) : (
            chats.map(chat => {
              const isActive = chat.id === activeChatId;
              return (
                <div key={chat.id} className="group flex items-center gap-2">
                  <button
                    onClick={() => onChatSelect?.(chat.id)}
                    className={`flex-1 text-left px-3 py-2 rounded-md transition ${
                      isActive ? 'bg-accent/20 border border-accent/30' : 'hover:bg-accent/10'
                    }`}
                    title={sanitizeUserText(chat.title, 120)}
                  >
                    <SafeText value={chat.title} maxLen={120} fallback="Без названия" />
                  </button>
                  <button
                    aria-label="Удалить чат"
                    onClick={() => {
                      if (!onDeleteChat) return;
                      if (confirm('Удалить этот чат?')) {
                        onDeleteChat(chat.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-accent/10"
                    title="Удалить чат"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom section */}
        <div className="space-y-1 pt-4 border-t border-border">
          {/* Кошелёк */}
          {onNavigateToWallet && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={onNavigateToWallet}
            >
              <Wallet className="w-4 h-4" />
              Кошелёк
            </Button>
          )}

          {/* Theme toggle */}
          {isDark !== undefined && setIsDark && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4" />
                  Светлая тема
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  Тёмная тема
                </>
              )}
            </Button>
          )}

          {/* Statistics */}
          {onNavigateToStatistics && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={onNavigateToStatistics}
            >
              <BarChart3 className="w-4 h-4" />
              Статистика
            </Button>
          )}

        </div>

        {/* Legal block — RKN requirement */}
        <div className="pt-3 mt-3 border-t border-border flex flex-col gap-0.5 text-[10px] text-muted-foreground">
          <a
            href="https://t.me/valeriia_avitolog"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 mb-2 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] text-white font-semibold text-[11px] hover:opacity-90 transition"
          >
            <Send className="w-3 h-3" />
            Наш блог
          </a>
          <a href="/policies/privacy-policy" style={{ display: 'block' }} className="hover:text-foreground transition leading-tight">
            Политика конфиденциальности
          </a>
          <a href="/offer" style={{ display: 'block' }} className="hover:text-foreground transition leading-tight">
            Пользовательское соглашение
          </a>
          <a href="/cookies" style={{ display: 'block' }} className="hover:text-foreground transition leading-tight">
            Политика cookies
          </a>
          <p className="text-[9px] opacity-50 pt-1.5 leading-snug">
            © 2024–{new Date().getFullYear()} ИП Салтыкова В.В. · ИНН 540303308700
          </p>
        </div>
      </Card>
    </div>
  );
}
