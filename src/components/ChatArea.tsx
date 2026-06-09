import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Paperclip, Send } from 'lucide-react';
import { Message } from '../types/chat';

interface ChatAreaProps {
  className?: string;
}

export function ChatArea({ className = '' }: ChatAreaProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const previousMessageRef = useRef<string>(message);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        author: 'user',
        text: message.trim(),
        state: 'base',
        createdAt: Date.now()
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea (disable transition during typing)
    const textarea = e.target;
    textarea.style.transition = '';
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const isEmpty = messages.length === 0;

  // Smooth height reset animation after message is sent
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Check if message was cleared (sent)
    const wasCleared = previousMessageRef.current.trim().length > 0 && message.trim().length === 0;
    
    if (wasCleared) {
      // Add smooth transition
      textarea.style.transition = 'height 150ms ease-out';
      textarea.style.height = '54px'; // Minimum height for this component
      
      // Remove transition after animation completes
      const cleanup = setTimeout(() => {
        textarea.style.transition = '';
      }, 200);
      
      return () => clearTimeout(cleanup);
    }
    
    // Update previous message reference
    previousMessageRef.current = message;
  }, [message]);

  return (
    <div className={`flex-1 ${className}`}>
      <Card className="h-full min-h-[calc(100vh-5rem)] flex flex-col shadow-card">
        {/* Chat content */}
        <div className="flex-1 flex flex-col">
          {isEmpty ? (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <h1 className="mb-4">AI Авитолог PRO</h1>
              <p className="text-muted-foreground mb-12 max-w-md">
                Готов помочь с анализом ниш и оптимизацией объявлений
              </p>
            </div>
          ) : (
            /* Messages */
            <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
              {/* Render messages here when needed */}
            </div>
          )}
        </div>

        {/* Message composer */}
        <div className="border-t p-6" id="composer">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            {/* Attachment button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-shrink-0 w-12 h-11 hover:bg-accent/50 border-border hover:border-brand/30"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            {/* Textarea */}
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                placeholder="Напишите сообщение…"
                value={message}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                className="min-h-[54px] max-h-[120px] resize-none border-0 bg-input-background focus:ring-2 focus:ring-brand rounded-xl"
                rows={1}
              />
            </div>

            {/* Send button */}
            <Button 
              size="sm" 
              className="flex-shrink-0 w-12 h-11 bg-brand hover:bg-brand/90 text-white disabled:bg-muted disabled:text-muted-foreground"
              disabled={!message.trim()}
              onClick={handleSend}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}