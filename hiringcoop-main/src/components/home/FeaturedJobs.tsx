
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiBriefcase, FiClock, FiBookmark } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Mock data for featured jobs
const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Innovations Co.",
    location: "New York, NY",
    type: "Full-time",
    posted: "2 days ago",
    logo: "T",
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: 2,
    title: "Marketing Specialist",
    company: "Brand Growth Inc.",
    location: "Remote",
    type: "Contract",
    posted: "1 day ago",
    logo: "B",
    color: "bg-purple-100 text-purple-800"
  },
  {
    id: 3,
    title: "Product Manager",
    company: "SaaS Solutions",
    location: "San Francisco, CA",
    type: "Full-time",
    posted: "3 days ago",
    logo: "S",
    color: "bg-green-100 text-green-800"
  },
  {
    id: 4,
    title: "UX/UI Designer",
    company: "Creative Agency",
    location: "Chicago, IL",
    type: "Part-time",
    posted: "Just now",
    logo: "C",
    color: "bg-amber-100 text-amber-800"
  },
  {
    id: 5,
    title: "Data Analyst",
    company: "Data Insights Corp",
    location: "Boston, MA",
    type: "Full-time",
    posted: "1 week ago",
    logo: "D",
    color: "bg-indigo-100 text-indigo-800"
  },
  {
    id: 6,
    title: "Sales Representative",
    company: "Growth Ventures",
    location: "Miami, FL",
    type: "Full-time",
    posted: "3 days ago", 
    logo: "G",
    color: "bg-rose-100 text-rose-800"
  }
];

const FeaturedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  
  const toggleSaveJob = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Featured Job Opportunities</h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover your next career move from our curated selection of open positions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden card-hover border">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-lg ${job.color} flex items-center justify-center font-bold text-xl`}>
                        {job.logo}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold line-clamp-1">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleSaveJob(job.id)}
                      className="text-gray-400 hover:text-primary"
                      aria-label={savedJobs.includes(job.id) ? "Unsave job" : "Save job"}
                    >
                      <FiBookmark 
                        className={`h-5 w-5 ${savedJobs.includes(job.id) ? "fill-primary text-primary" : ""}`} 
                      />
                    </button>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiMapPin className="mr-1 h-4 w-4" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiBriefcase className="mr-1 h-4 w-4" />
                      <span>{job.type}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FiClock className="mr-1 h-4 w-4" />
                    <span>Posted {job.posted}</span>
                  </div>
                </div>
                
                <div className="flex border-t mt-4">
                  <Link to={`/jobs/${job.id}`} className="flex-1">
                    <Button variant="ghost" className="w-full rounded-none py-3">
                      View Details
                    </Button>
                  </Link>
                  <div className="w-px bg-gray-200"></div>
                  <Link to={`/apply/${job.id}`} className="flex-1">
                    <Button variant="ghost" className="w-full rounded-none py-3 text-primary hover:text-primary/90">
                      Quick Apply
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/jobs">
            <Button size="lg" variant="outline">
              View All Jobs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
