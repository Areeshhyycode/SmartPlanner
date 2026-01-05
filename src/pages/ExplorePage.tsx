import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { countryAPI, type ApiCountry } from '../api';
import {
  CountryCard,
  ExploreHeader,
  ExploreSearchBar,
  ExploreLoadingState,
  ExploreErrorState,
  ExploreResultsCount,
  ExploreEmptyState,
} from '../components/explore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 9;

function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [countries, setCountries] = useState<ApiCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch countries from API with caching
  const fetchCountries = useCallback(async () => {
    // Check cache first
    const cachedData = sessionStorage.getItem('countries_cache');
    const cacheTime = sessionStorage.getItem('countries_cache_time');
    const now = Date.now();

    // Use cache if less than 5 minutes old
    if (cachedData && cacheTime && (now - parseInt(cacheTime)) < 5 * 60 * 1000) {
      setCountries(JSON.parse(cachedData));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await countryAPI.getAllFull();
      setCountries(data);
      // Cache the data
      sessionStorage.setItem('countries_cache', JSON.stringify(data));
      sessionStorage.setItem('countries_cache_time', now.toString());
    } catch (err) {
      console.error('Failed to fetch countries:', err);
      setError('Failed to load countries. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // Get filtered countries
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return countries;
    }

    const query = searchQuery.toLowerCase();
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.code?.toLowerCase().includes(query) ||
        country.description?.toLowerCase().includes(query) ||
        country.cities?.some((city) => city.name.toLowerCase().includes(query))
    );
  }, [searchQuery, countries]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE);
  const paginatedCountries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCountries.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCountries, currentPage]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchParams({});
  }, [setSearchParams]);

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <ExploreHeader />

        <ExploreSearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClear={handleClearSearch}
        />

        {loading && <ExploreLoadingState />}

        {error && !loading && (
          <ExploreErrorState error={error} onRetry={fetchCountries} />
        )}

        {!loading && !error && (
          <>
            <ExploreResultsCount count={filteredCountries.length} searchQuery={searchQuery} />

            {filteredCountries.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {paginatedCountries.map((country, index) => (
                    <CountryCard key={country.id} country={country} index={index} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 sm:p-2 rounded-lg border border-dark-border bg-dark-card hover:bg-dark-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-text-primary" />
                    </button>

                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first, last, current, and neighbors
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 px-2 sm:px-3 text-sm sm:text-base rounded-lg border transition-colors ${
                                currentPage === page
                                  ? 'bg-blue-500 border-blue-500 text-white'
                                  : 'bg-dark-card border-dark-border text-text-primary hover:bg-dark-elevated'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="text-text-muted px-0.5 sm:px-1 text-sm">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 sm:p-2 rounded-lg border border-dark-border bg-dark-card hover:bg-dark-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-text-primary" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <ExploreEmptyState onExploreAll={handleClearSearch} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ExplorePage;
