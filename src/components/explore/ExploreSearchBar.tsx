import { Search, X } from 'lucide-react';

interface ExploreSearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

function ExploreSearchBar({ searchQuery, onSearchChange, onClear }: ExploreSearchBarProps) {
  return (
    <div className="mb-5 sm:mb-6 md:mb-8">
      <div className="relative w-full sm:max-w-xl">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full pl-10 sm:pl-12 pr-9 sm:pr-10 py-2.5 sm:py-3 bg-dark-card border border-dark-border rounded-xl text-sm sm:text-base text-text-primary placeholder-text-muted focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          placeholder="Search countries or cities..."
        />
        {searchQuery && (
          <button
            onClick={onClear}
            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary rounded-full hover:bg-dark-border/50 transition-colors"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ExploreSearchBar;
