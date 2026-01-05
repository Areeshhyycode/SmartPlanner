import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  X,
} from 'lucide-react';
import type { ApiCity } from '../../api';

interface WeatherComparisonCardProps {
  city: ApiCity;
  onRemove: (cityId: string) => void;
  index: number;
  isTopScorer?: boolean;
}

function getWeatherIcon(description: string) {
  const desc = description.toLowerCase();
  const iconClass = "w-6 h-6";
  if (desc.includes('rain') || desc.includes('shower')) return <CloudRain className={`${iconClass} text-blue-400`} />;
  if (desc.includes('snow') || desc.includes('flurr')) return <CloudSnow className={`${iconClass} text-cyan-300`} />;
  if (desc.includes('cloud') || desc.includes('overcast')) return <Cloud className={`${iconClass} text-gray-400`} />;
  if (desc.includes('wind')) return <Wind className={`${iconClass} text-teal-400`} />;
  return <Sun className={`${iconClass} text-amber-400`} />;
}

function getTempColor(temp: number): string {
  if (temp <= 0) return 'text-cyan-400';
  if (temp <= 10) return 'text-blue-400';
  if (temp <= 20) return 'text-green-400';
  if (temp <= 30) return 'text-amber-400';
  return 'text-red-400';
}

export default function WeatherComparisonCard({ city, onRemove, isTopScorer = false }: WeatherComparisonCardProps) {
  const weather = city.weather;

  return (
    <div className={`bg-dark-card border rounded-lg overflow-hidden ${
      isTopScorer ? 'border-green-500/50' : 'border-dark-border'
    }`}>
      {isTopScorer && (
        <div className="bg-green-500/10 border-b border-green-500/20 py-1.5 px-4">
          <span className="text-xs font-medium text-green-400">Best Weather</span>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-text-muted" />
            <h3 className="font-medium text-text-primary">{city.name}</h3>
          </div>
          <button
            onClick={() => onRemove(city.id)}
            className="p-1 hover:bg-dark-elevated rounded transition-colors"
          >
            <X className="w-4 h-4 text-text-muted hover:text-red-400" />
          </button>
        </div>

        {weather ? (
          <>
            {/* Main Weather */}
            <div className="flex items-center gap-3 mb-4">
              {getWeatherIcon(weather.description)}
              <div>
                <p className={`text-2xl font-bold ${getTempColor(weather.temperature)}`}>
                  {Math.round(weather.temperature)}C
                </p>
                <p className="text-sm text-text-muted capitalize">{weather.description}</p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="bg-dark-elevated/50 rounded p-2">
                <div className="flex items-center gap-1 text-text-muted mb-1">
                  <Droplets className="w-3 h-3" />
                  <span className="text-xs">Humidity</span>
                </div>
                <p className="font-medium text-text-primary">{weather.humidity}%</p>
              </div>
              <div className="bg-dark-elevated/50 rounded p-2">
                <div className="flex items-center gap-1 text-text-muted mb-1">
                  <Wind className="w-3 h-3" />
                  <span className="text-xs">Wind</span>
                </div>
                <p className="font-medium text-text-primary">{Math.round(weather.windSpeed)} km/h</p>
              </div>
              <div className="bg-dark-elevated/50 rounded p-2">
                <div className="flex items-center gap-1 text-text-muted mb-1">
                  <Thermometer className="w-3 h-3" />
                  <span className="text-xs">Feels</span>
                </div>
                <p className={`font-medium ${getTempColor(weather.temperature - 2)}`}>
                  {Math.round(weather.temperature - 2)}C
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="py-6 text-center">
            <Cloud className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-50" />
            <p className="text-text-muted text-sm">No weather data</p>
          </div>
        )}
      </div>
    </div>
  );
}
