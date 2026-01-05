import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// ==================== CONFIGURATION ====================
/**
 * API Base URL Configuration
 *
 * In DEVELOPMENT: Uses '/api/v1' which gets proxied by Vite to http://localhost:8080
 * This avoids CORS issues during development.
 *
 * The Vite proxy is configured in vite.config.ts:
 * - '/api' requests are forwarded to 'http://localhost:8080'
 *
 * IMPORTANT: Make sure your Spring Boot backend is running on port 8080
 * Command to start backend: mvn spring-boot:run (or ./mvnw spring-boot:run)
 */
const API_BASE_URL = '/api/v1';

/**
 * Request timeout in milliseconds
 * Increased to 30 seconds to handle slow backend responses
 * Common causes of timeout:
 * - Backend not running
 * - Database connection issues
 * - Network problems
 */
const REQUEST_TIMEOUT = 30000; // 30 seconds

// ==================== TYPES ====================

// Auth Types - User authentication and authorization
export interface User {
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  // Profile fields
  avatarUrl?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  language?: string;
  bio?: string;
  address?: string;
}

// Backend response DTO - matches what backend returns
export interface UserProfileResponse {
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  profilePhotoUrl?: string;  // Backend field name
  phoneNumber?: string;
  dateOfBirth?: string;
  language?: string;
  bio?: string;
  address?: string;
}

// Frontend UserProfile - uses avatarUrl for consistency
export interface UserProfile {
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string;  // Frontend field name (mapped from profilePhotoUrl)
  phoneNumber?: string;
  dateOfBirth?: string;
  language?: string;
  bio?: string;
  address?: string;
}

// Backend base URL for static files (images, etc.)
// This is needed because profilePhotoUrl from backend might be a relative path
const BACKEND_URL = 'http://localhost:8080';

// Helper to convert relative image URL to full URL
const getFullImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  // If already a full URL (http:// or https://), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If relative path, prepend backend URL
  return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Helper to map backend response to frontend format
const mapProfileResponse = (response: UserProfileResponse): UserProfile => ({
  username: response.username,
  email: response.email,
  role: response.role,
  avatarUrl: getFullImageUrl(response.profilePhotoUrl),  // Map profilePhotoUrl -> avatarUrl with full URL
  phoneNumber: response.phoneNumber,
  dateOfBirth: response.dateOfBirth,
  language: response.language,
  bio: response.bio,
  address: response.address,
});

// Request DTO for updating profile via PUT /api/v1/profile
// Must match backend's UserProfileRequest DTO
// Note: Backend requires username and email even though they can't be changed
export interface UpdateProfileRequest {
  username: string;              // Required
  email: string;                 // Required (but cannot be changed)
  phoneNumber?: string;          // Optional - format: +1234567890
  dateOfBirth?: string;          // Optional - format: "YYYY-MM-DD", must be in past
  language?: string;             // Optional - 2-5 chars (e.g., "en", "ur")
  bio?: string;                  // Optional - max 500 chars
  address?: string;              // Optional - max 200 chars
}

// Note: Avatar upload now returns UserProfile directly from backend

