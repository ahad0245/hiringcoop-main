
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { FiAlertCircle, FiMail, FiCheck } from 'react-icons/fi';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

type SignupStep = 'enter_code' | 'create_account';

const AdminSignupPage = () => {
  const [step, setStep] = useState<SignupStep>('enter_code');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (!email || !invitationCode) {
        throw new Error('Email and invitation code are required');
      }

      // Verify the invitation code
      const { data: isValid, error: verifyError } = await supabase.rpc('verify_admin_invitation', {
        email_address: email,
        code: invitationCode
      });
      
      if (verifyError) throw verifyError;
      
      if (!isValid) {
        throw new Error('Invalid or expired invitation code');
      }
      
      setVerifiedEmail(email);
      setStep('create_account');
      
      toast({
        title: "Invitation verified",
        description: "Please create your admin account"
      });
    } catch (err: any) {
      setError(err.message || 'Failed to verify invitation code');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Validation
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      if (!verifiedEmail) {
        throw new Error('Email verification required');
      }
      
      const { error } = await signUp(
        verifiedEmail,
        password,
        {
          first_name: firstName,
          last_name: lastName,
          user_type: 'admin'
        }
      );
      
      if (error) throw error;
      
      toast({
        title: "Admin account created successfully",
        description: "You can now log in to access the admin dashboard"
      });
      
      navigate('/hcadmin2025');
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };
  
  const renderCurrentStep = () => {
    switch (step) {
      case 'enter_code':
        return (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyCode}>
            <div className="flex items-center justify-center mb-4">
              <FiMail className="h-12 w-12 text-primary" />
            </div>
            
            <p className="text-center text-sm text-gray-300 mb-4">
              To create an admin account, you need a valid invitation code.<br />
              Please check your email for the invitation sent by a super admin.
            </p>
            
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
                  placeholder="Enter your email"
                  className="block w-full bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="invitation-code" className="text-gray-200">Invitation Code</Label>
              <div className="mt-1">
                <Input
                  id="invitation-code"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                  required
                  placeholder="Enter invitation code"
                  className="block w-full bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading ? "Verifying..." : "Verify Invitation"}
            </Button>
          </form>
        );
      
      case 'create_account':
        return (
          <form className="mt-8 space-y-6" onSubmit={handleCreateAccount}>
            <div className="flex items-center justify-center mb-4">
              <FiCheck className="h-12 w-12 text-green-500" />
            </div>
            
            <p className="text-center text-sm text-gray-300 mb-4">
              Invitation verified for <strong>{verifiedEmail}</strong>.<br />
              Please complete your admin account information.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first-name" className="text-gray-200">First name</Label>
                <Input
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Enter first name"
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
                  placeholder="Enter last name"
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
                  minLength={8}
                  placeholder="Create password"
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
                  placeholder="Confirm password"
                  className="block w-full bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading ? "Creating Account..." : "Create Admin Account"}
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
            Create Admin Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Join the HiringCoop administrative team
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

export default AdminSignupPage;
