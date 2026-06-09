import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from './ui/button';

const CONSENT_COOKIE_NAME = 'cookies_consent';
const CONSENT_COOKIE_ACCEPTED = 'accepted';
const CONSENT_COOKIE_REJECTED = 'rejected';
const CONSENT_MAX_AGE = 31536000;

const getCookieValue = (name: string) => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  const rawValue = cookie.split('=').slice(1).join('=');
  try {
    return decodeURIComponent(rawValue);
  } catch {
    // In case of malformed URI sequences, return raw value.
    return rawValue;
  }
};

const setConsentCookie = (value: string) => {
  if (typeof document === 'undefined') {
    return;
  }

  let cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(value)}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax`;
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    cookie += '; Secure';
  }

  document.cookie = cookie;
};

const hasConsentChoice = () => {
  const value = getCookieValue(CONSENT_COOKIE_NAME);
  return value === CONSENT_COOKIE_ACCEPTED || value === CONSENT_COOKIE_REJECTED;
};

export const canUseOptionalCookies = () =>
  getCookieValue(CONSENT_COOKIE_NAME) === CONSENT_COOKIE_ACCEPTED;

export function CookiesConsentBanner() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (hasConsentChoice()) {
      setIsVisible(false);
      return;
    }

    const timerId = window.setTimeout(() => {
      setIsVisible(true);
    }, 2200);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  const handleAccept = () => {
    setConsentCookie(CONSENT_COOKIE_ACCEPTED);
    setIsVisible(false);
  };

  const handleReject = () => {
    setConsentCookie(CONSENT_COOKIE_REJECTED);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  const node = (
    <div
      className="fixed inset-x-0 bottom-0"
      // В вашем билде часть tailwind-утилит может не попадать в итоговый CSS.
      // Поэтому задаём критичные стили (fixed positioning + z-index) надёжно инлайном.
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483647,
        pointerEvents: 'auto',
      }}
    >
      <div
        className="mx-auto max-w-[1100px] px-4"
        // safe-area снизу для iOS, чтобы баннер не упирался в home-indicator
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        <div className="rounded-2xl border border-border bg-card shadow-card px-4 py-4 sm:px-6 sm:py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm sm:text-base text-muted-foreground">
            Используем cookies для работы сайта. Подробнее — в{' '}
            <a
              href="/cookies"
              className="text-accent underline underline-offset-4 hover:text-accent/80"
            >
              Политике cookies
            </a>
            .
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 w-full sm:w-auto">
            <Button
              onClick={handleAccept}
              className="w-full sm:w-auto flex-none whitespace-nowrap h-9 px-3 text-sm"
            >
              Принять
            </Button>
            <Button
              variant="outline"
              onClick={handleReject}
              className="w-full sm:w-auto flex-none whitespace-nowrap h-9 px-3 text-sm"
            >
              Отклонить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') {
    return null;
  }

  // Portal fixes cases when `position: fixed` becomes relative to transformed parents.
  return createPortal(node, document.body);
}
