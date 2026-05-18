
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import FeaturedJobs from '@/components/home/FeaturedJobs';
import Testimonials from '@/components/home/Testimonials';
import CTA from '@/components/home/CTA';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <FeaturedJobs />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
