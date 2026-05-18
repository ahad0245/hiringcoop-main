
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTA = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-coop-purple to-coop-blue text-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Join the Community?</h2>
          <p className="mt-6 text-xl text-white/90">
            Apply for your next role using our cutting-edge video interview platform
            or post job listings to find ideal candidates.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/rapid-apply">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/90 hover:text-primary px-8 py-6 text-lg"
              >
                Apply for Jobs
              </Button>
            </Link>
            <Link to="/for-employers">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                For Employers
              </Button>
            </Link>
          </div>
          
          <p className="mt-8 text-white/80">
            No account required for quick applications. Join thousands of members already in our community.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
