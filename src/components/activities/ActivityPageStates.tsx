import { Link } from 'react-router-dom';
import { AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = 'Loading activities...' }: LoadingStateProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingSpinner />
      <p className="text-text-secondary mt-4">{message}</p>
    </div>
  );
};

interface ErrorStateProps {
  error: string;
  countryId?: string;
  onRetry: () => void;
}

export const ErrorState = ({ error, countryId, onRetry }: ErrorStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center max-w-md">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          Unable to Load Activities
        </h3>
        <p className="text-text-secondary mb-4">{error}</p>
        <div className="flex gap-3 justify-center">
          <Link
            to={countryId ? `/country/${countryId}` : '/explore'}
            className="px-4 py-2 bg-dark-elevated border border-dark-border text-text-primary rounded-xl hover:border-blue-500/50 transition-colors"
          >
            Back to Cities
          </Link>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotFoundState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">City not found</h2>
        <Link to="/explore" className="text-blue-400 hover:underline">
          Back to Explore
        </Link>
      </div>
    </div>
  );
};

export const SuccessState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-grid opacity-30"></div>
      <div className="relative text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/30 animate-bounce">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-text-primary mb-2">Trip Booked!</h2>
        <p className="text-text-secondary">Redirecting to My Trips...</p>
      </div>
    </div>
  );
};
