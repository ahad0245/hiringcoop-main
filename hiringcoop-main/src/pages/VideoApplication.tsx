import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import VideoRecorder from '@/components/video/VideoRecorder';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { uploadVideoBlob } from '@/utils/uploadVideo';

const mockQuestions = [
  { id: 1, question: "Tell us about yourself and your professional background.", maxDuration: 60 },
  { id: 2, question: "What interests you about this position and why do you think you'd be a good fit?", maxDuration: 90 },
  { id: 3, question: "Describe a challenging project you've worked on and how you approached it.", maxDuration: 120 },
];

const VideoApplication = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordings, setRecordings] = useState<Blob[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [recordingGroupId] = useState(() => crypto.randomUUID());
const [showPreview, setShowPreview] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [interviewTitle, setInterviewTitle] = useState('');

  const handleVideoRecorded = (recordedBlob: Blob) => {
    const newRecordings = [...recordings];
    newRecordings[currentQuestionIndex] = recordedBlob;
    setRecordings(newRecordings);
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (allQuestionsAnswered) {
      const urls = recordings.map(blob => URL.createObjectURL(blob));
      setPreviewUrls(urls);
      setShowPreview(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // --- Hard validation before attempting anything ---
    if (!user) {
      toast({ variant: 'destructive', title: 'Please log in to submit videos' });
      return;
    }

    // Re-check session is still valid
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      toast({ variant: 'destructive', title: 'Session expired', description: 'Please log in again and retry.' });
      return;
    }

    // Validate all blobs exist and have size
    for (let i = 0; i < mockQuestions.length; i++) {
      const blob = recordings[i];
      if (!blob || blob.size === 0) {
        toast({ variant: 'destructive', title: `Missing recording for Q${i + 1}`, description: 'Please record all questions before submitting.' });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const filePaths: string[] = [];

      // Upload each segment with retry
      for (let i = 0; i < recordings.length; i++) {
        setUploadProgress(`Uploading Q${i + 1} of ${recordings.length}...`);
        const path = await uploadVideoBlob(recordings[i], user.id, i, setUploadProgress);
        filePaths.push(path);
      }

      setUploadProgress('Saving record...');

      const finalTitle = interviewTitle.trim() || `Video Interview - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
      const questionsJson = JSON.stringify(mockQuestions.map(q => q.question));
      const filePathJson = JSON.stringify(filePaths);

      const { error: insertError } = await (supabase as any)
        .from('video_recordings')
        .insert({
          user_id: user.id,
          title: finalTitle,
          file_path: filePathJson,
          question_text: questionsJson,
          recording_group_id: recordingGroupId,
        });

      if (insertError) {
        throw new Error(`Failed to save recording: ${insertError.message}`);
      }

      toast({ title: 'Video submitted!', description: 'Your interview has been saved to your video library.' });
      navigate('/dashboard/videos');
    } catch (error: any) {
      console.error('Error submitting videos:', error);
      toast({ variant: 'destructive', title: 'Submission failed', description: error.message });
    } finally {
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;
  const currentQuestion = mockQuestions[currentQuestionIndex];
  const allQuestionsAnswered = recordings.length === mockQuestions.length &&
    recordings.every(recording => recording != null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-muted/30 py-12">
        <div className="container-custom max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Video Interview</h1>
            <p className="text-muted-foreground mt-2">
              Answer the following questions to complete your application
            </p>
          </div>

          {!showPreview ? (
            <>
              <div className="mb-8">
                <Progress value={progress} className="h-2" />
                <div className="mt-2 text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {mockQuestions.length}
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-8 border">
                <VideoRecorder
                  onVideoRecorded={handleVideoRecorded}
                  questionText={currentQuestion.question}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={mockQuestions.length}
                  timeLimit={currentQuestion.maxDuration}
                  key={currentQuestion.id}
                />

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                    Previous Question
                  </Button>
                  <Button onClick={handleNext} disabled={!recordings[currentQuestionIndex]}>
                    {currentQuestionIndex < mockQuestions.length - 1 ? 'Next Question' : 'Review All Answers'}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card rounded-xl shadow-sm p-8 border">
              <h2 className="text-xl font-semibold mb-4">Review Your Answers</h2>
              <p className="text-muted-foreground mb-4">
                Review each recording before submitting. All videos will be saved to your video library.
              </p>

              <div className="mb-6">
                <Label htmlFor="interview-title" className="text-sm font-medium">Interview Title (optional)</Label>
                <Input
                  id="interview-title"
                  value={interviewTitle}
                  onChange={(e) => setInterviewTitle(e.target.value)}
                  placeholder={`Video Interview - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Give your interview a name to find it easily later.</p>
              </div>

              <div className="space-y-6">
                {mockQuestions.map((q, i) => (
                  <div key={q.id}>
                    <h3 className="font-medium mb-2">Q{i + 1}: {q.question}</h3>
                    <div className="aspect-video bg-muted rounded-xl overflow-hidden">
                      {previewUrls[i] && (
                        <video src={previewUrls[i]} controls className="w-full h-full object-contain" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => {
                    previewUrls.forEach(url => URL.revokeObjectURL(url));
                    setPreviewUrls([]);
                    setShowPreview(false);
                  }}
                  disabled={isSubmitting}
                >
                  Back to Questions
                </Button>

                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {uploadProgress || 'Uploading...'}
                    </>
                  ) : (
                    "Submit and Save to Library"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VideoApplication;
