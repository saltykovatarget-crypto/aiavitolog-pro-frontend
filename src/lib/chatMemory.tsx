import React from 'react';
import type { FilePinData } from '@/components/FilePin';
import type { Message } from '@/lib/chats';

// Приведи тип к своей модели сообщений UI:
export type UiMessage = {
  id: string;
  author: 'user' | 'assistant';
  text: string;
  state: 'base' | 'streaming' | 'error';
  createdAt?: number;
  images?: string[];
  files?: FilePinData[];
  hasUploadingDocument?: boolean;
};

export type MessagesByChat = Record<string, UiMessage[]>;

type ChatMemoryContextValue = {
  messagesByChat: MessagesByChat;
  setMessages: (chatId: string, messages: UiMessage[]) => void;
  updateMessages: (chatId: string, updater: (prev: UiMessage[]) => UiMessage[]) => void;
  clearAll: () => void;
  removeChat: (chatId: string) => void;
};

const ChatMemoryContext = React.createContext<ChatMemoryContextValue | null>(null);

function storageKey(userId?: string | null) {
  return `chat_memory:${userId || 'anon'}`;
}

export function ChatMemoryProvider({
  userId,
  children,
}: {
  userId?: string | null;
  children: React.ReactNode;
}) {
  const key = storageKey(userId);
  const [messagesByChat, setMessagesByChat] = React.useState<MessagesByChat>(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed ? (parsed as MessagesByChat) : {};
    } catch {
      return {};
    }
  });

  const messagesByChatRef = React.useRef(messagesByChat);

  // Обновляем ref при каждом изменении стейта, чтобы он всегда указывал на актуальные данные
  React.useEffect(() => {
    messagesByChatRef.current = messagesByChat;
  }, [messagesByChat]);

  // если userId меняется — загружаем отдельное пространство
  React.useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      setMessagesByChat(raw ? JSON.parse(raw) : {});
    } catch {
      setMessagesByChat({});
    }
  }, [key]);

  // Автосохранение в localStorage
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(messagesByChat));
      }
    } catch {}
  }, [key, messagesByChat]);

  const setMessages = React.useCallback((chatId: string, messages: UiMessage[]) => {
    setMessagesByChat(prev => {
      const next = { ...prev, [chatId]: messages };
      messagesByChatRef.current = next;
      return next;
    });
  }, []);

  const updateMessages = React.useCallback((chatId: string, updater: (prev: UiMessage[]) => UiMessage[]) => {
    setMessagesByChat(prev => {
      const current = prev[chatId] ?? [];
      const next = updater(current);
      const updated = { ...prev, [chatId]: next };
      messagesByChatRef.current = updated;
      return updated;
    });
  }, []);

  const clearAll = React.useCallback(() => {
    messagesByChatRef.current = {};
    setMessagesByChat({});
  }, []);

  const removeChat = React.useCallback((chatId: string) => {
    setMessagesByChat(prev => {
      const next = { ...prev };
      delete next[chatId];
      messagesByChatRef.current = next;
      return next;
    });
  }, []);

  const value = React.useMemo<ChatMemoryContextValue>(() => ({
    messagesByChat,
    setMessages,
    updateMessages,
    clearAll,
    removeChat,
  }), [messagesByChat, setMessages, updateMessages, clearAll, removeChat]);

  return (
    <ChatMemoryContext.Provider value={value}>
      {children}
    </ChatMemoryContext.Provider>
  );
}

export function useChatMemory() {
  const ctx = React.useContext(ChatMemoryContext);
  if (!ctx) {
    throw new Error('useChatMemory must be used within <ChatMemoryProvider>');
  }
  return ctx;
}

function normalizeAuthor(role: Message['role']): UiMessage['author'] {
  switch (role) {
    case 'user':
      return 'user';
    case 'assistant':
    case 'system':
    default:
      return 'assistant';
  }
}

export function mapApiMessagesToUi(messages: Message[]): UiMessage[] {
  return messages.map(message => ({
    id: message.id,
    author: normalizeAuthor(message.role),
    text: message.content,
    state: 'base',
    createdAt: message.created_at ? Date.parse(message.created_at) : undefined,
    images: Array.isArray(message.images) ? message.images : [],
    files: (message.exports ?? []).map(exp => ({
      id: exp.id,
      name: exp.file_name,
      type: exp.kind,
      size: exp.size_bytes,
      state: 'mirrored',
      url: exp.download_url,
    })),
  }));
}
