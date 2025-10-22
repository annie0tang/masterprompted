interface ProgressIndicatorProps {
  currentStep: 'intro' | 'main' | 'takeaway';
  steps: {
    id: string;
    label: string;
  }[];
}

export default function ProgressIndicator({ currentStep, steps }: ProgressIndicatorProps) {
  const stepIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === stepIndex
                  ? 'bg-primary scale-125'
                  : index < stepIndex
                  ? 'bg-primary/60'
                  : 'bg-gray-300'
              }`}
            />
            <span
              className={`text-xs transition-colors duration-300 ${
                index === stepIndex
                  ? 'text-primary font-medium'
                  : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 w-12 transition-colors duration-300 ${
                index < stepIndex ? 'bg-primary/60' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
