
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import JobSearch from '@/components/jobs/JobSearch';
import JobList from '@/components/jobs/JobList';

const JobsPage = () => {
  const [searchKeywords, setSearchKeywords] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [filters, setFilters] = useState({});

  const handleSearch = (keywords: string, location: string, filters: any) => {
    setSearchKeywords(keywords);
    setSearchLocation(location);
    setFilters(filters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Find Your Next Opportunity</h1>
            <p className="text-gray-600 mt-2">
              Browse through our curated list of job opportunities
            </p>
          </div>
          
          <div className="mb-8">
            <JobSearch onSearch={handleSearch} />
          </div>
          
          <JobList 
            searchKeywords={searchKeywords} 
            searchLocation={searchLocation}
            filters={filters}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobsPage;
