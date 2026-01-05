// Weather Service using Open-Meteo API (Free, No API Key Required)

// Cache for weather data - stores data for 10 minutes
interface CacheEntry {
  data: WeatherData;
  timestamp: number;
}

const weatherCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_SIZE = 50; // Limit cache size

function getCacheKey(lat: number, lon: number): string {
  return `${lat.toFixed(2)}_${lon.toFixed(2)}`;
}

// Clean up old cache entries
function cleanupCache(): void {
  const now = Date.now();
  const entries = Array.from(weatherCache.entries());

  // Remove expired entries
  for (const [key, entry] of entries) {
    if (now - entry.timestamp >= CACHE_DURATION) {
      weatherCache.delete(key);
    }
  }

  // If still too large, remove oldest entries
  if (weatherCache.size > MAX_CACHE_SIZE) {
    const sorted = Array.from(weatherCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    const toRemove = sorted.slice(0, weatherCache.size - MAX_CACHE_SIZE);
    toRemove.forEach(([key]) => weatherCache.delete(key));
  }
}

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  uvIndex: number;
  weatherCode: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  timezone: string;
}

export interface WeatherCondition {
  description: string;
  icon: string;
  isSafe: boolean;
}

export const weatherCodes: Record<number, WeatherCondition> = {
  0: { description: "Clear sky", icon: "☀️", isSafe: true },
  1: { description: "Mainly clear", icon: "🌤️", isSafe: true },
  2: { description: "Partly cloudy", icon: "⛅", isSafe: true },
  3: { description: "Overcast", icon: "☁️", isSafe: true },
  45: { description: "Foggy", icon: "🌫️", isSafe: false },
  48: { description: "Depositing rime fog", icon: "🌫️", isSafe: false },
  51: { description: "Light drizzle", icon: "🌦️", isSafe: true },
  53: { description: "Moderate drizzle", icon: "🌦️", isSafe: true },
  55: { description: "Dense drizzle", icon: "🌧️", isSafe: false },
  61: { description: "Light rain", icon: "🌧️", isSafe: false },
  63: { description: "Moderate rain", icon: "🌧️", isSafe: false },
  65: { description: "Heavy rain", icon: "⛈️", isSafe: false },
  71: { description: "Light snow", icon: "🌨️", isSafe: false },
  73: { description: "Moderate snow", icon: "🌨️", isSafe: false },
  75: { description: "Heavy snow", icon: "❄️", isSafe: false },
  80: { description: "Light showers", icon: "🌦️", isSafe: true },
  81: { description: "Moderate showers", icon: "🌧️", isSafe: false },
  82: { description: "Violent showers", icon: "⛈️", isSafe: false },
  95: { description: "Thunderstorm", icon: "⛈️", isSafe: false },
  96: { description: "Thunderstorm with hail", icon: "⛈️", isSafe: false },
  99: { description: "Thunderstorm with heavy hail", icon: "⛈️", isSafe: false },
};

export function getWeatherCondition(code: number): WeatherCondition {
  return weatherCodes[code] || { description: "Unknown", icon: "❓", isSafe: true };
}

export type Season = "winter" | "summer" | "monsoon";

export function getSeason(month: number): Season {
  if (month >= 3 && month <= 5) return "summer";
  if (month >= 6 && month <= 9) return "monsoon";
  return "winter";
}

export function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1;
  return getSeason(month);
}

export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  timezone: string = "auto"
): Promise<WeatherData | null> {
  const cacheKey = getCacheKey(latitude, longitude);

  // Check cache first
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Cleanup cache periodically
  cleanupCache();

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,weather_code&timezone=${timezone}&forecast_days=5`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    const data = await response.json();

    const weatherData: WeatherData = {
      current: {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
      },
      daily: data.daily.time.map((date: string, i: number) => ({
        date,
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
        precipitationProbability: data.daily.precipitation_probability_max[i],
        uvIndex: data.daily.uv_index_max[i],
        weatherCode: data.daily.weather_code[i],
      })),
      timezone: data.timezone,
    };

    // Store in cache
    weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now() });

    return weatherData;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return null;
  }
}

// Batch fetch multiple weather data
export async function fetchWeatherDataBatch(
  locations: Array<{ lat: number; lon: number; timezone?: string }>
): Promise<Array<WeatherData | null>> {
  return Promise.all(
    locations.map(({ lat, lon, timezone }) =>
      fetchWeatherData(lat, lon, timezone)
    )
  );
}

export function calculateTravelScore(weather: CurrentWeather): number {
  let score = 50;

  if (weather.temperature >= 18 && weather.temperature <= 28) {
    score += 25;
  } else if (weather.temperature >= 12 && weather.temperature <= 32) {
    score += 15;
  } else {
    score -= 10;
  }

  if (weather.humidity >= 30 && weather.humidity <= 60) {
    score += 15;
  } else if (weather.humidity > 80) {
    score -= 15;
  }

  if (weather.windSpeed < 20) {
    score += 10;
  } else if (weather.windSpeed > 35) {
    score -= 10;
  }

  const condition = getWeatherCondition(weather.weatherCode);
  if (condition.isSafe) {
    score += 15;
  } else {
    score -= 20;
  }

  return Math.max(0, Math.min(100, score));
}