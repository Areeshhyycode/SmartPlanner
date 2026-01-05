import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { type ApiCity } from '../../api';
import { WeatherIcon, getWeatherCondition } from '../activities/WeatherWidget';
import { formatImageUrl, FALLBACK_IMAGE } from '../../utils/imageHelpers';

interface CityCardProps {
  city: ApiCity;
  countryId: string;
}

function CityCard({ city, countryId }: CityCardProps) {
  const weatherCondition = getWeatherCondition(city.weather?.description);
  const activitiesCount = city.activities?.length || 0;

  return (
    <Link
      to={`/country/${countryId}/city/${city.id}`}
      className="group block bg-dark-card border border-dark-border hover:border-blue-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={formatImageUrl(city.imageUrl)}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = FALLBACK_IMAGE;
          }}
        />

        {/* Weather Widget */}
        {city.weather && (
          <div className="absolute top-3 right-3 px-4 py-2.5 bg-dark-bg/90 backdrop-blur-sm rounded-xl flex items-center gap-3">
            <WeatherIcon condition={weatherCondition} className="w-7 h-7" />
            <div className="text-right">
              <div className="text-text-primary font-bold text-lg">
                {Math.round(city.weather.temperature)}°C
              </div>
              <div className="text-text-muted text-xs">{city.weather.description}</div>
            </div>
          </div>
        )}

        {/* Activities Count Badge */}
        {activitiesCount > 0 && (
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs font-medium text-blue-400">
            {activitiesCount} {activitiesCount === 1 ? 'activity' : 'activities'}
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-semibold text-text-primary group-hover:text-blue-400 transition-colors mb-2">
          {city.name}
        </h3>

        {/* Description */}
        <p className="text-text-muted text-sm line-clamp-2 mb-4">
          {city.description || 'Discover this amazing city'}
        </p>

        {/* Activities Preview */}
        <div className="flex items-center gap-2 pt-4 border-t border-dark-border">
          <div className="flex -space-x-2">
            {city.activities?.slice(0, 3).map((activity) => (
              <div
                key={activity.id}
                className="w-8 h-8 rounded-full border-2 border-dark-card overflow-hidden bg-dark-elevated"
              >
                {activity.imageUrl ? (
                  <img
                    src={formatImageUrl(activity.imageUrl, 100)}
                    alt={activity.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center text-xs text-text-muted ${activity.imageUrl ? 'hidden' : ''}`}>
                  {activity.name.charAt(0)}
                </div>
              </div>
            ))}
            {activitiesCount > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-dark-card bg-dark-elevated flex items-center justify-center text-xs text-text-muted">
                +{activitiesCount - 3}
              </div>
            )}
          </div>
          <span className="text-text-secondary text-sm ml-2">
            {activitiesCount > 0 ? 'View activities' : 'No activities yet'}
          </span>
          <ChevronRight className="w-4 h-4 text-text-muted ml-auto group-hover:text-blue-400 transition-colors" />
        </div>
      </div>
    </Link>
  );
}

export default CityCard;
