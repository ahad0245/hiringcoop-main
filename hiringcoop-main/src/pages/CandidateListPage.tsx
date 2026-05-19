
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

const supabaseAny = supabase as any;

interface Candidate {
  id: string;
  candidateId: string;
  name: string;
  title: string;
  location: string;
  skills: string[];
  appliedDate: string;
  status: string;
  avatar: string;
  jobTitle: string;
}

const getInitials = (name: string) => name.split(' ').map(p => p.charAt(0)).join('').toUpperCase();

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800 border-blue-200',
    reviewed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    shortlisted: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
  };
  return map[status] || 'bg-muted text-muted-foreground';
};

const CandidateListPage = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    if (!user) return;
    const fetchCandidates = async () => {
      setLoading(true);
      // Get employer's jobs
      const { data: jobs } = await supabaseAny.from('jobs').select('id, title').eq('employer_id', user.id);
      if (!jobs || jobs.length === 0) { setLoading(false); return; }

      const jobIds = jobs.map((j: any) => j.id);
      const jobMap = Object.fromEntries(jobs.map((j: any) => [j.id, j.title]));

      // Get applications for those jobs
      const { data: apps } = await supabaseAny.from('applications').select('*').in('job_id', jobIds).order('created_at', { ascending: false });
      if (!apps || apps.length === 0) { setLoading(false); return; }

      const candidateIds = [...new Set(apps.map((a: any) => a.candidate_id))];
      const { data: profiles } = await supabaseAny.from('profiles').select('*').in('id', candidateIds);
      const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p]));

      const mapped: Candidate[] = apps.map((app: any) => {
        const p = profileMap[app.candidate_id] || {};
        return {
          id: app.id,
          candidateId: app.candidate_id,
          name: [p.first_name, p.last_name].filter(Boolean).join(' ') || app.candidate_name || 'Unknown',
          title: p.headline || p.title || '',
          location: p.location || '',
          skills: p.skills || [],
          appliedDate: app.created_at,
          status: app.status,
          avatar: p.avatar_url || '',
          jobTitle: jobMap[app.job_id] || '',
        };
      });
      setCandidates(mapped);
      setLoading(false);
    };
    fetchCandidates();
  }, [user]);

  const filtered = candidates.filter(c => {
    const matchesSearch = !searchTerm || c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout userType="employer">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Candidates</h1>
          <p className="text-muted-foreground">Review and manage job applicants</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input placeholder="Search by name, title, or skills" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No candidates found</h3>
            <p className="text-muted-foreground mt-1">
              {candidates.length === 0 ? 'No one has applied to your jobs yet' : 'Try adjusting your search criteria'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(candidate => (
              <Card key={candidate.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={candidate.avatar} alt={candidate.name} />
                        <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{candidate.name}</h3>
                        <p className="text-muted-foreground">{candidate.title}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className={getStatusColor(candidate.status)}>
                            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                          </Badge>
                          {candidate.location && <Badge variant="outline" className="bg-muted">{candidate.location}</Badge>}
                          <Badge variant="outline" className="bg-muted">Applied for: {candidate.jobTitle}</Badge>
                        </div>
                        {candidate.skills.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 5).map((skill, i) => (
                              <span key={i} className="inline-block bg-muted text-muted-foreground text-xs px-2 py-1 rounded">{skill}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex flex-col items-end">
                      <div className="text-sm text-muted-foreground mb-3">
                        Applied {formatDistanceToNow(new Date(candidate.appliedDate), { addSuffix: true })}
                      </div>
                      <Link to={`/dashboard/candidates/${candidate.candidateId}?app=${candidate.id}`}>
                        <Button>View Profile</Button>
                      </Link>
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

export default CandidateListPage;
