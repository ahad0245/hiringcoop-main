
import { useState, useEffect, useCallback } from 'react';
import { useUserProfile, ProfileType } from '@/hooks/useUserProfile';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FiAlertCircle, FiEdit, FiSave, FiX, FiUser, 
  FiMapPin, FiLink, FiLinkedin, FiFileText, FiPlus, FiShare2, FiCopy, FiTrash2, FiVideo, FiStar, FiPlay
} from 'react-icons/fi';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface Experience {
  id: string;
  job_title: string;
  company: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  is_current: boolean;
  order_index: number;
}

const CandidateProfilePage = () => {
  const { user } = useAuth();
  const { profile, loading, error, updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileType>>({});
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const { toast } = useToast();

  // Skills state
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // Experience state
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [addingExperience, setAddingExperience] = useState(false);
  const [newExp, setNewExp] = useState({ job_title: '', company: '', location: '', start_date: '', end_date: '', description: '', is_current: false });
  const navigate = useNavigate();

  // Video state
  const [videoGroups, setVideoGroups] = useState<any[]>([]);
  const [featuredGroupId, setFeaturedGroupId] = useState<string | null>(null);
  const [showVideoSelector, setShowVideoSelector] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const supabaseAny = supabase as any;

  // Sync profile data
  useEffect(() => {
    if (profile) {
      setIsPublic((profile as any).is_public !== false);
      setSkills((profile as any).skills || []);
    }
  }, [profile]);

  // Fetch experiences
  const fetchExperiences = useCallback(async () => {
    if (!user) return;
    const { data } = await supabaseAny.from('candidate_experience').select('*').eq('user_id', user.id).order('order_index', { ascending: true });
    if (data) setExperiences(data);
  }, [user]);

  useEffect(() => { fetchExperiences(); }, [fetchExperiences]);

  // Fetch video recordings grouped by recording_group_id
  const fetchVideoGroups = useCallback(async () => {
    if (!user) return;
    setLoadingVideos(true);
    try {
      const { data } = await supabaseAny.from('video_recordings').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) {
        const grouped: Record<string, any> = {};
        data.forEach((rec: any) => {
          const gid = rec.recording_group_id || rec.id;
          if (!grouped[gid]) {
            grouped[gid] = { groupId: gid, title: rec.title, created_at: rec.created_at, segments: [] };
          }
          grouped[gid].segments.push(rec);
        });
        setVideoGroups(Object.values(grouped));
      }
    } finally {
      setLoadingVideos(false);
    }
  }, [user]);

  useEffect(() => { fetchVideoGroups(); }, [fetchVideoGroups]);

  // Sync featured group id from profile
  useEffect(() => {
    if (profile) {
      setFeaturedGroupId((profile as any).featured_recording_group_id || null);
    }
  }, [profile]);

  const handleFeatureVideo = async (groupId: string) => {
    const newId = featuredGroupId === groupId ? null : groupId;
    setFeaturedGroupId(newId);
    await supabaseAny.from('profiles').update({ featured_recording_group_id: newId }).eq('id', user?.id);
    setShowVideoSelector(false);
    toast({ title: newId ? 'Video featured on your public profile!' : 'Featured video removed' });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setFormData({
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        title: profile?.title || '',
        bio: profile?.bio || '',
        headline: (profile as any)?.headline || '',
        location: (profile as any)?.location || '',
        linkedin_url: (profile as any)?.linkedin_url || '',
      });
      setIsEditing(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdating(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({ title: "Profile updated", description: "Your profile has been updated successfully" });
    } catch (err: any) {
      setUpdateError(err.message || 'An error occurred while updating your profile');
    } finally {
      setUpdating(false);
    }
  };

  // Skills handlers
  const addSkill = async () => {
    const trimmed = newSkill.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    const updated = [...skills, trimmed];
    await supabaseAny.from('profiles').update({ skills: updated }).eq('id', user?.id);
    setSkills(updated);
    setNewSkill('');
    toast({ title: 'Skill added' });
  };

  const removeSkill = async (skill: string) => {
    const updated = skills.filter(s => s !== skill);
    await supabaseAny.from('profiles').update({ skills: updated }).eq('id', user?.id);
    setSkills(updated);
  };

  // Experience handlers
  const addExperience = async () => {
    if (!newExp.job_title || !newExp.company) return;
    const { error: insertError } = await supabaseAny.from('candidate_experience').insert({
      user_id: user?.id,
      job_title: newExp.job_title,
      company: newExp.company,
      location: newExp.location || null,
      start_date: newExp.start_date ? `${newExp.start_date}-01` : null,
      end_date: newExp.is_current ? null : (newExp.end_date ? `${newExp.end_date}-01` : null),
      description: newExp.description || null,
      is_current: newExp.is_current,
      order_index: experiences.length,
    });
    if (insertError) {
      console.error('Experience insert error:', insertError);
      toast({ variant: 'destructive', title: 'Failed to add experience', description: insertError.message });
      return;
    }
    setNewExp({ job_title: '', company: '', location: '', start_date: '', end_date: '', description: '', is_current: false });
    setAddingExperience(false);
    await fetchExperiences();
    toast({ title: 'Experience added' });
  };

  const deleteExperience = async (id: string) => {
    await supabaseAny.from('candidate_experience').delete().eq('id', id);
    fetchExperiences();
    toast({ title: 'Experience removed' });
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `resume-${Date.now()}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}`;
    setUploadingResume(true);
    try {
      const { error: uploadError } = await supabaseAny.storage.from('resumes').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: publicUrl } = supabaseAny.storage.from('resumes').getPublicUrl(filePath);
      if (publicUrl) {
        await updateProfile({ resume_url: publicUrl.publicUrl });
        toast({ title: "Resume uploaded", description: "Your resume has been uploaded successfully" });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload failed", description: error.message || "Failed to upload resume" });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar-${Date.now()}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}`;
    setUploadingAvatar(true);
    try {
      const { error: uploadError } = await supabaseAny.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: publicUrl } = supabaseAny.storage.from('avatars').getPublicUrl(filePath);
      if (publicUrl) {
        await updateProfile({ avatar_url: publicUrl.publicUrl });
        toast({ title: "Avatar uploaded", description: "Your profile picture has been updated" });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload failed", description: error.message || "Failed to upload avatar" });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const getInitials = () => {
    if (!profile) return 'U';
    return ((profile.first_name || '').charAt(0) + (profile.last_name || '').charAt(0)).toUpperCase();
  };

  if (loading) {
    return (
      <DashboardLayout userType="candidate">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="candidate">
      <div className="container max-w-5xl py-8">
        <h1 className="text-2xl font-bold mb-6">My Professional Profile</h1>
        
        {(error || updateError) && (
          <Alert variant="destructive" className="mb-6">
            <FiAlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error || updateError}</AlertDescription>
          </Alert>
        )}
        
        {/* Header Card */}
        <Card className="mb-6">
          <div className="h-40 bg-gradient-to-r from-primary/80 to-accent/60 rounded-t-lg relative"></div>
          <CardContent className="relative pt-0">
            <div className="-mt-16 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
              <div className="flex items-end">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-background">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <label htmlFor="avatar-upload" className="cursor-pointer w-full h-full flex items-center justify-center">
                      <FiEdit className="h-6 w-6 text-white" />
                      <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                    </label>
                  </div>
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <div className="ml-4 mb-4">
                  <h2 className="text-2xl font-bold">{profile?.first_name} {profile?.last_name}</h2>
                  <p className="text-lg text-muted-foreground">{(profile as any)?.headline || profile?.title || 'Add your professional title'}</p>
                  {(profile as any)?.location && (
                    <p className="flex items-center text-muted-foreground text-sm mt-1">
                      <FiMapPin className="mr-1 h-3 w-3" /> {(profile as any).location}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                <div className="flex items-center gap-2 mr-2">
                  <Switch
                    checked={isPublic}
                    onCheckedChange={async (checked) => {
                      setIsPublic(checked);
                      await supabaseAny.from('profiles').update({ is_public: checked }).eq('id', user?.id);
                      toast({ title: checked ? 'Profile is now public' : 'Profile is now private' });
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{isPublic ? 'Public' : 'Private'}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/candidates/${user?.id}`); toast({ title: 'Profile link copied!' }); }}>
                  <FiShare2 className="h-4 w-4 mr-1" /> Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleEditToggle}>
                  {isEditing ? <FiX className="h-4 w-4 mr-1" /> : <FiEdit className="h-4 w-4 mr-1" />}
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
                {!isEditing && (
                  <label htmlFor="resume-upload">
                    <Button variant="outline" size="sm" disabled={uploadingResume} asChild>
                      <div><FiFileText className="h-4 w-4 mr-1" />{uploadingResume ? 'Uploading...' : 'Upload Resume'}</div>
                    </Button>
                    <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} disabled={uploadingResume} />
                  </label>
                )}
              </div>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="first_name">First Name</Label><Input id="first_name" name="first_name" value={formData.first_name || ''} onChange={handleInputChange} /></div>
                  <div><Label htmlFor="last_name">Last Name</Label><Input id="last_name" name="last_name" value={formData.last_name || ''} onChange={handleInputChange} /></div>
                </div>
                <div><Label htmlFor="title">Professional Title</Label><Input id="title" name="title" value={formData.title || ''} onChange={handleInputChange} placeholder="e.g., Frontend Developer" /></div>
                <div><Label htmlFor="headline">Headline</Label><Input id="headline" name="headline" value={(formData as any).headline || ''} onChange={handleInputChange} placeholder="e.g., Passionate about building great products" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="location">Location</Label><Input id="location" name="location" value={(formData as any).location || ''} onChange={handleInputChange} placeholder="e.g., San Francisco, CA" /></div>
                  <div><Label htmlFor="linkedin_url">LinkedIn URL</Label><Input id="linkedin_url" name="linkedin_url" value={(formData as any).linkedin_url || ''} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." /></div>
                </div>
                <div><Label htmlFor="bio">About Me</Label><Textarea id="bio" name="bio" value={formData.bio || ''} onChange={handleInputChange} placeholder="Tell us about yourself" rows={5} /></div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={updating}>
                    {updating ? <><span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>Saving...</> : <><FiSave className="h-4 w-4 mr-1" />Save Changes</>}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="mt-6">
                <h3 className="text-xl font-semibold">About</h3>
                <p className="mt-2 whitespace-pre-line">{profile?.bio || 'No information provided. Click "Edit Profile" to add your bio.'}</p>
                {(profile as any)?.linkedin_url && (
                  <a href={(profile as any).linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-primary hover:underline text-sm">
                    <FiLinkedin className="h-4 w-4" /> LinkedIn Profile
                  </a>
                )}
              </div>
            )}
          </CardContent>
          {profile?.resume_url && !isEditing && (
            <CardFooter className="bg-muted/50 flex justify-between">
              <div className="flex items-center"><FiFileText className="h-5 w-5 mr-2 text-primary" /><span>Resume uploaded</span></div>
              <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center">View Resume <FiLink className="ml-1 h-3 w-3" /></a>
            </CardFooter>
          )}
        </Card>
        
        {/* Experience Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Experience</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setAddingExperience(!addingExperience)}>
                {addingExperience ? <FiX className="h-4 w-4 mr-1" /> : <FiPlus className="h-4 w-4 mr-1" />}
                {addingExperience ? 'Cancel' : 'Add'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {addingExperience && (
              <div className="mb-6 p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><Label>Job Title *</Label><Input value={newExp.job_title} onChange={e => setNewExp(p => ({ ...p, job_title: e.target.value }))} /></div>
                  <div><Label>Company *</Label><Input value={newExp.company} onChange={e => setNewExp(p => ({ ...p, company: e.target.value }))} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div><Label>Location</Label><Input value={newExp.location} onChange={e => setNewExp(p => ({ ...p, location: e.target.value }))} /></div>
                  <div><Label>Start Date</Label><Input type="month" value={newExp.start_date} onChange={e => setNewExp(p => ({ ...p, start_date: e.target.value }))} /></div>
                  <div><Label>End Date</Label><Input type="month" value={newExp.end_date} onChange={e => setNewExp(p => ({ ...p, end_date: e.target.value }))} disabled={newExp.is_current} /></div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={newExp.is_current} onCheckedChange={c => setNewExp(p => ({ ...p, is_current: c, end_date: '' }))} />
                  <Label>Currently working here</Label>
                </div>
                <div><Label>Description</Label><Textarea value={newExp.description} onChange={e => setNewExp(p => ({ ...p, description: e.target.value }))} rows={3} /></div>
                <Button size="sm" onClick={addExperience} disabled={!newExp.job_title || !newExp.company}><FiSave className="h-4 w-4 mr-1" /> Save</Button>
              </div>
            )}
            {experiences.length === 0 && !addingExperience && (
              <p className="text-muted-foreground text-sm">No experience added yet. Click "Add" to get started.</p>
            )}
            {experiences.map((exp, index) => (
              <div key={exp.id} className="mb-6 last:mb-0">
                <div className="flex">
                  <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="font-semibold text-xl">{exp.company.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{exp.job_title}</h3>
                        <p className="text-muted-foreground">{exp.company}{exp.location ? ` • ${exp.location}` : ''}</p>
                        <p className="text-sm text-muted-foreground">
                          {exp.start_date ? new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} - {exp.is_current ? 'Present' : (exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteExperience(exp.id)} className="text-muted-foreground hover:text-destructive">
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {exp.description && <p className="mt-2">{exp.description}</p>}
                  </div>
                </div>
                {index < experiences.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Featured Video Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <FiVideo className="h-5 w-5" /> Featured Video
              </CardTitle>
              <div className="flex gap-2">
                {videoGroups.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setShowVideoSelector(!showVideoSelector)}>
                    {showVideoSelector ? <FiX className="h-4 w-4 mr-1" /> : <FiStar className="h-4 w-4 mr-1" />}
                    {showVideoSelector ? 'Cancel' : (featuredGroupId ? 'Change Video' : 'Select Video')}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => navigate('/apply-now')}>
                  <FiPlay className="h-4 w-4 mr-1" /> Record New
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose a video interview to showcase on your public profile.
            </p>
          </CardHeader>
          <CardContent>
            {loadingVideos ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : videoGroups.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <FiVideo className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-3">No video recordings yet</p>
                <Button variant="default" size="sm" onClick={() => navigate('/apply-now')}>
                  <FiPlay className="h-4 w-4 mr-1" /> Record Your First Video
                </Button>
              </div>
            ) : (
              <>
                {/* Current featured video */}
                {featuredGroupId && !showVideoSelector && (
                  <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FiStar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {videoGroups.find(g => g.groupId === featuredGroupId)?.title || 'Featured Video'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        This video is displayed on your public profile
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleFeatureVideo(featuredGroupId)} className="text-muted-foreground hover:text-destructive">
                      <FiX className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                )}

                {!featuredGroupId && !showVideoSelector && (
                  <div className="text-center py-6 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-2">No featured video selected</p>
                    <Button variant="outline" size="sm" onClick={() => setShowVideoSelector(true)}>
                      <FiStar className="h-4 w-4 mr-1" /> Choose a Video
                    </Button>
                  </div>
                )}

                {/* Video selector */}
                {showVideoSelector && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Select a video to feature:</p>
                    {videoGroups.map(group => (
                      <div
                        key={group.groupId}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                          featuredGroupId === group.groupId ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => handleFeatureVideo(group.groupId)}
                      >
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                          <FiPlay className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{group.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {group.segments.length} segment{group.segments.length !== 1 ? 's' : ''} • {formatDistanceToNow(new Date(group.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        {featuredGroupId === group.groupId && (
                          <FiStar className="h-5 w-5 text-primary fill-primary flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Skills</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map(skill => (
                <Badge key={skill} variant="secondary" className="px-3 py-1 group cursor-pointer" onClick={() => removeSkill(skill)}>
                  {skill} <FiX className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Badge>
              ))}
              {skills.length === 0 && <p className="text-muted-foreground text-sm">No skills added yet.</p>}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Add a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} className="max-w-xs" />
              <Button variant="outline" size="sm" onClick={addSkill} disabled={!newSkill.trim()}><FiPlus className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CandidateProfilePage;
