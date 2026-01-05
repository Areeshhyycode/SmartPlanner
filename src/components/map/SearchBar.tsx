import { useState, useCallback } from 'react';
import { Search, X, MapPin, Loader2 } from 'lucide-react';
import { mapAPI } from '../../api/mapService';

interface SearchBarProps {
  onLocationFound: (location: { lat: number; lon: number; name: string }) => void;
  placeholder?: string;
}

export default function SearchBar({ onLocationFound, placeholder = "Search for a location..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await mapAPI.geocode(query);
      onLocationFound({
        lat: result.latitude,
        lon: result.longitude,
        name: result.displayName,
      });
      setError(null);
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Location not found. Try a different search.');
    } finally {
      setLoading(false);
    }
  }, [query, onLocationFound]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setError(null);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-3 bg-dark-elevated border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
          {query && (
            <button
              onClick={clearSearch}
              className="p-1.5 hover:bg-dark-hover rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-dark-border disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
      {error && (
        <p className="text-red-400 text-sm pl-1">{error}</p>
      )}
    </div>
  );
}
