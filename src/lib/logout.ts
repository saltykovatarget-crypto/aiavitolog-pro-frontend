import { useCallback, useState } from 'react';

export function useLogout() {
  const [loading, setLoading] = useState(false);

  const logout = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      await fetch('/api/session/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      try {
        sessionStorage.clear();

        for (const key of Object.keys(localStorage)) {
          if (key.startsWith('chat_memory:') || key === 'userProfile') {
            localStorage.removeItem(key);
          }
        }
      } catch {
        // Ignore storage errors so logout can always redirect.
      }

      window.location.href = '/';
    }
  }, [loading]);

  return { logout, loading };
}
