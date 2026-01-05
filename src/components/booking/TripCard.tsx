import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Cloud, Sun, CloudRain, Snowflake, Wind } from 'lucide-react';
import type { ProviderTrip } from '../../types/booking';
import { getCategoryInfo } from '../../data/providerTrips';

interface TripCardProps {
  trip: ProviderTrip;
}

// Mock weather data based on location
const getWeatherForLocation = (city: string) => {
  const weatherTypes = [
    { temp: 28, condition: 'Sunny', icon: Sun, color: '#fbbf24' },
    { temp: 22, condition: 'Cloudy', icon: Cloud, color: '#94a3b8' },
    { temp: 18, condition: 'Rainy', icon: CloudRain, color: '#3b82f6' },
    { temp: -2, condition: 'Snowy', icon: Snowflake, color: '#22d3ee' },
    { temp: 25, condition: 'Windy', icon: Wind, color: '#a3e635' },
  ];

  // Generate consistent weather based on city name hash
  const hash = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return weatherTypes[hash % weatherTypes.length];
};

function TripCard({ trip }: TripCardProps) {
  const categoryInfo = getCategoryInfo(trip.category);
  const [weather, setWeather] = useState<ReturnType<typeof getWeatherForLocation> | null>(null);

  useEffect(() => {
    // Simulate weather API call
    const timer = setTimeout(() => {
      setWeather(getWeatherForLocation(trip.location.city));
    }, 300);
    return () => clearTimeout(timer);
  }, [trip.location.city]);

  const WeatherIcon = weather?.icon || Cloud;

  return (
    <Link
      to={`/trip/${trip.id}`}
      className="group block bg-dark-card border border-dark-border hover:border-blue-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Category Badge */}
        <div
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5"
          style={{
            backgroundColor: `${categoryInfo?.color}20`,
            color: categoryInfo?.color,
            borderColor: `${categoryInfo?.color}50`,
            borderWidth: 1,
          }}
        >
          <span>{categoryInfo?.icon}</span>
          <span>{categoryInfo?.label}</span>
        </div>

        {/* Weather Widget */}
        {weather && (
          <div className="absolute top-3 right-3 px-3 py-2 bg-dark-bg/90 backdrop-blur-sm rounded-xl flex items-center gap-2">
            <WeatherIcon className="w-5 h-5" style={{ color: weather.color }} />
            <div className="text-right">
              <div className="text-text-primary font-bold text-sm">{weather.temp}°C</div>
              <div className="text-text-muted text-xs">{weather.condition}</div>
            </div>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-dark-bg/90 backdrop-blur-sm rounded-lg">
          <span className="text-lg font-bold text-text-primary">${trip.price}</span>
          <span className="text-text-muted text-sm">/day</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-text-primary group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">
          {trip.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-3">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span>
            {trip.location.city}, {trip.location.country}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-text-muted text-sm line-clamp-2 mb-4">
          {trip.shortDescription}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-dark-border">
          {/* Duration */}
          <div className="flex items-center gap-1.5 text-text-secondary text-sm">
            <Clock className="w-4 h-4" />
            <span>{trip.duration} days</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-text-primary font-medium">{trip.rating}</span>
            <span className="text-text-muted text-sm">({trip.reviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default TripCard;
