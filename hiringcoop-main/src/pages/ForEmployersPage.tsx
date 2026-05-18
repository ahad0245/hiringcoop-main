
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiVideo, FiCheckCircle, FiUsers, FiShield, FiArrowRight, FiBarChart2 } from 'react-icons/fi';

const features = [
  {
    icon: FiVideo,
    title: 'AI-Driven Video Screening',
    description: 'Candidates respond to your custom questions via video. Review responses at your pace — no scheduling needed.',
  },
  {
    icon: FiShield,
    title: 'Verified Candidates',
    description: 'Every applicant goes through trusted ID verification so you can hire with confidence.',
  },
  {
    icon: FiUsers,
    title: 'Community-First Hiring',
    description: 'Tap into a cooperative network of vetted candidates who are committed to meaningful work.',
  },
  {
    icon: FiBarChart2,
    title: 'Smart Matching',
    description: 'Our AI matches your job requirements with candidates who fit — saving hours of manual screening.',
  },
];

const ForEmployersPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Hire smarter with <span className="gradient-text">HiringCoop</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Post jobs, screen candidates through AI-powered video interviews, and build your team from a community of verified professionals.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="px-8 py-6 text-lg">
                Get Started Free <FiArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center">Why employers choose HiringCoop</h2>
          <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
            Everything you need to find, screen, and hire the right people — faster.
          </p>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4 p-6 rounded-xl border bg-card card-hover">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{f.title}</h3>
                  <p className="mt-2 text-muted-foreground text-sm">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-muted/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center">How it works for employers</h2>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Post Your Job', desc: 'Create a listing with custom video questions in minutes.' },
              { step: '2', title: 'Review Video Responses', desc: 'Watch candidate interviews on your schedule — no calls to coordinate.' },
              { step: '3', title: 'Hire with Confidence', desc: 'Select verified candidates and move forward faster.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold text-lg">{item.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-coop-purple to-coop-blue text-white">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">Ready to find your next great hire?</h2>
          <p className="mt-4 text-white/90 text-lg">
            Join HiringCoop today — it's free to post your first job.
          </p>
          <Link to="/signup" className="inline-block mt-8">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg">
              Sign Up as Employer <FiArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForEmployersPage;
