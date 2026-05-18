
import { FiSearch, FiVideo, FiUserCheck, FiCheckCircle } from 'react-icons/fi';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FiSearch className="h-8 w-8" />,
      title: "Find Relevant Jobs",
      description: "Search and filter job listings by location, keywords, and other criteria to find positions that match your skills and interests.",
      iconBg: "bg-coop-blue/10",
      iconColor: "text-coop-blue"
    },
    {
      icon: <FiVideo className="h-8 w-8" />,
      title: "Record Video Interview",
      description: "Answer job-specific questions with our video recording tool. Retake any answer until you're satisfied with your response.",
      iconBg: "bg-coop-purple/10",
      iconColor: "text-coop-purple"
    },
    {
      icon: <FiUserCheck className="h-8 w-8" />,
      title: "Verify Your Identity",
      description: "Upload your official ID for verification, adding credibility to your profile and building trust with employers.",
      iconBg: "bg-coop-indigo/10",
      iconColor: "text-coop-indigo"
    },
    {
      icon: <FiCheckCircle className="h-8 w-8" />,
      title: "Get Matched & Hired",
      description: "Our AI matches your qualifications to positions, helping employers discover your talent through your video interview.",
      iconBg: "bg-coop-green/10",
      iconColor: "text-coop-green"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">How HiringCoop Works</h2>
          <p className="mt-4 text-lg text-gray-600">
            Our platform streamlines the hiring process with video interviews and AI-matching, helping you find your ideal position faster.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border card-hover">
              <div className={`w-16 h-16 rounded-full ${step.iconBg} flex items-center justify-center mb-6`}>
                <div className={step.iconColor}>{step.icon}</div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              <div className="mt-6">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-semibold text-lg">
                  {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            No account? No problem. You can still apply with our Rapid Apply option.
          </p>
          <a href="/apply-now" className="btn-primary">
            Start Your Application
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
