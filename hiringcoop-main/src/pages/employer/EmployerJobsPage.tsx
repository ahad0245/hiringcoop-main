
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiPause, FiPlay } from 'react-icons/fi';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  location: string;
  job_type: string;
  status: string;
  created_at: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
}

const EmployerJobsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const sb = supabase as any;

  const fetchJobs = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await sb
      .from('jobs')
      .select('*')
      .eq('employer_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setJobs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, [user]);

  const toggleStatus = async (job: Job) => {
    const newStatus = job.status === 'active' ? 'paused' : 'active';
    const { error } = await sb.from('jobs').update({ status: newStatus }).eq('id', job.id);
    if (!error) {
      toast({ title: `Job ${newStatus === 'active' ? 'activated' : 'paused'}` });
      fetchJobs();
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    const { error } = await sb.from('jobs').delete().eq('id', jobId);
    if (!error) {
      toast({ title: 'Job deleted' });
      fetchJobs();
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'paused': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Paused</Badge>;
      case 'draft': return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case 'closed': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Closed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout userType="employer">
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Job Postings</h1>
            <p className="text-muted-foreground mt-1">Manage all your job listings</p>
          </div>
          <Link to="/dashboard/jobs/create">
            <Button><FiPlus className="mr-2" /> Post a Job</Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <p className="text-muted-foreground p-6">Loading...</p>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">You haven't posted any jobs yet.</p>
                <Link to="/dashboard/jobs/create">
                  <Button><FiPlus className="mr-2" /> Post Your First Job</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-b">
                      <th className="px-6 py-4">Job Title</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Salary</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Posted</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <Link to={`/dashboard/jobs/${job.id}/applicants`} className="font-medium text-primary hover:underline">
                            {job.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{job.location || '—'}</td>
                        <td className="px-6 py-4 text-muted-foreground capitalize">{job.job_type}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {job.salary_min && job.salary_max
                            ? `${job.salary_currency} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
                            : '—'}
                        </td>
                        <td className="px-6 py-4">{statusBadge(job.status)}</td>
                        <td className="px-6 py-4 text-muted-foreground text-sm">
                          {new Date(job.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => toggleStatus(job)} title={job.status === 'active' ? 'Pause' : 'Activate'}>
                              {job.status === 'active' ? <FiPause className="h-4 w-4" /> : <FiPlay className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteJob(job.id)} title="Delete">
                              <FiTrash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployerJobsPage;
