import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMarkdown } from './ChatMarkdown';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Composer, ComposerState } from './Composer';
import { FilePinList, FilePinData } from './FilePin';
import { ModalNameChat } from './ModalNameChat';
import { copyToClipboard, isCopySupported } from './ui/copy-utils';
import { Bot, User, AlertTriangle, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useChatMemory, type UiMessage, mapApiMessagesToUi } from '@/lib/chatMemory';
import { getMessages, sendMessageStream, uploadChatImage } from '@/lib/chats';
import { sendGuestMessageStream } from '@/lib/guest';
import { ApiError, uploadChatDocument } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const CTA_ANIM = 'transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]';

interface NewChatAreaProps {
  className?: string;
  isDark?: boolean;
  setIsDark?: (isDark: boolean) => void;
  chatId?: string | null;
  onCreateChat?: () => Promise<string>;
  onAuthRequired?: (reason?: string) => void;
  onOpenLogin?: () => void;
  onOpenRegistration?: () => void;
  /** сообщаем родителю новое имя для активного чата (обновить список слева) */
  onRenameChat?: (chatId: string, title: string) => Promise<void>;
}

/** Временные заглушки для стриминга ответа */
function softFormat(s: string): string {
  // не форматируем, если пришёл fenced code – пусть markdown решает сам
  if (s.includes('```')) return s.trim();
  let t = s;
  // перенос перед маркерами/нумерацией/длинным тире
  t = t.replace(/([^\n])\s+(-\s+)/g, '$1\n$2');
  t = t.replace(/([^\n])\s+(\d+[.)]\s+)/g, '$1\n$2');
  t = t.replace(/([^\n])\s+(—\s+)/g, '$1\n$2');
  // схлопнуть любые серии пустых строк до ОДНОЙ
  t = t.replace(/\n{3,}/g, '\n\n');   // сначала три и больше → две
  t = t.replace(/\n{2,}\s*\n+/g, '\n\n'); // затем двойные, если между ними только пробелы
  // частые артеfacts: абзац, который содержит только "— ..."
  t = t.replace(/\n\n—\s+/g, '\n— ');
  // убрать лишние двойные пробелы
  t = t.replace(/[ \t]{2,}/g, ' ');
  return t.trim();
}

const BASE_THINKING_TEXT = 'Думаю над ответом…';
const MAX_IMAGE_ATTACH = 4;

const RATE_LIMIT_MESSAGE =
  'Вы отправили слишком много сообщений за короткий период. Я стараюсь давать ответы взвешенно и полезно — подождите немного, перечитайте уже полученные рекомендации и попробуйте снова.';

const ALLOWED_FILE_EXTENSIONS = ['docx', 'xlsx', 'csv'];

type LimitNotice = {
  kind: 'quota' | 'rate';
  title: string;
  message: string;
  used?: number;
  limit?: number;
};

function getPendingAssistantText(hasUploadingDocument: boolean): string {
  if (!hasUploadingDocument) {
    return BASE_THINKING_TEXT;
  }

  return [
    BASE_THINKING_TEXT,
    'Распаковываю файл и индексирую его в базе, подожди немного…',
    'Распаковываю и изучаю документ… Это займёт несколько секунд',
  ].join('\n');
}

function StreamingPlaceholder({ hasUploadingDocument = false }: { hasUploadingDocument?: boolean }) {
  const basePhrases = [
    BASE_THINKING_TEXT,
    'Ищу подходящий вариант…',
    'Анализирую…',
    'Формулирую мысль…',
    'Подготавливаю сообщение…'
  ];

  const phrases = hasUploadingDocument ? [getPendingAssistantText(true)] : basePhrases;
  const [i, setI] = useState(0);

  useEffect(() => {
    if (phrases.length <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % phrases.length), 2000);
    return () => clearInterval(t);
  }, [phrases.length]);
  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="text-muted-foreground italic text-base"
        style={{ lineHeight: '1.6' }}
      >
        {phrases[i]}
      </motion.p>
    </AnimatePresence>
  );
}

function detectFileType(fileName: string): FilePinData['type'] {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.xlsx')) return 'xlsx';
  if (lower.endsWith('.csv')) return 'csv';
  if (lower.endsWith('.docx')) return 'docx';
  return 'unknown';
}

