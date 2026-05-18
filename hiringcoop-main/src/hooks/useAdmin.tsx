
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface AdminHookReturn {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAdmin = (): AdminHookReturn => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await (supabase as any)
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        // Use user_type for now, since we just added the user_role column
        const userType = data?.user_type;
        setIsAdmin(userType === 'admin' || userType === 'superadmin');
        setIsSuperAdmin(userType === 'superadmin');
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError('Failed to verify admin permissions');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, isSuperAdmin, isLoading, error };
};
