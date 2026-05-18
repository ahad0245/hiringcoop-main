
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-muted/30">
        {/* Hero Section */}
        <div className="bg-primary text-white py-20">
          <div className="container-custom px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About HiringCoop</h1>
              <p className="text-xl opacity-90">
                Revolutionizing hiring through community, technology, and trust.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-16 container-custom px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg mb-6">
              At HiringCoop, we're on a mission to transform the hiring process through innovation, 
              community engagement, and cutting-edge technology. We believe that hiring should 
              be more human, more efficient, and more equitable.
            </p>
            <p className="text-lg mb-6">
              Founded in 2023, HiringCoop was born from a simple observation: traditional hiring 
              processes are often inefficient, impersonal, and fail to identify the best candidates. 
              We set out to change that by creating a platform that leverages AI-driven video 
              interviews and robust ID verification to connect employers with talent in a more 
              meaningful way.
            </p>
            <p className="text-lg">
              Our community-focused approach means we're building more than just a job board – 
              we're creating an ecosystem where candidates can showcase their true potential and 
              employers can make more informed hiring decisions.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16 bg-muted/50">
          <div className="container-custom px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-10 text-center">Our Leadership Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Team Member 1 */}
                <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">JD</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">Jane Doe</h3>
                  <p className="text-muted-foreground mb-3">CEO & Co-Founder</p>
                  <p className="text-sm">
                    Former HR Director with 15+ years experience in talent acquisition and workforce development.
                  </p>
                </div>
                
                {/* Team Member 2 */}
                <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">JS</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">John Smith</h3>
                  <p className="text-muted-foreground mb-3">CTO & Co-Founder</p>
                  <p className="text-sm">
                    Tech innovator with background in AI and video technology. Previously led engineering at VideoHire.
                  </p>
                </div>
                
                {/* Team Member 3 */}
                <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">AR</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">Ana Rodriguez</h3>
                  <p className="text-muted-foreground mb-3">Chief Product Officer</p>
                  <p className="text-sm">
                    Product strategist focused on creating intuitive user experiences and solving complex workflows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16 container-custom px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">Our Values</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Innovation</h3>
                  <p>
                    We constantly push the boundaries of what's possible in hiring technology, 
                    finding new ways to make the process more efficient, effective, and fair.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Community</h3>
                  <p>
                    We believe in the power of community to drive change in the hiring landscape, 
                    connecting candidates and employers in meaningful ways.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Trust</h3>
                  <p>
                    Trust is the foundation of our platform. We're committed to creating a secure and 
                    transparent environment where candidates and employers can connect with confidence.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Efficiency</h3>
                  <p>
                    We strive to make hiring faster and more efficient, saving time for both 
                    candidates and employers while maintaining quality and thoroughness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-primary/10">
          <div className="container-custom px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Join HiringCoop Today</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Whether you're looking for your next career move or seeking talented individuals to join your team, 
              HiringCoop provides the tools and community to make it happen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/signup">Join as a Candidate</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/employers">Post a Job</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
