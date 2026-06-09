import React, { useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { FilePinList, FilePinData } from './FilePin';
import { Paperclip, ArrowUp, Sun, Moon, Square, RotateCcw, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReportProblemFab } from './ReportProblemFab';

// Types for different states
export type ComposerState = 'idle' | 'typing' | 'streaming' | 'error' | 'attachLimit';

// Use FilePinData instead of AttachedFile
export type { FilePinData as AttachedFile } from './FilePin';

interface ComposerProps {
  message: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop?: () => void;
  onRetry?: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  position: 'centered' | 'bottom';
  state?: ComposerState;
  disabled?: boolean;
  isDark?: boolean;
  setIsDark?: (isDark: boolean) => void;
  attachedFiles?: AttachedFile[];
  onFileAttach?: (files: FileList) => void;
  onFileRemove?: (fileId: string) => void;
  onFileDownload?: (fileId: string) => void;
  onAttachmentRequest?: () => boolean | void;
  onImageAttach?: (file: File) => void;
  onImageRemove?: (key: string) => void;
  onImageAttachmentRequest?: () => boolean | void;
  attachedImages?: Array<{ key: string; url: string; name?: string }>;
  errorMessage?: string;
  maxFiles?: number;
  maxImages?: number;
  chatId?: string | null;
}

// File preview is now handled by FilePinList component

export function Composer({ 
  message, 
  onChange, 
  onSend, 
  onStop,
  onRetry,
  onKeyPress, 
  position, 
  state = 'idle',
  disabled = false, 
  isDark, 
  setIsDark,
  attachedFiles = [],
  onFileAttach,
  onFileRemove,
  onFileDownload,
  onAttachmentRequest,
  onImageAttach,
  onImageRemove,
  onImageAttachmentRequest,
  attachedImages = [],
  errorMessage = 'Не удалось отправить. Повторить?',
  maxFiles = 3, // Ограничиваем до 3 файлов
  maxImages = 4,
  chatId,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const previousMessageRef = useRef<string>(message);

  const isStreaming = state === 'streaming';
  const isError = state === 'error';
  const isAttachDisabled =
    state === 'attachLimit' || attachedFiles.length >= maxFiles || isStreaming || disabled;
  const isImageAttachDisabled = isStreaming || disabled || attachedImages.length >= maxImages;
  const hasText = message.trim().length > 0;
  const hasFiles = attachedFiles.length > 0;
  const hasImages = attachedImages.length > 0;
  const isSendDisabled = disabled || isStreaming || (!hasText && !hasFiles && !hasImages);

  // Smooth height reset animation after message is sent
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Check if message was cleared (sent)
    const wasCleared = previousMessageRef.current.trim().length > 0 && message.trim().length === 0;
    
    if (wasCleared) {
      // Add smooth transition
      textarea.style.transition = 'height 150ms ease-out';
      textarea.style.height = '28px'; // Minimum height
      
      // Remove transition after animation completes
      const cleanup = setTimeout(() => {
        textarea.style.transition = '';
      }, 200);
      
      return () => clearTimeout(cleanup);
    }
    
    // Update previous message reference
    previousMessageRef.current = message;
  }, [message]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    
    // Auto-resize textarea (disable transition during typing)
    const textarea = e.target;
    textarea.style.transition = '';
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onKeyPress(e);
    }
  };

  const handleFileAttach = () => {
    const shouldOpenPicker = onAttachmentRequest ? onAttachmentRequest() !== false : true;
    if (!isAttachDisabled && fileInputRef.current && shouldOpenPicker) {
      fileInputRef.current.click();
    }
  };

  const handleImageAttach = () => {
    const shouldOpenPicker = onImageAttachmentRequest ? onImageAttachmentRequest() !== false : true;
    if (!isImageAttachDisabled && imageInputRef.current && shouldOpenPicker) {
      imageInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    onFileAttach?.(files);
    e.target.value = '';
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (!onImageAttach) return;
    if (isImageAttachDisabled) return;
    if (attachedImages.length >= maxImages) return;

    const items = e.clipboardData?.items;
    if (!items || items.length === 0) return;

    const imageItem = Array.from(items).find(
      (it) => it.kind === 'file' && it.type.startsWith('image/')
    );

    if (!imageItem) return;

    const file = imageItem.getAsFile();
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const maxBytes = 10 * 1024 * 1024;

    if (!allowed.includes(file.type)) {
      e.preventDefault();
      return;
    }

    if (file.size > maxBytes) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    const ext =
      file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';

    const named = new File([file], `pasted.${ext}`, { type: file.type });

    onImageAttach(named);
  };

  const handleSendClick = () => {
    if (isStreaming && onStop) {
      onStop();
    } else if (!disabled && (hasText || hasFiles || hasImages)) {
      onSend();
    }
  };

  const baseClasses = `
    transition-all duration-300 ease-out
    ${position === 'centered' 
      ? 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[40%] w-full max-w-2xl px-6' 
      : 'border-t p-6'
    }
  `;

  const attachTooltipText = isAttachDisabled
    ? state === 'attachLimit' || attachedFiles.length >= maxFiles
      ? 'Лимит вложений исчерпан'
      : 'Недоступно во время ответа'
    : 'Прикрепить файл';

  const imageAttachTooltipText = isImageAttachDisabled
    ? attachedImages.length >= maxImages
      ? 'Лимит изображений исчерпан'
      : 'Недоступно во время ответа'
    : 'Прикрепить изображение';

  return (
    <div className={baseClasses}>
      <div className="w-full max-w-[880px] mx-auto px-4 md:px-0">

        {/* Main container with files and input */}
        <div className={`
          bg-card border border-border
          rounded-[14px] md:rounded-[16px]
          shadow-card
          transition-all duration-200 ease-out
          hover:border-muted
          focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]
          ${disabled ? 'opacity-60' : ''}
          overflow-hidden
        `}>
          {/* File pins section */}
          <AnimatePresence>
            {attachedFiles.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="border-b border-border"
              >
                <div className="p-3">
                  <FilePinList
                    files={attachedFiles}
                    onRemove={onFileRemove}
                    onDownload={onFileDownload}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image preview section */}
          <AnimatePresence>
            {attachedImages.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="border-b border-border"
              >
                <div className="p-3">
                  <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
                    {attachedImages.map((img) => (
                      <div
                        key={img.key}
                        className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted"
                        title={img.name ?? 'image'}
                      >
                        <img
                          src={img.url}
                          alt={img.name ?? 'attached image'}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        {!!onImageRemove && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onImageRemove(img.key);
                            }}
                            style={{
                              position: 'absolute',
                              right: 4,
                              top: 4,
                              zIndex: 50,
                              width: 24,
                              height: 24,
                              borderRadius: 9999,
                              background: 'rgba(0,0,0,0.75)',
                              color: '#fff',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              pointerEvents: 'auto',
                            }}
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input row */}
          <div className={`
            flex items-end gap-3 p-3 md:p-[10px_12px]
            min-h-[52px] md:min-h-[56px]
          `}>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.rtf,.md,.csv"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImageAttach?.(file);
              e.currentTarget.value = '';
            }}
          />

          {/* Attachment button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className={`
                    flex-shrink-0 w-9 h-9 rounded-[10px] 
                    flex items-center justify-center
                    transition-all duration-200
                    ${isAttachDisabled
                      ? 'text-muted-foreground/50 cursor-not-allowed'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer'
                    }
                  `}
                  onClick={handleFileAttach}
                  disabled={isAttachDisabled}
                  title={attachTooltipText}
                >
                  <Paperclip className="w-[18px] h-[18px] md:w-5 md:h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{attachTooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Image attach button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`
                    flex-shrink-0 w-9 h-9 rounded-[10px]
                    flex items-center justify-center
                    transition-all duration-200
                    ${isImageAttachDisabled
                      ? 'text-muted-foreground/50 cursor-not-allowed'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer'
                    }
                  `}
                  onClick={handleImageAttach}
                  disabled={isImageAttachDisabled}
                  title={imageAttachTooltipText}
                >
                  <ImageIcon className="w-[18px] h-[18px] md:w-5 md:h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{imageAttachTooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* Textarea container */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              placeholder="Напишите сообщение…"
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              className={`
                w-full min-h-[28px] max-h-[120px] 
                bg-transparent border-0 outline-none resize-none
                text-foreground placeholder:text-muted-foreground
                text-base leading-[24px]
                ${disabled ? 'cursor-not-allowed' : ''}
              `}
              rows={1}
              disabled={disabled}
              autoFocus={position === 'centered'}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--scrollbar-thumb) transparent'
              }}
            />
          </div>



          {/* Send/Stop button */}
          <button
            className={`
              flex-shrink-0 w-9 h-9 rounded-full
              flex items-center justify-center
              transition-all duration-200 ease-out
              active:scale-95 active:duration-[120ms]
              ${isSendDisabled && !isStreaming
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : isStreaming
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80'
              }
            `}
            disabled={isSendDisabled}
            onClick={handleSendClick}
          >
            {isStreaming ? (
              <Square className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            ) : (
              <ArrowUp className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            )}
          </button>
          </div>
        </div>

        {/* Error message and retry */}
        <AnimatePresence>
          {isError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-xl"
            >
              <span className="text-sm text-destructive">{errorMessage}</span>
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  className="ml-3 border-destructive/20 text-destructive hover:bg-destructive/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Повторить
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* File support hint (only when no files and position is bottom) */}
        {position === 'bottom' && !hasFiles && !isError && (
          <div className="mt-3 flex items-center justify-between gap-3">
            <ReportProblemFab variant="link" />
            <div className="text-xs text-muted-foreground flex-1">
              Поддерживаемые файлы: .pdf, .docx, .xlsx, .csv и другие до 20 МБ • Максимум 3 файла
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
