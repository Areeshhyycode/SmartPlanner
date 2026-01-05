import { useMemo } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Calendar } from 'lucide-react';
import type { ApiCity } from '../../api';

interface ForecastDay {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  humidity: number;
  score: number;
}

interface ForecastChartProps {
  cities: ApiCity[];
}

function getWeatherIcon(condition: string, size = 'w-5 h-5') {
  const c = condition.toLowerCase();
  if (c.includes('rain')) return <CloudRain className={`${size} text-blue-400`} />;
  if (c.includes('snow')) return <CloudSnow className={`${size} text-cyan-300`} />;
  if (c.includes('cloud')) return <Cloud className={`${size} text-slate-400`} />;
  if (c.includes('wind')) return <Wind className={`${size} text-teal-400`} />;
  return <Sun className={`${size} text-amber-400`} />;
}

function generateForecast(city: ApiCity): ForecastDay[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Sunny', 'Clear', 'Windy'];
  const baseTemp = city.weather?.temperature || 20;
  const today = new Date();

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const variation = Math.sin(i * 0.8) * 5;
    const high = Math.round(baseTemp + variation + Math.random() * 3);
    const low = Math.round(high - 8 - Math.random() * 4);
    const condition = conditions[(i + city.name.length) % conditions.length];
    const humidity = Math.round(40 + Math.random() * 40);
    const score = Math.round(60 + Math.random() * 35);

    return {
      day: days[date.getDay()],
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      high,
      low,
      condition,
      humidity,
      score,
    };
  });
}

export default function ForecastChart({ cities }: ForecastChartProps) {
  const forecasts = useMemo(() => {
    return cities.map(city => ({
      city,
      forecast: generateForecast(city),
    }));
  }, [cities]);

  if (cities.length === 0) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 text-center">
        <Calendar className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
        <p className="text-text-muted">Select cities to view 7-day forecast</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">7-Day Forecast</h3>
            <p className="text-sm text-text-muted">Compare weather conditions across cities</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-dark-elevated/50">
              <th className="text-left p-3 sm:p-4 text-sm font-semibold text-text-secondary sticky left-0 bg-dark-elevated/50 z-10">City</th>
              {forecasts[0]?.forecast.map((day, i) => (
                <th key={i} className="p-3 sm:p-4 text-center">
                  <p className="text-sm font-semibold text-text-primary">{day.day}</p>
                  <p className="text-xs text-text-muted">{day.date}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {forecasts.map(({ city, forecast }, cityIndex) => (
              <tr key={city.id} className="border-t border-dark-border/50 hover:bg-dark-elevated/30 transition-colors">
                <td className="p-3 sm:p-4 sticky left-0 bg-dark-card z-10">
                  <p className="font-medium text-text-primary">{city.name}</p>
                </td>
                {forecast.map((day, dayIndex) => (
                  <td key={dayIndex} className="p-3 sm:p-4 text-center" style={{ animationDelay: `${(cityIndex * 7 + dayIndex) * 30}ms`, animation: 'fadeIn 0.3s ease-out forwards', opacity: 0 }}>
                    <div className="flex flex-col items-center gap-1">
                      {getWeatherIcon(day.condition)}
                      <div className="flex items-center gap-1 text-sm">
                        <span className="font-bold text-text-primary">{day.high}°</span>
                        <span className="text-text-muted">/</span>
                        <span className="text-text-muted">{day.low}°</span>
                      </div>
                      <div className={`text-xs px-1.5 py-0.5 rounded ${day.score >= 75 ? 'bg-emerald-500/20 text-emerald-400' : day.score >= 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                        {day.score}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-dark-border/50 bg-dark-elevated/30">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500"></div>
            <span className="text-text-muted">Excellent (75+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500"></div>
            <span className="text-text-muted">Good (50-74)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500/30 border border-red-500"></div>
            <span className="text-text-muted">Fair (&lt;50)</span>
          </div>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}