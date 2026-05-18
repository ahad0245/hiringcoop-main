
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { FiAlertCircle, FiMail, FiUser, FiUsers } from 'react-icons/fi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';

const AdminInvitePage = () => {
  const [email, setEmail] = useState('');
  const [invitations, setInvitations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInvitations, setLoadingInvitations] = useState(true);
  
  const { user } = useAuth();
  const { isSuperAdmin, isLoading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is superadmin
  useEffect(() => {
    if (!adminLoading && !isSuperAdmin) {
      toast({
        title: "Access Denied",
        description: "Only super admins can invite new admins",
        variant: "destructive",
      });
      navigate('/admin');
    }
  }, [isSuperAdmin, adminLoading, navigate, toast]);

  // Load existing invitations
  useEffect(() => {
    const fetchInvitations = async () => {
      if (!user) return;
      
      try {
        setLoadingInvitations(true);
        const { data, error } = await (supabase as any)
          .from('admin_invitations')
          .select('*, profiles:invited_by(first_name, last_name)')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setInvitations(data || []);
      } catch (err) {
        console.error('Error fetching invitations:', err);
      } finally {
        setLoadingInvitations(false);
      }
    };

    fetchInvitations();
  }, [user]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (!user) {
        throw new Error('You must be logged in to invite admins');
      }

      // Validate email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Check if email is already invited
      const { data: existingData, error: existingError } = await (supabase as any)
        .from('admin_invitations')
        .select('id, status')
        .eq('email', email)
        .limit(1);
      
      if (existingError) throw existingError;
      
      if (existingData && existingData.length > 0 && (existingData[0] as any).status === 'pending') {
        throw new Error('This email has already been invited');
      }

      // Create invitation
      const { data: invitationCode, error: inviteError } = await supabase.rpc('create_admin_invitation', {
        email_address: email, 
        inviter_id: user.id
      });
      
      if (inviteError) throw inviteError;

      // Get user profile for the email
      const { data: userData, error: userError } = await (supabase as any)
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();
        
      if (userError) throw userError;

      // Send invitation email
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Authentication required');
      }

      const emailResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-admin-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: email,
          type: 'invitation',
          code: invitationCode,
          inviterName: `${userData?.first_name || ''} ${userData?.last_name || ''}`
        })
      });
      
      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        throw new Error(errorData.error || 'Failed to send invitation email');
      }

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      });

      // Reset form and refresh invitations
      setEmail('');
      const { data: newInvitations, error: refreshError } = await (supabase as any)
        .from('admin_invitations')
        .select('*, profiles:invited_by(first_name, last_name)')
        .order('created_at', { ascending: false });
        
      if (refreshError) throw refreshError;
      setInvitations(newInvitations || []);
      
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Invite Admin</h1>
        <p className="text-muted-foreground">
          Invite new administrators to the HiringCoop admin panel
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <FiAlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Send New Invitation</CardTitle>
          <CardDescription>
            Invited users will receive an email with instructions on how to join
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="flex mt-1 gap-4">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter email address"
                  className="flex-grow"
                />
                <Button
                  type="submit"
                  disabled={loading || !email}
                >
                  {loading ? "Sending..." : "Send Invitation"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FiUsers className="mr-2" /> 
            Admin Invitations
          </CardTitle>
          <CardDescription>
            Manage existing admin invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingInvitations ? (
            <p className="text-center py-8 text-muted-foreground">Loading invitations...</p>
          ) : invitations.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No invitations yet</p>
          ) : (
            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium">Email</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Invited By</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Created</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Expires</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invitations.map((invitation) => (
                    <tr key={invitation.id}>
                      <td className="py-3 px-4 text-sm">{invitation.email}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invitation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          invitation.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {invitation.profiles ? 
                          `${invitation.profiles.first_name || ''} ${invitation.profiles.last_name || ''}` :
                          'Unknown'}
                      </td>
                      <td className="py-3 px-4 text-sm">{formatDate(invitation.created_at)}</td>
                      <td className="py-3 px-4 text-sm">{formatDate(invitation.expires_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInvitePage;
