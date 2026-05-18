-- Employers can view video recordings for candidates who applied to their jobs
CREATE POLICY "Employers can view candidate recordings"
ON public.video_recordings FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.jobs j ON j.id = a.job_id
    WHERE a.candidate_id = video_recordings.user_id
    AND j.employer_id = auth.uid()
  )
);

-- Employers can read video files for candidates who applied to their jobs
CREATE POLICY "Employers can read candidate videos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'video-recordings'
  AND EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.jobs j ON j.id = a.job_id
    WHERE a.candidate_id = (storage.foldername(name))[1]::uuid
    AND j.employer_id = auth.uid()
  )
);