import { useState, useCallback } from 'react';
import { Search, MapPin, Loader2, Utensils, Hotel, Building2, Heart, Landmark, Coffee, Pill, Car, Fuel } from 'lucide-react';
import { mapAPI, type NearbyPlace, type PlaceType } from '../../api/mapService';

interface NearbyPlacesPanelProps {
  currentLocation: { lat: number; lon: number } | null;
  onPlacesFound: (places: NearbyPlace[]) => void;
  onPlaceSelect: (place: NearbyPlace) => void;
}

const placeTypes: { value: PlaceType; label: string; icon: React.ReactNode }[] = [
  { value: 'restaurant', label: 'Restaurants', icon: <Utensils className="w-4 h-4" /> },
  { value: 'hotel', label: 'Hotels', icon: <Hotel className="w-4 h-4" /> },
  { value: 'tourism', label: 'Tourism', icon: <Landmark className="w-4 h-4" /> },
  { value: 'cafe', label: 'Cafes', icon: <Coffee className="w-4 h-4" /> },
  { value: 'hospital', label: 'Hospitals', icon: <Heart className="w-4 h-4" /> },
  { value: 'atm', label: 'ATMs', icon: <Building2 className="w-4 h-4" /> },
  { value: 'pharmacy', label: 'Pharmacy', icon: <Pill className="w-4 h-4" /> },
  { value: 'parking', label: 'Parking', icon: <Car className="w-4 h-4" /> },
  { value: 'gas_station', label: 'Gas Station', icon: <Fuel className="w-4 h-4" /> },
];

export default function NearbyPlacesPanel({ currentLocation, onPlacesFound, onPlaceSelect }: NearbyPlacesPanelProps) {
  const [selectedType, setSelectedType] = useState<PlaceType>('restaurant');
  const [radius, setRadius] = useState(3000);
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchNearby = useCallback(async () => {
    if (!currentLocation) {
      setError('Please search for a location first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await mapAPI.getNearbyPlaces(
        currentLocation.lat,
        currentLocation.lon,
        radius,
        selectedType
      );
      setPlaces(response.places);
      onPlacesFound(response.places);
    } catch (err) {
      console.error('Nearby search error:', err);
      setError('Failed to find nearby places');
      setPlaces([]);
      onPlacesFound([]);
    } finally {
      setLoading(false);
    }
  }, [currentLocation, radius, selectedType, onPlacesFound]);

  return (
    <div className="space-y-4">
      {/* Place Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Place Type</label>
        <div className="grid grid-cols-3 gap-2">
          {placeTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedType === type.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-dark-elevated text-gray-300 hover:bg-dark-hover border border-dark-border'
              }`}
            >
              {type.icon}
              <span className="hidden sm:inline">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Radius Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Search Radius: <span className="text-blue-400">{(radius / 1000).toFixed(1)} km</span>
        </label>
        <input
          type="range"
          min={500}
          max={10000}
          step={500}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full h-2 bg-dark-elevated rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>500m</span>
          <span>10km</span>
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={searchNearby}
        disabled={loading || !currentLocation}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:from-dark-border disabled:to-dark-border disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 disabled:shadow-none"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Find Nearby Places
          </>
        )}
      </button>

      {!currentLocation && (
        <p className="text-yellow-400 text-sm text-center">Search for a location first to find nearby places</p>
      )}

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      {/* Results List */}
      {places.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          <p className="text-sm text-gray-400">{places.length} places found</p>
          {places.map((place) => (
            <button
              key={place.id}
              onClick={() => onPlaceSelect(place)}
              className="w-full flex items-start gap-3 p-3 bg-dark-elevated hover:bg-dark-hover border border-dark-border rounded-lg transition-all text-left"
            >
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <MapPin className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{place.name}</p>
                <p className="text-xs text-gray-400">{place.type}</p>
                {place.distance && (
                  <p className="text-xs text-blue-400 mt-1">
                    {(place.distance / 1000).toFixed(1)} km away
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