function MessageBubble({ message, onFileDownload }: {
  message: UiMessage;
  onFileDownload?: (fileId: string) => void;
}) {
  const { author, text, state, files, images } = message;
  const isUser = author === 'user';
  const isAssistant = author === 'assistant';
  const [isHovered, setIsHovered] = useState(false);
  const [showTextToCopy, setShowTextToCopy] = useState(false);
  const textRef = React.useRef<HTMLDivElement>(null);
  const isError = state === 'error';
  const isStreaming = state === 'streaming';

  const rawText = text || '';
  // Для ассистента больше не применяем softFormat, чтобы не ломать Markdown-разметку.
  // Всегда рендерим сырой текст как есть.
  const displayText = rawText;

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setShowTextToCopy(false);
    } else {
      setShowTextToCopy(true);
      setTimeout(() => setShowTextToCopy(false), 5000);
      if (textRef.current) {
        try {
          const range = document.createRange();
          range.selectNodeContents(textRef.current);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        } catch {}
      }
    }
  };

  return (
    <div
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start md:justify-center'} group relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isAssistant && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className={`${isError ? 'bg-destructive/10 text-destructive' : 'bg-brand/10 text-brand'}`}>
            {isError ? <AlertTriangle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`
          ${isUser ? 'max-w-[60%] md:max-w-[64%] order-first' : 'max-w-[76%] md:w-full md:max-w-[1080px]'}
          relative
          min-w-0
        `}
      >
        <div
          className={`
            break-words
            ${isUser
              ? 'rounded-xl px-4 py-4 bg-card text-card-foreground border border-border'
              : isError
                ? 'rounded-xl px-4 py-4 bg-destructive/10 border border-destructive/20 text-destructive'
                : 'py-2'
            }
          `}
        >
          {isStreaming && !text ? (
            <StreamingPlaceholder hasUploadingDocument={message.hasUploadingDocument} />
          ) : (
            <>
              <div
                ref={textRef}
                className={`
                  text-base break-words hyphens-auto
                  ${isAssistant ? '' : 'preserve-newlines'}
                  ${isError ? 'flex items-start gap-2 text-destructive' : 'text-card-foreground'}
                  ${showTextToCopy ? 'select-all bg-accent/5 rounded px-1' : 'select-text'}
                `}
                style={{ lineHeight: 1.7 }}
              >
                {isError && (
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 inline-block mr-2" />
                )}
                <ChatMarkdown content={displayText} />
              </div>

              {!!images?.length && (
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {images.map((url) => (
                    <button
                      key={url}
                      type="button"
                      className="group relative overflow-hidden rounded-xl border bg-muted"
                      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                      title="Open image"
                    >
                      <img
                        src={url}
                        alt="message image"
                  className="h-24 w-full object-cover sm:h-28"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              )}

              {files && files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file) => {
                    const mirrored: FilePinData = { ...file, state: 'mirrored' };
                    return (
                      <div key={file.id} className="max-w-[300px]">
                        <FilePinList files={[mirrored]} onDownload={onFileDownload} />
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {!isStreaming && isHovered && isCopySupported() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-2 -right-2"
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 bg-card border border-border shadow-sm hover:bg-accent/5"
                onClick={handleCopy}
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="bg-accent/10 text-accent">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export function NewChatArea({
  className = '',
  isDark,
  setIsDark,
  chatId,
  onCreateChat,
  onAuthRequired,
  onOpenLogin,
  onOpenRegistration,
  onRenameChat,
}: NewChatAreaProps) {
  // Используем общий контекст, сохраняющий историю по пользователю в localStorage
  const { messagesByChat, updateMessages, setMessages } = useChatMemory();
  const { user, refreshUser } = useAuth();

  // UI состояния (как в «старой» версии)
  const [message, setMessage] = useState('');
  const [inputPosition, setInputPosition] = useState<'centered' | 'bottom'>('centered');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [firstMessage, setFirstMessage] = useState('');
  const [composerState, setComposerState] = useState<ComposerState>('idle');
  const [attachedFiles, setAttachedFiles] = useState<FilePinData[]>([]);
  const [attachedImages, setAttachedImages] = useState<Array<{ key: string; url: string; name?: string }>>([]);
  const [limitNotice, setLimitNotice] = useState<LimitNotice | null>(null);

  // Рефы для защиты от race-condition: loadHistory не должен перетирать локальные сообщения
  // пустой историей, пока идёт первый стрим или пока уже есть локальные сообщения.
  const messagesByChatRef = useRef(messagesByChat);
  const composerStateRef = useRef(composerState);
  useEffect(() => {
    messagesByChatRef.current = messagesByChat;
  }, [messagesByChat]);
  useEffect(() => {
    composerStateRef.current = composerState;
  }, [composerState]);

  // Скролл/автоскролл (как раньше)
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastAssistantMessageRef = useRef<HTMLDivElement>(null);
  const lastCreatedChatIdRef = useRef<string | null>(null);
  const skipResetOnNextChatIdRef = useRef<string | null>(null);
  const effectiveChatId = chatId ?? lastCreatedChatIdRef.current;
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout>();
  const streamAbort = useRef<AbortController | null>(null);

  const handleNavigateToPricing = useCallback(() => {
    try {
      window.location.hash = 'pricing';
    } catch (error) {
      console.error('Failed to navigate to pricing', error);
    }
  }, []);

  // ✅ Документы теперь доступны на всех тарифах (Free/Basic/Plus/Premium),
  // но в гостевом режиме загрузку не показываем.
  const canUploadDocuments = Boolean(user);
  const canUploadImages = Boolean(user);

  const handleAttachmentRequest = useCallback(() => {
    if (!canUploadDocuments) {
      toast.info('Чтобы прикреплять документы — войдите или зарегистрируйтесь.');
      onAuthRequired?.('documents');
      return false;
    }
    return true;
  }, [canUploadDocuments, onAuthRequired]);

  const handleImageAttachmentRequest = useCallback(() => {
    if (!canUploadImages) {
      toast.info('Чтобы прикреплять изображения — войдите или зарегистрируйтесь.');
      onAuthRequired?.('images');
      return false;
    }
    return true;
  }, [canUploadImages, onAuthRequired]);

  // сбрасываем ввод при смене чата, чтобы не утащить текст в другой диалог
  useEffect(() => {
    // Если chatId сменился из-за создания чата прямо из композера —
    // НЕ сбрасываем и НЕ abort'им стрим, иначе убиваем ответ модели.
    if (chatId && skipResetOnNextChatIdRef.current === chatId) {
      skipResetOnNextChatIdRef.current = null;
      return;
    }

    setMessage('');
    // чтобы не тащить «старые» файлы/состояние в новый чат
    setAttachedFiles([]);
    setAttachedImages([]);
    setComposerState('idle');
    streamAbort.current?.abort();
    streamAbort.current = null;
  }, [chatId]);

  useEffect(() => {
    if (!user && attachedFiles.length > 0) {
      setAttachedFiles([]);
    }
  }, [user, attachedFiles.length]);

  useEffect(() => {
    if (!user && attachedImages.length > 0) {
      setAttachedImages([]);
    }
  }, [user, attachedImages.length]);

  // Активные сообщения для текущего chatId
  const messages: UiMessage[] = effectiveChatId ? (messagesByChat[effectiveChatId] ?? []) : [];
  // "Пустой чат" = ещё нет ни одного осмысленного сообщения пользователя.
  // Это устойчивее, чем messages.length === 0 (localStorage/плейсхолдеры/служебные записи).
  const hasUserMessage = messages.some((m) => {
    if (m.author !== 'user') return false;
    const hasText = typeof m.text === 'string' && m.text.trim().length > 0;
    const hasFiles = Array.isArray(m.files) && m.files.length > 0;
    const hasImages = Array.isArray(m.images) && m.images.length > 0;
    return hasText || hasFiles || hasImages;
  });

  const isEmpty = !effectiveChatId || !hasUserMessage;
  const showWelcome = isEmpty && composerState !== 'streaming';

  const WELCOME_TITLE = 'Привет, я AI Авитолог';
  const WELCOME_SUBTITLE = 'приступим к разработке рекламы на Авито?';

  // Смена chatId — позиция ввода в центр, если пусто
  useEffect(() => {
    setInputPosition(
      !effectiveChatId || (messagesByChat[effectiveChatId] ?? []).length === 0 ? 'centered' : 'bottom',
    );
  }, [effectiveChatId, messagesByChat]);

  useEffect(() => {
    if (!effectiveChatId) return;
    if (!user) return;

    let cancelled = false;

    const loadHistory = async () => {
      try {
        // Guard ДО запроса: не перетираем локальные сообщения пустой историей
        // (например, сразу после создания чата/первого send) и не мешаем активному стриму.
        const existingLocal = messagesByChatRef.current[effectiveChatId] ?? [];
        if (existingLocal.length > 0) return;
        if (composerStateRef.current === 'streaming') return;

        const msgs = await getMessages(effectiveChatId);
        if (cancelled) return;

        // За время запроса мы могли уже локально добавить сообщения (первый send) или начать стрим.
        // В этом случае не перетираем локальные сообщения пустой/устаревшей историей.
        const localAfter = messagesByChatRef.current[effectiveChatId] ?? [];
        if (localAfter.length > 0) return;
        if (composerStateRef.current === 'streaming') return;

        const normalized = mapApiMessagesToUi(msgs);
        setMessages(effectiveChatId, normalized);
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load messages', err);
        }
      }
    };

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [effectiveChatId, setMessages, user]);

  const upsertMessages = useCallback((chat: string, next: UiMessage[] | ((prev: UiMessage[]) => UiMessage[])) => {
    if (typeof next === 'function') {
      updateMessages(chat, next as (prev: UiMessage[]) => UiMessage[]);
      const current = messagesByChatRef.current[chat] ?? [];
      const updated = (next as (prev: UiMessage[]) => UiMessage[])(current);
      messagesByChatRef.current = { ...messagesByChatRef.current, [chat]: updated };
    } else {
      void setMessages(chat, next);
      messagesByChatRef.current = { ...messagesByChatRef.current, [chat]: next };
    }
  }, [setMessages, updateMessages]);

  // Автоскролл (как раньше)
  const scrollToCenter = useCallback((element: HTMLElement, smooth = true) => {
    if (!messagesContainerRef.current) return;
    const container = messagesContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const containerCenter = containerRect.height / 2;
    const elementTop = elementRect.top - containerRect.top + container.scrollTop;
    const targetScrollTop = Math.max(0, elementTop - containerCenter + (elementRect.height / 2));
    if (smooth) {
      container.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
    } else {
      container.scrollTop = targetScrollTop;
    }
  }, []);

  const isNearBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true;
    const c = messagesContainerRef.current;
    const threshold = 150;
    const dist = c.scrollHeight - c.scrollTop - c.clientHeight;
    return dist <= threshold;
  }, []);

  const handleAutoScroll = useCallback(() => {
    if (!isAutoScrollEnabled || userHasScrolled || !lastAssistantMessageRef.current) return;
    const el = lastAssistantMessageRef.current;
    const container = messagesContainerRef.current;
    if (!container || !el) return;
    const cr = container.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const below = er.top > cr.bottom - 30;
    if (below) scrollToCenter(el);
  }, [isAutoScrollEnabled, userHasScrolled, scrollToCenter]);

  const throttledAutoScroll = useCallback(() => {
    if (autoScrollTimeoutRef.current) return;
    autoScrollTimeoutRef.current = setTimeout(() => {
      handleAutoScroll();
      autoScrollTimeoutRef.current = undefined;
    }, 100);
  }, [handleAutoScroll]);

  const handleUserScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    const near = isNearBottom();
    if (near && userHasScrolled) {
      setUserHasScrolled(false);
      setIsAutoScrollEnabled(true);
    } else if (!near && !userHasScrolled) {
      setUserHasScrolled(true);
      setIsAutoScrollEnabled(false);
    }
  }, [isNearBottom, userHasScrolled]);

  useEffect(() => {
    const c = messagesContainerRef.current;
    if (!c) return;
    c.addEventListener('scroll', handleUserScroll);
    return () => c.removeEventListener('scroll', handleUserScroll);
  }, [handleUserScroll]);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.author === 'assistant' && last?.state === 'streaming') {
      setTimeout(() => {
        if (isAutoScrollEnabled && !userHasScrolled && lastAssistantMessageRef.current) {
          scrollToCenter(lastAssistantMessageRef.current);
        }
      }, 50);
    }
  }, [messages, isAutoScrollEnabled, userHasScrolled, scrollToCenter]);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.author === 'assistant' && last?.state === 'streaming') {
      const t = setInterval(throttledAutoScroll, 200);
      return () => clearInterval(t);
    }
  }, [messages, throttledAutoScroll]);

  useEffect(() => {
    return () => {
      if (autoScrollTimeoutRef.current) clearTimeout(autoScrollTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      streamAbort.current?.abort();
      streamAbort.current = null;
    };
  }, []);

  const handleSend = useCallback(async () => {
    const wasChatMissing = !effectiveChatId;

    if (composerState === 'streaming') return;
    const trimmed = message.trim();
    const hasFiles = attachedFiles.length > 0;
    const hasImages = attachedImages.length > 0;
    if (!trimmed && !hasFiles && !hasImages) {
      setComposerState('idle');
      return;
    }

    let targetChatId = effectiveChatId ?? null;
    if (!targetChatId) {
      if (!onCreateChat) return;
      try {
        targetChatId = await onCreateChat();
        lastCreatedChatIdRef.current = targetChatId;
        // На следующий апдейт chatId (когда родитель сделает setActiveChat)
        // НЕ сбрасываем состояние и не abort'им стрим.
        skipResetOnNextChatIdRef.current = targetChatId;
      } catch (error) {
        console.error('Failed to create chat for composer', error);
        setComposerState('idle');
        return;
      }
    }
    if (!targetChatId) return;

    let filesSnapshot = attachedFiles;
    const updateFiles = (updater: (prev: FilePinData[]) => FilePinData[]) => {
      setAttachedFiles((prev) => {
        const next = updater(prev);
        filesSnapshot = next;
        return next;
      });
    };

    const localFiles = filesSnapshot.filter((f) => f.state === 'local' && f.file);

    if (localFiles.length > 0) {
      setComposerState('streaming');

      for (const file of localFiles) {
        updateFiles((prev) =>
          prev.map((p) =>
            p.id === file.id ? { ...p, state: 'uploading', progress: p.progress ?? 0 } : p,
          ),
        );

        try {
          const uploaded = await uploadChatDocument(targetChatId, file.file as File, file.name);

          updateFiles((prev) =>
            prev.map((p) =>
              p.id === file.id
                ? {
                    ...p,
                    id: uploaded.id,
                    name: uploaded.file_name ?? p.name,
                    state: 'uploaded',
                    progress: 100,
                    file: undefined,
                  }
                : p,
            ),
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Не удалось загрузить файл';
          updateFiles((prev) =>
            prev.map((p) =>
              p.id === file.id ? { ...p, state: 'error', errorMessage } : p,
            ),
          );
        }
      }
    }

    const validFiles = filesSnapshot.filter((f) => f.state === 'uploaded');
    const hasUploadingDocument = validFiles.length > 0;

    const existing = messagesByChat[targetChatId] ?? [];
    const isFirstMessage = wasChatMissing || existing.length === 0;
    const timestamp = Date.now();

    const userMsg: UiMessage = {
      id: timestamp.toString(),
      author: 'user',
      text: trimmed,
      state: 'base',
      createdAt: timestamp,
      files: validFiles.length ? validFiles : undefined,
      images: attachedImages.map((img) => img.url),
    };

    if (isFirstMessage) {
      setFirstMessage(trimmed);
      setInputPosition('bottom');
      setIsModalOpen(true);
    }

    composerStateRef.current = 'streaming';
    setComposerState('streaming');
    setMessage('');
    setAttachedFiles([]);
    const imageKeysToSend = attachedImages.map((img) => img.key);
    setAttachedImages([]);

    upsertMessages(targetChatId, (prev) => [...prev, userMsg]);

    const assistantId = (timestamp + 1).toString();
    const assistantMsg: UiMessage = {
      id: assistantId,
      author: 'assistant',
      text: '',
      state: 'streaming',
      createdAt: Date.now(),
      hasUploadingDocument,
    };
    upsertMessages(targetChatId, (prev) => [...prev, assistantMsg]);

    streamAbort.current?.abort();
    const controller = new AbortController();
    streamAbort.current = controller;

    try {
      if (!user && (hasFiles || hasImages)) {
        const msgText =
          'Гостевой режим поддерживает только один текстовый запрос. Для документов и изображений нужно войти или зарегистрироваться.';
        toast.error(msgText);
        upsertMessages(targetChatId, (prev) => [
          ...prev,
          { id: crypto.randomUUID(), author: 'assistant', text: msgText, state: 'base', createdAt: Date.now() },
        ]);
        onAuthRequired?.(msgText);
        setComposerState('idle');
        return;
      }

      const streamOptions = { docs_only: hasFiles, image_keys: imageKeysToSend };
      if (user) {
        await sendMessageStream(
          targetChatId,
          trimmed,
          (delta) => {
            if (!delta) return;
            upsertMessages(targetChatId, (prev) =>
              prev.map((msg) =>
                msg.id === assistantId ? { ...msg, text: msg.text + delta } : msg,
              ),
            );
          },
          (exp) => {
            const exportFile: FilePinData = {
              id: exp.id,
              name: exp.file_name ?? (exp.kind === 'docx' ? 'export.docx' : 'export.xlsx'),
              type: exp.kind,
              size: exp.size_bytes ?? 0,
              state: 'mirrored',
              url: exp.download_url ?? `/api/exports/${exp.id}/download`,
            };

            upsertMessages(targetChatId, (prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? {
                      ...msg,
                      files: msg.files ? [...msg.files, exportFile] : [exportFile],
                    }
                  : msg,
              ),
            );
          },
          controller.signal,
          streamOptions,
        );
      } else {
        await sendGuestMessageStream(targetChatId, trimmed, (chunk) => {
          if (chunk.type === 'text') {
            upsertMessages(targetChatId, (prev) =>
              prev.map((msg) =>
                msg.id === assistantId ? { ...msg, text: msg.text + chunk.delta } : msg,
              ),
            );
          }
        });
      }

      upsertMessages(targetChatId, (prev) =>
        prev.map((msg) => (msg.id === assistantId ? { ...msg, state: 'base' } : msg)),
      );
      setComposerState('idle');

      // 🔄 Обновляем профиль, чтобы диаграмма "вопросов осталось" была актуальной
      if (user) {
        void refreshUser().catch((e) => {
          console.warn('Failed to refresh user after message send', e);
        });
      }

      if (isFirstMessage && !controller.signal.aborted) {
        setIsModalOpen(true);
      }
    } catch (error) {
      if (controller.signal.aborted) {
        upsertMessages(targetChatId, (prev) =>
          prev.map((msg) => (msg.id === assistantId ? { ...msg, state: 'base' } : msg)),
        );
        setComposerState('idle');
        return;
      }
      if (error instanceof ApiError && error.status === 400) {
        const detail = (error.data as any)?.detail ?? (error.data as any);
        const messageText =
          typeof detail === 'string'
            ? detail
            : 'Нужно либо ввести текст сообщения, либо прикрепить документ.';
        toast.error(messageText);
        upsertMessages(targetChatId, (prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, text: messageText, state: 'error' } : msg,
          ),
        );
        setComposerState('idle');
        return;
      }
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        const detail = (error.data as any)?.detail ?? (error.data as any);
        const messageText =
          typeof detail === 'string'
            ? detail
            : 'Для продолжения нужно войти или зарегистрироваться.';
        toast.error(messageText);
        upsertMessages(targetChatId, (prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, text: messageText, state: 'error' } : msg,
          ),
        );
        onAuthRequired?.(messageText);
        setComposerState('idle');
        return;
      }
      if (error instanceof ApiError && error.status === 429) {
        const detail = (error.data as any)?.detail ?? error.data ?? {};
        const code = typeof detail?.code === 'string' ? detail.code : undefined;
        const retryAfter =
          typeof detail?.retry_after_seconds === 'number' ? detail.retry_after_seconds : undefined;

        const rawMessage =
          typeof detail?.message === 'string'
            ? detail.message
            : '';

        const isTemporaryRateLimit =
          code === 'rate_limit_exceeded' ||
          typeof retryAfter === 'number' ||
          rawMessage.toLowerCase().includes('слишком много сообщений');

        const messageText = isTemporaryRateLimit
          ? `${rawMessage || RATE_LIMIT_MESSAGE}${retryAfter ? ` Попробуйте снова примерно через ${retryAfter} сек.` : ''}`
          : rawMessage || 'Баланс пустой. Пополни кошелёк — продолжишь работу.';

        const usedCount = typeof detail?.used === 'number' ? detail.used : undefined;
        const limitCount = typeof detail?.limit === 'number' ? detail.limit : undefined;

        setLimitNotice({
          kind: isTemporaryRateLimit ? 'rate' : 'quota',
          title: isTemporaryRateLimit ? 'Слишком много сообщений' : 'Баланс пустой',
          message: messageText,
          used: usedCount,
          limit: limitCount,
        });
        upsertMessages(targetChatId, (prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, text: messageText, state: 'error' } : msg,
          ),
        );
        setComposerState('idle');
        return;
      }
      console.error('Failed to stream assistant response', error);
      const fallback =
        error instanceof Error && error.message
          ? error.message
          : 'Произошла ошибка. Попробуйте ещё раз.';
      toast.error(fallback);
      upsertMessages(targetChatId, (prev) =>
        prev.map((msg) =>
          msg.id === assistantId ? { ...msg, text: fallback, state: 'error' } : msg,
        ),
      );
      setComposerState('error');
    } finally {
      if (streamAbort.current === controller) {
        streamAbort.current = null;
      }
    }
  }, [
    attachedFiles,
    attachedImages,
    chatId,
    composerState,
    message,
    messagesByChat,
    onCreateChat,
    onAuthRequired,
    setAttachedFiles,
    setAttachedImages,
    setComposerState,
    setFirstMessage,
    setInputPosition,
    setIsModalOpen,
    setMessage,
    upsertMessages,
    user,
  ]);

  const handleStop = () => {
    streamAbort.current?.abort();
    setComposerState('idle');
  };
  const handleRetry = () => {
    setComposerState('idle');
    void handleSend();
  };

  const handleFileAttach = (files: FileList) => {
    const newFiles: FilePinData[] = Array.from(files).map((file, index) => {
      const fileId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${index}`;
      const extension = file.name.toLowerCase().split('.').pop() ?? '';
      const isOversize = file.size > 20 * 1024 * 1024;
      const isWrongType = !ALLOWED_FILE_EXTENSIONS.includes(extension);

      let state: FilePinData['state'] = 'local';
      let errorMessage: string | undefined;

      if (isOversize) {
        state = 'oversize';
        errorMessage = 'Файл слишком большой (максимум 20 МБ)';
      } else if (isWrongType) {
        state = 'wrong-type';
        errorMessage = 'Формат не поддерживается';
      }

      return {
        id: fileId,
        name: file.name,
        type: detectFileType(file.name),
        size: file.size,
        state,
        file: state === 'local' ? file : undefined,
        errorMessage,
      };
    });

    setAttachedFiles(prev => [...prev, ...newFiles]);
  };
  const handleFileRemove = (fileId: string) => setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  const handleFileDownload = (fileId: string) => {
    const msgFile = messages.flatMap((m) => m.files ?? []).find((f) => f.id === fileId);
    const url = msgFile?.url ?? `/api/exports/${fileId}/download`;

    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const handleAttachImage = useCallback(async (file: File) => {
    if (!canUploadImages) {
      toast.info('Чтобы прикреплять изображения — войдите или зарегистрируйтесь.');
      onAuthRequired?.('images');
      return;
    }

    if (attachedImages.length >= MAX_IMAGE_ATTACH) {
      toast.info(`Можно прикрепить максимум ${MAX_IMAGE_ATTACH} изображения.`);
      return;
    }

    let targetChatId = effectiveChatId ?? null;
    if (!targetChatId) {
      if (!onCreateChat) {
        toast.error('Сначала создайте чат, чтобы прикрепить изображение.');
        return;
      }
      try {
        targetChatId = await onCreateChat();
        lastCreatedChatIdRef.current = targetChatId;
        skipResetOnNextChatIdRef.current = targetChatId;
      } catch (error) {
        console.error('Failed to create chat for image upload', error);
        toast.error('Не удалось создать чат для загрузки изображения.');
        return;
      }
    }
    if (!targetChatId) return;

    try {
      const uploaded = await uploadChatImage(targetChatId, file, attachedImages.length);
      setAttachedImages((prev) => [...prev, { key: uploaded.key, url: uploaded.url, name: uploaded.name }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить изображение';
      toast.error(errorMessage);
    }
  }, [attachedImages.length, canUploadImages, effectiveChatId, onAuthRequired, onCreateChat]);
  const handleRemoveImage = useCallback((key: string) => {
    setAttachedImages((prev) => prev.filter((img) => img.key !== key));
  }, []);
  // блокируем отправку по Enter, если чата ещё нет и нельзя создать
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!effectiveChatId && !onCreateChat) return;
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void handleSend(); }
  };

  // Модалка «назовите чат»
  const handleChatNameConfirm = async (title: string) => {
    if (isRenaming) return;
    const trimmed = title.trim();
    if (!trimmed || !onRenameChat) return;
    if (!effectiveChatId) return;

    try {
      setIsRenaming(true);
      await onRenameChat(effectiveChatId, trimmed);
      setIsModalOpen(false);
    } finally {
      setIsRenaming(false);
    }
  };
  const handleModalClose = () => setIsModalOpen(false);

  // Рендер
  return (
    <div className={`flex-1 min-w-0 overflow-x-hidden ${className}`}>
      <Card className="h-full min-h-[calc(100vh-5rem)] flex flex-col shadow-card relative overflow-hidden min-w-0">
        {/* Сообщения */}
        {!!effectiveChatId && !isEmpty && (
          <div ref={messagesContainerRef} className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-6">
              {messages.map((msg, idx) => {
                const prev = messages[idx - 1];
                const isSame = prev && prev.author === msg.author;
                const isLastAssistant = msg.author === 'assistant' && idx === messages.length - 1;
                return (
                  <div
                    key={msg.id}
                    ref={isLastAssistant ? lastAssistantMessageRef : undefined}
                    className={idx === 0 ? '' : isSame ? 'mt-2' : 'mt-5'}
                  >
                    <MessageBubble message={msg} onFileDownload={handleFileDownload} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Пустой/не выбранный чат — ввод по центру */}
        {isEmpty && !!effectiveChatId && !showWelcome && (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3 px-6 text-center">
            <div>Напишите сообщение, чтобы начать диалог</div>
            {!user && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button variant="ghost" className={CTA_ANIM} onClick={() => onOpenLogin?.()}>
                  Войти
                </Button>
                <Button variant="outline" className={CTA_ANIM} onClick={() => onOpenRegistration?.()}>
                  Регистрация
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Empty чат: welcome + композер в одном центре, без absolute */}
        {showWelcome && (
          <div
            className="absolute left-1/2 z-10 px-6 text-center pointer-events-none"
            style={{ top: "calc(50% - 96px)", transform: "translateX(-50%)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="font-normal text-foreground/80 text-center"
              style={{
                fontSize: "clamp(12px, 3.4vw, 20px)",
                lineHeight: "1.25",
              }}
            >
              {/* Desktop: как было (одной строкой/естественно) */}
              <span className="hidden sm:inline">
                {WELCOME_TITLE} PRO{WELCOME_SUBTITLE?.trim() ? `, ${WELCOME_SUBTITLE}` : ""}
              </span>

              {/* Mobile: строго 2 строки, без дальнейших переносов */}
              <span className="sm:hidden">
                <span className="whitespace-nowrap">{WELCOME_TITLE} PRO,</span>
                <br />
                <span className="whitespace-nowrap">{WELCOME_SUBTITLE}</span>
              </span>
            </motion.div>
          </div>
        )}

        {/* Composer с интегрированными FilePins (позиция: центр, если чат пуст) */}
        <Composer
          message={message}
          onChange={setMessage}
          onSend={() => { void handleSend(); }}
          onStop={handleStop}
          onRetry={handleRetry}
          onKeyPress={handleKeyPress}
          position={(!effectiveChatId || isEmpty) ? 'centered' : inputPosition}
          state={composerState}
          isDark={isDark}
          setIsDark={setIsDark}
          attachedFiles={attachedFiles}
          onFileAttach={handleFileAttach}
          onFileRemove={handleFileRemove}
          onFileDownload={handleFileDownload}
          onAttachmentRequest={handleAttachmentRequest}
          onImageAttach={handleAttachImage}
          onImageRemove={handleRemoveImage}
          onImageAttachmentRequest={handleImageAttachmentRequest}
          attachedImages={attachedImages}
          maxFiles={3}
          maxImages={MAX_IMAGE_ATTACH}
          chatId={effectiveChatId}
          disabled={!effectiveChatId && !onCreateChat}
        />

        {/* Модалка для имени чата (после первого сообщения) */}
        <ModalNameChat
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handleChatNameConfirm}
          initialMessage={firstMessage}
          isSaving={isRenaming}
        />

        <Dialog
          open={limitNotice !== null}
          onOpenChange={(open) => {
            if (!open) {
              setLimitNotice(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{limitNotice?.title ?? 'Баланс пустой'}</DialogTitle>
              <DialogDescription>
                {limitNotice?.kind === 'rate'
                  ? (limitNotice?.message ?? 'Слишком много сообщений за короткое время. Попробуй через несколько секунд.')
                  : (limitNotice?.message
                      ?? 'Баланс пустой. Пополни кошелёк — продолжишь работу.')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end gap-2">
              {limitNotice?.kind === 'rate' ? (
                <Button onClick={() => setLimitNotice(null)}>
                  Понятно
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setLimitNotice(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Закрыть
                  </Button>
                  <Button
                    onClick={() => {
                      setLimitNotice(null);
                      handleNavigateToPricing();
                    }}
                  >
                    Пополнить кошелёк
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
