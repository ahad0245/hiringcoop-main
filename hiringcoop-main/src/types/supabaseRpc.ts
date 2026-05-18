
import { Database } from '@/integrations/supabase/types';

// Type definitions for custom RPC functions
export type RPCFunctionReturnType<T> = {
  data: T;
  error: Error | null;
};

// Extend the Supabase client to include our custom RPC functions
declare module '@supabase/supabase-js' {
  interface SupabaseClient<Database> {
    rpc<T = any>(
      fn: string,
      params?: object,
      options?: {
        head?: boolean;
        count?: null | 'exact' | 'planned' | 'estimated';
      }
    ): Promise<RPCFunctionReturnType<T>>;
  }
}
