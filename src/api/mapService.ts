import axios from 'axios';

// ==================== MAP API CONFIGURATION ====================
const MAP_BASE_URL = '/api/v1/maps';


// Create axios instance for map API
const mapApi = axios.create({
  baseURL: MAP_BASE_URL,
  timeout: 30000,
});

// Add auth interceptor
mapApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== TYPE DEFINITIONS ====================

// Geocode Response - Address to Coordinates
export interface GeocodeResponse {
  latitude: number;
  longitude: number;
  displayName: string;
  placeId?: string;
  type?: string;
  importance?: number;
  boundingBox?: [number, number, number, number]; // [south, north, west, east]
}

// Reverse Geocode Response - Coordinates to Address
export interface ReverseGeocodeResponse {
  displayName: string;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
  latitude: number;
  longitude: number;
}

// Location coordinates
export interface LocationCoords {
  latitude: number;
  longitude: number;
}

// Direction Step - Single instruction in route
export interface DirectionStep {
  instruction: string;
  distance: string;
  duration: string;
  maneuver?: string;
  startLocation: LocationCoords;
  endLocation: LocationCoords;
}

// GeoJSON LineString for polyline
export interface GeoJSONLineString {
  type: 'LineString';
  coordinates: [number, number][]; // [longitude, latitude] pairs
}

// Directions Response - Route between two points (matches backend API)
export interface DirectionsResponse {
  origin: LocationCoords;
  destination: LocationCoords;
  distance: string;
  duration: string;
  mode: TravelMode;
  polyline: string; // GeoJSON string that needs parsing
  steps: DirectionStep[];
}

// Distance Response - Simple distance calculation
export interface DistanceResponse {
  distanceKm: number;
  distanceMiles: number;
  duration: string; // Estimated travel time
  straightLine: boolean; // Whether this is straight-line distance
}

// Nearby Place - Point of Interest
export interface NearbyPlace {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  address?: string;
  distance?: number; // Distance from search point in meters
  rating?: number;
  openNow?: boolean;
  tags?: Record<string, string>;
}

// Nearby Places Response
export interface NearbyPlacesResponse {
  places: NearbyPlace[];
  total: number;
  searchCenter: {
    latitude: number;
    longitude: number;
  };
  radiusMeters: number;
}

// Waypoint for multi-stop route
export interface Waypoint {
  lat: number;
  lon: number;
  name?: string;
}

// Multi-stop Route Request
export interface MultiStopRouteRequest {
  originLat: number;
  originLon: number;
  destLat: number;
  destLon: number;
  mode: 'driving' | 'walking' | 'cycling';
  waypoints: Waypoint[];
}

// Route Leg - Segment between two points
export interface RouteLeg {
  startLocation: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  endLocation: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  distance: string;
  distanceMeters: number;
  duration: string;
  durationSeconds: number;
  steps: DirectionStep[];
}

// Multi-stop Route Response
export interface MultiStopRouteResponse {
  totalDistance: string;
  totalDistanceMeters: number;
  totalDuration: string;
  totalDurationSeconds: number;
  legs: RouteLeg[];
  polyline: string; // Full route polyline
  waypoints: Array<{
    latitude: number;
    longitude: number;
    name?: string;
  }>;
}

// City Map Data Response
export interface CityMapDataResponse {
  cityId: number;
  cityName: string;
  center: {
    latitude: number;
    longitude: number;
  };
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  pointsOfInterest: NearbyPlace[];
  activities: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    type: string;
  }>;
}

// Trip Route Response
export interface TripRouteResponse {
  tripId: number;
  route: MultiStopRouteResponse;
  activities: Array<{
    id: number;
    name: string;
    location: {
      latitude: number;
      longitude: number;
    };
    order: number;
    scheduledDate?: string;
  }>;
}

// Place Types for nearby search
export type PlaceType = 'restaurant' | 'hotel' | 'atm' | 'hospital' | 'tourism' | 'cafe' | 'pharmacy' | 'parking' | 'gas_station';

// Travel Mode for directions
export type TravelMode = 'driving' | 'walking' | 'cycling';

// ==================== MAP API SERVICE ====================

