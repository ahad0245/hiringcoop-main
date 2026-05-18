
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-muted/30">
        <div className="container-custom py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
            
            <div className="bg-card rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold mb-4">For Candidates</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">How do I create an account?</AccordionTrigger>
                  <AccordionContent>
                    Sign up is easy! Click on the "Sign Up" button in the top navigation, fill in your details,
                    and verify your email address. Once verified, you can complete your profile and start applying for jobs.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">How does the video interview process work?</AccordionTrigger>
                  <AccordionContent>
                    Our platform uses AI-driven video interviews. When you apply for a position, you'll be prompted to
                    record short video answers to a few key questions. These videos help employers get to know you beyond
                    your resume and make the hiring process more personal and efficient.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">Is my personal information secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we take data security very seriously. We use advanced encryption and security measures to protect
                    your personal information. Your data is only shared with employers you apply to, and you can control
                    what information is visible on your profile.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">How can I prepare for video interviews?</AccordionTrigger>
                  <AccordionContent>
                    Check out our Interview Tips page for detailed guidance. Ensure you have a quiet environment with good
                    lighting, dress professionally, speak clearly, and be concise in your answers. Our platform also offers
                    practice sessions to help you get comfortable with video interviews.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold mb-4">For Employers</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">How do I post a job?</AccordionTrigger>
                  <AccordionContent>
                    After creating an employer account, navigate to your dashboard and click on "Post Job." Fill in the job
                    details, requirements, and set up the screening questions for the video interviews. Once submitted, your
                    job will be live on our platform.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">What are the benefits of video screening?</AccordionTrigger>
                  <AccordionContent>
                    Video screening saves time by allowing you to evaluate candidates' communication skills, enthusiasm, and
                    cultural fit before scheduling in-person interviews. This reduces the time-to-hire and helps you identify
                    the best candidates more efficiently.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-left">How much does it cost to use HiringCoop?</AccordionTrigger>
                  <AccordionContent>
                    We offer flexible pricing plans to suit businesses of all sizes. Visit our Pricing page for detailed
                    information on our packages. We also offer custom solutions for enterprise clients with specific needs.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-left">How do I review candidate applications?</AccordionTrigger>
                  <AccordionContent>
                    In your employer dashboard, you'll find a "Candidates" section where you can review all applications,
                    watch candidate videos, review resumes, and make notes. Our smart filtering system helps you identify
                    the most promising candidates based on your requirements.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Technical Support</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-9">
                  <AccordionTrigger className="text-left">I'm having technical issues. How can I get help?</AccordionTrigger>
                  <AccordionContent>
                    For technical support, please visit our Contact page and submit a support ticket. Our team is available
                    Monday through Friday, 9 AM to 6 PM EST, and will respond to your query within 24 hours.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-10">
                  <AccordionTrigger className="text-left">My video isn't recording properly. What should I do?</AccordionTrigger>
                  <AccordionContent>
                    Please ensure you've granted camera and microphone permissions to our website in your browser settings.
                    If issues persist, try using a different browser or device. Our system works best with Chrome, Firefox,
                    and Safari's latest versions.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
