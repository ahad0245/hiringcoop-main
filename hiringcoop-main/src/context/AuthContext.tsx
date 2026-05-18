
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string, 
    password: string, 
    metadata: { first_name: string; last_name: string; user_type: 'candidate' | 'employer' | 'admin' | 'superadmin'; user_role?: string }
  ) => Promise<{ error: any | null; data: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null; data: any | null }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string, 
    password: string, 
    metadata: { first_name: string; last_name: string; user_type: 'candidate' | 'employer' | 'admin' | 'superadmin'; user_role?: string }
  ) => {
    const { data: fnData, error: fnError } = await supabase.functions.invoke('auth-email-actions', {
      body: {
        action: 'signup',
        email,
        password,
        firstName: metadata.first_name,
        lastName: metadata.last_name,
        userType: metadata.user_type,
        origin: window.location.origin,
      },
    });
    
    if (fnError) {
      // Extract real error message from edge function response
      try {
        const errorBody = fnError.context ? await fnError.context.json() : null;
        if (errorBody?.error) {
          return { data: null, error: { message: errorBody.error } };
        }
      } catch {
        // fallback
      }
      return { data: null, error: { message: fnError.message || 'Signup failed. Please try again.' } };
    }
    
    if (fnData?.error) {
      return { data: null, error: { message: fnData.error } };
    }
    
    return { data: fnData, error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const { data, error } = await (supabase as any)
          .from('profiles')
          .select('user_type')
          .eq('id', user?.id)
          .single();

        if (error) {
          throw error;
        }

        const isAdminUser = data?.user_type === 'admin' || data?.user_type === 'superadmin';
        setIsAdmin(isAdminUser);

        if (!isAdminUser) {
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        navigate('/dashboard', { replace: true });
      } finally {
        setChecking(false);
      }
    };

    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading, navigate, isAuthenticated]);

  if (loading || checking) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAdmin ? <>{children}</> : null;
};
