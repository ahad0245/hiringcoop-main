
CREATE TABLE public.candidate_experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  location TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.candidate_experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view experience" ON public.candidate_experience FOR SELECT USING (true);
CREATE POLICY "Users can insert own experience" ON public.candidate_experience FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own experience" ON public.candidate_experience FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own experience" ON public.candidate_experience FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_candidate_experience_updated_at
BEFORE UPDATE ON public.candidate_experience
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
