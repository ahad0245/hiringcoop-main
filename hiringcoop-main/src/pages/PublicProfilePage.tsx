
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FiMapPin, FiLinkedin, FiFileText, FiPlay, FiCheckCircle } from 'react-icons/fi';
import { supabase } from '@/integrations/supabase/client';
import InterviewPlayer from '@/components/video/InterviewPlayer';

interface Experience {
  id: string;
  job_title: string;
  company: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  is_current: boolean;
}

interface VideoSegment {
  signedUrl: string;
  questionText: string;
}

const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [videoSegments, setVideoSegments] = useState<VideoSegment[]>([]);
  const [videoCount, setVideoCount] = useState(0);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDate, setVideoDate] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);
  const [playing, setPlaying] = useState(false);

  const supabaseAny = supabase as any;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const { data: prof, error: profErr } = await supabaseAny
        .from('profiles').select('*').eq('id', userId).single();

      if (profErr || !prof || !prof.is_public) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setProfile(prof);

      // Fetch experience
      const { data: exps } = await supabaseAny
        .from('candidate_experience').select('*').eq('user_id', userId).order('order_index', { ascending: true });
      if (exps) setExperiences(exps);

      // Fetch video recording — prefer featured, fall back to latest
      const { data: recordings } = await supabaseAny
        .from('video_recordings').select('*').eq('user_id', userId).order('created_at', { ascending: false });

      if (recordings && recordings.length > 0) {
        const featuredGroupId = prof.featured_recording_group_id;
        let targetGroup: any[];

        if (featuredGroupId) {
          targetGroup = recordings.filter((r: any) => r.recording_group_id === featuredGroupId);
        }

        // Fall back to latest group if no featured or featured not found
        if (!targetGroup || targetGroup.length === 0) {
          const latestGroupId = recordings[0].recording_group_id;
          targetGroup = latestGroupId
            ? recordings.filter((r: any) => r.recording_group_id === latestGroupId)
            : [recordings[0]];
        }

        setVideoCount(targetGroup.length);
        setVideoTitle(targetGroup[0].title || 'Interview Recording');
        setVideoDate(new Date(targetGroup[0].created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));

        const segments: VideoSegment[] = [];
        for (const rec of targetGroup) {
          const { data: signed } = await supabaseAny.storage
            .from('video-recordings').createSignedUrl(rec.file_path, 3600);
          if (signed?.signedUrl) {
            segments.push({ signedUrl: signed.signedUrl, questionText: rec.question_text || rec.title });
          }
        }
        setVideoSegments(segments);
      }
      setLoading(false);
    };
    fetchAll();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Profile Not Found</h2>
            <p className="mt-2 text-muted-foreground">This profile doesn't exist or is set to private.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User';
  const initials = `${(profile.first_name || 'U').charAt(0)}${(profile.last_name || '').charAt(0)}`.toUpperCase();
  const headline = profile.headline || profile.title;
  const skills: string[] = profile.skills || [];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-grow pt-20 sm:pt-24 pb-16 sm:pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-8 sm:mb-12">
          <div
            className="relative overflow-hidden rounded-xl p-8 sm:p-12 lg:p-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
            style={{ background: 'linear-gradient(135deg, #044384 0%, #2b5b9d 100%)' }}
          >
            {/* Avatar */}
            <div className="relative z-10 w-36 h-36 sm:w-48 sm:h-48 lg:w-64 lg:h-64 flex-shrink-0">
              <div className="absolute inset-0 rounded-full border-4 border-white/20 scale-110" />
              <Avatar className="w-full h-full shadow-[0_8px_32px_rgba(25,28,29,0.15)]">
                <AvatarImage src={profile.avatar_url || undefined} className="object-cover" />
                <AvatarFallback className="text-4xl sm:text-6xl bg-white/20 text-white">{initials}</AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="relative z-10 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white tracking-tighter mb-2 sm:mb-4">
                {fullName}
              </h1>
              {headline && (
                <p className="text-lg sm:text-xl lg:text-2xl text-[#a9c7ff] font-medium mb-6 sm:mb-8 max-w-2xl">
                  {headline}
                </p>
              )}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-white text-[#044384] hover:bg-white/90 px-6 sm:px-8 py-3 rounded-md font-bold text-xs sm:text-sm tracking-wide uppercase hover:scale-[1.02] active:scale-95 transition-all">
                      <FiLinkedin className="mr-2 h-4 w-4" /> Connect
                    </Button>
                  </a>
                )}
                {profile.resume_url && (
                  <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 px-6 sm:px-8 py-3 rounded-md font-bold text-xs sm:text-sm tracking-wide uppercase transition-all">
                      <FiFileText className="mr-2 h-4 w-4" /> Download Resume
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Decorative blob */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Content Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* About */}
            {profile.bio && (
              <div className="bg-card p-6 sm:p-10 rounded-xl shadow-[0_8px_32px_rgba(25,28,29,0.05)]">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-primary mb-4 sm:mb-6">About</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed whitespace-pre-line">{profile.bio}</div>
              </div>
            )}

            {/* Video Portfolio */}
            {videoSegments.length > 0 && (
              <div className="bg-card p-6 sm:p-10 rounded-xl shadow-[0_8px_32px_rgba(25,28,29,0.05)]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-primary">Video Portfolio</h2>
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                    {videoCount} {videoCount === 1 ? 'Entry' : 'Entries'}
                  </span>
                </div>
                {showPlayer ? (
                  <InterviewPlayer segments={videoSegments} playing={playing} onTogglePlay={() => setPlaying(!playing)} />
                ) : (
                  <div
                    className="aspect-video relative rounded-lg overflow-hidden cursor-pointer group"
                    style={{ background: 'linear-gradient(135deg, #044384 0%, #2b5b9d 100%)' }}
                    onClick={() => { setShowPlayer(true); setPlaying(true); }}
                  >
                    {/* Play button */}
                    <div className="absolute inset-0 bg-[#044384]/40 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 rounded-full flex items-center justify-center text-[#044384] shadow-[0_8px_32px_rgba(25,28,29,0.15)] group-hover:scale-110 transition-transform">
                        <FiPlay className="h-6 w-6 sm:h-8 sm:w-8 ml-1" />
                      </div>
                    </div>
                    {/* Bottom overlay text */}
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                      <h3 className="font-bold text-base sm:text-lg">{videoTitle}</h3>
                      <p className="text-white/80 text-xs sm:text-sm">
                        {videoCount} question{videoCount !== 1 ? 's' : ''} • Recorded {videoDate}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <div className="bg-card p-6 sm:p-10 rounded-xl shadow-[0_8px_32px_rgba(25,28,29,0.05)]">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-primary mb-6 sm:mb-8">Experience</h2>
                <div className="space-y-8 sm:space-y-12">
                  {experiences.map((exp, idx) => (
                    <div key={exp.id} className="relative pl-6 sm:pl-8">
                      {/* Timeline dot */}
                      <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full ${idx === 0 && exp.is_current ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1">
                        <div>
                          <h3 className="font-bold text-base sm:text-lg text-foreground">{exp.job_title}</h3>
                          <p className="text-primary font-medium text-sm">{exp.company}</p>
                        </div>
                        <span className="text-muted-foreground text-[11px] uppercase tracking-widest font-medium mt-0.5 sm:mt-0 whitespace-nowrap">
                          {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            {/* Expertise */}
            {skills.length > 0 && (
              <div className="bg-card p-6 sm:p-8 rounded-xl shadow-[0_8px_32px_rgba(25,28,29,0.05)]">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-primary mb-4 sm:mb-6">Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-muted px-4 py-2 rounded-md text-sm font-medium text-muted-foreground border border-border/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Candidate Spotlight */}
            <div className="bg-secondary/5 p-6 sm:p-8 rounded-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <FiCheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-[11px] font-bold tracking-widest uppercase text-foreground">Candidate Spotlight</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {fullName} is an active candidate on HiringCoop with a verified video portfolio.
                  {experiences.length > 0 && ` They bring ${experiences.length} professional experience${experiences.length > 1 ? 's' : ''}.`}
                  {skills.length > 0 && ` Skilled in ${skills.slice(0, 3).join(', ')}${skills.length > 3 ? ' and more' : ''}.`}
                </p>
              </div>
              {/* Decorative blob */}
              <div className="absolute bottom-[-20%] right-[-20%] w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PublicProfilePage;
