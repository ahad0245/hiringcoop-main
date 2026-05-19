
import { FiUser, FiVideo, FiUserCheck, FiCheck } from 'react-icons/fi';

interface ApplyStepsProps {
  currentStep: number;
}

const ApplySteps = ({ currentStep }: ApplyStepsProps) => {
  const steps = [
    { name: 'Basic Info', icon: <FiUser /> },
    { name: 'Video Interview', icon: <FiVideo /> },
    { name: 'ID Verification', icon: <FiUserCheck /> },
    { name: 'Submit Application', icon: <FiCheck /> }
  ];

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center w-full">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`flex-1 ${stepIdx !== steps.length - 1 ? 'relative' : ''}`}
          >
            <div className="flex flex-col items-center">
              {/* Step line */}
              {stepIdx !== steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-0.5 -translate-y-1/2 ${
                    stepIdx < currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Step indicator */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white ${
                  stepIdx < currentStep
                    ? 'bg-primary text-white' // Completed
                    : stepIdx === currentStep
                    ? 'border-2 border-primary text-primary' // Current
                    : 'border-2 border-gray-200 text-gray-400' // Upcoming
                }`}
              >
                {stepIdx < currentStep ? (
                  <FiCheck className="h-5 w-5" />
                ) : (
                  <span className="h-5 w-5 flex items-center justify-center">{step.icon}</span>
                )}
              </div>

              {/* Step label */}
              <span 
                className={`mt-2 text-xs sm:text-sm ${
                  stepIdx <= currentStep ? 'text-primary font-medium' : 'text-gray-500'
                }`}
              >
                {step.name}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ApplySteps;
