import { Search } from 'lucide-react';

interface ExploreEmptyStateProps {
  onExploreAll: () => void;
}

function ExploreEmptyState({ onExploreAll }: ExploreEmptyStateProps) {
  return (
    <div className="text-center py-10 sm:py-12 md:py-16 px-4">
      <Search className="w-10 h-10 sm:w-12 sm:h-12 text-text-muted mx-auto mb-3 sm:mb-4" />
      <h3 className="text-base sm:text-lg font-medium text-text-primary mb-1.5 sm:mb-2">No results found</h3>
      <p className="text-sm sm:text-base text-text-muted mb-4 sm:mb-6">
        Try a different search term or browse all destinations
      </p>
      <button
        onClick={onExploreAll}
        className="px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg transition-colors"
      >
        View all countries
      </button>
    </div>
  );
}

export default ExploreEmptyState;
