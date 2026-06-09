import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { api, ApiError } from './api';
import { isDemoMode, tryAutoEnableDemoMode } from './demoMode';
import type { UserProfile } from '@/types/user';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const hasInitialisedRef = useRef(false);

  const fetchUser = useCallback(async () => {
    const shouldShowLoader = !hasInitialisedRef.current;
    if (shouldShowLoader) {
      setLoading(true);
    }
    try {
      const profile = await api.get<UserProfile>('/api/session/me');
      setUser(profile);
      return profile;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setUser(null);
        return null;
      }
      if (!isDemoMode()) {
        const status = error instanceof ApiError ? error.status : 'network';
        tryAutoEnableDemoMode(`fetchUser failed: ${status}`);
        try {
          const profile = await api.get<UserProfile>('/api/session/me');
          setUser(profile);
          return profile;
        } catch (retryError) {
          console.error('Failed to load user profile after demo retry', retryError);
          setUser(null);
          throw retryError;
        }
      }
      console.error('Failed to load user profile', error);
      setUser(null);
      throw error;
    } finally {
      if (shouldShowLoader) {
        hasInitialisedRef.current = true;
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchUser().catch(() => {
      // Errors are already logged in fetchUser. We swallow them here to avoid unhandled rejections.
    });
  }, [fetchUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      refreshUser: fetchUser,
    }),
    [user, loading, fetchUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
