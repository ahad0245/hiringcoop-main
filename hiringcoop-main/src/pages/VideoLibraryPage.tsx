import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { FiPlus, FiTrash2, FiDownload, FiPlay, FiEdit2, FiCheck, FiStar } from 'react-icons/fi';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import InterviewPlayer from '@/components/video/InterviewPlayer';
import { formatDistanceToNow } from 'date-fns';

interface VideoRecord {
  id: string;
  title: string;
  duration: string | null;
  file_path: string;
  created_at: string;
  question_text: string | null;
  recording_group_id: string | null;
  signedUrl?: string;
  segments?: { signedUrl: string; questionText: string }[];
  isMultiSegment?: boolean;
}

const VideoLibraryPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [featuredGroupId, setFeaturedGroupId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VideoRecord | null>(null);

  const parseJsonArray = (val: string | null): string[] => {
    if (!val) return [];
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return [val];
  };

  const fetchVideos = async () => {
    if (!user) return;
    setLoading(true);

    const supabaseAny = supabase as any;

    // Fetch featured group id from profile
    const { data: prof } = await supabaseAny
      .from('profiles').select('featured_recording_group_id').eq('id', user.id).single();
    if (prof) setFeaturedGroupId(prof.featured_recording_group_id);

    const { data, error } = await supabaseAny
      .from('video_recordings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      setLoading(false);
      return;
    }

    const records: VideoRecord[] = data || [];

    const withUrls = await Promise.all(
      records.map(async (video) => {
        const filePaths = parseJsonArray(video.file_path);
        const questions = parseJsonArray(video.question_text);
        const isMulti = filePaths.length > 1 || video.file_path.startsWith('[');

        if (isMulti) {
          const segments = await Promise.all(
            filePaths.map(async (fp, i) => {
              const { data: signedData } = await supabaseAny.storage
                .from('video-recordings')
                .createSignedUrl(fp, 3600);
              return { signedUrl: signedData?.signedUrl || '', questionText: questions[i] || `Question ${i + 1}` };
            })
          );
          return { ...video, isMultiSegment: true, segments };
        } else {
          const path = filePaths[0] || video.file_path;
          const { data: signedData } = await supabaseAny.storage
            .from('video-recordings')
            .createSignedUrl(path, 3600);
          return { ...video, isMultiSegment: false, signedUrl: signedData?.signedUrl || '' };
        }
      })
    );

    setVideos(withUrls);
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, [user]);

  const handleFeature = async (video: VideoRecord) => {
    if (!user) return;
    const supabaseAny = supabase as any;
    const groupId = video.recording_group_id || video.id;
    const newFeatured = featuredGroupId === groupId ? null : groupId;
    const { error } = await supabaseAny
      .from('profiles')
      .update({ featured_recording_group_id: newFeatured })
      .eq('id', user.id);
    if (error) {
      toast({ variant: 'destructive', title: 'Failed to update featured video' });
    } else {
      setFeaturedGroupId(newFeatured);
      toast({ title: newFeatured ? 'Video featured on your public profile' : 'Video removed from public profile' });
    }
  };

  const handleDelete = async (video: VideoRecord) => {
    const supabaseAny = supabase as any;
    const filePaths = parseJsonArray(video.file_path);

    await supabaseAny.storage.from('video-recordings').remove(filePaths);

    const { error } = await supabaseAny
      .from('video_recordings')
      .delete()
      .eq('id', video.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Failed to delete video' });
      return;
    }

    setVideos(prev => prev.filter(v => v.id !== video.id));
    if (playingId === video.id) setPlayingId(null);
    toast({ title: 'Video deleted' });
  };

  const handleRename = async (video: VideoRecord) => {
    const newTitle = editTitle.trim();
    if (!newTitle || newTitle === video.title) {
      setEditingId(null);
      return;
    }
    const { error } = await (supabase as any)
      .from('video_recordings')
      .update({ title: newTitle })
      .eq('id', video.id);
    if (error) {
      toast({ variant: 'destructive', title: 'Failed to rename' });
    } else {
      setVideos(prev => prev.map(v => v.id === video.id ? { ...v, title: newTitle } : v));
      toast({ title: 'Renamed successfully' });
    }
    setEditingId(null);
  };

  const handleDownload = (video: VideoRecord) => {
    const url = video.signedUrl || video.segments?.[0]?.signedUrl;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${video.title}.webm`;
    a.click();
  };

  return (
    <DashboardLayout userType="candidate">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Video Library</h1>
            <p className="text-muted-foreground mt-1">
              Manage your video introductions and responses
            </p>
          </div>
          <Link to="/apply-now">
            <Button className="flex items-center">
              <FiPlus className="mr-2" /> Record New Video
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardHeader className="pb-2"><Skeleton className="h-5 w-3/4" /></CardHeader>
                <CardContent><Skeleton className="h-4 w-full mb-4" /><Skeleton className="h-9 w-full" /></CardContent>
              </Card>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
              const questions = parseJsonArray(video.question_text);
              return (
                <Card key={video.id} className="overflow-hidden">
                  {video.isMultiSegment && video.segments ? (
                    <InterviewPlayer
                      segments={video.segments}
                      playing={playingId === video.id}
                      onTogglePlay={() => setPlayingId(playingId === video.id ? null : video.id)}
                    />
                  ) : (
                    <div className="aspect-video bg-muted relative">
                      {video.signedUrl && (
                        <video
                          src={video.signedUrl}
                          controls={playingId === video.id}
                          className="w-full h-full object-contain"
                          onPlay={() => setPlayingId(video.id)}
                          onPause={() => setPlayingId(null)}
                        />
                      )}
                      {playingId !== video.id && (
                        <div
                          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 hover:bg-black/40 transition-colors"
                          onClick={() => {
                            setPlayingId(video.id);
                            const vid = document.querySelector(`video[src="${video.signedUrl}"]`) as HTMLVideoElement;
                            vid?.play();
                          }}
                        >
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <FiPlay className="text-white w-5 h-5 ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    {editingId === video.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="h-8 text-sm"
                          onKeyDown={(e) => e.key === 'Enter' && handleRename(video)}
                          autoFocus
                        />
                        <Button size="sm" variant="ghost" onClick={() => handleRename(video)}>
                          <FiCheck className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <CardTitle className="text-lg truncate">{video.title}</CardTitle>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                      <span title={new Date(video.created_at).toLocaleString()}>
                        {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                      </span>
                      {questions.length > 1 && (
                        <span>{questions.length} questions</span>
                      )}
                    </div>
                    {questions.length > 1 && (
                      <ul className="text-xs text-muted-foreground mb-3 space-y-1">
                        {questions.map((q, i) => (
                          <li key={i} className="truncate">Q{i + 1}: {q}</li>
                        ))}
                      </ul>
                    )}
                    <div className="flex space-x-2">
                      {(() => {
                        const groupId = video.recording_group_id || video.id;
                        const isFeatured = featuredGroupId === groupId;
                        return (
                          <Button
                            variant={isFeatured ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFeature(video)}
                            title={isFeatured ? "Remove from profile" : "Feature on profile"}
                            className={isFeatured ? "" : "text-amber-500 hover:text-amber-600 hover:bg-amber-50"}
                          >
                            <FiStar className={isFeatured ? "fill-current" : ""} />
                          </Button>
                        );
                      })()}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setEditingId(video.id); setEditTitle(video.title); }}
                        title="Rename"
                      >
                        <FiEdit2 />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(video)}
                      >
                        <FiTrash2 />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(video)}>
                        <FiDownload />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="bg-muted/50 border rounded-lg p-8 text-center">
            <h3 className="font-medium text-lg mb-2">No videos found</h3>
            <p className="text-muted-foreground mb-6">
              You haven't recorded any videos yet. Video introductions help you stand out to employers.
            </p>
            <Link to="/apply-now">
              <Button>Record Your First Video</Button>
            </Link>
          </div>
        )}
      </div>
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) handleDelete(deleteTarget);
                setDeleteTarget(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default VideoLibraryPage;
