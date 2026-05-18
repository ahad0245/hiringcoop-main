
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { FiAlertCircle, FiMail, FiCheck, FiLock } from 'react-icons/fi';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Steps of the setup process
type SetupStep = 'request_code' | 'verify_code' | 'create_account';

const FirstAdminSetupPage = () => {
  // State for the multi-step form
  const [step, setStep] = useState<SetupStep>('request_code');
  const [email, setEmail] = useState('contact@i8is.com'); // Default to the designated admin email
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [requestedCode, setRequestedCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Handle countdown for code resending
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  // Check if there's already an admin
  useEffect(() => {
    const checkExistingAdmin = async () => {
      try {
        // Check for any admin or superadmin accounts
        const { data, error } = await (supabase as any)
          .from('profiles')
          .select('id')
          .or('user_type.eq.admin,user_type.eq.superadmin')
          .limit(1);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          toast({
            title: "Admin already exists",
            description: "The first admin account has already been set up. Please use the admin login.",
            variant: "destructive",
          });
          navigate('/hcadmin2025');
        }
      } catch (err) {
        console.error("Error checking for existing admin:", err);
      }
    };
    
    checkExistingAdmin();
  }, [navigate, toast]);
  
  // Handle step 1: Request verification code
  const handleRequestCode = async () => {
    setError(null);
    setLoading(true);
    
    try {
      if (email !== 'contact@i8is.com') {
        throw new Error('The first admin must use the designated email address: contact@i8is.com');
      }
      
      const { data: codeData, error: codeError } = await supabase.rpc('create_admin_verification_code', {
        email_address: email
      });
      
      if (codeError) throw codeError;
      
      // Send verification email via edge function
      try {
        await sendVerificationEmail('', codeData);
      } catch (emailError: any) {
        console.error("Email sending error:", emailError);
        throw new Error("Could not send verification email. Please check your email configuration.");
      }
      
      setRequestedCode(true);
      setCountdown(60);
      
      toast({
        title: "Verification code sent",
        description: `A verification code has been sent to ${email}`,
      });
      
      setStep('verify_code');
    } catch (err: any) {
      console.error("Error requesting verification code:", err);
      setError(err.message || 'Failed to request verification code');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to send the verification email
  const sendVerificationEmail = async (token: string, code: string) => {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-admin-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        type: 'verification',
        code: code
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send verification email');
    }
    
    return await response.json();
  };
  
  // Handle step 2: Verify code
  const handleVerifyCode = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('verify_admin_code', {
        email_address: email,
        verification_code: verificationCode
      });
      
      if (error) throw error;
      
      if (!data) {
        throw new Error('Invalid or expired verification code');
      }
      
      toast({
        title: "Code verified",
        description: "Please create your admin account",
      });
      
      setStep('create_account');
    } catch (err: any) {
      setError(err.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle step 3: Create account
  const handleCreateAccount = async () => {
    setError(null);
    setLoading(true);
    
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      // Create the user account
      const { error: signUpError } = await signUp(
        email,
        password,
        {
          first_name: firstName,
          last_name: lastName,
          user_type: 'admin'
        }
      );
      
      if (signUpError) throw signUpError;
      
      // Sign in immediately after successful signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) throw signInError;
      
      toast({
        title: "Admin account created",
        description: "You are now signed in as an admin",
      });
      
      // Redirect directly to admin dashboard
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };
  
  const renderCurrentStep = () => {
    switch (step) {
      case 'request_code':
        return (
          <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleRequestCode(); }}>
            <div>
              <Label htmlFor="email" className="text-gray-200">Admin Email Address</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  readOnly
                  className="block w-full bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                The first admin must use the designated email address: contact@i8is.com
              </p>
            </div>
            
            <Button
              type="submit"
              disabled={loading || countdown > 0}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Send Verification Code"}
            </Button>
          </form>
        );
      
      case 'verify_code':
        return (
          <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleVerifyCode(); }}>
            <div className="flex items-center justify-center mb-4">
              <FiMail className="h-12 w-12 text-primary" />
            </div>
            
            <p className="text-center text-sm text-gray-300 mb-4">
              A verification code has been sent to <strong>{email}</strong>.<br />
              Please check your inbox and enter the code below.
            </p>
            
            <div>
              <Label htmlFor="verification-code" className="text-gray-200">Verification Code</Label>
              <div className="mt-1">
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="block w-full bg-gray-700 border-gray-600 text-white text-center text-lg tracking-wider"
                  placeholder="Enter 6-digit code"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading || !verificationCode}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
            
            <div className="flex justify-center">
              <button
                type="button"
                className="text-sm text-primary-400 hover:text-primary"
                onClick={() => setStep('request_code')}
                disabled={loading}
              >
                Back to previous step
              </button>
            </div>
          </form>
        );
      
      case 'create_account':
        return (
          <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleCreateAccount(); }}>
            <div className="flex items-center justify-center mb-4">
              <FiCheck className="h-12 w-12 text-green-500" />
            </div>
            
            <p className="text-center text-sm text-gray-300 mb-4">
              Email verified! Now create your super admin account.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first-name" className="text-gray-200">First name</Label>
                <Input
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="block w-full bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="last-name" className="text-gray-200">Last name</Label>
                <Input
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="block w-full bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-gray-200">Email address</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  readOnly
                  className="block w-full bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-200">Password</Label>
              <div className="mt-1">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="confirm-password" className="text-gray-200">Confirm Password</Label>
              <div className="mt-1">
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading ? "Creating Account..." : "Create Super Admin Account"}
            </Button>
          </form>
        );
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg text-white">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight">
            First Admin Setup
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Set up the first super admin account for HiringCoop
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <FiAlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default FirstAdminSetupPage;
