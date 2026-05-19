
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface ProfileType {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  contact_email: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  bio: string | null;
  title: string | null;
  headline: string | null;
  location: string | null;
  linkedin_url: string | null;
  skills: string[] | null;
  is_public: boolean;
  user_type: 'candidate' | 'employer' | 'admin';
  user_role: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Cast the entire supabase client to any to bypass type checking
        const supabaseAny = supabase as any;
        
        const { data, error } = await supabaseAny
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          throw error;
        }

        if (data) {
          setProfile(data as ProfileType);
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to fetch profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<ProfileType>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      
      // Cast the entire supabase client to any to bypass type checking
      const supabaseAny = supabase as any;
      
      const { data, error } = await supabaseAny
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data as ProfileType);
        return data;
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
  };
};
