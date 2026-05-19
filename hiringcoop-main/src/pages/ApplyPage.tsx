import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ApplySteps from '@/components/apply/ApplySteps';
import VideoRecorder from '@/components/video/VideoRecorder';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const mockQuestions = [
  'Tell us about yourself and your professional experience.',
  'What interests you about this position?',
  "Describe a challenging project you've worked on and how you overcame obstacles.",
];

const ApplyPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [job, setJob] = useState<any>(null);
  const [companyName, setCompanyName] = useState<string>('Company');
  const [loading, setLoading] = useState(true);

  // Basic info state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');

  // Video interview state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordedVideos, setRecordedVideos] = useState<Blob[]>([]);

  // ID verification state
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchContext = async () => {
      if (!jobId) {
        setLoading(false);
        navigate('/jobs');
        return;
      }

      setLoading(true);
      const sb = supabase as any;

      const { data: jobData, error: jobError } = await sb
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobError || !jobData) {
        toast({ variant: 'destructive', title: 'Job not found' });
        setLoading(false);
        navigate('/jobs');
        return;
      }

      setJob(jobData);

      if (user) {
        const withContact = await sb
          .from('profiles')
          .select('first_name,last_name,email,contact_email')
          .eq('id', user.id)
          .maybeSingle();

        let profile = withContact.data;
        if (withContact.error && String(withContact.error.message || '').includes('contact_email')) {
          const fallback = await sb
            .from('profiles')
            .select('first_name,last_name,email')
            .eq('id', user.id)
            .maybeSingle();
          profile = fallback.data;
        }

        const fullName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim();
        if (fullName) setName(fullName);

        const resolvedEmail = profile?.contact_email || profile?.email || user.email || '';
        if (resolvedEmail) setEmail(resolvedEmail);
      }

      const { data: company } = await sb
        .from('company_profiles')
        .select('name')
        .eq('user_id', jobData.employer_id)
        .maybeSingle();

      setCompanyName(company?.name || 'Company');
      setLoading(false);
    };

    fetchContext();
  }, [jobId, user, navigate, toast]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleVideoRecorded = (videoBlob: Blob) => {
    const newRecordedVideos = [...recordedVideos];
    newRecordedVideos[currentQuestionIndex] = videoBlob;
    setRecordedVideos(newRecordedVideos);

    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleNext();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!user || !jobId || !job) {
      toast({ variant: 'destructive', title: 'Unable to submit application' });
      return;
    }

    setSubmitting(true);
    const sb = supabase as any;

    const payload = {
      job_id: jobId,
      candidate_id: user.id,
      cover_letter: coverLetter || null,
      resume_url: null,
      candidate_name: name || null,
      candidate_email: email || user.email || null,
      status: 'new',
    };

    const { error } = await sb.from('applications').insert(payload);

    if (error) {
      const msg = String(error.message || '');
      const duplicate = msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('unique');
      toast({
        variant: 'destructive',
        title: duplicate ? 'Already applied' : 'Application failed',
        description: duplicate ? 'You have already applied to this job.' : msg,
      });
      setSubmitting(false);
      return;
    }

    toast({ title: 'Application submitted!' });
    setSubmitting(false);
    navigate('/candidate/applications');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Apply for: {job.title}</h1>
            <p className="text-gray-600 mt-2">
              {companyName} • {job.location || 'Remote'} • {job.job_type || 'full-time'}
            </p>
          </div>

          <div className="mb-12">
            <ApplySteps currentStep={step} />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 border">
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" placeholder="Enter your full name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" placeholder="Enter your email address" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" placeholder="Enter your phone number" />
                  </div>
                  <div>
                    <Label htmlFor="resume">Resume/CV</Label>
                    <div className="mt-1">
                      <Input id="resume" type="file" onChange={(e) => handleFileChange(e, setResumeFile)} accept=".pdf,.doc,.docx" />
                      <p className="mt-1 text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX. Maximum size: 5MB</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cover">Cover Letter (Optional)</Label>
                    <Textarea id="cover" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} className="mt-1 h-32" placeholder="Tell us why you're interested in this position" />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button onClick={handleNext}>Continue to Video Interview</Button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Video Interview</h2>
                <VideoRecorder onVideoRecorded={handleVideoRecorded} questionText={mockQuestions[currentQuestionIndex]} questionNumber={currentQuestionIndex + 1} totalQuestions={mockQuestions.length} />

                {currentQuestionIndex > 0 && (
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>Previous Question</Button>
                    {recordedVideos[currentQuestionIndex] && <Button onClick={handleNext}>Skip to Next Step</Button>}
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">ID Verification</h2>
                <p className="mb-6 text-gray-600">
                  Please upload a photo of a government-issued ID to verify your identity.
                  This helps build trust with employers and improves your chances of getting hired.
                </p>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="id-front">ID Front Side</Label>
                    <div className="mt-1">
                      <Input id="id-front" type="file" onChange={(e) => handleFileChange(e, setIdFrontFile)} accept="image/*" />
                      <p className="mt-1 text-xs text-gray-500">Accepted formats: JPG, PNG, PDF. Maximum size: 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <p className="text-sm text-gray-500">
                    Your ID will only be used for verification purposes and will be stored securely.
                    Learn more about our <a href="/privacy" className="text-primary hover:underline">privacy policy</a>.
                  </p>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={handleBack}>Back</Button>
                  <Button onClick={handleNext}>Continue to Submit</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Review & Submit</h2>
                <p className="mb-6 text-gray-600">Please review your application before submitting.</p>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Name:</div>
                      <div className="font-medium">{name}</div>
                      <div>Email:</div>
                      <div className="font-medium">{email}</div>
                      <div>Phone:</div>
                      <div className="font-medium">{phone}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Documents</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Resume:</div>
                      <div className="font-medium">{resumeFile ? resumeFile.name : 'Not uploaded'}</div>
                      <div>Cover Letter:</div>
                      <div className="font-medium">{coverLetter ? 'Provided' : 'Not provided'}</div>
                      <div>ID Verification:</div>
                      <div className="font-medium">{idFrontFile ? 'Uploaded' : 'Not uploaded'}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Video Interview</h3>
                    <div className="text-sm">
                      <p>{recordedVideos.length} of {mockQuestions.length} questions answered</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={handleBack}>Back</Button>
                  <Button onClick={handleSubmit} disabled={submitting} className="px-8">
                    {submitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </div>
                    ) : 'Submit Application'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApplyPage;
