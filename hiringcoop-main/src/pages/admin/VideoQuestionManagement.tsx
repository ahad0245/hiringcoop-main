
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FiPlus, FiEdit2, FiTrash2, FiCopy, FiSave, FiLoader } from 'react-icons/fi';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface VideoQuestion {
  id: string;
  question: string;
  duration_seconds: number;
  is_active: boolean;
  category: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
}

interface QuestionSet {
  id: string;
  name: string;
  description: string;
  industry: string;
  jobLevel: string;
  questions: VideoQuestion[];
  isTemplate: boolean;
  lastUpdated: string;
}

const DEFAULT_CATEGORIES = [
  'Technical', 'Behavioral', 'Leadership', 'Problem-solving', 
  'Communication', 'Teamwork', 'Creativity', 'General'
];

const VideoQuestionManagement: React.FC = () => {
  const [showNewQuestionDialog, setShowNewQuestionDialog] = useState(false);
  const [showSetDialog, setShowSetDialog] = useState(false);
  const [videoQuestions, setVideoQuestions] = useState<VideoQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<VideoQuestion | null>(null);
  const [editingQuestion, setEditingQuestion] = useState({
    question: '',
    duration_seconds: 60,
    category: '',
    is_active: true,
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('video_questions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setVideoQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load video questions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAddQuestion = () => {
    setCurrentQuestion(null);
    setEditingQuestion({
      question: '',
      duration_seconds: 60,
      category: 'General',
      is_active: true,
    });
    setShowNewQuestionDialog(true);
  };

  const handleEditQuestion = (question: VideoQuestion) => {
    setCurrentQuestion(question);
    setEditingQuestion({
      question: question.question,
      duration_seconds: question.duration_seconds,
      category: question.category || 'General',
      is_active: question.is_active,
    });
    setShowNewQuestionDialog(true);
  };

  const handleSaveQuestion = async () => {
    try {
      if (editingQuestion.question.trim() === '') {
        toast({
          title: "Validation Error",
          description: "Question text cannot be empty",
          variant: "destructive"
        });
        return;
      }

      if (currentQuestion) {
        // Update existing question
        const { error } = await (supabase as any)
          .from('video_questions')
          .update({
            question: editingQuestion.question,
            duration_seconds: editingQuestion.duration_seconds,
            category: editingQuestion.category,
            is_active: editingQuestion.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentQuestion.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Question updated successfully"
        });
      } else {
        // Create new question
        const { error } = await (supabase as any)
          .from('video_questions')
          .insert({
            question: editingQuestion.question,
            duration_seconds: editingQuestion.duration_seconds,
            category: editingQuestion.category,
            is_active: editingQuestion.is_active,
            created_by: user?.id
          });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Question created successfully"
        });
      }
      
      setShowNewQuestionDialog(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: "Error",
        description: "Failed to save question",
        variant: "destructive"
      });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      // Check if question is used in any job
      const { data: usages, error: checkError } = await (supabase as any)
        .from('job_questions')
        .select('job_id')
        .eq('question_id', questionId);
      
      if (checkError) throw checkError;
      
      if (usages && usages.length > 0) {
        toast({
          title: "Cannot Delete",
          description: "This question is being used in one or more job postings",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await (supabase as any)
        .from('video_questions')
        .delete()
        .eq('id', questionId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Question deleted successfully"
      });
      
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };

  const toggleQuestionStatus = async (question: VideoQuestion) => {
    try {
      const { error } = await (supabase as any)
        .from('video_questions')
        .update({ is_active: !question.is_active })
        .eq('id', question.id);
      
      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: `Question is now ${!question.is_active ? 'active' : 'inactive'}`
      });
      
      fetchQuestions();
    } catch (error) {
      console.error('Error updating question status:', error);
      toast({
        title: "Error",
        description: "Failed to update question status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="superadmin">
        <div className="p-6 flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <FiLoader className="animate-spin h-8 w-8 mb-4 text-primary" />
            <p>Loading video questions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="superadmin">
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Video Interview Questions</h1>
            <p className="text-gray-600 mt-1">
              Manage interview questions for video applications
            </p>
          </div>
          <div>
            <Button onClick={handleAddQuestion}>
              <FiPlus className="mr-2 h-4 w-4" /> 
              New Question
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question Library</CardTitle>
            <CardDescription>
              These questions will be available to select for job applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {videoQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No questions have been created yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={handleAddQuestion}
                  >
                    <FiPlus className="mr-2 h-4 w-4" /> 
                    Create First Question
                  </Button>
                </div>
              ) : (
                videoQuestions.map(question => (
                  <Card key={question.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <div>
                              <h4 className="font-medium">{question.question}</h4>
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                                <Badge variant={question.is_active ? "default" : "secondary"}>
                                  {question.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                                <span>{question.duration_seconds} seconds</span>
                                {question.category && (
                                  <Badge variant="outline">{question.category}</Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                Last updated: {formatDate(question.updated_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleQuestionStatus(question)}
                          >
                            {question.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditQuestion(question)}
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <FiTrash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Question Dialog */}
      <Dialog open={showNewQuestionDialog} onOpenChange={setShowNewQuestionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Question Text</label>
              <Textarea 
                placeholder="Enter the interview question..." 
                value={editingQuestion.question}
                onChange={(e) => setEditingQuestion({...editingQuestion, question: e.target.value})}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Duration (seconds)</label>
                <Input 
                  type="number" 
                  min="15" 
                  max="300"
                  value={editingQuestion.duration_seconds}
                  onChange={(e) => setEditingQuestion(
                    {...editingQuestion, duration_seconds: parseInt(e.target.value)}
                  )}
                />
                <p className="text-xs text-gray-500 mt-1">
                  How long candidates have to answer this question
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={editingQuestion.category} 
                  onValueChange={(value) => setEditingQuestion({...editingQuestion, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={editingQuestion.is_active}
                  onChange={(e) => setEditingQuestion({
                    ...editingQuestion, 
                    is_active: e.target.checked
                  })}
                  className="form-checkbox h-4 w-4"
                />
                <span>Question is active</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Only active questions can be assigned to jobs
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewQuestionDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveQuestion}
              disabled={!editingQuestion.question.trim()}
            >
              {currentQuestion ? 'Save Changes' : 'Add Question'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default VideoQuestionManagement;
