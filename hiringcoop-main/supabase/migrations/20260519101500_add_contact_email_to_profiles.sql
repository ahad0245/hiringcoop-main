ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS contact_email text;

UPDATE public.profiles
SET contact_email = COALESCE(contact_email, email)
WHERE contact_email IS NULL OR contact_email = '';
