
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FiBookOpen, FiCheck, FiVideo, FiAward, FiEdit, FiPlay, FiCheckCircle, FiExternalLink } from 'react-icons/fi';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  hint: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'course';
  description: string;
  url: string;
  duration?: string;
}

interface MockInterview {
  id: string;
  title: string;
  timeEstimate: string;
  questions: number;
  completed: boolean;
}

const InterviewPrepPage = () => {
  const [activeTab, setActiveTab] = useState('questions');
  const navigate = useNavigate();

  const commonQuestions: InterviewQuestion[] = [
    { id: '1', category: 'Behavioral', question: 'Tell me about yourself and your experience.', hint: 'Focus on your professional journey and highlight relevant skills and achievements.', difficulty: 'beginner' },
    { id: '2', category: 'Behavioral', question: 'What is your greatest professional achievement?', hint: 'Use the STAR method (Situation, Task, Action, Result) to structure your response.', difficulty: 'intermediate' },
    { id: '3', category: 'Technical', question: 'How would you approach debugging a complex issue in production?', hint: 'Describe your methodical approach to problem-solving and the tools you would use.', difficulty: 'advanced' },
    { id: '4', category: 'Technical', question: 'Explain how you would design a scalable web application.', hint: 'Cover database design, backend architecture, frontend optimization, and deployment strategies.', difficulty: 'advanced' },
    { id: '5', category: 'Situational', question: 'How do you handle conflicts within a team?', hint: 'Show your communication skills and ability to find common ground and resolutions.', difficulty: 'intermediate' },
  ];

  const resources: Resource[] = [
    { id: '1', title: 'Mastering the Behavioral Interview', type: 'article', description: 'Learn how to effectively respond to common behavioral interview questions.', url: 'https://www.themuse.com/advice/behavioral-interview-questions-answers-examples' },
    { id: '2', title: 'Technical Interview Patterns', type: 'video', description: 'Common patterns and approaches for solving technical interview problems.', url: 'https://www.youtube.com/results?search_query=technical+interview+tips', duration: '45 min' },
    { id: '3', title: 'Mock Interview Series', type: 'course', description: 'A comprehensive course with mock interviews and detailed feedback.', url: 'https://www.pramp.com/', duration: '3 hours' },
  ];

  const mockInterviews: MockInterview[] = [
    { id: '1', title: 'Entry-level Software Developer Interview', timeEstimate: '20 minutes', questions: 8, completed: false },
    { id: '2', title: 'Mid-level Full Stack Developer Interview', timeEstimate: '30 minutes', questions: 12, completed: false },
    { id: '3', title: 'Senior Frontend Engineer Interview', timeEstimate: '45 minutes', questions: 15, completed: false },
  ];

  const getDifficultyBadge = (difficulty: InterviewQuestion['difficulty']) => {
    const config = {
      beginner: { color: 'bg-green-100 text-green-800', label: 'Beginner' },
      intermediate: { color: 'bg-blue-100 text-blue-800', label: 'Intermediate' },
      advanced: { color: 'bg-purple-100 text-purple-800', label: 'Advanced' },
    };
    const { color, label } = config[difficulty];
    return <Badge className={`${color}`}>{label}</Badge>;
  };

  const getResourceTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article': return <FiBookOpen className="h-5 w-5" />;
      case 'video': return <FiVideo className="h-5 w-5" />;
      case 'course': return <FiAward className="h-5 w-5" />;
    }
  };

  return (
    <DashboardLayout userType="candidate">
      <div className="container max-w-5xl py-8">
        <h1 className="text-2xl font-bold mb-2">Interview Preparation</h1>
        <p className="text-muted-foreground mb-6">Prepare for your interviews with practice questions and resources</p>

        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-2">Your Interview Preparation Progress</h2>
                <p className="text-muted-foreground mb-4">Practice answering questions to build confidence</p>
                <Progress value={0} className="h-2 mb-4" />
                <div className="flex flex-wrap gap-3 mt-2">
                  <div className="flex items-center">
                    <FiCheckCircle className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-sm">0 Questions Practiced</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-muted pt-4 md:pt-0 md:pl-6">
                <Button className="w-full mb-2 flex items-center justify-center gap-2" onClick={() => navigate('/apply-now')}>
                  <FiVideo className="h-4 w-4" />
                  <span>Record Practice Answer</span>
                </Button>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/interview-tips')}>
                  <FiBookOpen className="h-4 w-4" />
                  <span>View Interview Tips</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="questions">Common Questions</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="mock">Mock Interviews</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {commonQuestions.map((q) => (
                <AccordionItem key={q.id} value={q.id}>
                  <AccordionTrigger className="hover:bg-muted/50 px-4 py-2 rounded-md">
                    <div className="flex flex-col items-start text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{q.category}</Badge>
                        {getDifficultyBadge(q.difficulty)}
                      </div>
                      <span>{q.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="bg-muted p-4 rounded-md mb-4">
                      <p className="font-medium mb-1">Preparation Hint:</p>
                      <p>{q.hint}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => navigate('/apply-now')}>
                        <FiVideo className="h-3 w-3" />
                        <span>Record Response</span>
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource) => (
                <Card key={resource.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>
                          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                          {resource.duration && <span> • {resource.duration}</span>}
                        </CardDescription>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-full">{getResourceTypeIcon(resource.type)}</div>
                    </div>
                  </CardHeader>
                  <CardContent><p>{resource.description}</p></CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full" onClick={() => window.open(resource.url, '_blank')}>
                      <FiExternalLink className="mr-2 h-4 w-4" />
                      {resource.type === 'video' ? 'Watch' : 'Read'} Resource
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mock">
            <Alert className="mb-4">
              <AlertDescription>
                Mock interviews help you practice in a realistic setting. Click "Start Interview" to record video responses.
              </AlertDescription>
            </Alert>
            <div className="space-y-4">
              {mockInterviews.map((interview) => (
                <Card key={interview.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{interview.title}</h3>
                        <span className="text-muted-foreground text-sm">
                          {interview.timeEstimate} • {interview.questions} questions
                        </span>
                        <div className="mt-4">
                          <Button className="flex items-center gap-2" onClick={() => navigate('/apply-now')}>
                            <FiPlay className="h-4 w-4" />
                            <span>Start Interview</span>
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-4 md:text-right">
                        <div className="text-sm text-muted-foreground">Difficulty</div>
                        <div className="flex items-center justify-end">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-2 mx-0.5 rounded-sm ${i < 3 ? 'bg-primary' : 'bg-muted'}`} style={{ height: `${12 + i * 2}px` }}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrepPage;
