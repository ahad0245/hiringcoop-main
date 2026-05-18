
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FiMapPin, FiBriefcase, FiClock, FiDollarSign, FiCheckCircle, FiArrowLeft, FiVideo } from 'react-icons/fi';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const JobDetailPage = ({ embedded = false }: { embedded?: boolean }) => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [job, setJob] = useState<any | null>(null);
  const [employer, setEmployer] = useState<any | null>(null);
  const [companyProfile, setCompanyProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [savedVideos, setSavedVideos] = useState<{ id: string; label: string }[]>([]);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      const supabaseAny = supabase as any;

      const { data, error } = await supabaseAny
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error || !data) {
        setJob(null);
        setLoading(false);
        return;
      }

      setJob(data);

      // Fetch employer profile
      const { data: empProfile } = await supabaseAny
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', data.employer_id)
        .single();

      if (empProfile) setEmployer(empProfile);

      // Fetch company profile
      const { data: compData } = await supabaseAny
        .from('company_profiles')
        .select('name, logo_url, website, industry, size, location, description')
        .eq('user_id', data.employer_id)
        .maybeSingle();

      if (compData) setCompanyProfile(compData);

      // Check if already applied
      if (user) {
        const { data: existing } = await supabaseAny
          .from('applications')
          .select('id')
          .eq('job_id', jobId)
          .eq('candidate_id', user.id)
          .maybeSingle();
        if (existing) setAlreadyApplied(true);
      }

      setLoading(false);
    };

    fetchJob();
  }, [jobId, user]);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!user) return;
      const supabaseAny = supabase as any;
      const { data } = await supabaseAny
        .from('video_recordings')
        .select('id, title')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setSavedVideos(
          data.map((v: any) => ({
            id: v.id,
            label: v.title,
          }))
        );
      }
    };
    fetchVideos();
  }, [user]);

  const handleApply = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Please log in to apply' });
      return;
    }
    setSubmitting(true);
    const supabaseAny = supabase as any;
    const { error } = await supabaseAny.from('applications').insert({
      job_id: jobId,
      candidate_id: user.id,
      cover_letter: coverLetter || null,
      resume_url: selectedVideo || null, // storing video ref in resume_url for now
    });

    if (error) {
      toast({ variant: 'destructive', title: 'Application failed', description: error.message });
    } else {
      toast({ title: 'Application submitted!', description: 'Your application has been sent to the employer.' });
      setAlreadyApplied(true);
      setApplyOpen(false);
    }
    setSubmitting(false);
  };

  const formatSalary = (job: any) => {
    if (!job.salary_min && !job.salary_max) return null;
    const currency = job.salary_currency || 'USD';
    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
    if (job.salary_min && job.salary_max) return `${fmt(job.salary_min)} - ${fmt(job.salary_max)}`;
    if (job.salary_min) return `From ${fmt(job.salary_min)}`;
    return `Up to ${fmt(job.salary_max)}`;
  };

  if (loading) {
      const content = <div className="flex-grow flex items-center justify-center"><div className="animate-pulse">Loading job details...</div></div>;
      if (embedded) return content;
      return (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          {content}
          <Footer />
        </div>
      );
  }

  if (!job) {
    const notFoundContent = (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold">Job Not Found</h2>
        <p className="mt-4 text-muted-foreground">The job you're looking for doesn't exist or has been removed.</p>
        <div className="mt-8"><Link to="/jobs"><Button>Browse All Jobs</Button></Link></div>
      </div>
    );
    if (embedded) return notFoundContent;
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12"><div className="container-custom">{notFoundContent}</div></main>
        <Footer />
      </div>
    );
  }

  const companyName = companyProfile?.name || (employer ? `${employer.first_name || ''} ${employer.last_name || ''}`.trim() || 'Employer' : 'Employer');

  const mainContent = (
    <>
      <div className="container-custom py-6">
        <Link to={embedded ? "/candidate/applications" : "/jobs"} className="flex items-center text-muted-foreground hover:text-primary mb-6">
          <FiArrowLeft className="mr-2" /> {embedded ? 'Back to applications' : 'Back to all jobs'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary" className="capitalize">{job.job_type}</Badge>
                  <Badge variant="outline" className="capitalize">{job.status}</Badge>
                </div>
                <h1 className="text-2xl font-bold">{job.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                  {job.location && <span className="flex items-center"><FiMapPin className="mr-1" /> {job.location}</span>}
                  <span className="flex items-center"><FiBriefcase className="mr-1" /> {job.job_type}</span>
                  <span className="flex items-center"><FiClock className="mr-1" /> Posted {new Date(job.created_at).toLocaleDateString()}</span>
                  {(job.salary_min || job.salary_max) && <span className="flex items-center"><FiDollarSign className="mr-1" /> {formatSalary(job)}</span>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                  <p className="whitespace-pre-line">{job.description || 'No description provided.'}</p>
                </div>

                {job.requirements && job.requirements.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {job.requirements.map((req: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <FiCheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.benefits && job.benefits.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.benefits.map((b: string, idx: number) => (
                        <Badge key={idx} variant="outline">{b}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">About the Company</h3>

                {companyProfile?.logo_url && (
                  <div className="w-16 h-16 rounded-lg border border-border overflow-hidden mb-3">
                    <img src={companyProfile.logo_url} alt={companyName} className="w-full h-full object-contain" />
                  </div>
                )}

                <p className="font-medium text-base">{companyName}</p>

                {companyProfile && (
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {companyProfile.industry && (
                      <p><span className="font-medium text-foreground">Industry:</span> {companyProfile.industry}</p>
                    )}
                    {companyProfile.size && (
                      <p><span className="font-medium text-foreground">Size:</span> {companyProfile.size}</p>
                    )}
                    {companyProfile.location && (
                      <p className="flex items-center"><FiMapPin className="mr-1 shrink-0" /> {companyProfile.location}</p>
                    )}
                    {companyProfile.website && (
                      <a href={companyProfile.website.startsWith('http') ? companyProfile.website : `https://${companyProfile.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block">
                        Visit Website
                      </a>
                    )}
                    {companyProfile.description && (
                      <p className="pt-2 border-t border-border mt-2 text-xs leading-relaxed">{companyProfile.description}</p>
                    )}
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  {user ? (
                    alreadyApplied ? (
                      <Button className="w-full" disabled>
                        <FiCheckCircle className="mr-2" /> Already Applied
                      </Button>
                    ) : (
                      <>
                        <Button className="w-full" onClick={() => setApplyOpen(true)}>
                          Apply Now
                        </Button>
                        <Link to={`/apply/${jobId}`} className="block">
                          <Button variant="outline" className="w-full">
                            <FiVideo className="mr-2" /> Video Application
                          </Button>
                        </Link>
                      </>
                    )
                  ) : (
                    <Link to="/login">
                      <Button className="w-full">Log in to Apply</Button>
                    </Link>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
                  <p>Posted {new Date(job.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Apply Sheet */}
      <Sheet open={applyOpen} onOpenChange={setApplyOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Apply to {job.title}</SheetTitle>
            <SheetDescription>Submit your application to {companyName}</SheetDescription>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            <div>
              <Label htmlFor="cover-letter">Cover Letter (Optional)</Label>
              <Textarea id="cover-letter" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Tell the employer why you're a great fit..." rows={5} className="mt-2" />
            </div>

            {savedVideos.length > 0 && (
              <div>
                <Label>Attach a Video (Optional)</Label>
                <Select value={selectedVideo} onValueChange={setSelectedVideo}>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="Select a saved video" /></SelectTrigger>
                  <SelectContent>
                    {savedVideos.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <h4 className="font-medium mb-2">Application Details</h4>
              <div className="space-y-1">
                <p><strong>Position:</strong> {job.title}</p>
                <p><strong>Company:</strong> {companyName}</p>
                <p><strong>Type:</strong> {job.job_type}</p>
              </div>
            </div>
          </div>

          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setApplyOpen(false)}>Cancel</Button>
            <Button onClick={handleApply} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );

  if (embedded) return mainContent;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-muted/30">
        {mainContent}
      </main>
      <Footer />
    </div>
  );
};

export default JobDetailPage;
