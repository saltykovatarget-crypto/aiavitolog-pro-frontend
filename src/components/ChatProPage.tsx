import React, { useEffect, useState, useRef } from 'react';
import { UniversalHeader } from './UniversalHeader';
import { ChatSidebar } from './ChatSidebar';
import { NewChatArea } from './NewChatArea';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { MobileChatsDrawer } from '@/components/chat/MobileChatsDrawer';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api';
import { ensureChatsLoaded, createChat, renameChat, deleteChat as apiDeleteChat, type Chat as ApiChat } from '@/lib/chats';
import { useChatMemory } from '@/lib/chatMemory';
import { useAuth } from '@/lib/auth';

interface ChatProPageProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  onNavigateToStatistics?: () => void;
}

export function ChatProPage({ isDark, setIsDark, onNavigateToStatistics }: ChatProPageProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isProfileSettingsModalOpen, setIsProfileSettingsModalOpen] = useState(false);
  const [mobileChatsOpen, setMobileChatsOpen] = useState(false);
  const { removeChat } = useChatMemory();
  const { user } = useAuth();
  const didBootRef = useRef(false);
  const bootUserRef = useRef<string | null | undefined>(undefined);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
  };

  const handleMobileChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    setMobileChatsOpen(false);
  };

  const handleAddChat = async () => {
    try {
      const created = await createChat('Новый чат');
      const item = { id: created.id, title: created.title };
      setChats(prev => [item, ...prev]);
      setActiveChat(item.id);
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        const detail = (error.data as any)?.detail;
        toast.error(typeof detail === 'string' ? detail : 'Доступно только на платном тарифе.');
        return;
      }
      console.error(error);
      toast.error('Не удалось создать чат');
    }
  };

  const createChatFromComposer = async () => {
    try {
      const created = await createChat('Новый чат');
      const item = { id: created.id, title: created.title };
      setChats(prev => [item, ...prev]);
      setActiveChat(item.id);
      return item.id;
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        const detail = (error.data as any)?.detail;
        toast.error(typeof detail === 'string' ? detail : 'Доступно только на платном тарифе.');
      } else {
        console.error(error);
        toast.error('Не удалось создать чат');
      }
      throw error;
    }
  };

  useEffect(() => {
    didBootRef.current = false;
  }, [user?.id]);

  useEffect(() => {
    let mounted = true;
    if (didBootRef.current) return;
    didBootRef.current = true;
    bootUserRef.current = user?.id;
    (async () => {
      try {
        const data = await ensureChatsLoaded({ userId: user?.id });
        if (!mounted) return;
        const mapped = data.map((chat: ApiChat) => ({ id: chat.id, title: chat.title }));
        setChats(mapped);
        setActiveChat(prev => (prev && mapped.some(chat => chat.id === prev)) ? prev : mapped[0]?.id ?? null);
      } catch (error) {
        if (!mounted) return;
        console.error(error);
        toast.error('Не удалось загрузить чаты');
        setChats([]);
        setActiveChat(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const handleOpenProfileSettings = () => {
    setIsProfileSettingsModalOpen(true);
  };

  const handleCloseProfileSettings = () => {
    setIsProfileSettingsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <UniversalHeader
        isDark={isDark}
        setIsDark={setIsDark}
        onOpenProfileSettings={handleOpenProfileSettings}
        onNavigateToStatistics={onNavigateToStatistics}
        onOpenMobileChats={() => setMobileChatsOpen(true)}
      />
      
      <main className="flex h-[calc(100vh-4rem)]">
        <ChatSidebar
          className="border-r hidden md:block"
          isCollapsed={isSidebarCollapsed}
          chats={chats}
          activeChatId={activeChat}
          onChatSelect={handleChatSelect}
          onAddChat={handleAddChat}
          onDeleteChat={async (id) => {
            try {
              await apiDeleteChat(id);
              setChats(prev => {
                const next = prev.filter(c => c.id !== id);
                setActiveChat(prevId => (prevId === id ? next[0]?.id ?? null : prevId));
                return next;
              });

              removeChat(id);
            } catch (e) {
              console.error('deleteChat failed:', e);

              const maybeDetail =
                e instanceof ApiError && typeof (e.data as any)?.detail === 'string'
                  ? (e.data as any).detail
                  : null;

              toast.error(maybeDetail ?? 'Не удалось удалить чат');
            }
          }}
        />
        <NewChatArea
          chatId={activeChat}
          onCreateChat={createChatFromComposer}
          onRenameChat={async (id, title) => {
            try {
              const updated = await renameChat(id, title);
              setChats(prev => prev.map(c => (c.id === id ? { ...c, title: updated.title } : c)));
            } catch (e) {
              console.error('renameChat failed:', e);
              toast.error('Не удалось переименовать чат');
              throw e;
            }
          }}
        />
      </main>

      <MobileChatsDrawer
        open={mobileChatsOpen}
        onClose={() => setMobileChatsOpen(false)}
        title="Чаты"
      >
        <ChatSidebar
          className="w-full h-full"
          isCollapsed={false}
          chats={chats}
          activeChatId={activeChat}
          onChatSelect={handleMobileChatSelect}
          onAddChat={handleAddChat}
          onDeleteChat={async (id) => {
            try {
              await apiDeleteChat(id);
              setChats(prev => {
                const next = prev.filter(c => c.id !== id);
                setActiveChat(prevId => (prevId === id ? next[0]?.id ?? null : prevId));
                return next;
              });

              removeChat(id);
            } catch (e) {
              console.error('deleteChat failed:', e);

              const maybeDetail =
                e instanceof ApiError && typeof (e.data as any)?.detail === 'string'
                  ? (e.data as any).detail
                  : null;

              toast.error(maybeDetail ?? 'Не удалось удалить чат');
            }
          }}
        />
      </MobileChatsDrawer>

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileSettingsModalOpen}
        onClose={handleCloseProfileSettings}
        profileData={{
          userId: user?.telegram_id ? `TG_${user.telegram_id}` : (user?.id ?? '—'),
          telegramUsername: user?.telegram_username ? `@${user.telegram_username}` : '—',
          fullName: user?.full_name || user?.username || '—',
          planType: (user?.plan || 'free').toUpperCase() as 'FREE' | 'BASIC' | 'PLUS' | 'PREMIUM'
        }}
      />
    </div>
  );
}
