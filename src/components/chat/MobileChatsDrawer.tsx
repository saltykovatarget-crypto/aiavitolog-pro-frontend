import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export function MobileChatsDrawer({ open, onClose, title = 'Чаты', children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <aside
        className="
          absolute right-0 top-0 h-full w-[88vw] max-w-[360px]
          bg-background border-l border-border shadow-xl
          flex flex-col
        "
        role="dialog"
        aria-modal="true"
      >
        <div className="h-14 px-4 flex items-center justify-between border-b border-border">
          <div className="font-medium">{title}</div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Закрыть">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </aside>
    </div>
  );
}
