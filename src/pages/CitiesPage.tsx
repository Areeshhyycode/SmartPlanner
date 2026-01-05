import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, AlertCircle, RefreshCw } from 'lucide-react';
import { countryAPI, type ApiCountry } from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { CityCard, CountryHeader } from '../components/cities';

function CitiesPage() {
  const { countryId } = useParams<{ countryId: string }>();
  const [country, setCountry] = useState<ApiCountry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCountry = async () => {
    if (!countryId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await countryAPI.getByIdFull(countryId);
      setCountry(data);
    } catch (err) {
      console.error('Failed to fetch country:', err);
      setError('Failed to load country data. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountry();
  }, [countryId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="text-text-secondary mt-4">Loading cities...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text-primary mb-2">Unable to Load Country</h3>
          <p className="text-text-secondary mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/explore"
              className="px-4 py-2 bg-dark-elevated border border-dark-border text-text-primary rounded-xl hover:border-blue-500/50 transition-colors"
            >
              Back to Explore
            </Link>
            <button
              onClick={fetchCountry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Country not found</h2>
          <Link to="/explore" className="text-blue-400 hover:underline">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-30"></div>
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Countries</span>
        </Link>

        {/* Country Header */}
        <CountryHeader country={country} />

        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Cities in {country.name}</h2>
            <p className="text-text-muted text-sm">Select a city to view activities and plan your trip</p>
          </div>
        </div>

        {/* Cities Grid */}
        {country.cities && country.cities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {country.cities.map((city) => (
              <CityCard key={city.id} city={city} countryId={country.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-dark-card border border-dark-border rounded-2xl">
            <Building2 className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">No cities available</h3>
            <p className="text-text-secondary">
              No cities have been added to this country yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CitiesPage;
