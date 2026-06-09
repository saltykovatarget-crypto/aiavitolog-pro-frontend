import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

import { Button } from './ui/button';

export function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Подтверждаем вход через Telegram...');

  useEffect(() => {
    const controller = new AbortController();

    const completeLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const loginToken = params.get('login_token');

      if (!loginToken) {
        setStatus('error');
        setMessage('Не удалось найти login_token в адресной строке.');
        return;
      }

      try {
        const callbackUrl = `/api/session/telegram/callback?login_token=${encodeURIComponent(loginToken)}`;
        const response = await fetch(callbackUrl, {
          method: 'GET',
          credentials: 'include',
          redirect: 'manual',
          signal: controller.signal
        });

        if (response.type === 'opaqueredirect' || response.status === 0 || (response.status >= 200 && response.status < 400)) {
          setStatus('success');
          setMessage('Вход выполнен, перенаправляем в чат...');

          try {
            const profileResponse = await fetch('/api/account', { credentials: 'include' });
            if (profileResponse.ok) {
              const profile = await profileResponse.json();
              sessionStorage.setItem('userProfile', JSON.stringify(profile));
            }
          } catch (profileError) {
            console.error('Failed to refresh profile after login:', profileError);
          }

          setTimeout(() => {
            window.location.replace('/#chat');
          }, 1200);
        } else {
          const details = await response.text().catch(() => '');
          throw new Error(details || `Unexpected status: ${response.status}`);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        console.error('Telegram login callback failed:', error);
        setStatus('error');
        setMessage('Не удалось завершить авторизацию. Попробуйте ещё раз.');
      }
    };

    void completeLogin();

    return () => {
      controller.abort();
    };
  }, []);

  const renderIcon = () => {
    if (status === 'loading') {
      return <Loader2 className="w-12 h-12 animate-spin text-brand" />;
    }
    if (status === 'success') {
      return <CheckCircle2 className="w-12 h-12 text-emerald-500" />;
    }
    return <AlertTriangle className="w-12 h-12 text-destructive" />;
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
      <div className="bg-background/80 backdrop-blur-xl border border-border rounded-2xl max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">{renderIcon()}</div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">
            {status === 'success' ? 'Вы вошли в аккаунт' : status === 'error' ? 'Не удалось войти' : 'Проверяем авторизацию'}
          </h1>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        {status === 'error' && (
          <Button onClick={() => window.location.replace('/#landing')}>Вернуться на главную</Button>
        )}
      </div>
    </div>
  );
}
