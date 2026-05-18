
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/context/AuthContext';
import { FiAlertCircle, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { useToast } from '@/components/ui/use-toast';

type AuthFormProps = {
  mode: 'login' | 'signup';
};

export const AuthForm = ({ mode }: AuthFormProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'candidate' | 'employer'>('candidate');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        
        toast({
          title: "Signed in successfully",
          description: "Welcome back to HiringCoop!"
        });
        
        navigate('/dashboard');
      } else {
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }
        
        const { error } = await signUp(
          email, 
          password, 
          { 
            first_name: firstName, 
            last_name: lastName, 
            user_type: userType 
          }
        );
        
        if (error) throw error;
        
        // Show "check your email" instead of navigating
        setSignupSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || `An error occurred during ${isLogin ? 'login' : 'signup'}`);
    } finally {
      setLoading(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <FiMail className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
        <p className="text-muted-foreground">
          We've sent a confirmation link to <strong>{email}</strong>. 
          Please click the link in the email to verify your account.
        </p>
        <p className="text-sm text-muted-foreground">
          Didn't receive it? Check your spam folder or try signing up again.
        </p>
        <Link to="/login">
          <Button variant="outline" className="mt-2">Back to login</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow">
      <div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin 
            ? 'Sign in to your account to access your dashboard' 
            : 'Join our platform to find your next opportunity or the perfect candidate'}
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <FiAlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div>
              <Label>I am a...</Label>
              <RadioGroup 
                className="mt-2 flex space-x-4" 
                defaultValue="candidate"
                onValueChange={(value) => setUserType(value as 'candidate' | 'employer')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="candidate" id="candidate" />
                  <Label htmlFor="candidate" className="cursor-pointer">Job Seeker</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="employer" id="employer" />
                  <Label htmlFor="employer" className="cursor-pointer">Employer</Label>
                </div>
              </RadioGroup>
            </div>
          </>
        )}
        
        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="mt-1">
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="block w-full"
            />
          </div>
        </div>
        
        <div>
          {isLogin && (
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80">
                  Forgot password?
                </Link>
              </div>
            </div>
          )}
          {!isLogin && (
            <Label htmlFor="password">Password</Label>
          )}
          <div className="mt-1">
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={isLogin ? "Enter your password" : "Create a password"}
              className="block w-full"
              minLength={8}
            />
            {!isLogin && (
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters
              </p>
            )}
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isLogin ? "Signing in..." : "Creating account..."}
            </span>
          ) : (
            isLogin ? "Sign in" : "Create account"
          )}
        </Button>
        
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-primary hover:text-primary/80">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </form>
    </div>
  );
};
