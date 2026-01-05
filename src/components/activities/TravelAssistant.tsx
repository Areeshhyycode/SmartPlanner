import { useState, useEffect } from 'react';
import {
  Thermometer,
  Wind,
  Droplets,
  AlertTriangle,
  Loader2,
  Sun,
  MapPin,
} from 'lucide-react';
import {
  fetchWeatherData,
  getWeatherCondition,
  getCurrentSeason,
  calculateTravelScore,
  type WeatherData,
} from '../../services/weatherService';
import {
  findLocationByCity,
  findActivityLocation,
} from '../../data/travelData';

interface ActivityWeather {
  name: string;
  neighborhood?: string;
  weather: WeatherData;
  travelScore: number;
}

interface TravelAssistantProps {
  cityName: string;
  countryName: string;
  latitude?: number;
  longitude?: number;
  selectedActivityNames: string[];
}

export function TravelAssistant({
  cityName,
  countryName,
  latitude,
  longitude,
  selectedActivityNames,
}: TravelAssistantProps) {
  const [cityWeather, setCityWeather] = useState<WeatherData | null>(null);
  const [activityWeathers, setActivityWeathers] = useState<ActivityWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'city' | number>('city');

  const season = getCurrentSeason();

  // Fetch weather data for city and all activities
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      let lat = latitude;
      let lon = longitude;

      // If no coordinates provided, try to find from our data
      if (!lat || !lon) {
        const locationData = findLocationByCity(cityName);
        if (locationData) {
          lat = locationData.lat;
          lon = locationData.lon;
        }
      }

      if (!lat || !lon) {
        setError('Location coordinates not available');
        setLoading(false);
        return;
      }

      // Fetch city weather
      const cityData = await fetchWeatherData(lat, lon);
      if (cityData) {
        setCityWeather(cityData);
      } else {
        setError('Failed to fetch weather data');
        setLoading(false);
        return;
      }

      // Fetch weather for each selected activity that has specific coordinates
      const activityWeatherResults: ActivityWeather[] = [];

      for (const activityName of selectedActivityNames) {
        const activityLocation = findActivityLocation(activityName);
        if (activityLocation) {
          const weather = await fetchWeatherData(activityLocation.lat, activityLocation.lon);
          if (weather) {
            activityWeatherResults.push({
              name: activityName,
              neighborhood: activityLocation.neighborhood,
              weather,
              travelScore: calculateTravelScore(weather.current),
            });
          }
        }
      }

      setActivityWeathers(activityWeatherResults);

      setLoading(false);
    };

    fetchData();
  }, [cityName, latitude, longitude, selectedActivityNames]);

  // Get current weather to display (city or activity)
  const currentWeather = activeTab === 'city'
    ? cityWeather
    : activityWeathers[activeTab]?.weather;

  const currentLocation = activeTab === 'city'
    ? { name: cityName, country: countryName }
    : {
        name: activityWeathers[activeTab]?.name || '',
        neighborhood: activityWeathers[activeTab]?.neighborhood
      };

  // Get weather condition info
  const weatherCondition = currentWeather
    ? getWeatherCondition(currentWeather.current.weatherCode)
    : null;

  // Calculate travel score
  const travelScore = currentWeather ? calculateTravelScore(currentWeather.current) : 0;

  if (loading) {
    return (
      <div className="bg-dark-elevated border border-dark-border rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-text-secondary text-sm">Loading travel assistant...</span>
        </div>
      </div>
    );
  }

  if (error || !cityWeather) {
    return (
      <div className="bg-dark-elevated border border-dark-border rounded-xl p-4">
        <div className="flex items-center gap-3 text-amber-400">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm">Weather data unavailable</span>
        </div>
      </div>
    );
  }

  const hasActivityWeathers = activityWeathers.length > 0;

  return (
    <div className="bg-gradient-to-br from-dark-elevated to-dark-card border border-dark-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-3 border-b border-dark-border">
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-400" />
          <h4 className="text-sm font-semibold text-text-primary">Travel Assistant</h4>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
          <MapPin className="w-3 h-3" />
          <span>
            {activeTab === 'city'
              ? `${cityName}, ${countryName}`
              : `${currentLocation.name}${currentLocation.neighborhood ? ` (${currentLocation.neighborhood})` : ''}`
            }
          </span>
          <span className="mx-1">•</span>
          <span className="capitalize">{season} Season</span>
        </div>
      </div>

      {/* Location Tabs - Show when activities have specific weather */}
      {hasActivityWeathers && (
        <div className="px-2 py-2 border-b border-dark-border bg-dark-elevated/50">
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setActiveTab('city')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'city'
                  ? 'bg-blue-500 text-white'
                  : 'bg-dark-border/50 text-text-muted hover:text-text-primary hover:bg-dark-border'
              }`}
            >
              {cityName}
            </button>
            {activityWeathers.map((aw, index) => (
              <button
                key={aw.name}
                onClick={() => setActiveTab(index)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-dark-border/50 text-text-muted hover:text-text-primary hover:bg-dark-border'
                }`}
              >
                <span>{aw.name}</span>
                <span className={`text-[10px] px-1 py-0.5 rounded ${
                  activeTab === index ? 'bg-white/20' : 'bg-dark-card'
                }`}>
                  {Math.round(aw.weather.current.temperature)}°
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Weather */}
      {currentWeather && (
        <div className="p-4 border-b border-dark-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{weatherCondition?.icon}</span>
              <div>
                <div className="text-2xl font-bold text-text-primary">
                  {Math.round(currentWeather.current.temperature)}°C
                </div>
                <div className="text-xs text-text-muted">{weatherCondition?.description}</div>
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              travelScore >= 70
                ? 'bg-green-500/20 text-green-400'
                : travelScore >= 50
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              Score: {travelScore}/100
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentWeather.current.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentWeather.current.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Thermometer className="w-3.5 h-3.5 text-orange-400" />
              <span>{currentWeather.daily[0]?.tempMax}° / {currentWeather.daily[0]?.tempMin}°</span>
            </div>
          </div>
        </div>
      )}

      {/* 5-Day Forecast Mini */}
      {currentWeather && (
        <div className="px-4 py-3 border-b border-dark-border">
          <div className="text-xs text-text-muted mb-2">5-Day Forecast</div>
          <div className="flex justify-between">
            {currentWeather.daily.slice(0, 5).map((day, i) => {
              const dayCondition = getWeatherCondition(day.weatherCode);
              const date = new Date(day.date);
              const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en', { weekday: 'short' });
              return (
                <div key={day.date} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-text-muted">{dayName}</span>
                  <span className="text-sm">{dayCondition.icon}</span>
                  <span className="text-[10px] text-text-secondary">{Math.round(day.tempMax)}°</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Weather Comparison (when multiple locations) */}
      {hasActivityWeathers && activityWeathers.length > 1 && (
        <div className="px-4 py-3 border-b border-dark-border bg-dark-elevated/30">
          <div className="text-xs text-text-muted mb-2">Weather Comparison</div>
          <div className="grid grid-cols-2 gap-2">
            {activityWeathers.map((aw) => {
              const condition = getWeatherCondition(aw.weather.current.weatherCode);
              return (
                <div
                  key={aw.name}
                  className="flex items-center gap-2 p-2 bg-dark-card/50 rounded-lg cursor-pointer hover:bg-dark-card transition-colors"
                  onClick={() => setActiveTab(activityWeathers.indexOf(aw))}
                >
                  <span className="text-lg">{condition.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-text-primary truncate">{aw.name}</div>
                    <div className="text-[10px] text-text-muted">
                      {Math.round(aw.weather.current.temperature)}°C
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    aw.travelScore >= 70 ? 'bg-green-400' : aw.travelScore >= 50 ? 'bg-amber-400' : 'bg-red-400'
                  }`} />
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

export default TravelAssistant;