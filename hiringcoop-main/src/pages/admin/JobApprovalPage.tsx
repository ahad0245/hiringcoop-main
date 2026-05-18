import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FiCheckCircle, FiXCircle, FiEye, FiMessageSquare, FiLoader } from 'react-icons/fi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface JobApproval {
  id: string;
  job_id: string;
  status: string;
  rejection_reason: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
  jobs?: {
    id: string;
    title: string;
    description: string;
    location: string | null;
    job_type: string | null;
    salary_range: string | null;
    is_active: boolean | null;
    skills: string[] | null;
    companies?: {
      name: string;
      industry: string | null;
      size: string | null;
    }
  }
}

const JobApprovalPage: React.FC = () => {
  const [pendingJobs, setPendingJobs] = useState<JobApproval[]>([]);
  const [approvedJobs, setApprovedJobs] = useState<JobApproval[]>([]);
  const [rejectedJobs, setRejectedJobs] = useState<JobApproval[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobApproval | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // Create temporary view for job approvals
      await supabase.rpc<void>('create_temp_view_if_not_exists');
      
      // Fetch pending job approvals
      const { data: pendingData, error: pendingError } = await supabase
        .rpc<JobApproval[]>('get_pending_job_approvals');
      
      if (pendingError) throw pendingError;
      
      // Fetch approved job approvals
      const { data: approvedData, error: approvedError } = await supabase
        .rpc<JobApproval[]>('get_approved_job_approvals');
      
      if (approvedError) throw approvedError;
      
      // Fetch rejected job approvals
      const { data: rejectedData, error: rejectedError } = await supabase
        .rpc<JobApproval[]>('get_rejected_job_approvals');
      
      if (rejectedError) throw rejectedError;
      
      setPendingJobs(pendingData || []);
      setApprovedJobs(approvedData || []);
      setRejectedJobs(rejectedData || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load job approvals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // First create the necessary functions
    const setupFunctions = async () => {
      try {
        // Create a function to create a temporary view if it doesn't exist
        await supabase.rpc<void>('create_temp_view_if_not_exists');
        // Then fetch the jobs
        fetchJobs();
      } catch (error) {
        console.error('Error setting up functions:', error);
        toast({
          title: "Error",
          description: "Failed to set up database functions",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    setupFunctions();
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

  const handleApprove = async (job: JobApproval) => {
    try {
      const { data: userData, error: authUserError } = await supabase.auth.getUser();
      if (authUserError) throw authUserError;
      
      const { error } = await supabase
        .rpc<void>('approve_job', {
          job_approval_id: job.id,
          reviewer_id: userData.user.id
        });
      
      if (error) throw error;
      
      toast({
        title: "Job Approved",
        description: "The job posting has been approved successfully"
      });
      
      // Refresh the list
      fetchJobs();
    } catch (error) {
      console.error('Error approving job:', error);
      toast({
        title: "Error",
        description: "Failed to approve job",
        variant: "destructive"
      });
    }
  };

  const handleReject = async () => {
    if (!selectedJob) return;
    
    try {
      const { data: userData, error: authUserError } = await supabase.auth.getUser();
      if (authUserError) throw authUserError;
      
      const { error } = await supabase
        .rpc<void>('reject_job', {
          job_approval_id: selectedJob.id,
          reviewer_id: userData.user.id,
          reason: rejectionReason
        });
      
      if (error) throw error;
      
      toast({
        title: "Job Rejected",
        description: "The job posting has been rejected"
      });
      
      // Close dialog and reset state
      setShowRejectionDialog(false);
      setRejectionReason('');
      setSelectedJob(null);
      
      // Refresh the list
      fetchJobs();
    } catch (error) {
      console.error('Error rejecting job:', error);
      toast({
        title: "Error",
        description: "Failed to reject job",
        variant: "destructive"
      });
    }
  };

  const openRejectionDialog = (job: JobApproval) => {
    setSelectedJob(job);
    setShowRejectionDialog(true);
  };

  const viewJobDetails = (job: JobApproval) => {
    setJobDetails(job);
    setShowDetailsDialog(true);
  };

  if (loading) {
    return (
      <DashboardLayout userType="superadmin">
        <div className="p-6 flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <FiLoader className="animate-spin h-8 w-8 mb-4 text-primary" />
            <p>Loading job approvals...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="superadmin">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Job Approval Management</h1>
          <p className="text-gray-600 mt-1">
            Review and manage job postings submitted by employers
          </p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Approval ({pendingJobs.length})</TabsTrigger>
            <TabsTrigger value="approved">Recently Approved</TabsTrigger>
            <TabsTrigger value="rejected">Recently Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingJobs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FiCheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <p className="text-xl font-medium text-gray-700">All caught up!</p>
                  <p className="text-gray-500 mt-2">No pending job approvals.</p>
                </CardContent>
              </Card>
            ) : (
              pendingJobs.map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{job.jobs?.title || 'Untitled Job'}</CardTitle>
                        <p className="text-sm text-gray-600">{job.jobs?.companies?.name || 'Unknown Company'}</p>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Pending Review
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{job.jobs?.location || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium">{job.jobs?.job_type || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Salary Range</p>
                        <p className="font-medium">{job.jobs?.salary_range || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Job Description</p>
                      <p className="text-sm line-clamp-2">{job.jobs?.description || 'No description provided'}</p>
                    </div>
                    
                    {job.jobs?.skills && job.jobs.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {job.jobs.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline">{skill}</Badge>
                          ))}
                          {job.jobs.skills.length > 3 && (
                            <Badge variant="outline">+{job.jobs.skills.length - 3} more</Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-gray-500">
                        Submitted {formatDate(job.created_at)}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewJobDetails(job)}
                        >
                          <FiEye className="mr-1 h-4 w-4" />
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openRejectionDialog(job)}
                        >
                          <FiXCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => handleApprove(job)}
                        >
                          <FiCheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {approvedJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No recently approved jobs</p>
              </div>
            ) : (
              approvedJobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{job.jobs?.title || 'Unknown Job'}</h3>
                        <p className="text-sm text-gray-600">{job.jobs?.companies?.name || 'Unknown Company'}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">{job.jobs?.location || 'Location not specified'}</span>
                          <span className="text-xs text-gray-500">{job.jobs?.job_type || 'Type not specified'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge variant="outline" className="mb-2 bg-green-100 text-green-800 border-green-200">
                          Approved
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(job.reviewed_at)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No recently rejected jobs</p>
              </div>
            ) : (
              rejectedJobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{job.jobs?.title || 'Unknown Job'}</h3>
                        <p className="text-sm text-gray-600">{job.jobs?.companies?.name || 'Unknown Company'}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">{job.jobs?.location || 'Location not specified'}</span>
                          <span className="text-xs text-gray-500">{job.jobs?.job_type || 'Type not specified'}</span>
                        </div>
                        {job.rejection_reason && (
                          <div className="mt-3 p-2 bg-red-50 rounded-md text-sm">
                            <p className="font-medium text-red-700 mb-1">Rejection Reason:</p>
                            <p className="text-gray-700">{job.rejection_reason}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge variant="outline" className="mb-2 bg-red-100 text-red-800 border-red-200">
                          Rejected
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(job.reviewed_at)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Job Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Job Details</DialogTitle>
            </DialogHeader>
            {jobDetails && jobDetails.jobs && (
              <div className="py-4">
                <div className="flex justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">{jobDetails.jobs.title}</h2>
                    <p className="text-gray-600">{jobDetails.jobs.companies?.name || 'Unknown Company'}</p>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Pending Review
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p>{jobDetails.jobs.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type</h3>
                    <p>{jobDetails.jobs.job_type || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Salary Range</h3>
                    <p>{jobDetails.jobs.salary_range || 'Not specified'}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Job Description</h3>
                  <div className="prose max-w-none">
                    <p>{jobDetails.jobs.description}</p>
                  </div>
                </div>

                {jobDetails.jobs.skills && jobDetails.jobs.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {jobDetails.jobs.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Company Information</h3>
                  <p className="font-medium">{jobDetails.jobs.companies?.name || 'Unknown Company'}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    {jobDetails.jobs.companies?.industry || 'Industry not specified'} • 
                    {jobDetails.jobs.companies?.size || 'Size not specified'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Submission Information</h3>
                  <p className="text-sm">
                    Submitted on {formatDate(jobDetails.created_at)}
                  </p>
                </div>
              </div>
            )}
            <DialogFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setShowDetailsDialog(false)}
              >
                Close
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowDetailsDialog(false);
                    openRejectionDialog(jobDetails);
                  }}
                >
                  <FiXCircle className="mr-1 h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  variant="default"
                  onClick={() => {
                    setShowDetailsDialog(false);
                    handleApprove(jobDetails);
                  }}
                >
                  <FiCheckCircle className="mr-1 h-4 w-4" />
                  Approve
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rejection Dialog */}
        <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Job Posting</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="mb-1 text-sm font-medium">Provide a reason for rejection:</p>
              <Textarea 
                placeholder="Please explain why this job posting is being rejected..." 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="mt-2 text-xs text-gray-500">
                This message will be sent to the employer who submitted the job posting.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Reject Job Posting
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default JobApprovalPage;
