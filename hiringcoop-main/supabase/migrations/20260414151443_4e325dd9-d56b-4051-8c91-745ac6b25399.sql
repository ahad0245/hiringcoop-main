CREATE POLICY "Public can view featured recordings"
ON public.video_recordings FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = video_recordings.user_id
      AND profiles.is_public = true
      AND profiles.featured_recording_group_id IS NOT NULL
      AND profiles.featured_recording_group_id = video_recordings.recording_group_id
  )
);