
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiPlus, FiUsers, FiBriefcase, FiClock, FiEye, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Job {
  id: string;
  title: string;
  location: string;
  job_type: string;
  status: string;
  created_at: string;
  applicant_count?: number;
}

interface Applicant {
  id: string;
  candidate_id: string;
  status: string;
  created_at: string;
  job_title: string;
  candidate_name: string;
}

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0, newToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      const sb = supabase as any;

      // Fetch employer's jobs
      const { data: jobsData } = await sb
        .from('jobs')
        .select('*')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });

      const jobsList: Job[] = jobsData || [];

      // Fetch applications for employer's jobs
      const jobIds = jobsList.map(j => j.id);
      let allApps: any[] = [];
      if (jobIds.length > 0) {
        const { data: appsData } = await sb
          .from('applications')
          .select('*')
          .in('job_id', jobIds)
          .order('created_at', { ascending: false });
        allApps = appsData || [];
      }

      // Enrich jobs with applicant count
      const enrichedJobs = jobsList.map(j => ({
        ...j,
        applicant_count: allApps.filter(a => a.job_id === j.id).length,
      }));

      // Build recent applicants with names
      const candidateIds = [...new Set(allApps.map(a => a.candidate_id))];
      let profilesMap: Record<string, string> = {};
      if (candidateIds.length > 0) {
        const { data: profiles } = await sb
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', candidateIds);
        (profiles || []).forEach((p: any) => {
          profilesMap[p.id] = `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown';
        });
      }

      const recentApps: Applicant[] = allApps.slice(0, 6).map((a: any) => {
        const job = jobsList.find(j => j.id === a.job_id);
        return {
          id: a.id,
          candidate_id: a.candidate_id,
          status: a.status,
          created_at: a.created_at,
          job_title: job?.title || 'Unknown',
          candidate_name: profilesMap[a.candidate_id] || a.candidate_name || 'Unknown',
        };
      });

      const today = new Date().toISOString().slice(0, 10);
      const newToday = allApps.filter(a => a.created_at.slice(0, 10) === today).length;

      setJobs(enrichedJobs);
      setApplicants(recentApps);
      setStats({
        activeJobs: jobsList.filter(j => j.status === 'active').length,
        totalApplicants: allApps.length,
        newToday,
      });
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const formatDate = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-50 text-green-700';
      case 'reviewed': return 'bg-blue-50 text-blue-700';
      case 'shortlisted': return 'bg-purple-50 text-purple-700';
      case 'interview': return 'bg-amber-50 text-amber-700';
      case 'hired': return 'bg-emerald-50 text-emerald-700';
      case 'rejected': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <DashboardLayout userType="employer">
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Employer Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back to your hiring dashboard!
            </p>
          </div>
          <Link to="/dashboard/jobs/create">
            <Button className="flex items-center">
              <FiPlus className="mr-2" /> Post a Job
            </Button>
          </Link>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                  <h4 className="text-2xl font-bold mt-1">{stats.activeJobs}</h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <FiBriefcase size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Applicants</p>
                  <h4 className="text-2xl font-bold mt-1">{stats.totalApplicants}</h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FiUsers size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Today</p>
                  <h4 className="text-2xl font-bold mt-1">{stats.newToday}</h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <FiClock size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                  <h4 className="text-2xl font-bold mt-1">{jobs.length}</h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <FiEye size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Postings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Active Job Postings</CardTitle>
            <Link to="/dashboard/jobs" className="text-sm text-primary hover:underline">
              Manage All Jobs
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground py-4">Loading...</p>
            ) : jobs.filter(j => j.status === 'active').length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No active job postings yet.</p>
                <Link to="/dashboard/jobs/create">
                  <Button><FiPlus className="mr-2" /> Post Your First Job</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <th className="px-4 py-3">Job Title</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Applicants</th>
                      <th className="px-4 py-3">Posted</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {jobs.filter(j => j.status === 'active').slice(0, 5).map((job) => (
                      <tr key={job.id}>
                        <td className="px-4 py-4 font-medium">{job.title}</td>
                        <td className="px-4 py-4 text-muted-foreground">{job.location || '—'}</td>
                        <td className="px-4 py-4 text-muted-foreground capitalize">{job.job_type}</td>
                        <td className="px-4 py-4 text-muted-foreground">{job.applicant_count}</td>
                        <td className="px-4 py-4 text-muted-foreground">{formatDate(job.created_at)}</td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 capitalize">
                            {job.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Link to={`/dashboard/jobs/${job.id}/applicants`} className="text-primary hover:underline text-sm">
                            View Applicants
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applicants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Applicants</CardTitle>
            <Link to="/dashboard/candidates" className="text-sm text-primary hover:underline">
              View All Applicants
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground py-4">Loading...</p>
            ) : applicants.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No applicants yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {applicants.map((applicant) => (
                  <div key={applicant.id} className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{applicant.candidate_name}</h3>
                        <p className="text-sm text-muted-foreground">{applicant.job_title}</p>
                        <span className="text-xs text-muted-foreground">Applied {formatDate(applicant.created_at)}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${statusColor(applicant.status)}`}>
                        {applicant.status}
                      </span>
                    </div>
                    <div className="mt-4">
                      <Link
                        to={`/dashboard/candidates/${applicant.candidate_id}?app=${applicant.id}`}
                        className="text-sm text-primary hover:underline inline-flex items-center"
                      >
                        View Profile <FiArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployerDashboard;
