
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { FiSearch, FiCalendar, FiClock, FiVideo, FiClipboard, FiCheck, FiXCircle } from 'react-icons/fi';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';

interface Application {
  id: string;
  status: string;
  created_at: string;
  cover_letter: string | null;
  jobs: {
    id: string;
    title: string;
    location: string | null;
  } | null;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  reviewing: { label: 'Under Review', color: 'bg-blue-100 text-blue-800' },
  shortlisted: { label: 'Shortlisted', color: 'bg-purple-100 text-purple-800' },
  interview: { label: 'Interview', color: 'bg-purple-100 text-purple-800' },
  offered: { label: 'Offer Received', color: 'bg-green-100 text-green-800' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Not Selected', color: 'bg-red-100 text-red-800' },
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'new': return <FiClock className="h-4 w-4" />;
    case 'reviewing': return <FiClipboard className="h-4 w-4" />;
    case 'interview': return <FiVideo className="h-4 w-4" />;
    case 'rejected': return <FiXCircle className="h-4 w-4" />;
    case 'accepted':
    case 'offered': return <FiCheck className="h-4 w-4" />;
    default: return <FiClock className="h-4 w-4" />;
  }
};

const ApplicationHistoryPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!user) return;
    const fetchApplications = async () => {
      const { data, error } = await (supabase as any)
        .from('applications')
        .select('id, status, created_at, cover_letter, jobs(id, title, location)')
        .eq('candidate_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setApplications(data);
      if (error) console.error('Error fetching applications:', error);
      setLoading(false);
    };
    fetchApplications();
  }, [user]);

  const filtered = applications.filter(app => {
    const matchesSearch =
      (app.jobs?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = applications.filter(a => !['rejected', 'accepted'].includes(a.status)).length;
  const interviewCount = applications.filter(a => ['interview', 'offered', 'accepted'].includes(a.status)).length;

  return (
    <DashboardLayout userType="candidate">
      <div className="container max-w-5xl py-8">
        <h1 className="text-2xl font-bold mb-2">Application History</h1>
        <p className="text-muted-foreground mb-6">Track and manage all your job applications in one place</p>

        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search positions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="new">Pending</SelectItem>
                <SelectItem value="reviewing">Under Review</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offered">Offer Received</SelectItem>
                <SelectItem value="rejected">Not Selected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-4 mb-4">
                <FiClipboard className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium mb-2">No applications found</p>
              <p className="text-muted-foreground text-center max-w-md">
                {searchTerm || statusFilter !== 'all'
                  ? "Try adjusting your filters to see more results."
                  : <>When you apply for jobs, they will appear here. <Link to="/jobs" className="text-primary hover:underline">Browse jobs</Link></>}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map(app => {
              const cfg = statusConfig[app.status] || { label: app.status, color: 'bg-muted text-muted-foreground' };
              return (
                <Card key={app.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="border-l-4 border-primary p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12 rounded-md">
                            <AvatarFallback className="rounded-md bg-primary text-primary-foreground">
                              {(app.jobs?.title || 'J').charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{app.jobs?.title || 'Unknown Job'}</h3>
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                              <FiCalendar className="h-3 w-3 mr-1" />
                              <span>Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                              {app.jobs?.location && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>{app.jobs.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center mt-4 sm:mt-0 gap-3">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(app.status)}
                            <Badge className={cfg.color} variant="outline">{cfg.label}</Badge>
                          </div>
                          {app.jobs?.id && (
                            <Link to={`/dashboard/jobs/${app.jobs.id}`}>
                              <Button variant="outline" size="sm">View Job</Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Application Insights</CardTitle>
            <CardDescription>Key statistics about your job applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <h3 className="text-2xl font-bold">{applications.length}</h3>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <h3 className="text-2xl font-bold">{activeCount}</h3>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Interview Rate</p>
                <h3 className="text-2xl font-bold">
                  {applications.length > 0 ? Math.round((interviewCount / applications.length) * 100) : 0}%
                </h3>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 border-t">
            <p className="text-sm text-muted-foreground">
              Data reflects all your applications on HiringCoop
            </p>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ApplicationHistoryPage;
