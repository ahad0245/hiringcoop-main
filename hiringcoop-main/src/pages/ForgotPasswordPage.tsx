import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('auth-email-actions', {
        body: { action: 'reset', email, origin: window.location.origin },
      });

      if (fnError) {
        // Try to extract real error from response body
        try {
          const errorBody = fnError.context ? await fnError.context.json() : null;
          if (errorBody?.error) {
            throw new Error(errorBody.error);
          }
        } catch (parseErr: any) {
          if (parseErr.message && parseErr.message !== fnError.message) throw parseErr;
        }
        throw new Error(fnError.message || 'Something went wrong. Please try again.');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow">
          {sent ? (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
              <p className="text-muted-foreground">
                If an account exists for <strong>{email}</strong>, we've sent a password reset link.
              </p>
              <Link to="/login">
                <Button variant="outline" className="mt-4">Back to login</Button>
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
                  Reset your password
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="mt-1"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Sending...' : 'Send reset link'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                    Sign in
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
