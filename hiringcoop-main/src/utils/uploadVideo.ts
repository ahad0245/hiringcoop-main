import { supabase } from '@/integrations/supabase/client';

/**
 * Upload a video blob to storage with retry logic and chunked approach.
 * Returns the storage path on success, throws on failure.
 */
export async function uploadVideoBlob(
  blob: Blob,
  userId: string,
  index: number,
  onProgress?: (msg: string) => void
): Promise<string> {
  const fileName = `${userId}/${crypto.randomUUID()}_q${index + 1}.webm`;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      onProgress?.(`Uploading Q${index + 1} (attempt ${attempt})...`);

      const { error } = await (supabase as any).storage
        .from('video-recordings')
        .upload(fileName, blob, {
          contentType: 'video/webm',
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      return fileName;
    } catch (err: any) {
      console.error(`Upload attempt ${attempt} for Q${index + 1} failed:`, err);
      if (attempt === maxRetries) {
        throw new Error(`Upload failed for Q${index + 1} after ${maxRetries} attempts: ${err.message}`);
      }
      // Wait before retry (exponential backoff)
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }

  throw new Error('Unexpected upload failure');
}
