import { toast } from 'sonner';

// Глобальные блокировки отключаем — блокируем только локально в ChatPage
export const restrictedPages = new Set<string>([]);

export function navigateToFreeChat() {
  try {
    history.replaceState(null, '', '/#chat');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } catch (error) {
    console.error('Failed to navigate to free chat via history API, falling back to hash update.', error);
    window.location.hash = 'chat';
  }
}

export function handleRestrictedNavigation(targetPage: string): boolean {
  if (!restrictedPages.has(targetPage)) {
    return false;
  }

  toast.info('Доступно после оплаты');
  navigateToFreeChat();
  return true;
}
