
-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  job_type TEXT NOT NULL DEFAULT 'full-time',
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  requirements TEXT[],
  benefits TEXT[],
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Everyone can view active jobs
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs FOR SELECT
  USING (status = 'active');

-- Employers can view all their own jobs (any status)
CREATE POLICY "Employers can view own jobs"
  ON public.jobs FOR SELECT
  TO authenticated
  USING (auth.uid() = employer_id);

-- Employers can create jobs
CREATE POLICY "Employers can create jobs"
  ON public.jobs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = employer_id);

-- Employers can update own jobs
CREATE POLICY "Employers can update own jobs"
  ON public.jobs FOR UPDATE
  TO authenticated
  USING (auth.uid() = employer_id);

-- Employers can delete own jobs
CREATE POLICY "Employers can delete own jobs"
  ON public.jobs FOR DELETE
  TO authenticated
  USING (auth.uid() = employer_id);

-- Trigger for updated_at
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  cover_letter TEXT,
  resume_url TEXT,
  employer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Candidates can view their own applications
CREATE POLICY "Candidates can view own applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (auth.uid() = candidate_id);

-- Employers can view applications for their jobs
CREATE POLICY "Employers can view applications for their jobs"
  ON public.applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

-- Candidates can create applications
CREATE POLICY "Candidates can create applications"
  ON public.applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = candidate_id);

-- Employers can update application status/notes for their jobs
CREATE POLICY "Employers can update applications for their jobs"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
