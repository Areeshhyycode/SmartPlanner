import { useState, useEffect } from 'react';
import {
  CheckCircle,
  Thermometer,
  Wind,
  Droplets,
  AlertTriangle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  weatherAlertsAPI,
  type WeatherAlertsResponse,
} from '../../api';

interface WeatherWarningCardProps {
  cityId?: string;
  cityName?: string;
  latitude?: number;
  longitude?: number;
}

export function WeatherWarningCard({
  cityId,
  cityName,
  latitude,
  longitude,
}: WeatherWarningCardProps) {
  const [alertsData, setAlertsData] = useState<WeatherAlertsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);

      try {
        let data: WeatherAlertsResponse;

        if (cityId) {
          data = await weatherAlertsAPI.getByCityId(cityId, cityName);
        } else if (latitude && longitude && cityName) {
          data = await weatherAlertsAPI.getByCoordinates(latitude, longitude, cityName);
        } else {
          throw new Error('City information required');
        }

        setAlertsData(data);
      } catch (err: any) {
        setError('Weather data unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [cityId, cityName, latitude, longitude]);

  if (loading) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-text-muted animate-spin" />
          <span className="text-text-muted text-sm">Loading weather...</span>
        </div>
      </div>
    );
  }

  if (error || !alertsData) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-lg p-4">
        <div className="flex items-center gap-2 text-text-muted">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error || 'Weather data unavailable'}</span>
        </div>
      </div>
    );
  }

  const status = alertsData.status || {
    level: 'safe',
    message: 'Weather conditions are favorable',
  };

  const conditions = alertsData.currentConditions || {
    temperature: 20,
    windSpeed: 10,
    humidity: 50,
  };

  const hasAlerts = alertsData.alerts && alertsData.alerts.length > 0;
  const isSafe = status.level === 'safe' || !hasAlerts;

  return (
    <div className={`rounded-lg p-4 border ${
      isSafe
        ? 'bg-dark-card border-dark-border'
        : 'bg-amber-950/30 border-amber-700/30'
    }`}>
      {/* Status Header */}
      <div className="flex items-center gap-2 mb-3">
        {isSafe ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        )}
        <span className={`text-sm font-medium ${isSafe ? 'text-green-500' : 'text-amber-500'}`}>
          {isSafe ? 'Good conditions' : 'Weather advisory'}
        </span>
      </div>

      {/* Current Conditions */}
      <div className="flex items-center gap-4 text-sm text-text-secondary">
        <div className="flex items-center gap-1.5">
          <Thermometer className="w-3.5 h-3.5 text-text-muted" />
          <span>{Math.round(conditions.temperature)}C</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-text-muted" />
          <span>{conditions.windSpeed} km/h</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-text-muted" />
          <span>{conditions.humidity}%</span>
        </div>
      </div>

      {/* Alert Message */}
      {hasAlerts && alertsData.alerts[0] && (
        <p className="mt-3 text-sm text-amber-400/90">
          {alertsData.alerts[0].message}
        </p>
      )}
    </div>
  );
}

export default WeatherWarningCard;
