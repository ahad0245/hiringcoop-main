
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { FiAlertCircle, FiShield } from 'react-icons/fi';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasAdmins, setHasAdmins] = useState<boolean | null>(null);
  const [checkingAdmins, setCheckingAdmins] = useState(true);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if any admin exists
  useEffect(() => {
    const checkExistingAdmin = async () => {
      try {
        setCheckingAdmins(true);
        const { data, error } = await (supabase as any)
          .from('profiles')
          .select('id')
          .or('user_type.eq.admin,user_type.eq.superadmin')
          .limit(1);
          
        if (error) throw error;
        
        setHasAdmins(data && data.length > 0);
      } catch (err) {
        console.error("Error checking for existing admin:", err);
        setHasAdmins(false);
      } finally {
        setCheckingAdmins(false);
      }
    };
    
    checkExistingAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Check the admin access code first
      if (adminCode !== 'HC_ADMIN_2025') {
        throw new Error('Invalid admin access code');
      }
      
      console.log("Attempting to sign in with:", email);
      const { data: authData, error } = await signIn(email, password);
      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      console.log("Sign in successful:", authData);
      
      // Verify that the user is an admin or superadmin
      // Get the current user ID more reliably
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      console.log("Current authenticated user:", currentUser);
      
      if (!currentUser) {
        throw new Error('Authentication failed: No user found');
      }
      
      const { data, error: profileError } = await (supabase as any)
        .from('profiles')
        .select('user_type')
        .eq('id', currentUser.id)
        .single();
      
      console.log("Profile check result:", data, profileError);
      
      if (profileError) {
        console.error("Profile check error:", profileError);
        throw profileError;
      }
      
      console.log("User type:", data?.user_type);
      if (data?.user_type !== 'admin' && data?.user_type !== 'superadmin') {
        // Sign out if not an admin
        console.error("Not an admin or superadmin");
        await supabase.auth.signOut();
        throw new Error('This account does not have admin privileges');
      }
      
      // Successfully signed in, redirect to admin dashboard
      toast({
        title: "Admin signed in successfully",
        description: "Welcome to HiringCoop Admin Panel"
      });
      
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };
  
  // Show setup page if no super admin exists
  if (checkingAdmins) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <p className="text-white">Checking admin configuration...</p>
      </div>
    );
  }
  
  // Redirect to first admin setup if no admins exist
  if (hasAdmins === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg text-white">
          <div className="text-center">
            <FiShield className="h-12 w-12 mx-auto text-primary" />
            <h2 className="text-center text-3xl font-bold tracking-tight mt-4">
              First Admin Setup Required
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              No admin accounts have been created yet
            </p>
          </div>
          
          <div className="mt-8">
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              asChild
            >
              <Link to="/admin/setup">Set Up First Admin</Link>
            </Button>
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-400">
            <p>The first admin account will have super admin privileges</p>
            <p>and will be able to create other admin accounts.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg text-white">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight">
            HiringCoop Admin Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Authorized personnel only
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <FiAlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="admin-code" className="text-gray-200">Admin Access Code</Label>
            <div className="mt-1">
              <Input
                id="admin-code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
                placeholder="Enter admin access code"
                className="block w-full bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email" className="text-gray-200">Email address</Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your admin email"
                className="block w-full bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="password" className="text-gray-200">Password</Label>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="block w-full bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? "Authenticating..." : "Access Admin Panel"}
          </Button>
          
          <div className="mt-4 text-center text-xs text-gray-400">
            <p>This page is for authorized HiringCoop administrators only.</p>
            <p>Unauthorized access attempts will be logged and reported.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
