import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import type { AuthUser } from '@/types/user';

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrateUser = async (nextUser: User | null) => {
    if (!nextUser) {
      setUser(null);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profile')
        .select('*')
        .eq('id', nextUser.id)
        .single();

      setUser({
        id: nextUser.id,
        email: nextUser.email ?? null,
        profile: {
          name: profile?.name ?? null,
          role: profile?.role ?? null,
          avatar_url: profile?.avatar_url ?? null,
        },
        createdAt: nextUser.created_at ?? null,
      });
    } catch (profileError) {
      console.error('Failed to load profile', profileError);
      setUser({
        id: nextUser.id,
        email: nextUser.email ?? null,
        profile: {
          name: null,
          role: null,
          avatar_url: null,
        },
        createdAt: nextUser.created_at ?? null,
      });
    }
  };

  const refreshUser = async () => {
    const { data } = await supabase.auth.getUser();
    await hydrateUser(data.user ?? null);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        await hydrateUser(data.user ?? null);
      } catch (error) {
        console.error('Failed to initialize auth state', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      hydrateUser(session?.user ?? null);
    });

    init();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
