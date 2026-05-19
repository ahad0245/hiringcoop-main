ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS candidate_name text,
  ADD COLUMN IF NOT EXISTS candidate_email text;

UPDATE public.applications a
SET
  candidate_name = COALESCE(a.candidate_name, NULLIF(trim(concat(COALESCE(p.first_name, ''), ' ', COALESCE(p.last_name, ''))), ''), 'Unknown'),
  candidate_email = COALESCE(a.candidate_email, p.contact_email, p.email)
FROM public.profiles p
WHERE p.id = a.candidate_id;
