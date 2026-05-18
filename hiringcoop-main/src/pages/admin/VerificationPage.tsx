import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiSearch, FiLoader } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Verification } from '@/types/admin';
import { useAuth } from '@/context/AuthContext';

const VerificationPage = () => {
  const { user } = useAuth();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [rejectionReason, setRejectionReason] = useState('');
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      
      // Fetch all verifications using RPC
      const { data, error } = await supabase.rpc<Verification[]>('get_verification_requests');
      
      if (error) {
        throw error;
      }
      
      setVerifications(data || []);
    } catch (error) {
      console.error('Error fetching verifications:', error);
      toast({
        title: "Error",
        description: "Failed to load verification data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getInitials = (verification: Verification) => {
    if (!verification.user) return 'U';
    
    const firstName = verification.user.first_name || '';
    const lastName = verification.user.last_name || '';
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const getDisplayName = (verification: Verification) => {
    if (!verification.user) return 'Unknown User';
    
    const firstName = verification.user.first_name || '';
    const lastName = verification.user.last_name || '';
    
    return `${firstName} ${lastName}`.trim() || 'Unknown User';
  };

  const viewVerification = (verification: Verification) => {
    setSelectedVerification(verification);
    setRejectionReason(verification.rejection_reason || '');
    setShowVerificationDialog(true);
  };

  const handleApprove = async () => {
    if (!selectedVerification || !user) return;
    
    try {
      const { error } = await supabase.rpc<void>('approve_verification', {
        verification_id: selectedVerification.id,
        reviewer_id: user.id
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification Approved",
        description: "The verification request has been approved successfully"
      });
      
      setShowVerificationDialog(false);
      setSelectedVerification(null);
      fetchVerifications();
    } catch (error) {
      console.error('Error approving verification:', error);
      toast({
        title: "Error",
        description: "Failed to approve verification",
        variant: "destructive"
      });
    }
  };

  const handleReject = async () => {
    if (!selectedVerification || !user || !rejectionReason.trim()) return;
    
    try {
      const { error } = await supabase.rpc<void>('reject_verification', {
        verification_id: selectedVerification.id,
        reviewer_id: user.id,
        reason: rejectionReason
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification Rejected",
        description: "The verification request has been rejected"
      });
      
      setShowVerificationDialog(false);
      setSelectedVerification(null);
      setRejectionReason('');
      fetchVerifications();
    } catch (error) {
      console.error('Error rejecting verification:', error);
      toast({
        title: "Error",
        description: "Failed to reject verification",
        variant: "destructive"
      });
    }
  };

  const pendingVerifications = verifications.filter(v => v.status === 'pending');
  const verificationHistory = verifications.filter(v => v.status !== 'pending');
  
  const filteredHistory = verificationHistory.filter((item) => {
    const name = getDisplayName(item).toLowerCase();
    const matchesSearch = 
      name.includes(searchTerm.toLowerCase()) ||
      (item.document_url?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <DashboardLayout userType="superadmin">
        <div className="p-6 flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <FiLoader className="animate-spin h-8 w-8 mb-4 text-primary" />
            <p>Loading verification requests...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="superadmin">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Verification Management</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage ID and business verifications
          </p>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Pending Verification ({pendingVerifications.length})
            </TabsTrigger>
            <TabsTrigger value="history">Verification History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            {pendingVerifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FiCheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <p className="text-xl font-medium text-gray-700">All caught up!</p>
                  <p className="text-gray-500 mt-2">No pending verifications to review.</p>
                </CardContent>
              </Card>
            ) : (
              pendingVerifications.map((verification) => (
                <Card key={verification.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={verification.user?.avatar_url || undefined} />
                            <AvatarFallback>{getInitials(verification)}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <h3 className="font-medium">{getDisplayName(verification)}</h3>
                            <p className="text-sm text-muted-foreground">{verification.user_id}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className={verification.user?.user_type === 'candidate' 
                                ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                : 'bg-purple-100 text-purple-800 border-purple-200'}>
                                {verification.user?.user_type === 'candidate' ? 'Candidate' : 'Employer'}
                              </Badge>
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                Pending Review
                              </Badge>
                            </div>
                            
                            <div className="mt-3">
                              <p className="text-sm">
                                <span className="font-medium">Document:</span>{' '}
                                {verification.document_url ? 'Provided' : 'Not provided'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Submitted {formatDate(verification.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 sm:mt-0 flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => viewVerification(verification)}
                          >
                            Review Verification
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Verification History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="md:w-2/3">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input 
                        placeholder="Search by name or document type" 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="md:w-1/3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredHistory.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                            No verification history found matching your filters.
                          </td>
                        </tr>
                      ) : (
                        filteredHistory.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={item.user?.avatar_url || undefined} />
                                  <AvatarFallback>{getInitials(item)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-800">{getDisplayName(item)}</p>
                                  <p className="text-xs text-muted-foreground">{item.user_id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <Badge variant="outline" className={item.user?.user_type === 'candidate' 
                                ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                : 'bg-purple-100 text-purple-800 border-purple-200'}>
                                {item.user?.user_type === 'candidate' ? 'Candidate' : 'Employer'}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">
                              <Badge variant={item.status === 'approved' ? 'outline' : 'destructive'} 
                                className={item.status === 'approved' 
                                  ? 'bg-green-100 text-green-800 border-green-200' 
                                  : 'bg-transparent'}>
                                {item.status === 'approved' ? 'Approved' : 'Rejected'}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">
                              <p className="text-gray-800">{formatDate(item.verified_at || item.updated_at)}</p>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => viewVerification(item)}
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Verification Review</DialogTitle>
            </DialogHeader>
            
            {selectedVerification && (
              <div className="py-4">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedVerification.user?.avatar_url || undefined} />
                    <AvatarFallback>{getInitials(selectedVerification)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{getDisplayName(selectedVerification)}</h3>
                    <p className="text-sm text-muted-foreground">{selectedVerification.user_id}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className={selectedVerification.user?.user_type === 'candidate' 
                        ? 'bg-blue-100 text-blue-800 border-blue-200' 
                        : 'bg-purple-100 text-purple-800 border-purple-200'}>
                        {selectedVerification.user?.user_type === 'candidate' ? 'Candidate' : 'Employer'}
                      </Badge>
                      <Badge variant={
                        selectedVerification.status === 'pending' ? 'outline' :
                        selectedVerification.status === 'approved' ? 'outline' : 'destructive'
                      } className={
                        selectedVerification.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                        selectedVerification.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 
                        'bg-transparent'
                      }>
                        {selectedVerification.status === 'pending' ? 'Pending' : 
                         selectedVerification.status === 'approved' ? 'Approved' : 'Rejected'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-100 rounded-md p-4 mb-6">
                  <h4 className="font-medium mb-2">Document Information</h4>
                  {selectedVerification.document_url ? (
                    <p className="font-medium">Document URL: {selectedVerification.document_url}</p>
                  ) : (
                    <p className="text-gray-500">No document provided</p>
                  )}
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm text-gray-500">Submission Date</p>
                      <p className="font-medium">{formatDate(selectedVerification.created_at)}</p>
                    </div>
                    {selectedVerification.status !== 'pending' && (
                      <div>
                        <p className="text-sm text-gray-500">Review Date</p>
                        <p className="font-medium">{formatDate(selectedVerification.verified_at)}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedVerification.status === 'rejected' && selectedVerification.rejection_reason && (
                  <div className="mb-6 p-3 bg-red-50 rounded-md">
                    <div className="flex items-center gap-2 text-red-800 mb-1">
                      <FiAlertTriangle className="h-4 w-4" />
                      <h4 className="font-medium">Rejection Reason</h4>
                    </div>
                    <p className="text-gray-700">{selectedVerification.rejection_reason}</p>
                  </div>
                )}
                
                {selectedVerification.status === 'pending' && (
                  <div className="mb-6">
                    <label className="block font-medium mb-2">Rejection Reason (if applicable)</label>
                    <Input 
                      placeholder="Enter reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              {selectedVerification?.status === 'pending' ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowVerificationDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleReject}
                    disabled={!rejectionReason}
                  >
                    <FiXCircle className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={handleApprove}
                  >
                    <FiCheckCircle className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setShowVerificationDialog(false)}
                >
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default VerificationPage;
