import { Sun, Cloud, CloudRain, Snowflake, Wind } from 'lucide-react';

export type WeatherCondition = 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy' | 'Windy';

export const getWeatherCondition = (description?: string): WeatherCondition => {
  if (!description) return 'Sunny';
  const desc = description.toLowerCase();
  if (desc.includes('rain') || desc.includes('shower')) return 'Rainy';
  if (desc.includes('cloud') || desc.includes('overcast')) return 'Cloudy';
  if (desc.includes('snow') || desc.includes('ice')) return 'Snowy';
  if (desc.includes('wind') || desc.includes('gust')) return 'Windy';
  return 'Sunny';
};

interface WeatherIconProps {
  condition: WeatherCondition;
  className?: string;
}

export const WeatherIcon = ({ condition, className }: WeatherIconProps) => {
  const icons = {
    Sunny: Sun,
    Cloudy: Cloud,
    Rainy: CloudRain,
    Snowy: Snowflake,
    Windy: Wind,
  };
  const colors = {
    Sunny: '#fbbf24',
    Cloudy: '#94a3b8',
    Rainy: '#3b82f6',
    Snowy: '#22d3ee',
    Windy: '#a3e635',
  };
  const Icon = icons[condition];
  return <Icon className={className} style={{ color: colors[condition] }} />;
};

interface WeatherWidgetProps {
  temperature: number;
  description: string;
}

export const WeatherWidget = ({ temperature, description }: WeatherWidgetProps) => {
  const condition = getWeatherCondition(description);

  return (
    <div className="absolute top-4 right-4 px-4 py-2 bg-dark-bg/80 backdrop-blur-sm rounded-xl flex items-center gap-3">
      <WeatherIcon condition={condition} className="w-7 h-7" />
      <div>
        <div className="text-text-primary font-bold text-lg">
          {Math.round(temperature)}°C
        </div>
        <div className="text-text-muted text-xs">{description}</div>
      </div>
    </div>
  );
};

export default WeatherWidget;
