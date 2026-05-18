
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const WhyHiringCoopPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-primary py-20 text-white">
          <div className="container-custom px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Why Choose HiringCoop</h1>
              <p className="text-xl mb-8">
                Discover how our innovative platform is transforming the hiring process for employers and creating better opportunities for candidates.
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link to="/employers">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="py-16">
          <div className="container-custom px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Employers Choose HiringCoop</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-card border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Reduce Time-to-Hire</h3>
                  <p className="text-muted-foreground">
                    Our video screening process cuts interview time by up to 60%, allowing you to evaluate more candidates in less time and make faster hiring decisions.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Find Better Cultural Fits</h3>
                  <p className="text-muted-foreground">
                    Video applications reveal personality, communication style, and cultural fit in ways that resumes and text applications simply cannot match.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Enhanced Security</h3>
                  <p className="text-muted-foreground">
                    Our ID verification system ensures you're interviewing real candidates with verified identities, reducing fraud and improving hiring security.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* ROI Section */}
        <div className="py-16 bg-muted/30">
          <div className="container-custom px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Measurable ROI</h2>
                <p className="text-lg mb-8">
                  HiringCoop delivers tangible returns on your recruitment investment. Our clients report:
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                      ✓
                    </div>
                    <div>
                      <strong className="text-primary">40% reduction in time-to-hire</strong>
                      <p className="text-muted-foreground">Fill positions faster and reduce vacancy costs</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                      ✓
                    </div>
                    <div>
                      <strong className="text-primary">35% lower cost-per-hire</strong>
                      <p className="text-muted-foreground">Streamlined process reduces recruitment expenses</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                      ✓
                    </div>
                    <div>
                      <strong className="text-primary">25% improvement in retention rates</strong>
                      <p className="text-muted-foreground">Better matches lead to longer employee tenure</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                      ✓
                    </div>
                    <div>
                      <strong className="text-primary">60% wider candidate pool</strong>
                      <p className="text-muted-foreground">Access talent regardless of location</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-6 text-center">ROI Calculator</h3>
                <div className="space-y-6">
                  <div>
                    <label className="font-medium">Average annual salary for positions</label>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg">$</span>
                      <div className="bg-muted/50 p-2 rounded-md flex-grow text-center font-bold">
                        75,000
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="font-medium">Number of hires per year</label>
                    <div className="bg-muted/50 p-2 rounded-md mt-2 text-center font-bold">
                      20
                    </div>
                  </div>
                  <div>
                    <label className="font-medium">Current average time-to-hire (days)</label>
                    <div className="bg-muted/50 p-2 rounded-md mt-2 text-center font-bold">
                      45
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Reduced time-to-hire savings:</span>
                      <span className="font-bold text-primary">$82,500</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Improved quality of hire value:</span>
                      <span className="font-bold text-primary">$150,000</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Reduced recruitment costs:</span>
                      <span className="font-bold text-primary">$35,000</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-bold text-lg">
                      <span>Estimated annual savings:</span>
                      <span className="text-primary">$267,500</span>
                    </div>
                  </div>
                  
                  <div className="text-center mt-4">
                    <Button asChild>
                      <Link to="/contact">Contact for Custom ROI Analysis</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="container-custom px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Powerful Hiring Features</h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex gap-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-full h-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">AI-Enhanced Video Screening</h3>
                    <p className="text-muted-foreground">
                      Our platform allows candidates to record video responses to your specific questions. 
                      AI analysis provides insights on communication skills, confidence levels, and key talking points.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-full h-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Customizable Screening Questions</h3>
                    <p className="text-muted-foreground">
                      Create tailored question sets for different positions. Mix technical questions, 
                      behavioral scenarios, and company culture prompts to thoroughly evaluate candidates.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex gap-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-full h-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Robust ID Verification</h3>
                    <p className="text-muted-foreground">
                      Our platform includes government ID scanning and biometric verification to ensure 
                      candidate identity, reducing fraud and creating a secure hiring environment.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-full h-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                    <p className="text-muted-foreground">
                      Gain insights into your hiring process with detailed analytics. Track metrics like 
                      time-to-hire, source effectiveness, and conversion rates to optimize your recruitment strategy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <Card className="border-0 shadow-md bg-primary/5">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Collaborative Hiring Tools</h3>
                      <p className="mb-6">
                        Our platform makes team-based hiring decisions easier with collaborative review features:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Share candidate profiles with team members</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Leave private comments and ratings</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Standardized evaluation forms</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Aggregate team feedback automatically</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <img 
                        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                        alt="Team collaboration" 
                        className="rounded-lg shadow-lg w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-16 bg-primary/10">
          <div className="container-custom px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-primary">TD</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Thomas Decker</h3>
                      <p className="text-sm text-muted-foreground">HR Director, TechSolutions Inc.</p>
                    </div>
                  </div>
                  <p className="italic">
                    "HiringCoop has transformed our recruitment process. The video interviewing feature 
                    saves us countless hours and helps us identify top talent faster. Our time-to-hire 
                    has decreased by 45% since implementing the platform."
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-primary">RJ</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Rachel Johnson</h3>
                      <p className="text-sm text-muted-foreground">Talent Acquisition Manager, GrowthCorp</p>
                    </div>
                  </div>
                  <p className="italic">
                    "The identity verification feature gives us peace of mind, especially when hiring 
                    remotely. We've seen a significant improvement in candidate quality and retention rates 
                    since adopting HiringCoop's comprehensive platform."
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-primary">ML</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Michael Liu</h3>
                      <p className="text-sm text-muted-foreground">CEO, StartupNow</p>
                    </div>
                  </div>
                  <p className="italic">
                    "As a small company, every hire is crucial. HiringCoop's platform helped us compete 
                    for talent with larger organizations by streamlining our process and presenting our 
                    company culture effectively to candidates."
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <Button asChild variant="outline">
                <Link to="/testimonials">Read More Success Stories</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Pricing CTA */}
        <div className="py-16">
          <div className="container-custom px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring Process?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Join thousands of companies already using HiringCoop to find and hire exceptional talent 
              faster and more efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/pricing">View Pricing Plans</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Request a Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WhyHiringCoopPage;
