import { Check } from 'lucide-react';

interface BookingStepsProps {
  currentStep: number;
  steps: string[];
}

function BookingSteps({ currentStep, steps }: BookingStepsProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div key={step} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-dark-elevated border border-dark-border text-text-muted'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  isCurrent ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-text-muted'
                }`}
              >
                {step}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mx-2 transition-all duration-300 ${
                  isCompleted ? 'bg-green-500' : 'bg-dark-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BookingSteps;
