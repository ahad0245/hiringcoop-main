
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FiArrowRight, FiSearch, FiVolume2, FiVolumeX } from 'react-icons/fi';

const Hero = () => {
  const [mutedCSuite, setMutedCSuite] = useState(true);
  const [mutedBlueCollar, setMutedBlueCollar] = useState(true);
  const cSuiteRef = useRef<HTMLVideoElement>(null);
  const blueCollarRef = useRef<HTMLVideoElement>(null);

  const toggleMute = (video: 'csuite' | 'bluecollar') => {
    if (video === 'csuite') {
      setMutedCSuite((prev) => !prev);
      if (cSuiteRef.current) cSuiteRef.current.muted = !cSuiteRef.current.muted;
    } else {
      setMutedBlueCollar((prev) => !prev);
      if (blueCollarRef.current) blueCollarRef.current.muted = !blueCollarRef.current.muted;
    }
  };

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
      <div className="container-custom">
        {/* Text content */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Don't just be an employee—
            <span className="gradient-text">be a member.</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            HiringCoop connects candidates with employers through AI-driven
            video interviews and trusted verification—from the C-suite to the
            front line.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rapid-apply">
              <Button size="lg" className="px-6 py-6 text-lg">
                Apply Now <FiArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="lg" variant="outline" className="px-6 py-6 text-lg">
                Browse Jobs <FiSearch className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Side-by-side video showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* C-Suite Executive */}
          <div className="relative rounded-xl overflow-hidden shadow-xl bg-card border border-border group">
            <video
              ref={cSuiteRef}
              src="/videos/c-suite-interview.mp4"
              poster="/videos/c-suite-interview.jpg"
              preload="metadata"
              autoPlay
              loop
              muted
              playsInline
              className="w-full aspect-video object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-between">
              <span className="text-white font-semibold text-sm md:text-base">
                C-Suite Executive
              </span>
              <button
                onClick={() => toggleMute('csuite')}
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                aria-label={mutedCSuite ? 'Unmute C-Suite video' : 'Mute C-Suite video'}
              >
                {mutedCSuite ? <FiVolumeX className="h-5 w-5" /> : <FiVolume2 className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Blue-Collar Worker */}
          <div className="relative rounded-xl overflow-hidden shadow-xl bg-card border border-border group">
            <video
              ref={blueCollarRef}
              src="/videos/blue-collar-interview.mp4"
              poster="/videos/blue-collar-interview.jpg"
              preload="metadata"
              autoPlay
              loop
              muted
              playsInline
              className="w-full aspect-video object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-between">
              <span className="text-white font-semibold text-sm md:text-base">
                Blue-Collar Worker
              </span>
              <button
                onClick={() => toggleMute('bluecollar')}
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                aria-label={mutedBlueCollar ? 'Unmute Blue-Collar video' : 'Mute Blue-Collar video'}
              >
                {mutedBlueCollar ? <FiVolumeX className="h-5 w-5" /> : <FiVolume2 className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