export const mapAPI = {
  /**
   * Geocode - Convert address to coordinates
   * @param address - The address to geocode (e.g., "Clifton Karachi Pakistan")
   * @returns GeocodeResponse with latitude, longitude, and display name
   */
  geocode: async (address: string): Promise<GeocodeResponse> => {
    const response = await mapApi.get<GeocodeResponse>('/geocode', {
      params: { address }
    });
    return response.data;
  },

  /**
   * Reverse Geocode - Convert coordinates to address
   * @param lat - Latitude
   * @param lon - Longitude
   * @returns ReverseGeocodeResponse with address details
   */
  reverseGeocode: async (lat: number, lon: number): Promise<ReverseGeocodeResponse> => {
    const response = await mapApi.get<ReverseGeocodeResponse>('/reverse-geocode', {
      params: { lat, lon }
    });
    return response.data;
  },

  /**
   * Get Directions - Get route between two points
   * @param originLat - Origin latitude
   * @param originLon - Origin longitude
   * @param destLat - Destination latitude
   * @param destLon - Destination longitude
   * @param mode - Travel mode: 'driving', 'walking', or 'cycling'
   * @returns DirectionsResponse with route details, steps, and polyline
   */
  getDirections: async (
    originLat: number,
    originLon: number,
    destLat: number,
    destLon: number,
    mode: TravelMode = 'driving'
  ): Promise<DirectionsResponse> => {
    const response = await mapApi.get<DirectionsResponse>('/directions', {
      params: { originLat, originLon, destLat, destLon, mode }
    });
    return response.data;
  },

  /**
   * Calculate Distance - Get distance between two points
   * @param lat1 - Point 1 latitude
   * @param lon1 - Point 1 longitude
   * @param lat2 - Point 2 latitude
   * @param lon2 - Point 2 longitude
   * @returns DistanceResponse with distance in km/miles and estimated duration
   */
  calculateDistance: async (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): Promise<DistanceResponse> => {
    const response = await mapApi.get<DistanceResponse>('/distance', {
      params: { lat1, lon1, lat2, lon2 }
    });
    return response.data;
  },

  /**
   * Get Nearby Places - Find points of interest around a location
   * @param lat - Center latitude
   * @param lon - Center longitude
   * @param radius - Search radius in meters (default: 5000)
   * @param type - Place type: 'restaurant', 'hotel', 'atm', 'hospital', 'tourism', etc.
   * @returns NearbyPlacesResponse with list of places
   */
  getNearbyPlaces: async (
    lat: number,
    lon: number,
    radius: number = 5000,
    type: PlaceType = 'tourism'
  ): Promise<NearbyPlacesResponse> => {
    const response = await mapApi.get<NearbyPlacesResponse>('/nearby', {
      params: { lat, lon, radius, type }
    });
    return response.data;
  },

  /**
   * Get Multi-Stop Route - Get route with multiple waypoints
   * @param data - Route request with origin, destination, waypoints, and mode
   * @returns MultiStopRouteResponse with full route details
   */
  getMultiStopRoute: async (data: MultiStopRouteRequest): Promise<MultiStopRouteResponse> => {
    const response = await mapApi.post<MultiStopRouteResponse>('/route', data);
    return response.data;
  },

  /**
   * Get City Map Data - Get map data for a specific city
   * @param cityId - The city ID
   * @returns CityMapDataResponse with city center, bounds, and POIs
   */
  getCityMapData: async (cityId: number): Promise<CityMapDataResponse> => {
    const response = await mapApi.get<CityMapDataResponse>(`/city/${cityId}`);
    return response.data;
  },

  /**
   * Get Trip Route - Get route for a specific trip
   * @param tripId - The trip ID
   * @returns TripRouteResponse with trip route and activity locations
   */
  getTripRoute: async (tripId: number): Promise<TripRouteResponse> => {
    const response = await mapApi.get<TripRouteResponse>(`/trip/${tripId}/route`);
    return response.data;
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Parse GeoJSON polyline string to array of coordinates
 * Backend returns polyline as GeoJSON LineString string
 * @param polylineStr - GeoJSON string from directions API
 * @returns Array of [latitude, longitude] pairs for Leaflet
 */
export const parseGeoJSONPolyline = (polylineStr: string): [number, number][] => {
  try {
    const geoJSON: GeoJSONLineString = JSON.parse(polylineStr);
    if (geoJSON.type === 'LineString' && Array.isArray(geoJSON.coordinates)) {
      // GeoJSON uses [longitude, latitude], Leaflet uses [latitude, longitude]
      return geoJSON.coordinates.map(([lon, lat]) => [lat, lon] as [number, number]);
    }
    return [];
  } catch (error) {
    console.error('Failed to parse GeoJSON polyline:', error);
    return [];
  }
};

/**
 * Decode polyline string to array of coordinates
 * Used for rendering routes on maps
 * @param encoded - Encoded polyline string from directions API
 * @returns Array of [latitude, longitude] pairs
 */
export const decodePolyline = (encoded: string): [number, number][] => {
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
};

/**
 * Calculate distance between two points using Haversine formula
 * Useful for client-side distance calculations
 * @param lat1 - Point 1 latitude
 * @param lon1 - Point 1 longitude
 * @param lat2 - Point 2 latitude
 * @param lon2 - Point 2 longitude
 * @returns Distance in kilometers
 */
export const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Format distance for display
 * @param km - Distance in kilometers
 * @returns Formatted string (e.g., "1.5 km" or "500 m")
 */
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
};

/**
 * Format duration for display
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "5 min" or "1 hr 30 min")
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }
  return `${minutes} min`;
};

export default mapAPI;
