import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        if (isSupabaseConfigured()) {
          const { data: { session: initialSession }, error } = await supabase.auth.getSession();
          if (error) {
            console.warn('Erro ao obter sessão inicial do Supabase:', error.message);
          }
          if (mounted) {
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
          }
        } else {
          // Fallback demo caso .env não esteja configurado
          const savedMockUser = localStorage.getItem('redacaoSwipeUser');
          if (savedMockUser && mounted) {
            const parsed = JSON.parse(savedMockUser);
            setUser(parsed);
            setSession({ user: parsed });
          }
        }
      } catch (err) {
        console.error('Erro na inicialização da autenticação:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initializeAuth();

    let subscription = null;
    if (isSupabaseConfigured()) {
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false);
        }
      });
      subscription = authListener?.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Entrar com E-mail e Senha
  const signInWithPassword = async ({ email, password }) => {
    if (!isSupabaseConfigured()) {
      // Modo Mock/Demo offline
      const mockUser = {
        id: 'demo-user-123',
        email,
        user_metadata: { name: email.split('@')[0] || 'Estudante' },
      };
      localStorage.setItem('redacaoSwipeUser', JSON.stringify(mockUser));
      setUser(mockUser);
      setSession({ user: mockUser });
      return { data: { user: mockUser, session: { user: mockUser } }, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  // Cadastrar nova conta
  const signUp = async ({ name, email, password }) => {
    if (!isSupabaseConfigured()) {
      const mockUser = {
        id: 'demo-user-123',
        email,
        user_metadata: { name: name || 'Estudante' },
      };
      localStorage.setItem('redacaoSwipeUser', JSON.stringify(mockUser));
      setUser(mockUser);
      setSession({ user: mockUser });
      return { data: { user: mockUser, session: { user: mockUser } }, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || 'Estudante',
        },
      },
    });
    return { data, error };
  };

  // Login com Google OAuth
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      const mockUser = {
        id: 'google-demo-user',
        email: 'lucas.enem@gmail.com',
        user_metadata: { name: 'Lucas' },
      };
      localStorage.setItem('redacaoSwipeUser', JSON.stringify(mockUser));
      setUser(mockUser);
      setSession({ user: mockUser });
      return { data: { user: mockUser }, error: null };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { data, error };
  };

  // Recuperação de senha
  const resetPassword = async (email) => {
    if (!isSupabaseConfigured()) {
      return { data: {}, error: null };
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  };

  // Desconectar / Logout
  const signOut = async () => {
    localStorage.removeItem('redacaoSwipeUser');
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: Boolean(user),
    signInWithPassword,
    signUp,
    signInWithGoogle,
    resetPassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