export interface AuthResponse {
  token: string;        // JWT token for authentication
  message?: string;     // Optional success/error message
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Country Types - Data from backend API
export interface ApiWeather {
  temperature: number;   // Temperature in Celsius
  humidity: number;      // Humidity percentage (0-100)
  windSpeed: number;     // Wind speed in km/h
  description: string;   // Weather description (e.g., "Sunny", "Cloudy")
}

export interface ApiActivity {
  id: string;
  name: string;
  description?: string;
  pricePerHour: number;  // Cost per hour for this activity
  pricePerDay: number;   // Cost per day for this activity
  imageUrl?: string;     // Unsplash image URL
  latitude?: number;     // Activity location latitude
  longitude?: number;    // Activity location longitude
}

export interface ApiCity {
  id: string;
  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;      // Unsplash image URL
  weather?: ApiWeather;   // Current weather data
  activities?: ApiActivity[]; // Available activities in this city
}

export interface ApiCountry {
  id: string;
  name: string;
  code: string;          // ISO country code (e.g., "US", "PK")
  description?: string;
  imageUrl?: string;     // Unsplash image URL
  cities?: ApiCity[];    // Cities in this country
}

// ==================== COUNTDOWN TYPES ====================
/**
 * Countdown response from /api/v1/countdown/my-trips
 * Used to show trip reminders and status alerts
 */
export interface TripCountdown {
  tripId: string;
  cityName: string;
  country: string;
  startDate: string;
  endDate: string;
  status: 'PLANNED' | 'CONFIRMED' | 'IN_PROGRESS' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  message: string;
  isTripStarted: boolean;           // True if current date >= startDate
  isTripEnded: boolean;             // True if current date > endDate
  requiresCompletionConfirmation: boolean; // True if trip ended but not completed
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

// ==================== NOTIFICATION TYPES ====================
/**
 * Notification from /api/v1/notifications
 * Used to show trip reminders and alerts
 */
export interface Notification {
  id: string;
  userId: string;
  tripId?: string;
  type: 'TRIP_REMINDER' | 'TRIP_START' | 'TRIP_END' | 'GENERAL';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Trip Types - For creating and managing trips
export interface SelectedActivity {
  activityId: string;
  durationType: 'HOURS' | 'DAYS';  // Whether pricing is per hour or per day
  durationValue: number;            // Number of hours or days
  quantity: number;                 // Number of units/people
  unitPrice?: number;               // Price per hour or per day
  totalPrice?: number;              // Calculated total price
  activityName?: string;            // Activity name for display
}

export interface CreateTripRequest {
  cityId: string;
  startDate: string;     // ISO date format: "2025-01-15"
  durationDays: number;  // Number of days for the trip
  selectedActivities: SelectedActivity[];
}

export interface TripPreviewResponse {
  cityName: string;
  countryName: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  activities: {
    name: string;
    durationType: string;
    durationValue: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  taxes: number;
  serviceFee: number;
  totalPrice: number;
}

/**
 * ApiTrip Interface - Matches the backend Trip model
 *
 * IMPORTANT: Field names must match exactly what the Spring Boot backend sends:
 * - Backend sends "country" (not "countryName")
 * - Backend sends "totalCost" (not "totalPrice")
 * - Backend sends "selectedActivities" with "subtotal" field
 */
export interface ApiTrip {
  id: string;
  userId: string;
  userEmail: string;
  cityId: string;
  cityName: string;
  country: string;           // Backend sends "country" NOT "countryName"
  startDate: string;
  endDate: string;
  durationDays: number;
  totalCost: number;         // Backend sends "totalCost" NOT "totalPrice"
  currency: string;
  status: 'PLANNED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  selectedActivities: {      // Backend sends "selectedActivities" NOT "activities"
    activityId: string;
    activityName: string;
    durationType: string;
    durationValue: number;
    unitPrice: number;
    quantity: number;
    subtotal: number;        // Backend sends "subtotal" NOT "totalPrice"
  }[];
  weatherSnapshot?: ApiWeather;
}

// Search Types
export interface SearchResult {
  countries: ApiCountry[];
  cities: ApiCity[];
}

// Packing Suggestions Types (NEW Backend Structure)
export interface PackingItem {
  name: string;
  reason: string;
  priority: string;          // "essential", "recommended", "optional"
  icon: string;
}

export interface PackingCategory {
  category: string;
  icon: string;
  items: PackingItem[];
}

export interface WeatherSummary {
  avgTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  avgHumidity: number;
  maxWindSpeed: number;
  dominantWeather: string;
  period: string;
}

export interface PackingSuggestionsResponse {
  cityName: string;
  country: string;
  weatherSummary: WeatherSummary;
  categories: PackingCategory[];
  generalTips: string[];
}

// Weather Alerts Types (NEW Backend Structure)
export interface WeatherAlert {
  type: string;              // "temperature", "wind", etc.
  severity: string;          // "low", "medium", "high", "extreme"
  title: string;
  message: string;
  icon: string;
}

export interface CurrentConditions {
  temperature: number;
  windSpeed: number;
  humidity: number;
  weatherDescription: string;
  time: string;
}

export interface WeatherStatus {
  level: string;             // "safe", "caution", "warning", "danger"
  message: string;
  color: string;
}

export interface WeatherAlertsResponse {
  cityName: string;
  country: string;
  currentConditions: CurrentConditions;
  alerts: WeatherAlert[];
  status: WeatherStatus;
}

// ==================== AXIOS INSTANCE ====================
/**
 * Create Axios instance with custom configuration
 *
 * baseURL: API base path (proxied in development)
 * timeout: Maximum time to wait for response (30 seconds)
 * headers: Default headers for all requests
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: REQUEST_TIMEOUT,
});

// ==================== INTERCEPTORS ====================

/**
 * Request Interceptor
 *
 * Runs before every request is sent:
 * 1. Adds JWT token to Authorization header if user is logged in
 * 2. Logs request details for debugging (in development)
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get JWT token from localStorage
    const token = localStorage.getItem('token');

    // Add Authorization header if token exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug logging in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    // Log request errors
    console.error('[API Request Error]', error.message);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 *
 * Runs after every response is received:
 * 1. Returns successful responses directly
 * 2. Handles 401 (Unauthorized) - clears auth and redirects to login
 * 3. Handles timeout and network errors with clear messages
 * 4. Logs errors for debugging
 * 5. Returns mock data for weather endpoints when backend is unavailable
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Debug logging in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle different error types
    if (error.code === 'ECONNABORTED') {
      // Timeout error
      console.error('[API Timeout] Request took too long. Check if backend is running on http://localhost:8080');
    } else if (error.code === 'ERR_NETWORK') {
      // Network error - backend not reachable
      console.error('[API Network Error] Cannot connect to backend. Make sure Spring Boot is running on port 8080');
    } else if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      console.warn('[API 401] Unauthorized - clearing auth data');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 404) {
      // Not found - check if it's a weather or profile endpoint and return mock data
      const url = error.config?.url || '';

      // Mock profile endpoint (GET and PUT)
      if (url === '/profile') {
        console.warn(`[API 404] Using mock data for profile: ${url}`);
        return Promise.resolve({
          data: generateMockProfile(),
          status: 200,
          statusText: 'OK (Mock)',
          headers: {},
          config: error.config!,
        } as AxiosResponse);
      }

      // Mock packing suggestions endpoint (both city ID and coordinates)
      if (url.includes('/weather/packing-list/') || url.includes('/weather/packing/')) {
        console.warn(`[API 404] Using mock data for packing suggestions: ${url}`);
        const cityName = error.config?.params?.cityName || error.config?.params?.name || 'Unknown City';
        return Promise.resolve({
          data: generateMockPackingSuggestions(cityName),
          status: 200,
          statusText: 'OK (Mock)',
          headers: {},
          config: error.config!,
        } as AxiosResponse);
      }

      // Mock weather alerts endpoint (both city ID and coordinates)
      if (url.includes('/weather/alerts/') || url.includes('/weather/warning/')) {
        console.warn(`[API 404] Using mock data for weather alerts: ${url}`);
        const cityName = error.config?.params?.cityName || error.config?.params?.name || 'Unknown City';
        return Promise.resolve({
          data: generateMockWeatherAlerts(cityName),
          status: 200,
          statusText: 'OK (Mock)',
          headers: {},
          config: error.config!,
        } as AxiosResponse);
      }

      console.error(`[API 404] Endpoint not found: ${url}`);
    } else if (error.response?.status === 500) {
      // Server error
      console.error('[API 500] Server error - check backend logs');
    }

    return Promise.reject(error);
  }
);

// ==================== MOCK DATA GENERATORS ====================
/**
 * Generate mock user profile for development
 * Used when backend endpoint is not available
 */
const generateMockProfile = (): UserProfileResponse => {
  const currentUser = localStorage.getItem('user');
  const userData = currentUser ? JSON.parse(currentUser) : null;

  return {
    username: userData?.username || 'User',
    email: userData?.email || 'user@example.com',
    role: userData?.role || 'USER',
    phoneNumber: '',
    dateOfBirth: '',
    language: 'en',
    bio: '',
    address: '',
  };
};

/**
 * Generate mock packing suggestions for development
 * Used when backend endpoint is not available
 */
const generateMockPackingSuggestions = (cityName: string = 'Buenos Aires'): PackingSuggestionsResponse => {
  return {
    cityName,
    country: 'Argentina',
    weatherSummary: {
      avgTemperature: 22,
      maxTemperature: 28,
      minTemperature: 16,
      avgHumidity: 65,
      maxWindSpeed: 25,
      dominantWeather: 'Partly Cloudy',
      period: 'Next 7 days'
    },
    categories: [
      {
        category: 'Clothing',
        icon: '👕',
        items: [
          { name: 'Light jacket', reason: 'Cool evenings expected', priority: 'recommended', icon: '🧥' },
          { name: 'T-shirts', reason: 'Warm days', priority: 'essential', icon: '👕' },
          { name: 'Comfortable shoes', reason: 'Walking tours', priority: 'essential', icon: '👟' }
        ]
      },
      {
        category: 'Accessories',
        icon: '🎒',
        items: [
          { name: 'Sunglasses', reason: 'Bright sunny days', priority: 'recommended', icon: '🕶️' },
          { name: 'Umbrella', reason: 'Possible light rain', priority: 'optional', icon: '☂️' }
        ]
      },
      {
        category: 'Essentials',
        icon: '💼',
        items: [
          { name: 'Sunscreen', reason: 'High UV index', priority: 'essential', icon: '🧴' },
          { name: 'Water bottle', reason: 'Stay hydrated', priority: 'recommended', icon: '💧' }
        ]
      }
    ],
    generalTips: [
      'Layer your clothing for temperature changes throughout the day',
      'Bring comfortable walking shoes for exploring the city',
      'Don\'t forget your camera for amazing photo opportunities'
    ]
  };
};

/**
 * Generate mock weather alerts for development
 * Used when backend endpoint is not available
 */
const generateMockWeatherAlerts = (cityName: string = 'Buenos Aires'): WeatherAlertsResponse => {
  return {
    cityName,
    country: 'Argentina',
    currentConditions: {
      temperature: 23,
      windSpeed: 15,
      humidity: 60,
      weatherDescription: 'Partly cloudy',
      time: new Date().toISOString()
    },
    alerts: [],
    status: {
      level: 'safe',
      message: 'Weather conditions are favorable for travel',
      color: 'green'
    }
  };
};

// ==================== HELPER FUNCTION ====================
/**
 * Helper function to check if backend is reachable
 * Can be used to show connection status to user
 */
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    // Try to hit a simple endpoint
    await api.get('/countries', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
};

// ==================== AUTH API ====================
/**
 * Authentication API methods
 * Handles user registration, login, and logout
 */
export const authAPI = {
  /**
   * Register a new user
   * Automatically stores token and user data on success
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);

    // Store token and user data in localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify({
      username: response.data.username,
      email: response.data.email,
      role: response.data.role,
    }));

    return response.data;
  },

  /**
   * Login existing user
   * Automatically stores token and user data on success
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);

    // Store token and user data in localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify({
      username: response.data.username,
      email: response.data.email,
      role: response.data.role,
    }));

    return response.data;
  },

  /**
   * Logout current user
   * Clears token and user data from localStorage
   */
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from localStorage
   * Returns null if not logged in
   */
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is logged in
   * Returns true if token exists in localStorage
   */
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get current JWT token
   * Returns null if not logged in
   */
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};

// ==================== COUNTRIES API ====================
/**
 * Countries API methods
 * Fetches country data from backend
 */
export const countryAPI = {
  /**
   * Get all countries with nested cities, activities, and weather
   * This is the main endpoint for the Explore page
   *
   * Backend endpoint: GET /api/v1/countries/full
   */
  getAllFull: async (): Promise<ApiCountry[]> => {
    const response = await api.get<ApiCountry[]>('/countries/full');
    return response.data;
  },

  /**
   * Get single country with all nested data
   * Used on the Cities page to show country details
   *
   * Backend endpoint: GET /api/v1/countries/{id}/full
   */
  getByIdFull: async (id: string): Promise<ApiCountry> => {
    const response = await api.get<ApiCountry>(`/countries/${id}/full`);
    return response.data;
  },

  /**
   * Get basic country list (no nested data)
   * Lighter endpoint for simple country listings
   *
   * Backend endpoint: GET /api/v1/countries
   */
  getAll: async (): Promise<ApiCountry[]> => {
    const response = await api.get<ApiCountry[]>('/countries');
    return response.data;
  },

  /**
   * Get single country (basic info only)
   *
   * Backend endpoint: GET /api/v1/countries/{id}
   */
  getById: async (id: string): Promise<ApiCountry> => {
    const response = await api.get<ApiCountry>(`/countries/${id}`);
    return response.data;
  },
};

// ==================== CITIES API ====================
/**
 * Cities API methods
 * Fetches city data from backend
 */
export const cityAPI = {
  /**
   * Get all cities
   *
   * Backend endpoint: GET /api/v1/cities
   */
  getAll: async (): Promise<ApiCity[]> => {
    const response = await api.get<ApiCity[]>('/cities');
    return response.data;
  },

  /**
   * Get single city by ID
   *
   * Backend endpoint: GET /api/v1/cities/{id}
   */
  getById: async (id: string): Promise<ApiCity> => {
    const response = await api.get<ApiCity>(`/cities/${id}`);
    return response.data;
  },

  /**
   * Get all cities in a specific country
   *
   * Backend endpoint: GET /api/v1/countries/{countryId}/cities
   */
  getByCountry: async (countryId: string): Promise<ApiCity[]> => {
    const response = await api.get<ApiCity[]>(`/countries/${countryId}/cities`);
    return response.data;
  },
};

// ==================== CATEGORIES/ACTIVITIES API ====================
/**
 * Categories (Activities) API methods
 * Fetches activity data from backend
 */
export const categoryAPI = {
  /**
   * Get all activities
   *
   * Backend endpoint: GET /api/v1/categories
   */
  getAll: async (): Promise<ApiActivity[]> => {
    const response = await api.get<ApiActivity[]>('/categories');
    return response.data;
  },

  /**
   * Get single activity by ID
   *
   * Backend endpoint: GET /api/v1/categories/{id}
   */
  getById: async (id: string): Promise<ApiActivity> => {
    const response = await api.get<ApiActivity>(`/categories/${id}`);
    return response.data;
  },

  /**
   * Get all activities available in a specific city
   *
   * Backend endpoint: GET /api/v1/categories/city/{cityId}
   */
  getByCity: async (cityId: string): Promise<ApiActivity[]> => {
    const response = await api.get<ApiActivity[]>(`/categories/city/${cityId}`);
    return response.data;
  },
};

// ==================== WEATHER API ====================
/**
 * Weather API methods
 * Fetches weather data for cities
 */
export const weatherAPI = {
  /**
   * Get weather by city ID
   *
   * Backend endpoint: GET /api/v1/weather/city/{cityId}
   */
  getByCity: async (cityId: string): Promise<ApiWeather> => {
    const response = await api.get<ApiWeather>(`/weather/city/${cityId}`);
    return response.data;
  },

  /**
   * Get weather by city name
   *
   * Backend endpoint: GET /api/v1/weather/city?name={name}
   */
  getByCityName: async (name: string): Promise<ApiWeather> => {
    const response = await api.get<ApiWeather>(`/weather/city`, {
      params: { name },
    });
    return response.data;
  },
};

// ==================== SEARCH API ====================
/**
 * Search API methods
 * Search for countries and cities
 */
export const searchAPI = {
  /**
   * Search countries and cities by query
   *
   * Backend endpoint: GET /api/v1/search?q={query}
   */
  search: async (query: string): Promise<SearchResult> => {
    const response = await api.get<SearchResult>('/search', {
      params: { q: query },
    });
    return response.data;
  },

  /**
   * Search cities only by query
   *
   * Backend endpoint: GET /api/v1/search/cities?q={query}
   */
  searchCities: async (query: string): Promise<ApiCity[]> => {
    const response = await api.get<ApiCity[]>('/search/cities', {
      params: { q: query },
    });
    return response.data;
  },
};

// ==================== PACKING SUGGESTIONS API ====================
/**
 * Packing Suggestions API methods
 * Endpoint: /api/weather/packing/* (NOT /api/v1/)
 */
export const packingSuggestionsAPI = {
  getByCityId: async (cityId: string, cityName?: string): Promise<PackingSuggestionsResponse> => {
    try {
      const response = await axios.get<PackingSuggestionsResponse>(
        `${BACKEND_URL}/api/weather/packing/city/${cityId}`,
        { timeout: REQUEST_TIMEOUT }
      );
      console.log('Packing API Success:', response.data);
      return response.data;
    } catch (err) {
      console.log('Packing API failed, using mock data');
      return generateMockPackingSuggestions(cityName || 'Unknown City');
    }
  },

  getByCoordinates: async (lat: number, lon: number, name: string): Promise<PackingSuggestionsResponse> => {
    try {
      const response = await axios.get<PackingSuggestionsResponse>(
        `${BACKEND_URL}/api/weather/packing/coordinates`,
        { params: { lat, lon, cityName: name }, timeout: REQUEST_TIMEOUT }
      );
      return response.data;
    } catch {
      return generateMockPackingSuggestions(name);
    }
  },
};

// ==================== WEATHER ALERTS API ====================
/**
 * Weather Alerts API methods
 * Endpoint: /api/weather/alerts/* (NOT /api/v1/)
 */
export const weatherAlertsAPI = {
  getByCityId: async (cityId: string, cityName?: string): Promise<WeatherAlertsResponse> => {
    try {
      const response = await axios.get<WeatherAlertsResponse>(
        `${BACKEND_URL}/api/weather/alerts/city/${cityId}`,
        { timeout: REQUEST_TIMEOUT }
      );
      console.log('Weather Alerts API Success:', response.data);
      return response.data;
    } catch (err) {
      console.log('Weather Alerts API failed, using mock data');
      return generateMockWeatherAlerts(cityName || 'Unknown City');
    }
  },

  getByCoordinates: async (lat: number, lon: number, name: string): Promise<WeatherAlertsResponse> => {
    try {
      const response = await axios.get<WeatherAlertsResponse>(
        `${BACKEND_URL}/api/weather/alerts/coordinates`,
        { params: { lat, lon, cityName: name }, timeout: REQUEST_TIMEOUT }
      );
      return response.data;
    } catch {
      return generateMockWeatherAlerts(name);
    }
  },
};

// ==================== TRIPS API (Requires Auth) ====================
/**
 * Trips API methods
 * All methods require authentication (JWT token)
 */
export const tripAPI = {
  /**
   * Create a new trip
   * Requires user to be logged in
   *
   * Backend endpoint: POST /api/v1/trips
   */
  create: async (data: CreateTripRequest): Promise<ApiTrip> => {
    const response = await api.post<ApiTrip>('/trips', data);
    return response.data;
  },

  /**
   * Preview trip cost without saving
   * Calculates total cost based on selected activities
   *
   * Backend endpoint: POST /api/v1/trips/preview
   */
  preview: async (data: CreateTripRequest): Promise<TripPreviewResponse> => {
    const response = await api.post<TripPreviewResponse>('/trips/preview', data);
    return response.data;
  },

  /**
   * Get all trips for the logged-in user
   *
   * Backend endpoint: GET /api/v1/trips
   */
  getAll: async (): Promise<ApiTrip[]> => {
    const response = await api.get<ApiTrip[]>('/trips');
    return response.data;
  },

  /**
   * Get single trip by ID
   *
   * Backend endpoint: GET /api/v1/trips/{id}
   */
  getById: async (id: string): Promise<ApiTrip> => {
    const response = await api.get<ApiTrip>(`/trips/${id}`);
    return response.data;
  },

  /**
   * Update an existing trip (Full Update)
   * 
   * Updates all fields of an existing trip. Request body format is the same as CREATE.
   *
   * Backend endpoint: PUT /api/v1/trips/{id}
   * Method: PUT
   * Headers: Authorization: Bearer {token}
   * Body: CreateTripRequest (same format as CREATE)
   *   - cityId: string
   *   - startDate: string (ISO format: "2025-01-15")
   *   - durationDays: number
   *   - selectedActivities: SelectedActivity[]
   *
   * Example:
   * PUT http://localhost:8080/api/v1/trips/69565d42752e192e70a8b9d0
   */
  update: async (id: string, data: CreateTripRequest): Promise<ApiTrip> => {
    console.log('🌐 [tripAPI.update] Starting update request');
    console.log('🌐 [tripAPI.update] Trip ID:', id);
    console.log('🌐 [tripAPI.update] Endpoint: PUT /api/v1/trips/' + id);
    console.log('🌐 [tripAPI.update] Request data:', JSON.stringify(data, null, 2));
    
    try {
      const response = await api.put<ApiTrip>(`/trips/${id}`, data);
      console.log('✅ [tripAPI.update] Response received');
      console.log('✅ [tripAPI.update] Status:', response.status);
      console.log('✅ [tripAPI.update] Response data:', response.data);
      
      // Check activities in response
      if (response.data.selectedActivities) {
        const hoursCount = response.data.selectedActivities.filter(a => 
          a.durationType === 'HOURS' || a.durationType === 'hours'
        ).length;
        const daysCount = response.data.selectedActivities.filter(a => 
          a.durationType === 'DAYS' || a.durationType === 'days'
        ).length;
        console.log(`📊 [tripAPI.update] Response activities: ${hoursCount} HOURS, ${daysCount} DAYS`);
        
        response.data.selectedActivities.forEach((activity, idx) => {
          console.log(`📊 [tripAPI.update] Response Activity ${idx + 1}:`, {
            activityId: activity.activityId,
            activityName: activity.activityName,
            durationType: activity.durationType,
            durationValue: activity.durationValue,
            quantity: activity.quantity,
            unitPrice: activity.unitPrice,
            subtotal: activity.subtotal,
          });
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ [tripAPI.update] Request failed');
      console.error('❌ [tripAPI.update] Error:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('❌ [tripAPI.update] Response status:', axiosError.response?.status);
        console.error('❌ [tripAPI.update] Response data:', axiosError.response?.data);
        console.error('❌ [tripAPI.update] Response headers:', axiosError.response?.headers);
      }
      throw error;
    }
  },

  /**
   * Cancel/delete a trip
   *
   * Backend endpoint: DELETE /api/v1/trips/{id}
   */
  cancel: async (id: string): Promise<void> => {
    await api.delete(`/trips/${id}`);
  },

  /**
   * Start a trip (change status to ONGOING)
   * Used when user confirms trip is starting
   *
   * Backend endpoint: PUT /api/v1/trips/{id}/start
   */
  start: async (id: string): Promise<ApiTrip> => {
    const response = await api.put<ApiTrip>(`/trips/${id}/start`);
    return response.data;
  },

  /**
   * Complete a trip (change status to COMPLETED)
   * Used when user confirms trip has ended
   *
   * Backend endpoint: PUT /api/v1/trips/{id}/complete
   */
  complete: async (id: string): Promise<ApiTrip> => {
    const response = await api.put<ApiTrip>(`/trips/${id}/complete`);
    return response.data;
  },
};

// ==================== COUNTDOWN API ====================
/**
 * Countdown API methods
 * Fetches countdown data for trips (reminders, status alerts)
 */
export const countdownAPI = {
  /**
   * Get countdown for all user's trips
   * Returns trips with countdown info, status flags, and messages
   *
   * Backend endpoint: GET /api/v1/countdown/my-trips
   */
  getMyTrips: async (): Promise<TripCountdown[]> => {
    const response = await api.get<TripCountdown[]>('/countdown/my-trips');
    return response.data;
  },

  /**
   * Get countdown for a single trip
   *
   * Backend endpoint: GET /api/v1/countdown/trip/{tripId}
   */
  getByTripId: async (tripId: string): Promise<TripCountdown> => {
    const response = await api.get<TripCountdown>(`/countdown/trip/${tripId}`);
    return response.data;
  },
};

// ==================== NOTIFICATIONS API ====================
/**
 * Notifications API methods
 * Handles user notifications (reminders, alerts)
 */
export const notificationAPI = {
  /**
   * Get all notifications for the user
   *
   * Backend endpoint: GET /api/v1/notifications
   */
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/notifications');
    return response.data;
  },

  /**
   * Get unread notifications
   *
   * Backend endpoint: GET /api/v1/notifications/unread
   */
  getUnread: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/notifications/unread');
    return response.data;
  },

  /**
   * Get unread notification count
   *
   * Backend endpoint: GET /api/v1/notifications/unread/count
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>('/notifications/unread/count');
    return response.data.count;
  },

  /**
   * Mark a notification as read
   *
   * Backend endpoint: PUT /api/v1/notifications/{id}/read
   */
  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read
   *
   * Backend endpoint: PUT /api/v1/notifications/read-all
   */
  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/read-all');
  },
};

// ==================== PROFILE API ====================
/**
 * Profile API methods
 * Handles user profile management
 * Integrated with Spring Boot backend: UserProfileController
 */
export const profileAPI = {
  /**
   * Get current user's profile
   *
   * Backend endpoint: GET /api/v1/profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfileResponse>('/profile');
    const profile = mapProfileResponse(response.data);

    // Update localStorage with fetched profile data
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const updatedUser = { ...user, ...profile };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return profile;
  },

  /**
   * Update user profile
   *
   * Backend endpoint: PUT /api/v1/profile
   * Request Body: UserProfileRequest
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await api.put<UserProfileResponse>('/profile', data);
    const profile = mapProfileResponse(response.data);

    // Update localStorage with new user data
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const updatedUser = { ...user, ...profile };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return profile;
  },

  /**
   * Update username only
   *
   * Backend endpoint: PUT /api/v1/profile/username
   * Request Body: { username: string }
   */
  updateUsername: async (username: string): Promise<UserProfile> => {
    const response = await api.put<UserProfileResponse>('/profile/username', { username });
    const profile = mapProfileResponse(response.data);

    // Update localStorage
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const updatedUser = { ...user, ...profile };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return profile;
  },

  /**
   * Update phone number only
   *
   * Backend endpoint: PUT /api/v1/profile/phone
   * Request Body: { phoneNumber: string }
   */
  updatePhoneNumber: async (phoneNumber: string): Promise<UserProfile> => {
    const response = await api.put<UserProfileResponse>('/profile/phone', { phoneNumber });
    const profile = mapProfileResponse(response.data);

    // Update localStorage
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const updatedUser = { ...user, ...profile };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return profile;
  },

  /**
   * Upload/update profile photo
   *
   * Backend endpoint: POST /api/v1/profile/photo
   * Content-Type: multipart/form-data
   * Form field: "file"
   */
  uploadAvatar: async (file: File): Promise<UserProfile> => {
    const formData = new FormData();
    formData.append('file', file); // Backend expects 'file' field name

    const response = await api.post<UserProfileResponse>('/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const profile = mapProfileResponse(response.data);

    // Update localStorage with new avatar URL
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const updatedUser = { ...user, ...profile };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return profile;
  },

  /**
   * Delete profile photo
   *
   * Backend endpoint: DELETE /api/v1/profile/photo
   */
  deleteAvatar: async (): Promise<UserProfile> => {
    const response = await api.delete<UserProfileResponse>('/profile/photo');
    const profile = mapProfileResponse(response.data);

    // Remove avatar URL from localStorage
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const updatedUser = { ...user, ...profile };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return profile;
  },
};

// ==================== MAP API EXPORT ====================
export { mapAPI, decodePolyline, calculateHaversineDistance, formatDistance, formatDuration } from './mapService';
export type {
  GeocodeResponse,
  ReverseGeocodeResponse,
  DirectionsResponse,
  DirectionStep,
  DistanceResponse,
  NearbyPlace,
  NearbyPlacesResponse,
  Waypoint,
  MultiStopRouteRequest,
  MultiStopRouteResponse,
  RouteLeg,
  CityMapDataResponse,
  TripRouteResponse,
  PlaceType,
  TravelMode
} from './mapService';

// ==================== DEFAULT EXPORT ====================
export default api;
