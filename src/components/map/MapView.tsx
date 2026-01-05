import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import type { NearbyPlace, DirectionsResponse } from '../../api/mapService';
import { parseGeoJSONPolyline, decodePolyline } from '../../api/mapService';

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configure default icon
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

export const searchIcon = createCustomIcon('#3b82f6'); // Blue
export const originIcon = createCustomIcon('#22c55e'); // Green
export const destinationIcon = createCustomIcon('#ef4444'); // Red
export const poiIcon = createCustomIcon('#f59e0b'); // Amber
export const cityIcon = createCustomIcon('#8b5cf6'); // Purple - City center
export const activityIcon = createCustomIcon('#f97316'); // Orange - Activities

// Component to fly to location
function FlyToLocation({ position, zoom = 14 }: { position: [number, number] | null; zoom?: number }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, zoom, { duration: 1.5 });
    }
  }, [map, position, zoom]);

  return null;
}

// Component to fit bounds
function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);

  return null;
}

// Activity location interface
export interface ActivityLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
}

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  searchLocation?: { lat: number; lon: number; name: string } | null;
  nearbyPlaces?: NearbyPlace[];
  directions?: DirectionsResponse | null;
  originLocation?: { lat: number; lon: number; name?: string } | null;
  destinationLocation?: { lat: number; lon: number; name?: string } | null;
  onMapClick?: (lat: number, lon: number) => void;
  flyToPosition?: [number, number] | null;
  cityLocation?: { lat: number; lon: number; name: string } | null;
  activities?: ActivityLocation[];
}

function MapClickHandler({ onClick }: { onClick?: (lat: number, lon: number) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!onClick) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onClick(e.latlng.lat, e.latlng.lng);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onClick]);

  return null;
}

export default function MapView({
  center = [24.8607, 67.0011], // Default: Karachi
  zoom = 12,
  searchLocation,
  nearbyPlaces = [],
  directions,
  originLocation,
  destinationLocation,
  onMapClick,
  flyToPosition,
  cityLocation,
  activities = [],
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Parse polyline for route - try GeoJSON first, then encoded polyline
  const routeCoordinates = directions?.polyline
    ? directions.polyline.startsWith('{')
      ? parseGeoJSONPolyline(directions.polyline)
      : decodePolyline(directions.polyline)
    : [];

  // Calculate bounds for route
  const routeBounds = routeCoordinates.length > 0
    ? L.latLngBounds(routeCoordinates.map(([lat, lng]) => [lat, lng] as [number, number]))
    : null;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      ref={mapRef}
      className="w-full h-full rounded-xl"
      style={{ minHeight: '500px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onClick={onMapClick} />

      {flyToPosition && <FlyToLocation position={flyToPosition} />}

      {routeBounds && <FitBounds bounds={routeBounds} />}

      {/* City center marker */}
      {cityLocation && (
        <Marker
          position={[cityLocation.lat, cityLocation.lon]}
          icon={cityIcon}
        >
          <Popup>
            <div className="text-sm">
              <span className="font-bold text-purple-600">{cityLocation.name}</span>
              <p className="text-gray-500 text-xs">City Center</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Search result marker */}
      {searchLocation && (
        <Marker
          position={[searchLocation.lat, searchLocation.lon]}
          icon={searchIcon}
        >
          <Popup>
            <div className="text-sm font-medium">{searchLocation.name}</div>
          </Popup>
        </Marker>
      )}

      {/* Origin marker */}
      {originLocation && (
        <Marker
          position={[originLocation.lat, originLocation.lon]}
          icon={originIcon}
        >
          <Popup>
            <div className="text-sm">
              <span className="font-medium text-green-600">Origin</span>
              {originLocation.name && <p>{originLocation.name}</p>}
            </div>
          </Popup>
        </Marker>
      )}

      {/* Destination marker */}
      {destinationLocation && (
        <Marker
          position={[destinationLocation.lat, destinationLocation.lon]}
          icon={destinationIcon}
        >
          <Popup>
            <div className="text-sm">
              <span className="font-medium text-red-600">Destination</span>
              {destinationLocation.name && <p>{destinationLocation.name}</p>}
            </div>
          </Popup>
        </Marker>
      )}

      {/* Nearby places markers */}
      {nearbyPlaces.map((place) => (
        <Marker
          key={place.id}
          position={[place.latitude, place.longitude]}
          icon={poiIcon}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-medium">{place.name}</p>
              {place.type && <p className="text-gray-500 text-xs">{place.type}</p>}
              {place.distance && <p className="text-gray-500 text-xs">{(place.distance / 1000).toFixed(1)} km away</p>}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Activity markers */}
      {activities.filter(a => a.latitude && a.longitude).map((activity) => (
        <Marker
          key={activity.id}
          position={[activity.latitude, activity.longitude]}
          icon={activityIcon}
        >
          <Popup>
            <div className="text-sm">
              <span className="font-bold text-orange-600">{activity.name}</span>
              {activity.description && (
                <p className="text-gray-500 text-xs mt-1 max-w-[200px]">{activity.description}</p>
              )}
              <p className="text-orange-500 text-xs mt-1">Activity</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Route polyline */}
      {routeCoordinates.length > 0 && (
        <Polyline
          positions={routeCoordinates}
          color="#3b82f6"
          weight={4}
          opacity={0.8}
        />
      )}
    </MapContainer>
  );
}
