import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CloudSun,
  RefreshCw,
  AlertCircle,
  Compass,
  BarChart3,
} from 'lucide-react';
import { countryAPI, type ApiCountry, type ApiCity } from '../api';
import CitySelector from '../components/weather/CitySelector';
import WeatherComparisonCard from '../components/weather/WeatherComparisonCard';
import HistoricalData from '../components/weather/HistoricalData';
import { WeatherPageSkeleton } from '../components/weather/WeatherSkeleton';

type TabType = 'comparison' | 'historical';

export default function WeatherComparisonPage() {
  const [countries, setCountries] = useState<ApiCountry[]>([]);
  const [selectedCities, setSelectedCities] = useState<ApiCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('comparison');

  const fetchCountries = useCallback(async () => {
    // Check cache first (reuse from Explore page)
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
    } catch {
      setError('Failed to load destinations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const handleCitySelect = useCallback((city: ApiCity) => {
    if (selectedCities.length < 4 && !selectedCities.some(c => c.id === city.id)) {
      setSelectedCities(prev => [...prev, city]);
    }
  }, [selectedCities.length]);

  const handleCityRemove = useCallback((cityId: string) => {
    setSelectedCities(prev => prev.filter(c => c.id !== cityId));
  }, []);

  // Memoize sorted cities by weather score
  const sortedSelectedCities = useMemo(() => {
    return [...selectedCities].sort((a, b) => {
      const scoreA = a.weather?.temperature ?? 0;
      const scoreB = b.weather?.temperature ?? 0;
      return scoreB - scoreA;
    });
  }, [selectedCities]);

  const tabs = [
    { id: 'comparison' as TabType, label: 'Compare', icon: CloudSun },
    { id: 'historical' as TabType, label: 'History', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-1">Weather Comparison</h1>
          <p className="text-text-secondary text-sm">
            Compare weather conditions across multiple cities.
          </p>
        </div>

        {loading && <WeatherPageSkeleton />}

        {error && !loading && (
          <div className="bg-dark-card border border-dark-border rounded-lg p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="font-medium text-text-primary mb-2">Unable to Load</h3>
            <p className="text-text-muted text-sm mb-4">{error}</p>
            <button
              onClick={fetchCountries}
              className="inline-flex items-center gap-2 px-4 py-2 bg-dark-elevated border border-dark-border text-text-primary text-sm rounded-lg hover:bg-dark-border transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* City Selector */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-4 mb-5">
              <h2 className="text-sm font-medium text-text-primary mb-3">Select Cities</h2>
              <CitySelector
                countries={countries}
                selectedCities={selectedCities}
                onCitySelect={handleCitySelect}
                onCityRemove={handleCityRemove}
                maxCities={4}
              />
            </div>

            {selectedCities.length > 0 && (
              <>
                {/* Tabs */}
                <div className="flex gap-1 mb-5 bg-dark-elevated p-1 rounded-lg border border-dark-border">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-500 text-white'
                            : 'text-text-muted hover:text-text-primary hover:bg-dark-card'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Content */}
                {activeTab === 'comparison' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedSelectedCities.map((city, index) => (
                      <WeatherComparisonCard
                        key={city.id}
                        city={city}
                        onRemove={handleCityRemove}
                        index={index}
                        isTopScorer={index === 0}
                      />
                    ))}
                  </div>
                )}

                {activeTab === 'historical' && <HistoricalData cities={selectedCities} />}
              </>
            )}

            {/* Empty State */}
            {selectedCities.length === 0 && (
              <div className="text-center py-12">
                <CloudSun className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">No Cities Selected</h3>
                <p className="text-text-muted text-sm mb-6">
                  Search and select up to 4 cities to compare.
                </p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Compass className="w-4 h-4" />
                  Explore Destinations
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
