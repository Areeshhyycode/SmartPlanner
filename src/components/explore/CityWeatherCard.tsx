import { MapPin } from 'lucide-react';
import type { ApiCity } from '../../api';

interface CityWeatherCardProps {
  city: ApiCity;
}

function CityWeatherCard({ city }: CityWeatherCardProps) {
  const weather = city.weather;

  return (
    <div className="flex items-center justify-between py-1.5 sm:py-2 px-2.5 sm:px-3 bg-dark-bg/50 rounded-lg">
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-text-muted flex-shrink-0" />
        <span className="text-xs sm:text-sm text-text-secondary truncate">{city.name}</span>
      </div>
      {weather && (
        <span className="text-xs sm:text-sm text-text-muted flex-shrink-0 ml-2">
          {weather.temperature}°C
        </span>
      )}
    </div>
  );
}

export default CityWeatherCard;
