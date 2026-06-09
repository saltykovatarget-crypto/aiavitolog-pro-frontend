import React, { useState, useEffect, useRef } from 'react';
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

interface ChatBasicPageProps {
  isDark?: boolean;
  setIsDark?: (isDark: boolean) => void;
  onNavigateToStatistics?: () => void;
}

interface ChatSummary {
  id: string;
  title: string;
}

export function ChatBasicPage({ 
  isDark = true, 
  setIsDark = () => {}, 
  onNavigateToStatistics = () => {} 
}: ChatBasicPageProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [chats, setChats] = useState<ChatSummary[]>([]);
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
      const newChat = await createChat('Новый чат');
      const chatSummary: ChatSummary = { id: newChat.id, title: newChat.title };
      setChats(prev => [chatSummary, ...prev]);
      setActiveChat(chatSummary.id);
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        const detail = (error.data as any)?.detail;
        toast.error(typeof detail === 'string' ? detail : 'Доступно только на платном тарифе.');
        return;
      }
      console.error('Failed to create chat', error);
      toast.error('Не удалось создать чат');
    }
  };

  const createChatFromComposer = async () => {
    try {
      const newChat = await createChat('Новый чат');
      const chatSummary: ChatSummary = { id: newChat.id, title: newChat.title };
      setChats(prev => [chatSummary, ...prev]);
      setActiveChat(chatSummary.id);
      return chatSummary.id;
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        const detail = (error.data as any)?.detail;
        toast.error(typeof detail === 'string' ? detail : 'Доступно только на платном тарифе.');
      } else {
        console.error('Failed to create chat', error);
        toast.error('Не удалось создать чат');
      }
      throw error;
    }
  };

  useEffect(() => {
    didBootRef.current = false;
  }, [user?.id]);

  useEffect(() => {
    let isMounted = true;
    if (didBootRef.current) return;
    didBootRef.current = true;
    bootUserRef.current = user?.id;
    async function boot() {
      try {
        const data = await ensureChatsLoaded({ userId: user?.id });
        if (!isMounted) return;
        const mapped = data.map<ChatSummary>((chat: ApiChat) => ({ id: chat.id, title: chat.title }));

        setChats(mapped);
        setActiveChat(prev => {
          if (prev && mapped.some(chat => chat.id === prev)) {
            return prev;
          }
          return mapped[0]?.id ?? null;
        });
      } catch (error) {
        if (!isMounted) return;
        console.error('Failed to load chats', error);
        toast.error('Не удалось загрузить чаты');
        setChats([]);
        setActiveChat(null);
      }
    }

    boot();

    return () => {
      isMounted = false;
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
              toast.error('Не удалось удалить чат');
            }
          }}
          isDark={isDark}
          setIsDark={setIsDark}
          onNavigateToStatistics={onNavigateToStatistics}
          showUpgradeButton={false}
        />
        <NewChatArea
          isDark={isDark}
          setIsDark={setIsDark}
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
              toast.error('Не удалось удалить чат');
            }
          }}
          isDark={isDark}
          setIsDark={setIsDark}
          onNavigateToStatistics={onNavigateToStatistics}
          showUpgradeButton={false}
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
