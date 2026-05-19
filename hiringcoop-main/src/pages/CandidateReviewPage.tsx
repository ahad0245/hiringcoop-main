import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { FiArrowLeft, FiDownload, FiMail, FiUser, FiMapPin, FiCalendar, FiBookmark, FiThumbsUp, FiThumbsDown, FiCheck, FiLinkedin } from "react-icons/fi";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import InterviewPlayer from '@/components/video/InterviewPlayer';

interface CandidateProfile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  contact_email: string | null;
  title: string | null;
  location: string | null;
  bio: string | null;
  skills: string[] | null;
  avatar_url: string | null;
  resume_url: string | null;
  linkedin_url: string | null;
}

interface ApplicationData {
  id: string;
  status: string;
  cover_letter: string | null;
  resume_url: string | null;
  candidate_name: string | null;
  candidate_email: string | null;
  created_at: string;
  employer_notes: string | null;
  job_id: string;
  job_title?: string;
}

interface VideoSegment {
  signedUrl: string;
  questionText: string;
}

interface RecordingGroup {
  id: string;
  title: string;
  date: string;
  filePaths: string[];
  questions: string[];
  segments: VideoSegment[];
  loaded: boolean;
}

const stripQPrefix = (text: string) => text.replace(/^Q\d+:\s*/i, '');

