import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { formatImageUrl, FALLBACK_IMAGE, getFlagEmoji } from '../../utils/imageHelpers';
import { WeatherWidget } from './WeatherWidget';
import type { ApiCity, ApiCountry } from '../../api';

interface CityHeroProps {
  city: ApiCity;
  country: ApiCountry;
  countryId: string;
}

export const CityHero = ({ city, country, countryId }: CityHeroProps) => {
  const flag = getFlagEmoji(country.code || 'UN');

  return (
    <div className="relative h-64 md:h-80">
      <img
        src={formatImageUrl(city.imageUrl, 1200)}
        alt={city.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = FALLBACK_IMAGE;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent"></div>

      {/* Back Button */}
      <Link
        to={`/country/${countryId}`}
        className="absolute top-4 left-4 p-2 bg-dark-bg/80 backdrop-blur-sm rounded-xl border border-dark-border hover:border-blue-500/50 transition-all flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5 text-text-primary" />
        <span className="text-text-primary text-sm">Back to Cities</span>
      </Link>

      {/* Weather Widget */}
      {city.weather && (
        <WeatherWidget
          temperature={city.weather.temperature}
          description={city.weather.description}
        />
      )}

      {/* City Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-text-secondary mb-2">
            <span className="text-2xl">{flag}</span>
            <span>{country.name}</span>
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">{city.name}</h1>
          <p className="text-text-secondary max-w-2xl">
            {city.description || 'Discover this amazing city'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CityHero;
