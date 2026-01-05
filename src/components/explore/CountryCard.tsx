import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import type { ApiCountry } from '../../api';
import { getFlagEmoji, formatImageUrl, FALLBACK_IMAGE } from '../../utils/imageHelpers';
import CityWeatherCard from './CityWeatherCard';
import ImageWithSkeleton from '../common/ImageWithSkeleton';

interface CountryCardProps {
  country: ApiCountry;
  index: number;
}

function CountryCard({ country, index }: CountryCardProps) {
  const flag = getFlagEmoji(country.code || 'UN');
  const citiesCount = country.cities?.length || 0;
  const citiesToShow = country.cities?.slice(0, 3) || [];

  return (
    <Link
      to={`/country/${country.id}`}
      className="group block bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-dark-border/80 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image */}
      <div className="relative h-36 sm:h-40 md:h-44 overflow-hidden bg-dark-elevated">
        <ImageWithSkeleton
          src={formatImageUrl(country.imageUrl)}
          alt={country.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = FALLBACK_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Flag */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 text-xl sm:text-2xl">
          {flag}
        </div>

        {/* Country Name */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3">
          <h3 className="text-lg sm:text-xl font-semibold text-white truncate">
            {country.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Description */}
        <p className="text-text-muted text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4">
          {country.description || 'Discover the beauty and culture of this destination'}
        </p>

        {/* Cities */}
        {citiesToShow.length > 0 && (
          <div className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4">
            {citiesToShow.map((city) => (
              <CityWeatherCard key={city.id} city={city} />
            ))}
            {citiesCount > 3 && (
              <p className="text-[10px] sm:text-xs text-text-muted pl-2.5 sm:pl-3">
                +{citiesCount - 3} more cities
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-dark-border">
          <div className="flex items-center gap-1 sm:gap-1.5 text-text-muted text-xs sm:text-sm">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{citiesCount} {citiesCount === 1 ? 'city' : 'cities'}</span>
          </div>
          <span className="flex items-center gap-1 text-xs sm:text-sm text-blue-400 group-hover:gap-1.5 sm:group-hover:gap-2 transition-all">
            View details
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CountryCard;
