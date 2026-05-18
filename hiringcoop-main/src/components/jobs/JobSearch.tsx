
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiSearch, FiMapPin, FiFilter, FiX } from 'react-icons/fi';

interface JobSearchProps {
  onSearch: (keywords: string, location: string, filters: any) => void;
}

const JobSearch = ({ onSearch }: JobSearchProps) => {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobType: [],
    experience: [],
    remote: false
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keywords, location, filters);
  };

  const toggleJobType = (type: string) => {
    if (filters.jobType.includes(type)) {
      setFilters({
        ...filters,
        jobType: filters.jobType.filter(t => t !== type)
      });
    } else {
      setFilters({
        ...filters,
        jobType: [...filters.jobType, type]
      });
    }
  };

  const toggleExperience = (level: string) => {
    if (filters.experience.includes(level)) {
      setFilters({
        ...filters,
        experience: filters.experience.filter(l => l !== level)
      });
    } else {
      setFilters({
        ...filters,
        experience: [...filters.experience, level]
      });
    }
  };

  const toggleRemote = () => {
    setFilters({
      ...filters,
      remote: !filters.remote
    });
  };

  const resetFilters = () => {
    setFilters({
      jobType: [],
      experience: [],
      remote: false
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Keywords Input */}
          <div className="md:col-span-5">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <Input
                type="text"
                placeholder="Job title, skills, or keywords"
                className="pl-10"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
          </div>
          
          {/* Location Input */}
          <div className="md:col-span-4">
            <div className="relative">
              <FiMapPin className="absolute left-3 top-3 text-gray-400" />
              <Input
                type="text"
                placeholder="City, state, or remote"
                className="pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          
          {/* Search Button */}
          <div className="md:col-span-3">
            <Button type="submit" className="w-full">
              Search Jobs
            </Button>
          </div>
        </div>
        
        {/* Filters Toggle */}
        <div className="mt-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm text-gray-600 hover:text-primary"
          >
            <FiFilter className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          {(filters.jobType.length > 0 || filters.experience.length > 0 || filters.remote) && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-primary flex items-center"
            >
              <FiX className="mr-1" /> Clear Filters
            </button>
          )}
        </div>
        
        {/* Extended Filters */}
        {showFilters && (
          <div className="mt-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Job Type Filter */}
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Job Type</h4>
                <div className="space-y-2">
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-2"
                        checked={filters.jobType.includes(type)}
                        onChange={() => toggleJobType(type)}
                      />
                      <span className="text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Experience Level Filter */}
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Experience Level</h4>
                <div className="space-y-2">
                  {['Entry level', 'Mid level', 'Senior level', 'Manager'].map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-2"
                        checked={filters.experience.includes(level)}
                        onChange={() => toggleExperience(level)}
                      />
                      <span className="text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Remote Option */}
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Work Setting</h4>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-primary focus:ring-primary mr-2"
                    checked={filters.remote}
                    onChange={toggleRemote}
                  />
                  <span className="text-gray-700">Remote Only</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default JobSearch;
