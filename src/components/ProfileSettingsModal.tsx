import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { X, Trash2, MessageSquare, ExternalLink, Loader2 } from 'lucide-react';
import { getPublicPlanLabel } from '@/lib/planLabels';
import { SafeText } from './SafeText';

interface ChatItem {
  id: string;
  title: string;
  created_at: string;
  last_used_at?: string | null;
}

interface ProfileData {
  userId: string;
  telegramUsername: string;
  fullName: string;
  planType: 'FREE' | 'BASIC' | 'PLUS' | 'PREMIUM';
}

interface ApiUserProfile {
  id: string;
  telegram_id: number | null;
  telegram_username: string | null;
  full_name: string | null;
  username: string | null;
  photo_url: string | null;
  plan: string;
  plan_until: string | null;
}

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData?: ProfileData;
  chats?: ChatItem[];
  isLoading?: boolean;
  error?: string;
}

type ViewState = 'main' | 'delete-chats' | 'loading' | 'error';

export function ProfileSettingsModal({
  isOpen,
  onClose,
  profileData,
  chats,
  isLoading = false,
  error
}: ProfileSettingsModalProps) {
  const [viewState, setViewState] = useState<ViewState>('main');
  const [chatList, setChatList] = useState<ChatItem[]>(chats ?? []);
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [isDeletingChats, setIsDeletingChats] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [apiProfile, setApiProfile] = useState<ApiUserProfile | null>(null);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const combinedLoading = isLoading || remoteLoading || chatLoading;
  const combinedError = error ?? remoteError ?? chatError;

  const loadProfile = useCallback(
    async (signal?: AbortSignal) => {
      setRemoteLoading(true);
      setRemoteError(null);

      try {
        const response = await fetch('/api/account', {
          credentials: 'include',
          signal
        });

        if (!response.ok) {
          if (response.status === 401) {
            setApiProfile(null);
            setRemoteError('Чтобы просмотреть профиль, войдите через Telegram.');
            return;
          }

          const errorText = await response.text().catch(() => '');
          throw new Error(errorText || `Profile request failed with ${response.status}`);
        }

        const data = (await response.json()) as ApiUserProfile;
        setApiProfile(data);
        sessionStorage.setItem('userProfile', JSON.stringify(data));
      } catch (loadError) {
        if (signal?.aborted) {
          return;
        }
        console.error('Failed to load profile:', loadError);
        setRemoteError('Не удалось загрузить профиль. Попробуйте позже.');
      } finally {
        if (!signal?.aborted) {
          setRemoteLoading(false);
        }
      }
    },
    []
  );

  const loadChats = useCallback(
    async (signal?: AbortSignal) => {
      setChatLoading(true);
      setChatError(null);

      try {
        const response = await fetch('/api/workspaces', {
          credentials: 'include',
          signal
        });

        if (!response.ok) {
          if (response.status === 401) {
            setChatList([]);
            setChatError('Чтобы просмотреть чаты, войдите через Telegram.');
            return;
          }

          const errorText = await response.text().catch(() => '');
          throw new Error(errorText || `Chats request failed with ${response.status}`);
        }

        const data = (await response.json()) as ChatItem[];
        setChatList(data);
        setSelectedChats(new Set());
      } catch (loadError) {
        if (signal?.aborted) {
          return;
        }
        console.error('Failed to load chats:', loadError);
        setChatError('Не удалось загрузить чаты. Попробуйте позже.');
      } finally {
        if (!signal?.aborted) {
          setChatLoading(false);
        }
      }
    },
    []
  );

  // Если родитель когда-то начнёт передавать список чатов как проп,
  // аккуратно синхронизируемся, но не трогаем локальный стейт,
  // когда chats не задан (undefined).
  useEffect(() => {
    if (chats && chats.length > 0) {
      setChatList(chats);
      setSelectedChats(new Set());
    }
  }, [chats]);

  useEffect(() => {
    if (!isOpen) {
      setViewState('main');
      setRemoteError(null);
      setChatError(null);
      setSelectedChats(new Set());
      return;
    }

    const cachedProfile = sessionStorage.getItem('userProfile');
    if (cachedProfile) {
      try {
        setApiProfile(JSON.parse(cachedProfile) as ApiUserProfile);
      } catch (parseError) {
        console.warn('Failed to parse cached profile:', parseError);
        sessionStorage.removeItem('userProfile');
      }
    }

    const controller = new AbortController();

    void loadProfile(controller.signal);
    void loadChats(controller.signal);

    return () => {
      controller.abort();
    };
  }, [isOpen, loadProfile, loadChats]);

  const mockProfileData: ProfileData = profileData || {
    userId: 'TG_847291038',
    telegramUsername: '@avitouser2024',
    fullName: 'Александр Петров',
    planType: 'FREE'
  };

  const effectivePlanType = (apiProfile?.plan?.toUpperCase() as ProfileData['planType']) || 'FREE';
  const telegramIdDisplay =
    apiProfile?.telegram_id !== null && apiProfile?.telegram_id !== undefined
      ? `TG_${apiProfile.telegram_id}`
      : mockProfileData.userId;
  const telegramUsernameDisplay = apiProfile?.telegram_username
    ? `@${apiProfile.telegram_username}`
    : mockProfileData.telegramUsername;
  const fullNameDisplay = apiProfile?.full_name || apiProfile?.username || mockProfileData.fullName;

  const handleSelectAll = () => {
    setSelectedChats(prev => {
      if (chatList.length === 0) return prev;
      if (prev.size === chatList.length) {
        return new Set();
      }
      return new Set(chatList.map(chat => chat.id));
    });
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChats(prev => {
      const next = new Set(prev);
      if (next.has(chatId)) {
        next.delete(chatId);
      } else {
        next.add(chatId);
      }
      return next;
    });
  };

  const handleDeleteSelectedChats = async () => {
    if (selectedChats.size === 0) {
      return;
    }

    const confirmed = window.confirm('Удалить выбранные чаты? Это действие нельзя отменить.');
    if (!confirmed) {
      return;
    }

    setIsDeletingChats(true);
    try {
      const chatIds = Array.from(selectedChats);
      const response = await fetch('/api/workspaces/bulk-archive', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chat_ids: chatIds })
      });

      if (!response.ok) {
        console.error('Failed to delete chats', response.status);
        setChatError('Не удалось удалить выбранные чаты. Попробуйте позже.');
        return;
      }

      const deletedIds = (await response.json()) as string[];
      setChatList(prev => prev.filter(chat => !deletedIds.includes(chat.id)));
      setSelectedChats(new Set());
    } catch (deleteError) {
      console.error('Failed to delete chats:', deleteError);
      setChatError('Не удалось удалить выбранные чаты. Попробуйте позже.');
    } finally {
      setIsDeletingChats(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDeletingAccount(false);
    setShowDeleteAccountDialog(false);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  };

  const renderMainView = () => (
    <div className="space-y-6">
      {/* Account Information */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Информация об аккаунте</h3>
          <Badge
            variant="secondary"
            className={
              effectivePlanType === 'FREE'
                ? 'bg-gray-500/10 text-gray-600 border-gray-500/20'
                : effectivePlanType === 'BASIC'
                ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                : effectivePlanType === 'PLUS'
                ? 'bg-green-500/10 text-green-600 border-green-500/20'
                : effectivePlanType === 'PREMIUM'
                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                : 'bg-gray-500/10 text-gray-600 border-gray-500/20'
            }
          >
            {effectivePlanType === 'FREE' ? 'Free' :
             effectivePlanType === 'BASIC' ? getPublicPlanLabel('basic') :
             effectivePlanType === 'PLUS' ? getPublicPlanLabel('plus') :
             effectivePlanType === 'PREMIUM' ? getPublicPlanLabel('premium') : 'Free'}
          </Badge>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ID пользователя:</span>
            <span className="font-mono">{telegramIdDisplay || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Telegram:</span>
            <span>{telegramUsernameDisplay || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Имя:</span>
            <span>{fullNameDisplay || '—'}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Chat Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Мои чаты</h3>
          {chatList.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedChats(new Set());
                setViewState('delete-chats');
              }}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Удалить чаты
            </Button>
          )}
        </div>

        {chatList.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>У вас пока нет чатов</p>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Всего чатов: {chatList.length}
          </div>
        )}
      </div>

      <Separator />

      {/* Support */}
      <div className="space-y-4">
        <h3 className="font-medium">Поддержка</h3>
        <Button variant="outline" className="w-full justify-start">
          <ExternalLink className="w-4 h-4 mr-2" />
          Связаться с поддержкой
        </Button>
      </div>

      <Separator />

      {/* Delete Account */}
      <div className="space-y-4">
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => setShowDeleteAccountDialog(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Удалить аккаунт
        </Button>
      </div>
    </div>
  );

  const renderDeleteChatsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Удаление чатов</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setViewState('main');
            setSelectedChats(new Set());
          }}
        >
          Отмена
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={chatList.length > 0 && selectedChats.size === chatList.length}
              onCheckedChange={handleSelectAll}
            />
            Выбрать все
          </label>
          <span className="text-xs text-muted-foreground">
            {selectedChats.size} из {chatList.length}
          </span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
          {chatList.map((chat) => (
            <div
              key={chat.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                checked={selectedChats.has(chat.id)}
                onCheckedChange={() => handleChatSelect(chat.id)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <SafeText
                    as="div"
                    className="font-medium truncate"
                    value={chat.title}
                    maxLen={120}
                    fallback="Без названия"
                  />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(chat.last_used_at || chat.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          className="w-full"
          disabled={selectedChats.size === 0 || isDeletingChats}
          onClick={handleDeleteSelectedChats}
        >
          {isDeletingChats ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Удаление...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Удалить выбранные ({selectedChats.size})
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderLoadingView = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <p className="text-muted-foreground">Загрузка данных...</p>
    </div>
  );

  const renderErrorView = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <X className="w-4 h-4 text-destructive" />
      </div>
      <p className="text-muted-foreground text-center">
        {combinedError || 'Не удалось загрузить данные'}
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={() => {
          setViewState('main');
          void loadProfile();
          void loadChats();
        }}
      >
        Попробовать снова
      </Button>
    </div>
  );

  const getCurrentView = () => {
    if (combinedLoading) return renderLoadingView();
    if (combinedError) return renderErrorView();
    
    switch (viewState) {
      case 'delete-chats':
        return renderDeleteChatsView();
      case 'loading':
        return renderLoadingView();
      case 'error':
        return renderErrorView();
      default:
        return renderMainView();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[480px] max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Настройки профиля</DialogTitle>
            <DialogDescription>
              Управление настройками аккаунта, чатами и подпиской
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto custom-scrollbar px-1 -mx-1">
            {getCurrentView()}
          </div>

          {/* Footer */}
          <div className="border-t border-border pt-4 mt-6">
            <p className="text-xs text-center text-muted-foreground">
              <button className="hover:underline">
                Политика конфиденциальности
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteAccountDialog} onOpenChange={setShowDeleteAccountDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить аккаунт?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Удаление аккаунта приведёт к полному удалению всех данных и отвязке от Telegram.
              </p>
              <p>
                Если у вас есть активная подписка, удаление произойдёт после её окончания.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingAccount}>
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingAccount ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Удаление...
                </>
              ) : (
                'Удалить'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
