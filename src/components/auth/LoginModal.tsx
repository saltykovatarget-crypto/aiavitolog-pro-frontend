import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Loader2, CheckCircle2, LogIn } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { navigateToFreeChat } from '@/lib/navigation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginComplete: () => void;     // позволяет родителю реагировать на успешный вход (например, закрыть модалку)
  onOpenRegistration: () => void;  // открывает модалку регистрации
}

type LoginState = 'ready' | 'confirming' | 'success';

export function LoginModal({ isOpen, onClose, onLoginComplete, onOpenRegistration }: LoginModalProps) {
  const [loginState, setLoginState] = useState<LoginState>('ready');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState<string>('');
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (!isOpen) {
      // сброс при закрытии
      setLoginState('ready');
      setUsername('');
      setPassword('');
      setErrMsg('');
    }
  }, [isOpen]);

  const canSubmit = username.trim() !== '' && password.trim() !== '' && loginState !== 'confirming';

  async function handleLogin() {
    if (!canSubmit) return;
    setErrMsg('');
    setLoginState('confirming');
    try {
      await api.post('/api/session/login', { username, password });
      await refreshUser();
      setLoginState('success');
      navigateToFreeChat();
      // короткая пауза на анимацию успеха
      setTimeout(() => {
        onLoginComplete();
        onClose();
      }, 600);
    } catch (e: any) {
      const status = e instanceof ApiError ? e.status : e?.status;
      const detail = e instanceof ApiError ? (e.data as any)?.detail : e?.data?.detail;
      if (status === 401) setErrMsg('Неверный логин или пароль.');
      else if (status === 429) setErrMsg('Слишком много попыток. Попробуйте позже.');
      else if (status === 400 || status === 422) setErrMsg(typeof detail === 'string' ? detail : 'Проверьте введённые данные.');
      else setErrMsg('Ошибка сервера. Попробуйте позже.');
      setLoginState('ready');
    }
  }

  function handleRegistration() {
    onClose();
    onOpenRegistration();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && canSubmit) {
      e.preventDefault();
      void handleLogin();
    }
  }

  function renderContent() {
    switch (loginState) {
      case 'ready':
        return (
          <div className="space-y-6" onKeyDown={onKeyDown}>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <LogIn className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Войдите в аккаунт</h3>
                <p className="text-sm text-muted-foreground">
                  Введите ваши учётные данные для входа в систему
                </p>
              </div>
            </div>

            {/* Login Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Логин</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Введите логин"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>

              {errMsg && <p className="text-sm text-red-600">{errMsg}</p>}
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleLogin} 
                className="w-full"
                disabled={!canSubmit}
              >
                Войти
              </Button>
              
              <Button 
                onClick={handleRegistration} 
                variant="outline"
                className="w-full"
              >
                Зарегистрироваться
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                После входа вы получите доступ к профилю и статистике
              </p>
            </div>
          </div>
        );

      case 'confirming':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Выполняем вход…</h3>
                <p className="text-sm text-muted-foreground">
                  Пожалуйста, подождите
                </p>
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Вход выполнен!</h3>
                <p className="text-sm text-muted-foreground">
                  Добро пожаловать. Открываем чат…
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <DialogTitle>Вход в аккаунт</DialogTitle>
            <Badge variant="secondary" className="bg-muted/50">
              FREE
            </Badge>
          </div>
          <DialogDescription>
            Войдите в свой аккаунт или зарегистрируйтесь, если у вас его ещё нет.
          </DialogDescription>
        </DialogHeader>
        
        <div className="pt-2">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