const CandidateReviewPage = () => {
  const navigate = useNavigate();
  const { candidateId } = useParams();
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('app');
  const { user } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [recordings, setRecordings] = useState<RecordingGroup[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("new");
  const [loading, setLoading] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    if (!candidateId || !user) return;
    fetchCandidateData();
  }, [candidateId, user]);

  const fetchCandidateData = async () => {
    setLoading(true);
    const supabaseAny = supabase as any;

    // Fetch profile, application, and videos in parallel
    const applicationQuery = appId
      ? supabaseAny.from('applications').select('*, jobs(title)').eq('id', appId).single()
      : supabaseAny.from('applications').select('*, jobs(title)').eq('candidate_id', candidateId!).order('created_at', { ascending: false }).limit(1).single();

    const [profileRes, applicationRes, videosRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', candidateId!).single(),
      applicationQuery,
      supabaseAny
        .from('video_recordings')
        .select('*')
        .eq('user_id', candidateId!)
        .order('created_at', { ascending: true }),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data as CandidateProfile);
    }

    if (applicationRes.data) {
      const app = applicationRes.data;
      setApplication({
        id: app.id,
        status: app.status,
        cover_letter: app.cover_letter,
        resume_url: app.resume_url,
        candidate_name: app.candidate_name || null,
        candidate_email: app.candidate_email || null,
        created_at: app.created_at,
        employer_notes: app.employer_notes,
        job_id: app.job_id,
        job_title: app.jobs?.title || 'Unknown Position',
      });
      setStatus(app.status);
      setNotes(app.employer_notes || '');
    }

    // Group videos by row — don't flatten
    if (videosRes.data && videosRes.data.length > 0) {
      const groups: RecordingGroup[] = (videosRes.data as any[]).map((v) => {
        let filePaths: string[] = [];
        let questions: string[] = [];

        try {
          const parsed = JSON.parse(v.file_path);
          filePaths = Array.isArray(parsed) ? parsed : [v.file_path];
        } catch {
          filePaths = [v.file_path];
        }

        try {
          const parsed = JSON.parse(v.question_text || '');
          questions = Array.isArray(parsed) ? parsed.map(stripQPrefix) : [stripQPrefix(v.question_text || v.title)];
        } catch {
          questions = [stripQPrefix(v.question_text || v.title)];
        }

        return {
          id: v.id,
          title: v.title,
          date: v.created_at,
          filePaths,
          questions,
          segments: [],
          loaded: false,
        };
      });

      // Reverse so newest is first
      groups.reverse();
      setRecordings(groups);
      // Load segments for the first (newest) recording
      await loadRecordingSegments(groups, 0);
    }

    setLoading(false);
  };

  const loadRecordingSegments = async (groups: RecordingGroup[], idx: number) => {
    const rec = groups[idx];
    if (rec.loaded) return;
    const supabaseAny = supabase as any;
    const segments: VideoSegment[] = [];
    for (let i = 0; i < rec.filePaths.length; i++) {
      const { data: signedData } = await supabaseAny.storage
        .from('video-recordings')
        .createSignedUrl(rec.filePaths[i], 3600);
      if (signedData?.signedUrl) {
        segments.push({
          signedUrl: signedData.signedUrl,
          questionText: rec.questions[i] || `Question ${i + 1}`,
        });
      }
    }
    const updated = [...groups];
    updated[idx] = { ...rec, segments, loaded: true };
    setRecordings(updated);
  };

  const selectRecording = async (idx: number) => {
    setSelectedIdx(idx);
    setVideoPlaying(false);
    if (!recordings[idx].loaded) {
      await loadRecordingSegments(recordings, idx);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!application) return;
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus, employer_notes: notes } as any)
      .eq('id', application.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Failed to update status' });
      return;
    }
    setStatus(newStatus);
    toast({ title: `Candidate ${newStatus}` });
  };

  const saveNotes = async () => {
    if (!application) return;
    const { error } = await supabase
      .from('applications')
      .update({ employer_notes: notes } as any)
      .eq('id', application.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Failed to save notes' });
      return;
    }
    toast({ title: 'Notes saved' });
  };

  const fullNameFromApplication = application?.candidate_name?.trim() || '';
  const firstName = profile?.first_name || fullNameFromApplication.split(' ')[0] || 'Unknown';
  const lastName = profile?.last_name || fullNameFromApplication.split(' ').slice(1).join(' ') || '';
  const candidateEmail = profile?.contact_email?.trim() || profile?.email?.trim() || application?.candidate_email?.trim() || null;
  const candidateLinkedin = profile?.linkedin_url?.trim() || null;

  if (loading) {
    return (
      <DashboardLayout userType="employer">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96 lg:col-span-2" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="employer">
      <div className="space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={() => navigate("/dashboard/candidates")}
          >
            <FiArrowLeft className="mr-2" />
            Back to Candidates
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{firstName} {lastName}</h1>
            <p className="text-muted-foreground">
              Applying for: <span className="font-medium">{application?.job_title || 'N/A'}</span>
              {application && ` • Applied ${new Date(application.created_at).toLocaleDateString()}`}
            </p>
          </div>
          <Badge
            variant={
              status === "shortlisted" ? "default" :
              status === "reviewed" ? "outline" :
              status === "rejected" ? "destructive" : "secondary"
            }
          >
            {status === "shortlisted" ? "Shortlisted" :
             status === "reviewed" ? "Reviewed" :
             status === "rejected" ? "Rejected" : "New Application"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`} />
                    <AvatarFallback>{firstName[0]}{lastName[0]}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold mt-4">{firstName} {lastName}</h2>
                  <p className="text-muted-foreground">{profile?.title || 'Candidate'}</p>
                </div>

                <div className="space-y-3">
                  {candidateEmail && (
                    <div className="flex items-center">
                      <FiMail className="mr-3 text-muted-foreground" />
                      <a href={`mailto:${candidateEmail}`} className="text-sm text-primary hover:underline break-all">
                        {candidateEmail}
                      </a>
                    </div>
                  )}
                  {candidateLinkedin && (
                    <div className="flex items-center">
                      <FiLinkedin className="mr-3 text-muted-foreground" />
                      <a
                        href={candidateLinkedin.startsWith('http') ? candidateLinkedin : `https://${candidateLinkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline break-all"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center">
                      <FiMapPin className="mr-3 text-muted-foreground" />
                      <span className="text-sm">{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <FiCalendar className="mr-3 text-muted-foreground" />
                    <span className="text-sm">
                      Applied {application ? new Date(application.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>

                {profile?.skills && profile.skills.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h3 className="font-medium mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-1">
                        {profile.skills.map((skill, i) => (
                          <Badge key={i} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator className="my-4" />
                <div>
                  <h3 className="font-medium mb-3">Actions</h3>
                  <div className="space-y-2">
                    {(application?.resume_url || profile?.resume_url) && (
                      <Button variant="outline" className="w-full justify-start" onClick={async () => {
                        const path = application?.resume_url || profile?.resume_url || '';
                        if (path.startsWith('http')) { window.open(path); return; }
                        const { data } = await (supabase as any).storage.from('resumes').createSignedUrl(path, 3600);
                        if (data?.signedUrl) window.open(data.signedUrl);
                        else toast({ variant: 'destructive', title: 'Failed to download resume' });
                      }}>
                        <FiDownload className="mr-2" /> Download Resume
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        if (!candidateEmail) {
                          toast({ variant: 'destructive', title: 'Candidate email not available' });
                          return;
                        }
                        window.location.href = `mailto:${candidateEmail}`;
                      }}
                    >
                      <FiMail className="mr-2" /> Contact Candidate
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FiBookmark className="mr-2" /> Save to Folder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Evaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Add notes about this candidate..."
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onBlur={saveNotes}
                  />
                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      onClick={() => updateStatus("shortlisted")}
                      variant={status === "shortlisted" ? "default" : "outline"}
                    >
                      <FiThumbsUp className="mr-2" /> Shortlist Candidate
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => updateStatus("reviewed")}
                      variant={status === "reviewed" ? "default" : "outline"}
                    >
                      <FiCheck className="mr-2" /> Mark as Reviewed
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => updateStatus("rejected")}
                      variant={status === "rejected" ? "destructive" : "outline"}
                    >
                      <FiThumbsDown className="mr-2" /> Reject Application
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="video" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="video">Video Responses</TabsTrigger>
                <TabsTrigger value="resume">Resume & Cover Letter</TabsTrigger>
                <TabsTrigger value="history">Activity History</TabsTrigger>
              </TabsList>

              <TabsContent value="video" className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Video Interview Responses</h3>

                {recordings.length > 0 ? (
                  <>
                    {recordings.length > 1 && (
                      <div className="flex flex-wrap gap-2">
                        {recordings.map((rec, i) => (
                          <Button
                            key={rec.id}
                            variant={i === selectedIdx ? "default" : "outline"}
                            size="sm"
                            onClick={() => selectRecording(i)}
                          >
                            {rec.title} — {new Date(rec.date).toLocaleDateString()}
                          </Button>
                        ))}
                      </div>
                    )}
                    {recordings[selectedIdx]?.segments.length > 0 ? (
                      <Card className="overflow-hidden">
                        <InterviewPlayer
                          segments={recordings[selectedIdx].segments}
                          playing={videoPlaying}
                          onTogglePlay={() => setVideoPlaying(!videoPlaying)}
                        />
                      </Card>
                    ) : (
                      <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground text-sm">Loading video...</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <p className="text-muted-foreground">No video responses available</p>
                      <p className="text-sm text-muted-foreground mt-1">This candidate hasn't recorded any video interviews yet.</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="resume" className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Cover Letter</h3>
                <Card>
                  <CardContent className="pt-6">
                    {application?.cover_letter ? (
                      <p className="whitespace-pre-line">{application.cover_letter}</p>
                    ) : (
                      <p className="text-muted-foreground">No cover letter provided.</p>
                    )}
                  </CardContent>
                </Card>

                {(application?.resume_url || profile?.resume_url) && (
                  <>
                    <h3 className="text-lg font-medium pt-4">Resume</h3>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="bg-muted/50 rounded-lg h-32 flex items-center justify-center">
                          <Button variant="outline" onClick={async () => {
                            const path = application?.resume_url || profile?.resume_url || '';
                            if (path.startsWith('http')) { window.open(path); return; }
                            const { data } = await (supabase as any).storage.from('resumes').createSignedUrl(path, 3600);
                            if (data?.signedUrl) window.open(data.signedUrl);
                            else toast({ variant: 'destructive', title: 'Failed to download resume' });
                          }}>
                            <FiDownload className="mr-2" /> Download Resume
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Application Timeline</h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="rounded-full h-10 w-10 bg-primary flex items-center justify-center text-primary-foreground">
                            <FiCheck size={18} />
                          </div>
                          <div className="h-full w-0.5 bg-border mx-auto mt-2"></div>
                        </div>
                        <div>
                          <h4 className="font-medium">Application Submitted</h4>
                          <p className="text-sm text-muted-foreground">
                            {application ? new Date(application.created_at).toLocaleDateString() : 'N/A'}
                          </p>
                          <p className="mt-1 text-sm">Candidate submitted application for {application?.job_title || 'N/A'}</p>
                        </div>
                      </div>

                      {recordings.length > 0 && (
                        <div className="flex">
                          <div className="mr-4 flex flex-col items-center">
                            <div className="rounded-full h-10 w-10 bg-primary flex items-center justify-center text-primary-foreground">
                              <FiCheck size={18} />
                            </div>
                            <div className="h-full w-0.5 bg-border mx-auto mt-2"></div>
                          </div>
                          <div>
                            <h4 className="font-medium">Video Interview Completed</h4>
                            <p className="mt-1 text-sm">{recordings.length} recording{recordings.length !== 1 ? 's' : ''} submitted</p>
                          </div>
                        </div>
                      )}

                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="rounded-full h-10 w-10 bg-muted flex items-center justify-center text-muted-foreground">
                            <FiUser size={18} />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">{status === "new" ? "Awaiting Review" : `Status: ${status}`}</h4>
                          <p className="text-sm text-muted-foreground">
                            {status === "new" ? "Pending review" : `Updated by hiring manager`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CandidateReviewPage;
