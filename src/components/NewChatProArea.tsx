import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMarkdown } from './ChatMarkdown';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Composer, ComposerState } from './Composer';
import { FilePinList, FilePinData } from './FilePin';
import { ModalNameChat } from './ModalNameChat';
import { copyToClipboard, isCopySupported } from './ui/copy-utils';
import { Bot, User, AlertTriangle, Copy, CheckCircle, Crown, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message, Author, MessageState } from '../types/chat';
import { uploadChatDocument } from '@/lib/api';

// Message interface moved to types/chat.ts

interface NewChatProAreaProps {
  className?: string;
  onChatCreated?: (chatName: string, firstMessage: string) => void;
  isDark?: boolean;
  setIsDark?: (isDark: boolean) => void;
  chatId?: string | null;
}

function softFormat(s: string): string {
  if (s.includes('```')) return s.trim();

  let t = s;
  t = t.replace(/([^\n])\s+(-\s+)/g, '$1\n$2');
  t = t.replace(/([^\n])\s+(\d+[.)]\s+)/g, '$1\n$2');
  t = t.replace(/([^\n])\s+(—\s+)/g, '$1\n$2');
  t = t.replace(/\n{3,}/g, '\n\n');
  t = t.replace(/\n{2,}\s*\n+/g, '\n\n');
  t = t.replace(/\n\n—\s+/g, '\n— ');
  t = t.replace(/[ \t]{2,}/g, ' ');
  return t.trim();
}

const BASE_THINKING_TEXT = 'Думаю над ответом…';
const PRO_ALLOWED_FILE_EXTENSIONS = ['docx', 'xlsx', 'csv', 'pdf', 'txt', 'json'];

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

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    if (phrases.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentPhraseIndex(prev => (prev + 1) % phrases.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={currentPhraseIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="text-muted-foreground italic text-base"
        style={{ lineHeight: '1.6' }}
      >
        {phrases[currentPhraseIndex]}
      </motion.p>
    </AnimatePresence>
  );
}

function detectProFileType(fileName: string): FilePinData['type'] {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.xlsx')) return 'xlsx';
  if (lower.endsWith('.csv')) return 'csv';
  if (lower.endsWith('.docx')) return 'docx';
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.txt')) return 'txt';
  if (lower.endsWith('.json')) return 'json';
  return 'unknown';
}

function MessageBubble({ message, onFileDownload }: {
  message: Message;
  onFileDownload?: (fileId: string) => void;
}) {
  const { author, text, state, files } = message;
  const isUser = author === 'user';
  const isAssistant = author === 'assistant';
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [showTextToCopy, setShowTextToCopy] = useState(false);
  const textRef = React.useRef<HTMLDivElement>(null);
  
  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setCopyFailed(false);
      setShowTextToCopy(false);
      setTimeout(() => setCopied(false), 2000);
    } else {
      // Show text selection as last resort and auto-select text
      setShowTextToCopy(true);
      setCopyFailed(false);
      setTimeout(() => setShowTextToCopy(false), 5000);
      
      // Try to select the text for user convenience
      if (textRef.current) {
        try {
          const range = document.createRange();
          range.selectNodeContents(textRef.current);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        } catch {
          // Ignore selection errors
        }
      }
    }
  };
  
  const isError = state === 'error';
  const isStreaming = state === 'streaming';
  const rawText = text || '';
  // Не используем softFormat для ассистента, сохраняем исходный Markdown.
  const displayText = rawText;

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
          {isStreaming ? (
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

              {/* Mirrored files in message */}
              {files && files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file) => {
                    const mirroredFile: FilePinData = {
                      ...file,
                      state: 'mirrored'
                    };
                    return (
                      <div key={file.id} className="max-w-[300px]">
                        <FilePinList
                          files={[mirroredFile]}
                          onDownload={onFileDownload}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
          
          {/* Copy button */}
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
          
          {/* Copy feedback indicators */}
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute -top-8 right-0 bg-card border border-border rounded-md px-2 py-1 text-xs text-muted-foreground shadow-sm"
            >
              Скопировано!
            </motion.div>
          )}
          {copyFailed && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute -top-8 right-0 bg-destructive/10 border border-destructive/20 rounded-md px-2 py-1 text-xs text-destructive shadow-sm"
            >
              Не удалось скопировать
            </motion.div>
          )}
          {showTextToCopy && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute -top-8 right-0 bg-accent/10 border border-accent/20 rounded-md px-2 py-1 text-xs text-accent shadow-sm whitespace-nowrap"
            >
              Выделите текст → Ctrl+C
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

// Plus Status indicator for empty chat state
function PlusStatusIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-10"
    >
      <Badge 
        variant="default" 
        className="bg-gradient-to-r from-brand to-accent text-primary-foreground border-0 gap-2 px-4 py-2 shadow-card"
      >
        <CheckCircle className="w-4 h-4" />
        Лимитов хватает
      </Badge>
    </motion.div>
  );
}

