
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ==================== PROFILES ====================
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  user_type TEXT DEFAULT 'candidate',
  user_role TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, user_type, user_role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'candidate'),
    NEW.raw_user_meta_data->>'user_role'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================== ADMIN VERIFICATION CODES ====================
CREATE TABLE public.admin_verification_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 hour'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_verification_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read verification codes"
  ON public.admin_verification_codes FOR SELECT USING (true);

CREATE POLICY "Anyone can insert verification codes"
  ON public.admin_verification_codes FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update verification codes"
  ON public.admin_verification_codes FOR UPDATE USING (true);

-- ==================== ADMIN INVITATIONS ====================
CREATE TABLE public.admin_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  invitation_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  invited_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view invitations"
  ON public.admin_invitations FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert invitations"
  ON public.admin_invitations FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update invitations"
  ON public.admin_invitations FOR UPDATE TO authenticated USING (true);

-- ==================== VIDEO QUESTIONS ====================
CREATE TABLE public.video_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 60,
  is_active BOOLEAN NOT NULL DEFAULT true,
  category TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.video_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Video questions are viewable by everyone"
  ON public.video_questions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage video questions"
  ON public.video_questions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update video questions"
  ON public.video_questions FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete video questions"
  ON public.video_questions FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_video_questions_updated_at
  BEFORE UPDATE ON public.video_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== JOB QUESTIONS ====================
CREATE TABLE public.job_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL,
  question_id UUID NOT NULL REFERENCES public.video_questions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.job_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Job questions are viewable by everyone"
  ON public.job_questions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage job questions"
  ON public.job_questions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete job questions"
  ON public.job_questions FOR DELETE TO authenticated USING (true);

-- ==================== RPC FUNCTIONS ====================

-- Create admin verification code
CREATE OR REPLACE FUNCTION public.create_admin_verification_code(email_address TEXT)
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
BEGIN
  new_code := lpad(floor(random() * 1000000)::text, 6, '0');
  INSERT INTO public.admin_verification_codes (email, code)
  VALUES (email_address, new_code);
  RETURN new_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Verify admin code
CREATE OR REPLACE FUNCTION public.verify_admin_code(email_address TEXT, verification_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  is_valid BOOLEAN;
BEGIN
  UPDATE public.admin_verification_codes
  SET verified = true
  WHERE email = email_address
    AND code = verification_code
    AND verified = false
    AND expires_at > now();
  
  GET DIAGNOSTICS is_valid = ROW_COUNT;
  RETURN is_valid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create admin invitation
CREATE OR REPLACE FUNCTION public.create_admin_invitation(email_address TEXT, inviter_id UUID)
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
BEGIN
  new_code := lpad(floor(random() * 1000000)::text, 6, '0');
  INSERT INTO public.admin_invitations (email, invitation_code, invited_by)
  VALUES (email_address, new_code, inviter_id);
  RETURN new_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
