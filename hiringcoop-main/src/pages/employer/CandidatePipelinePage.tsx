
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { FiArrowLeft, FiUser, FiMail } from 'react-icons/fi';

interface Application {
  id: string;
  candidate_id: string;
  status: string;
  cover_letter: string | null;
  created_at: string;
  candidate_name: string;
  candidate_email: string;
}

const STATUSES = ['new', 'reviewed', 'shortlisted', 'interview', 'hired', 'rejected'];

const CandidatePipelinePage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const sb = supabase as any;

  const fetchData = async () => {
    if (!user || !jobId) return;
    setLoading(true);

    // Get job info
    const { data: job } = await sb.from('jobs').select('title, employer_id').eq('id', jobId).single();
    if (!job || job.employer_id !== user.id) {
      setLoading(false);
      return;
    }
    setJobTitle(job.title);

    // Get applications
    const { data: apps } = await sb
      .from('applications')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    const appsList = apps || [];
    const candidateIds = appsList.map((a: any) => a.candidate_id);

    let profilesMap: Record<string, { name: string; email: string }> = {};
    if (candidateIds.length > 0) {
      const { data: profiles } = await sb
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', candidateIds);
      (profiles || []).forEach((p: any) => {
        profilesMap[p.id] = {
          name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown',
          email: '',
        };
      });
    }

    const enriched: Application[] = appsList.map((a: any) => ({
      id: a.id,
      candidate_id: a.candidate_id,
      status: a.status,
      cover_letter: a.cover_letter,
      created_at: a.created_at,
      candidate_name: profilesMap[a.candidate_id]?.name || 'Unknown',
      candidate_email: profilesMap[a.candidate_id]?.email || '',
    }));

    setApplications(enriched);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user, jobId]);

  const updateStatus = async (appId: string, newStatus: string) => {
    const { error } = await sb.from('applications').update({ status: newStatus }).eq('id', appId);
    if (!error) {
      toast({ title: `Status updated to ${newStatus}` });
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'interview': return 'bg-amber-100 text-amber-800';
      case 'hired': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  return (
    <DashboardLayout userType="employer">
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/jobs">
            <Button variant="ghost" size="icon"><FiArrowLeft /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Applicants for {jobTitle || '...'}</h1>
            <p className="text-muted-foreground">{applications.length} total applicants</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Filter:</span>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUSES.map(s => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading applicants...</p>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {applications.length === 0 ? 'No applicants for this job yet.' : 'No applicants match this filter.'}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <Card key={app.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FiUser className="text-primary" />
                      </div>
                      <div>
                        <Link to={`/dashboard/candidates/${app.candidate_id}`} className="font-medium hover:underline text-primary">
                          {app.candidate_name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Applied {new Date(app.created_at).toLocaleDateString()}
                        </p>
                        {app.cover_letter && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{app.cover_letter}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${statusColor(app.status)} hover:${statusColor(app.status)} capitalize`}>
                        {app.status}
                      </Badge>
                      <Select value={app.status} onValueChange={(val) => updateStatus(app.id, val)}>
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map(s => (
                            <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CandidatePipelinePage;
