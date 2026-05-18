
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FiUser, FiBriefcase, FiVideo, FiCheckCircle } from "react-icons/fi";

const HowItWorksPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-primary py-16 text-white">
          <div className="container-custom px-4">
            <h1 className="text-4xl font-bold mb-4">How HiringCoop Works</h1>
            <p className="text-xl max-w-2xl">
              Discover how our innovative platform connects candidates and employers through
              AI-driven video interviews and a community-focused approach.
            </p>
          </div>
        </div>

        {/* For Candidates */}
        <div className="py-16">
          <div className="container-custom px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <FiUser className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">For Candidates</h2>
              <p className="text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
                Find your dream job with a platform designed to showcase your true potential.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                  alt="Person using laptop" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Create Your Profile</h3>
                    <p className="text-muted-foreground">
                      Sign up and build your professional profile. Upload your resume, showcase your skills,
                      and highlight your experience in a format employers love.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Discover Opportunities</h3>
                    <p className="text-muted-foreground">
                      Browse through our curated job listings across various industries.
                      Use filters to find positions that match your skills and career goals.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Record Video Applications</h3>
                    <p className="text-muted-foreground">
                      Stand out from the crowd with video interviews. Answer job-specific questions
                      and let employers see the person behind the resume.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Get Hired</h3>
                    <p className="text-muted-foreground">
                      Receive interview requests, connect with employers, and land your dream job.
                      Our platform makes the hiring process transparent and efficient.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <Link to="/signup">Create Your Profile</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* For Employers */}
        <div className="py-16 bg-muted/30">
          <div className="container-custom px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <FiBriefcase className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">For Employers</h2>
              <p className="text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
                Find the perfect candidates faster with our innovative hiring platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div className="order-2 md:order-1 space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Create Your Company Profile</h3>
                    <p className="text-muted-foreground">
                      Showcase your company culture, values, and benefits to attract the right talent.
                      Build a brand that resonates with potential candidates.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Post Job Openings</h3>
                    <p className="text-muted-foreground">
                      Create detailed job listings with custom screening questions and video prompts
                      that help identify the best candidates for your positions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Review Video Applications</h3>
                    <p className="text-muted-foreground">
                      Save time by watching candidate videos before scheduling interviews.
                      Get a sense of personality, communication skills, and cultural fit.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Hire With Confidence</h3>
                    <p className="text-muted-foreground">
                      Make more informed hiring decisions with our comprehensive candidate profiles
                      and verified identity checks. Reduce time-to-hire and improve quality of hires.
                    </p>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                  alt="Employer reviewing applications" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <Link to="/employers">Start Hiring</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Video Interview Technology */}
        <div className="py-16">
          <div className="container-custom px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <FiVideo className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Our Video Interview Technology</h2>
              <p className="text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
                Transforming the way candidates and employers connect through innovative video solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Time-Efficient</h3>
                <p className="text-muted-foreground">
                  Save hours of screening calls with asynchronous video interviews that candidates can complete on their own time.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">ID Verification</h3>
                <p className="text-muted-foreground">
                  Our platform includes robust identity verification to ensure the authenticity of candidates applying to your positions.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">AI-Enhanced</h3>
                <p className="text-muted-foreground">
                  Our AI technology helps match candidates with the right opportunities and provides insights for better hiring decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="py-16 bg-primary/10">
          <div className="container-custom px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-white rounded-full mb-4">
                <FiCheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Success Stories</h2>
              <p className="text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
                Real results from companies and candidates who've used HiringCoop.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <blockquote className="bg-card p-6 rounded-lg shadow-sm border-l-4 border-primary">
                <p className="italic mb-6">
                  "HiringCoop transformed our hiring process. We reduced our time-to-hire by 40% and saw a significant improvement in candidate quality. The video interviews give us insight into candidates before committing to formal interviews."
                </p>
                <footer>
                  <p className="font-bold">Sarah Johnson</p>
                  <p className="text-muted-foreground">HR Director, TechNova Inc</p>
                </footer>
              </blockquote>

              <blockquote className="bg-card p-6 rounded-lg shadow-sm border-l-4 border-primary">
                <p className="italic mb-6">
                  "As someone who gets nervous in interviews, the video application format allowed me to present myself at my best. I could prepare, practice, and put my best foot forward. I found my current role through HiringCoop and couldn't be happier."
                </p>
                <footer>
                  <p className="font-bold">Michael Chen</p>
                  <p className="text-muted-foreground">Software Developer</p>
                </footer>
              </blockquote>
            </div>

            <div className="mt-12 text-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/testimonials">Read More Success Stories</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16">
          <div className="container-custom px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Join thousands of candidates and employers who are already using HiringCoop to find their perfect match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/signup">Create an Account</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/faq">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
