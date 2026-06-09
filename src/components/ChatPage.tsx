import React, { useState, useEffect, useRef } from 'react';
import { UniversalHeader } from './UniversalHeader';
import { ChatSidebar } from './ChatSidebar';
import { NewChatArea } from './NewChatArea';
import { RegistrationModal } from './RegistrationModal';
import { LoginModal } from '@/components/auth/LoginModal';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { MobileChatsDrawer } from '@/components/chat/MobileChatsDrawer';
import { useAuth } from '@/lib/auth';
import { ApiError } from '@/lib/api';
import { toast } from 'sonner';
import { ensureChatsLoaded, createChat, renameChat, deleteChat as apiDeleteChat, type Chat as ApiChat } from '@/lib/chats';
import { getOrCreateGuestChat } from '@/lib/guest';
import { useChatMemory } from '@/lib/chatMemory';

interface ChatSummary {
  id: string;
  title: string;
}

interface ChatPageProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  onNavigateToPricing?: () => void;
  onNavigateToStatistics?: () => void;
  onNavigateToTools?: () => void;
  onNavigateToWallet?: () => void;
}

export function ChatPage({ isDark, setIsDark, onNavigateToPricing, onNavigateToStatistics, onNavigateToTools, onNavigateToWallet }: ChatPageProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileSettingsModalOpen, setIsProfileSettingsModalOpen] = useState(false);
  const [mobileChatsOpen, setMobileChatsOpen] = useState(false);
  const { user } = useAuth();
  const { removeChat } = useChatMemory();
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
    if (!user) {
      toast.info('В гостевом режиме доступен один чат и один вопрос. Для продолжения — войдите или зарегистрируйтесь.');
      setIsRegistrationModalOpen(true);
      return;
    }
    try {
      const newChat = await createChat('Новый чат');
      const chatSummary: ChatSummary = { id: newChat.id, title: newChat.title };
      setChats(prev => [chatSummary, ...prev]);
      setActiveChat(chatSummary.id);
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        const detail = (error.data as any)?.detail;
        toast.error(typeof detail === 'string' ? detail : 'Доступно только на платном тарифе.');
        onNavigateToPricing?.();
        return;
      }
      console.error('Failed to create chat', error);
      toast.error('Не удалось создать чат');
    }
  };

  const createChatFromComposer = async () => {
    if (!user) {
      toast.info('В гостевом режиме доступен один чат и один вопрос. Для продолжения — войдите или зарегистрируйтесь.');
      setIsRegistrationModalOpen(true);
      throw new Error('Guest chat creation is not allowed');
    }
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
        onNavigateToPricing?.();
      } else {
        console.error('Failed to create chat', error);
        toast.error('Не удалось создать чат');
      }
      throw error;
    }
  };

  const handleOpenRegistration = () => {
    setIsRegistrationModalOpen(true);
  };

  const handleCloseRegistration = () => {
    setIsRegistrationModalOpen(false);
  };

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginComplete = () => {
    setIsLoginModalOpen(false);
  };

  const handleOpenProfileSettings = () => {
    setIsProfileSettingsModalOpen(true);
  };

  const handleCloseProfileSettings = () => {
    setIsProfileSettingsModalOpen(false);
  };

  const handleStatsClick = () => {
    const plan = (user?.plan || 'free').toLowerCase();
    if (plan === 'free') {
      toast.info('Доступно после оплаты');
      return;
    }
    onNavigateToStatistics?.();
  };

  useEffect(() => {
    if (user) {
      setIsLoginModalOpen(false);
      setIsRegistrationModalOpen(false);
    }
  }, [user]);

  useEffect(() => {
    didBootRef.current = false;
  }, [user?.id]);

  useEffect(() => {
    let isMounted = true;
    if (didBootRef.current) return;
    didBootRef.current = true;
    bootUserRef.current = user?.id;
    async function boot() {
      if (!user) {
        if (isMounted) {
          try {
            const guest = await getOrCreateGuestChat();
            if (!isMounted) return;
            setChats([{ id: guest.id, title: guest.title }]);
            setActiveChat(guest.id);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Не удалось создать гостевой чат');
            setChats([]);
            setActiveChat(null);
          }
        }
        return;
      }

      try {
        const data = await ensureChatsLoaded({ userId: user.id });
        if (!isMounted) return;
        const mapped = data.map<ChatSummary>((chat: ApiChat) => ({
          id: chat.id,
          title: chat.title
        }));

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

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <UniversalHeader
        isDark={isDark}
        setIsDark={setIsDark}
        onLogin={handleOpenLogin}
        onRegistration={handleOpenRegistration}
        onOpenProfileSettings={handleOpenProfileSettings}
        onNavigateToStatistics={handleStatsClick}
        onNavigateToPricing={onNavigateToPricing}
        onOpenMobileChats={() => setMobileChatsOpen(true)}
      />
      
      <main className="flex min-w-0 overflow-x-hidden h-[calc(100vh-7.5rem)] md:h-[calc(100vh-4rem)]">
        <ChatSidebar
          className="border-r hidden md:block"
          isCollapsed={isSidebarCollapsed}
          chats={chats}
          activeChatId={activeChat}
          onChatSelect={handleChatSelect}
          onAddChat={handleAddChat}
          onDeleteChat={async (id) => {
            if (!user) {
              toast.info('В гостевом режиме доступен один чат. Для продолжения — войдите или зарегистрируйтесь.');
              setIsRegistrationModalOpen(true);
              return;
            }
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
          onNavigateToStatistics={handleStatsClick}
          onNavigateToPricing={onNavigateToPricing}
          onNavigateToTools={onNavigateToTools}
          onNavigateToWallet={onNavigateToWallet}
          showUpgradeButton={!user}
        />
        <NewChatArea
          isDark={isDark}
          setIsDark={setIsDark}
          chatId={activeChat}
          onCreateChat={createChatFromComposer}
          onAuthRequired={() => setIsRegistrationModalOpen(true)}
          onOpenLogin={handleOpenLogin}
          onOpenRegistration={handleOpenRegistration}
          onRenameChat={async (id, title) => {
            if (!user) {
              toast.info('В гостевом режиме чат нельзя переименовать. Для продолжения — войдите или зарегистрируйтесь.');
              setIsRegistrationModalOpen(true);
              return;
            }
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
            if (!user) {
              toast.info('В гостевом режиме доступен один чат. Для продолжения — войдите или зарегистрируйтесь.');
              setIsRegistrationModalOpen(true);
              return;
            }
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
          onNavigateToStatistics={handleStatsClick}
          onNavigateToPricing={onNavigateToPricing}
          onNavigateToTools={onNavigateToTools}
          onNavigateToWallet={onNavigateToWallet}
          showUpgradeButton={!user}
        />
      </MobileChatsDrawer>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={handleCloseRegistration}
        onRegistrationComplete={handleCloseRegistration}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLogin}
        onLoginComplete={handleLoginComplete}
        onOpenRegistration={handleOpenRegistration}
      />

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
