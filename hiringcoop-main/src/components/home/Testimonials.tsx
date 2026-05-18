
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';

const testimonials = [
  {
    id: 1,
    content: "HiringCoop completely transformed my job search. The video interview format allowed me to showcase my personality and skills in a way that resumes can't capture. I received three job offers within two weeks!",
    author: "Alexandra Chen",
    position: "Marketing Manager",
    company: "Hired at TechGrowth Inc.",
    rating: 5
  },
  {
    id: 2,
    content: "As someone who gets nervous in traditional interviews, the ability to record and redo my answers was a game-changer. I could present myself confidently and landed my dream job after just a few applications.",
    author: "Marcus Johnson",
    position: "Software Developer",
    company: "Hired at InnovateTech",
    rating: 5
  },
  {
    id: 3,
    content: "The platform is incredibly intuitive, and the rapid apply feature made it easy to apply to multiple positions quickly. The verification process also gave me confidence that employers were legitimate.",
    author: "Sophia Rodriguez",
    position: "Project Coordinator",
    company: "Hired at GlobalSolutions",
    rating: 4
  },
  {
    id: 4,
    content: "I was skeptical at first about video interviews, but HiringCoop made the process seamless. The ability to showcase my communication skills directly to employers gave me a competitive edge.",
    author: "David Kim",
    position: "Sales Executive",
    company: "Hired at GrowthVentures",
    rating: 5
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextTestimonial = () => {
    setActiveIndex((activeIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((activeIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Success Stories</h2>
          <p className="mt-4 text-lg text-gray-600">
            Hear from candidates who found their ideal positions through our platform
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Desktop Testimonial */}
          <div className="hidden md:block bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="flex">
              <div className="w-1/3 pr-8">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4"></div>
                <h3 className="font-semibold text-lg">{testimonials[activeIndex].author}</h3>
                <p className="text-gray-600 text-sm">{testimonials[activeIndex].position}</p>
                <p className="text-primary text-sm mt-1">{testimonials[activeIndex].company}</p>
                <div className="flex items-center mt-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i}
                      className={`h-4 w-4 ${i < testimonials[activeIndex].rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
              </div>
              <div className="w-2/3">
                <svg className="h-12 w-12 text-primary/20 mb-4" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-lg text-gray-700 italic mb-6">
                  {testimonials[activeIndex].content}
                </p>
              </div>
            </div>
          </div>
          
          {/* Mobile Testimonial */}
          <div className="md:hidden bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
            <svg className="h-10 w-10 text-primary/20 mb-4" fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <p className="text-gray-700 italic mb-6">
              {testimonials[activeIndex].content}
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h3 className="font-semibold">{testimonials[activeIndex].author}</h3>
                <p className="text-gray-600 text-sm">{testimonials[activeIndex].position}</p>
                <p className="text-primary text-xs">{testimonials[activeIndex].company}</p>
              </div>
            </div>
            <div className="flex items-center mt-4">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i}
                  className={`h-4 w-4 ${i < testimonials[activeIndex].rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} 
                />
              ))}
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="absolute -bottom-12 left-0 right-0 flex justify-center items-center mt-8 space-x-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full ${index === activeIndex ? "bg-primary" : "bg-gray-300"}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            onClick={prevTestimonial}
            className="absolute top-1/2 -left-12 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 focus:outline-none hidden md:block"
            aria-label="Previous testimonial"
          >
            <FiChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={nextTestimonial}
            className="absolute top-1/2 -right-12 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 focus:outline-none hidden md:block"
            aria-label="Next testimonial"
          >
            <FiChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
