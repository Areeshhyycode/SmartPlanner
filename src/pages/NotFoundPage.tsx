import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, MapPin } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-30"></div>
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="relative text-center max-w-lg">
        {/* 404 Text */}
        <div className="relative mb-8">
          <div className="text-[150px] sm:text-[200px] font-bold text-dark-border leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
              <MapPin className="w-12 h-12 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-text-secondary mb-8 max-w-md mx-auto">
          Oops! Looks like you've wandered off the map. The page you're looking for doesn't exist
          or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40 transition-all duration-300 transform hover:-translate-y-1"
          >
            <Home className="w-5 h-5 text-white" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-dark-elevated hover:bg-dark-hover border border-dark-border hover:border-blue-500/50 text-text-primary font-semibold rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Search Suggestion */}
        <div className="mt-12 p-6 bg-dark-card border border-dark-border rounded-2xl">
          <p className="text-text-secondary text-sm mb-4">Or try searching for what you need:</p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-cyan-400 font-medium transition-colors"
          >
            <Search className="w-4 h-4" />
            Search for cities
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;