export function NewChatProArea({ className = '', onChatCreated, isDark, setIsDark, chatId = null }: NewChatProAreaProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputPosition, setInputPosition] = useState<'centered' | 'bottom'>('centered');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstMessage, setFirstMessage] = useState('');
  const [composerState, setComposerState] = useState<ComposerState>('idle');
  const [attachedFiles, setAttachedFiles] = useState<FilePinData[]>([]);
  
  // Auto-scroll refs and state
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastAssistantMessageRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout>();

  const isEmpty = messages.length === 0;

  // Auto-scroll functions
  const scrollToCenter = useCallback((element: HTMLElement, smooth = true) => {
    if (!messagesContainerRef.current) return;

    const container = messagesContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    // Calculate the center position
    const containerCenter = containerRect.height / 2;
    const elementTop = elementRect.top - containerRect.top + container.scrollTop;
    const targetScrollTop = elementTop - containerCenter + (elementRect.height / 2);
    
    // Ensure we don't scroll above the top
    const finalScrollTop = Math.max(0, targetScrollTop);
    
    if (smooth) {
      container.scrollTo({
        top: finalScrollTop,
        behavior: 'smooth'
      });
    } else {
      container.scrollTop = finalScrollTop;
    }
  }, []);

  const isNearBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true;
    
    const container = messagesContainerRef.current;
    const threshold = 150; // 150px from bottom
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    
    return distanceFromBottom <= threshold;
  }, []);

  const handleAutoScroll = useCallback(() => {
    if (!isAutoScrollEnabled || userHasScrolled || !lastAssistantMessageRef.current) return;

    // Check if the last assistant message is visible
    const element = lastAssistantMessageRef.current;
    const container = messagesContainerRef.current;
    
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    // Check if message start is below the visible area
    const isMessageStartBelowView = elementRect.top > containerRect.bottom - 30;
    
    if (isMessageStartBelowView) {
      scrollToCenter(element);
    }
  }, [isAutoScrollEnabled, userHasScrolled, scrollToCenter]);

  // Throttled auto-scroll during streaming
  const throttledAutoScroll = useCallback(() => {
    if (autoScrollTimeoutRef.current) return;
    
    autoScrollTimeoutRef.current = setTimeout(() => {
      handleAutoScroll();
      autoScrollTimeoutRef.current = undefined;
    }, 100); // 100ms throttling
  }, [handleAutoScroll]);

  // Handle user scroll detection
  const handleUserScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    
    const nearBottom = isNearBottom();
    
    if (nearBottom && userHasScrolled) {
      // User scrolled back to bottom, re-enable auto-scroll
      setUserHasScrolled(false);
      setIsAutoScrollEnabled(true);
    } else if (!nearBottom && !userHasScrolled) {
      // User scrolled away from bottom, disable auto-scroll
      setUserHasScrolled(true);
      setIsAutoScrollEnabled(false);
    }
  }, [isNearBottom, userHasScrolled]);

  // Set up scroll listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleUserScroll);
    return () => container.removeEventListener('scroll', handleUserScroll);
  }, [handleUserScroll]);

  // Auto-scroll when new streaming message is added
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.author === 'assistant' && lastMessage?.state === 'streaming') {
      // Small delay to ensure the DOM is updated
      setTimeout(() => {
        if (isAutoScrollEnabled && !userHasScrolled && lastAssistantMessageRef.current) {
          scrollToCenter(lastAssistantMessageRef.current);
        }
      }, 50);
    }
  }, [messages, isAutoScrollEnabled, userHasScrolled, scrollToCenter]);

  // Periodic auto-scroll during streaming
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.author === 'assistant' && lastMessage?.state === 'streaming') {
      const interval = setInterval(throttledAutoScroll, 200);
      return () => clearInterval(interval);
    }
  }, [messages, throttledAutoScroll]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
    };
  }, []);

  const handleSend = async () => {
    if (composerState === 'streaming') return;

    const trimmed = message.trim();
    let filesSnapshot = attachedFiles;
    const updateFiles = (updater: (prev: FilePinData[]) => FilePinData[]) => {
      setAttachedFiles((prev) => {
        const next = updater(prev);
        filesSnapshot = next;
        return next;
      });
    };

    const localFiles = filesSnapshot.filter((file) => file.state === 'local' && file.file);

    if (localFiles.length > 0) {
      if (!chatId) {
        updateFiles((prev) =>
          prev.map((file) =>
            file.state === 'local'
              ? {
                  ...file,
                  state: 'error',
                  errorMessage: 'Нельзя загрузить файл без выбранного чата',
                }
              : file,
          ),
        );
      } else {
        setComposerState('streaming');

        for (const file of localFiles) {
          updateFiles((prev) =>
            prev.map((p) =>
              p.id === file.id ? { ...p, state: 'uploading', progress: p.progress ?? 0 } : p,
            ),
          );

          try {
            const uploaded = await uploadChatDocument(chatId, file.file as File, file.name);

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
    }

    const validFiles = filesSnapshot.filter((f) => f.state === 'uploaded');
    const hasUploadingDocument = validFiles.length > 0;

    if (!trimmed && validFiles.length === 0) {
      setComposerState('idle');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      author: 'user',
      text: trimmed,
      state: 'base',
      createdAt: Date.now(),
      files: validFiles.length > 0 ? validFiles : undefined,
    };

    if (isEmpty) {
      setFirstMessage(trimmed);
      setComposerState('streaming');

      setTimeout(() => {
        setInputPosition('bottom');
        setMessages([userMessage]);

        setTimeout(() => {
          const streamingMessage: Message = {
            id: (Date.now() + 1).toString(),
            author: 'assistant',
            text: '',
            state: 'streaming',
            createdAt: Date.now(),
            hasUploadingDocument,
          };
          setMessages((prev) => [...prev, streamingMessage]);

          setTimeout(() => {
            const finalMessage: Message = {
              id: streamingMessage.id,
              author: 'assistant',
              text: 'Привет! Добро пожаловать в Plus версию! 🔥 Здесь все возможности разблокированы.',
              state: 'base',
              createdAt: Date.now(),
            };
            setMessages((prev) =>
              prev.map((msg) => (msg.id === streamingMessage.id ? finalMessage : msg)),
            );
            setComposerState('idle');
            setIsModalOpen(true);
          }, 3000);
        }, 300);
      }, 50);
    } else {
      setComposerState('streaming');
      setMessages((prev) => [...prev, userMessage]);

      const streamingId = (Date.now() + 1).toString();
      const streamingMessage: Message = {
        id: streamingId,
        author: 'assistant',
        text: '',
        state: 'streaming',
        createdAt: Date.now(),
        hasUploadingDocument,
      };
      setMessages((prev) => [...prev, streamingMessage]);

      setTimeout(() => {
        const isError = Math.random() < 0.05;

        if (isError) {
          setComposerState('error');
          const errorMessage: Message = {
            id: streamingId,
            author: 'assistant',
            text: 'Произошла ошибка. Попробуйте ещё раз.',
            state: 'error',
            createdAt: Date.now(),
          };
          setMessages((prev) => prev.map((msg) => (msg.id === streamingId ? errorMessage : msg)));
        } else {
          setComposerState('idle');
          const finalMessage: Message = {
            id: streamingId,
            author: 'assistant',
            text: 'Отлично! Plus версия работает быстрее и с расширенными возможностями! ⚡',
            state: 'base',
            createdAt: Date.now(),
          };
          setMessages((prev) => prev.map((msg) => (msg.id === streamingId ? finalMessage : msg)));
        }
      }, 2500);
    }

    setMessage('');
    setAttachedFiles([]);
  };

  const handleStop = () => {
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

      const isOversize = file.size > 50 * 1024 * 1024; // 50MB limit in Plus
      const isWrongType = !PRO_ALLOWED_FILE_EXTENSIONS.includes(extension);

      let state: FilePinData['state'] = 'local';
      let errorMessage: string | undefined;

      if (isOversize) {
        state = 'oversize';
        errorMessage = 'Файл слишком большой (максимум 50 МБ в Plus)';
      } else if (isWrongType) {
        state = 'wrong-type';
        errorMessage = 'Формат не поддерживается';
      }

      return {
        id: fileId,
        name: file.name,
        type: detectProFileType(file.name),
        size: file.size,
        state,
        file: state === 'local' ? file : undefined,
        errorMessage,
      };
    });

    setAttachedFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileRemove = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleFileDownload = (fileId: string) => {
    const msgFile = messages.flatMap((m) => m.files ?? []).find((f) => f.id === fileId);
    const url = msgFile?.url ?? `/api/exports/${fileId}/download`;

    window.open(url, '_blank');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleChatNameConfirm = (chatName: string) => {
    setIsModalOpen(false);
    onChatCreated?.(chatName, firstMessage);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`flex-1 min-w-0 overflow-x-hidden ${className}`}>
      <Card className="h-full min-h-[calc(100vh-5rem)] flex flex-col shadow-card relative overflow-hidden">
        {/* Chat messages area */}
        {!isEmpty && (
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
          >
            <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-6">
              {messages.map((msg, index) => {
                const previousMsg = messages[index - 1];
                const isSameAuthor = previousMsg && previousMsg.author === msg.author;
                const isLastAssistantMessage = msg.author === 'assistant' && 
                  index === messages.length - 1;
                
                return (
                  <div 
                    key={msg.id} 
                    ref={isLastAssistantMessage ? lastAssistantMessageRef : undefined}
                    className={
                      index === 0 
                        ? '' 
                        : isSameAuthor 
                          ? 'mt-2' // 8px между сообщениями одного автора
                          : 'mt-5' // 20px между сообщениями разных авторов
                    }
                  >
                    <MessageBubble 
                      message={msg} 
                      onFileDownload={handleFileDownload}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Plus Status indicator - only show when chat is empty */}
        {isEmpty && <PlusStatusIndicator />}

        {/* Composer с встроенными FilePins */}
        <Composer
          message={message}
          onChange={setMessage}
          onSend={handleSend}
          onStop={handleStop}
          onRetry={handleRetry}
          onKeyPress={handleKeyPress}
          position={inputPosition}
          state={composerState}
          isDark={isDark}
          setIsDark={setIsDark}
          attachedFiles={attachedFiles}
          onFileAttach={handleFileAttach}
          onFileRemove={handleFileRemove}
          onFileDownload={handleFileDownload}
          chatId={chatId}
          maxFiles={10} // Higher limit in Plus
        />

        {/* Modal for chat naming */}
        <ModalNameChat
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handleChatNameConfirm}
          initialMessage={firstMessage}
        />
      </Card>
    </div>
  );
}
