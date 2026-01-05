import { AlertCircle, RefreshCw } from 'lucide-react';

interface ExploreErrorStateProps {
  error: string;
  onRetry: () => void;
}

function ExploreErrorState({ error, onRetry }: ExploreErrorStateProps) {
  return (
    <div className="text-center py-10 sm:py-12 md:py-16 px-4">
      <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mx-auto mb-3 sm:mb-4" />
      <h3 className="text-base sm:text-lg font-medium text-text-primary mb-1.5 sm:mb-2">Unable to load countries</h3>
      <p className="text-sm sm:text-base text-text-muted mb-4 sm:mb-6 max-w-md mx-auto">{error}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        Try again
      </button>
    </div>
  );
}

export default ExploreErrorState;
