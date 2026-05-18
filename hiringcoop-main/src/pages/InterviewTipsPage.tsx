
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FiVideo, FiMic, FiMonitor, FiUser, FiMessageCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const InterviewTipsPage = () => {
  return (
    <DashboardLayout userType="candidate">
      <div className="bg-muted/30 min-h-full">
        {/* Hero Section */}
        <div className="bg-primary text-white py-16">
          <div className="container-custom px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">Interview Tips</h1>
              <p className="text-xl opacity-90">
                Master your video interviews with professional tips and guidance.
                Stand out from the crowd and make a lasting impression.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-custom px-4 py-12">
          <Tabs defaultValue="video" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-5">
              <TabsTrigger value="video">Video Setup</TabsTrigger>
              <TabsTrigger value="preparation">Preparation</TabsTrigger>
              <TabsTrigger value="presentation">Presentation</TabsTrigger>
              <TabsTrigger value="questions">Common Questions</TabsTrigger>
              <TabsTrigger value="followup">Follow-up</TabsTrigger>
            </TabsList>
            
            {/* Video Setup Tips */}
            <TabsContent value="video" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FiVideo className="mr-2 h-5 w-5 text-primary" />
                    Setting Up Your Video Environment
                  </CardTitle>
                  <CardDescription>
                    Create the ideal setting for your video interview to make a professional impression
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Lighting</h3>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Position yourself facing a window for natural light, if possible</li>
                        <li>Avoid backlighting that creates shadows on your face</li>
                        <li>Use a desk lamp positioned in front of you if natural light isn't available</li>
                        <li>Test your lighting setup before the interview</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Background</h3>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Choose a clean, uncluttered background</li>
                        <li>Remove distracting items from view</li>
                        <li>A blank wall or bookshelf works well</li>
                        <li>Ensure privacy and minimize interruptions</li>
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Camera Position</h3>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Position your camera at eye level</li>
                        <li>Sit at arm's length from the camera</li>
                        <li>Frame yourself from mid-chest to just above your head</li>
                        <li>Look directly into the camera when speaking</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Technical Checks</h3>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Test your camera and microphone before starting</li>
                        <li>Ensure stable internet connection</li>
                        <li>Close unnecessary applications to improve performance</li>
                        <li>Have a backup plan if technical issues arise</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Pro Tip</h3>
                    <p>
                      Record a practice session with your setup and watch it back to spot any issues with your 
                      lighting, framing, or audio quality. This will help you make adjustments before your actual interview.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preparation Tips */}
            <TabsContent value="preparation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FiMonitor className="mr-2 h-5 w-5 text-primary" />
                    Interview Preparation
                  </CardTitle>
                  <CardDescription>
                    Set yourself up for success by thoroughly preparing for your interview
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Research</h3>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Study the company's website, mission, and values</li>
                        <li>Research recent news and developments about the company</li>
                        <li>Understand the role and how it fits into the organization</li>
                        <li>Review the LinkedIn profiles of your potential interviewers</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Practice</h3>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Rehearse answers to common interview questions</li>
                        <li>Practice the STAR method (Situation, Task, Action, Result)</li>
                        <li>Record yourself and review your delivery</li>
                        <li>Conduct mock interviews with friends or family</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Prepare Your Materials</h3>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Have multiple copies of your resume nearby</li>
                      <li>Prepare a list of your key accomplishments relevant to the role</li>
                      <li>Have examples ready that demonstrate your skills and experience</li>
                      <li>Create a list of thoughtful questions to ask the interviewer</li>
                      <li>Keep a notepad and pen handy to take notes</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Pro Tip</h3>
                    <p>
                      Create a "cheat sheet" with key talking points, accomplishments, and questions 
                      to ask. Keep it just off-camera for quick reference during your video interview.
                      Just be careful not to read directly from it—use it only as a memory aid.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Presentation Tips */}
            <TabsContent value="presentation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FiUser className="mr-2 h-5 w-5 text-primary" />
                    Professional Presentation
                  </CardTitle>
                  <CardDescription>
                    Make the right impression with your appearance and demeanor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Attire</h3>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Dress professionally from head to toe (you might need to stand up)</li>
                        <li>Choose solid colors over busy patterns</li>
                        <li>Avoid clothing that blends with your background</li>
                        <li>Check how your outfit appears on camera before the interview</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Body Language</h3>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Sit up straight with good posture</li>
                        <li>Maintain appropriate eye contact by looking at the camera</li>
                        <li>Nod and smile to show engagement</li>
                        <li>Use hand gestures naturally but keep them in frame</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Speaking Skills</h3>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Speak clearly and at a moderate pace</li>
                      <li>Pause briefly before answering questions to gather your thoughts</li>
                      <li>Avoid filler words like "um," "like," and "you know"</li>
                      <li>Vary your tone to maintain interest</li>
                      <li>End your responses with clear conclusions rather than trailing off</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Pro Tip</h3>
                    <p>
                      Place a small sticky note with a smiley face near your camera to remind yourself 
                      to smile during the interview. This simple trick can help you maintain a friendly, 
                      engaged demeanor throughout the conversation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Common Questions Tips */}
            <TabsContent value="questions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FiMessageCircle className="mr-2 h-5 w-5 text-primary" />
                    Answering Common Questions
                  </CardTitle>
                  <CardDescription>
                    Prepare thoughtful responses to frequently asked interview questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-2">Tell me about yourself</h3>
                      <p className="mb-2">Strategy: Provide a concise professional summary that highlights your relevant experience, skills, and interests.</p>
                      <div className="bg-muted/50 p-3 rounded">
                        <p className="italic">
                          "I'm a marketing professional with 5 years of experience in digital advertising. I specialize in social media campaigns and have helped increase engagement by 40% for my current company. I have a degree in Marketing Communications and I'm passionate about data-driven strategies. Outside of work, I volunteer teaching digital literacy skills, which keeps me connected to how different audiences interact with technology."
                        </p>
                      </div>
                    </div>

                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-2">What is your greatest strength?</h3>
                      <p className="mb-2">Strategy: Choose a strength that is relevant to the position and provide a specific example that demonstrates it.</p>
                      <div className="bg-muted/50 p-3 rounded">
                        <p className="italic">
                          "My greatest strength is my ability to collaborate effectively across teams. In my previous role, I led a project that required coordination between marketing, design, and development. By establishing clear communication channels and holding regular check-ins, we launched the campaign two weeks ahead of schedule and exceeded our conversion targets by 25%."
                        </p>
                      </div>
                    </div>

                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-2">What is your greatest weakness?</h3>
                      <p className="mb-2">Strategy: Be honest about an area you're working to improve, and describe the specific steps you're taking to address it.</p>
                      <div className="bg-muted/50 p-3 rounded">
                        <p className="italic">
                          "I've sometimes struggled with delegation, preferring to ensure quality by handling important tasks myself. However, I've recognized that this isn't scalable as projects grow. I've been working on this by identifying team members' strengths, providing clear instructions, and focusing on outcomes rather than micromanaging the process. This has not only improved our team's productivity but has also allowed me to focus more on strategic initiatives."
                        </p>
                      </div>
                    </div>

                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-2">Why do you want to work for this company?</h3>
                      <p className="mb-2">Strategy: Show that you've researched the company and explain how your values, goals, and skills align with their mission.</p>
                      <div className="bg-muted/50 p-3 rounded">
                        <p className="italic">
                          "I've followed your company's growth for several years and have been impressed by your commitment to sustainability and innovation. Your recent initiative to reduce carbon emissions in your supply chain particularly resonates with my values. Additionally, your collaborative culture and emphasis on professional development align with what I'm looking for in my career. I believe my experience in optimizing operations would allow me to contribute meaningfully to your sustainability goals."
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Where do you see yourself in five years?</h3>
                      <p className="mb-2">Strategy: Show ambition that aligns with the company's growth while demonstrating commitment to the role you're applying for.</p>
                      <div className="bg-muted/50 p-3 rounded">
                        <p className="italic">
                          "In five years, I hope to have grown with the company and developed deeper expertise in this industry. I'm excited about potentially taking on increased responsibility, perhaps in a senior role where I can mentor others. I'm particularly interested in your company's expansion into international markets, and I hope to contribute to that growth by developing my cross-cultural communication skills and industry knowledge."
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Pro Tip</h3>
                    <p>
                      Use the STAR method (Situation, Task, Action, Result) when answering behavioral questions. 
                      This provides a structured way to tell compelling stories about your past experiences and 
                      achievements, giving interviewers concrete examples of your capabilities.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Follow-up Tips */}
            <TabsContent value="followup" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FiMic className="mr-2 h-5 w-5 text-primary" />
                    Follow-up Best Practices
                  </CardTitle>
                  <CardDescription>
                    Leave a lasting impression after your interview concludes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Thank You Notes</h3>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Send a thank you email within 24 hours</li>
                        <li>Personalize each note if you met with multiple people</li>
                        <li>Reference specific topics discussed during the interview</li>
                        <li>Express continued interest in the position</li>
                        <li>Keep it concise and professional</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Appropriate Follow-up</h3>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Wait at least one week before following up if you haven't heard back</li>
                        <li>Be polite and express continued interest</li>
                        <li>Ask about the timeline for the hiring decision</li>
                        <li>Limit follow-ups to avoid appearing desperate</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Additional Materials</h3>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Send any requested follow-up materials promptly</li>
                      <li>Consider sending relevant work samples that support points discussed</li>
                      <li>Share articles or resources related to topics from your conversation</li>
                      <li>Update your LinkedIn profile to reflect current activities</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Pro Tip</h3>
                    <p>
                      In your thank-you note, include a brief "value-add" such as an article relevant to a challenge 
                      discussed during the interview or a thoughtful idea that came to you after the conversation. 
                      This shows your continued engagement and proactive thinking.
                    </p>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-md border border-primary/20 mt-6">
                    <h3 className="text-lg font-semibold mb-2">Thank You Note Template</h3>
                    <div className="bg-white p-4 rounded border">
                      <p><strong>Subject:</strong> Thank You for the [Position] Interview</p>
                      <br />
                      <p>Dear [Interviewer's Name],</p>
                      <br />
                      <p>Thank you for taking the time to speak with me today about the [Position] role at [Company]. I enjoyed learning more about [specific topic discussed] and how your team is working to [company objective].</p>
                      <br />
                      <p>Our conversation reinforced my enthusiasm for the position and confidence that my experience in [relevant skill/experience] would allow me to make valuable contributions to your team.</p>
                      <br />
                      <p>I was particularly excited about [specific project or aspect of the role discussed], and I've been thinking about [additional insight or idea related to the conversation].</p>
                      <br />
                      <p>Please don't hesitate to contact me if you need any additional information. I look forward to hearing from you about the next steps in the process.</p>
                      <br />
                      <p>Best regards,</p>
                      <p>[Your Name]</p>
                      <p>[Phone Number]</p>
                      <p>[LinkedIn Profile]</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Practice Section */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-primary/10 rounded-lg p-6 md:p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Put These Tips into Practice?</h2>
              <p className="text-lg mb-6">
                Join HiringCoop today and access our interview simulator to practice your video interview skills.
                Get feedback, build confidence, and land your dream job.
              </p>
              <Button asChild size="lg">
                <Link to="/signup">Create Free Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewTipsPage;
