
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CandidateStats from '@/components/dashboard/candidate/CandidateStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const statusColors: Record<string, string> = {
  new: 'text-blue-600 bg-blue-50',
  reviewing: 'text-yellow-600 bg-yellow-50',
  shortlisted: 'text-purple-600 bg-purple-50',
  interview: 'text-blue-600 bg-blue-50',
  offered: 'text-green-600 bg-green-50',
  rejected: 'text-red-600 bg-red-50',
  accepted: 'text-green-600 bg-green-50',
};

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const s = supabase as any;
      const [profileRes, appsRes, jobsRes] = await Promise.all([
        s.from('profiles').select('first_name, last_name').eq('id', user.id).single(),
        s.from('applications').select('*, jobs(title, location, employer_id)').eq('candidate_id', user.id).order('created_at', { ascending: false }).limit(5),
        s.from('jobs').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(5),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (appsRes.data) setApplications(appsRes.data);
      if (jobsRes.data) setRecommendedJobs(jobsRes.data);
      setLoading(false);
    };
    load();
  }, [user]);

  const firstName = profile?.first_name || 'there';

  return (
    <DashboardLayout userType="candidate">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">Candidate Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {firstName}! Here's an overview of your job search.
          </p>
        </div>

        <CandidateStats userId={user?.id || ''} />

        {/* Video Banner */}
        <div className="bg-gradient-to-r from-coop-blue to-coop-purple rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Your Video Introduction</h2>
              <p className="mt-2 opacity-90">Record a video to stand out to employers.</p>
              <div className="mt-4">
                <Link to="/dashboard/videos" className="bg-white text-primary px-4 py-2 rounded-md font-medium inline-flex items-center">
                  Update Video <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Recent Applications</CardTitle>
              <Link to="/candidate/applications" className="text-sm text-primary hover:underline">View All</Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : applications.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4">You haven't applied to any jobs yet. <Link to="/jobs" className="text-primary hover:underline">Browse jobs</Link></p>
              ) : (
                <div className="space-y-4">
                  {applications.map((app: any) => (
                    <div key={app.id} className="p-3 bg-muted/50 rounded-md flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{app.jobs?.title || 'Unknown Job'}</h3>
                        <p className="text-xs text-muted-foreground mt-1">Applied: {new Date(app.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[app.status] || 'text-muted-foreground bg-muted'}`}>
                        {app.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Jobs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Recommended for You</CardTitle>
              <Link to="/jobs" className="text-sm text-primary hover:underline">Browse Jobs</Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : recommendedJobs.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4">No active jobs right now. Check back soon!</p>
              ) : (
                <div className="space-y-4">
                  {recommendedJobs.map((job: any) => (
                    <div key={job.id} className="p-3 bg-muted/50 rounded-md">
                      <h3 className="font-medium">{job.title}</h3>
                      {job.location && <p className="text-xs text-muted-foreground mt-1">{job.location}</p>}
                      <div className="mt-2">
                        <Link to={`/jobs/${job.id}`} className="text-sm text-primary hover:underline inline-flex items-center">
                          View Details <FiArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CandidateDashboard;
