
-- Create video_recordings table
CREATE TABLE public.video_recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  duration TEXT,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video_recordings ENABLE ROW LEVEL SECURITY;

-- Users can view their own recordings
CREATE POLICY "Users can view own recordings"
ON public.video_recordings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own recordings
CREATE POLICY "Users can insert own recordings"
ON public.video_recordings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own recordings
CREATE POLICY "Users can delete own recordings"
ON public.video_recordings FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('video-recordings', 'video-recordings', false);

-- Storage policies: users can upload to their own folder
CREATE POLICY "Users can upload own videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'video-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can read their own videos
CREATE POLICY "Users can read own videos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'video-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own videos
CREATE POLICY "Users can delete own videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'video-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);
