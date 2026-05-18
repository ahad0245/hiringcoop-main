
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiBriefcase, FiClock, FiBookmark, FiDollarSign } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface JobListProps {
  searchKeywords?: string;
  searchLocation?: string;
  filters?: any;
}

const JobList = ({ searchKeywords = '', searchLocation = '', filters = {} }: JobListProps) => {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const supabaseAny = supabase as any;
      const { data, error } = await supabaseAny
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setJobs(data);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const formatSalary = (job: any) => {
    if (!job.salary_min && !job.salary_max) return null;
    const currency = job.salary_currency || 'USD';
    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
    if (job.salary_min && job.salary_max) return `${fmt(job.salary_min)} - ${fmt(job.salary_max)}`;
    if (job.salary_min) return `From ${fmt(job.salary_min)}`;
    return `Up to ${fmt(job.salary_max)}`;
  };

  const filteredJobs = jobs.filter(job => {
    const keywordMatch = !searchKeywords ||
      job.title?.toLowerCase().includes(searchKeywords.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchKeywords.toLowerCase());
    const locationMatch = !searchLocation ||
      job.location?.toLowerCase().includes(searchLocation.toLowerCase());
    const jobTypeMatch = !filters.jobType || filters.jobType.length === 0 ||
      filters.jobType.includes(job.job_type);
    return keywordMatch && locationMatch && jobTypeMatch;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6"><div className="h-20 bg-muted rounded" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No jobs found</h3>
          <p className="mt-1 text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      ) : (
        filteredJobs.map((job) => (
          <Card key={job.id} className="overflow-hidden card-hover border">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-xl text-primary">
                      {job.title?.charAt(0) || 'J'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold line-clamp-1">{job.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {job.job_type?.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className="text-muted-foreground hover:text-primary"
                    aria-label={savedJobs.includes(job.id) ? 'Unsave job' : 'Save job'}
                  >
                    <FiBookmark className={`h-5 w-5 ${savedJobs.includes(job.id) ? 'fill-primary text-primary' : ''}`} />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-4">
                  {job.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FiMapPin className="mr-1 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                  )}
                  {formatSalary(job) && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FiDollarSign className="mr-1 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{formatSalary(job)}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FiClock className="mr-1 h-4 w-4 flex-shrink-0" />
                    <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex border-t">
                <Link to={`/jobs/${job.id}`} className="flex-1">
                  <Button variant="ghost" className="w-full rounded-none py-3">View Details</Button>
                </Link>
                <div className="w-px bg-border"></div>
                <Link to={`/jobs/${job.id}`} className="flex-1">
                  <Button variant="ghost" className="w-full rounded-none py-3 text-primary hover:text-primary/90">Quick Apply</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default JobList;
