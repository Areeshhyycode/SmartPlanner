import { useState, useCallback } from 'react';
import { Navigation, MapPin, Car, Footprints, Bike, Loader2, Clock, Route, ChevronDown, ChevronUp } from 'lucide-react';
import { mapAPI, type DirectionsResponse, type TravelMode } from '../../api/mapService';

interface DirectionsPanelProps {
  originLocation: { lat: number; lon: number; name?: string } | null;
  destinationLocation: { lat: number; lon: number; name?: string } | null;
  onOriginSearch: () => void;
  onDestinationSearch: () => void;
  onDirectionsFound: (directions: DirectionsResponse) => void;
  onClear: () => void;
  isSelectingOrigin: boolean;
  isSelectingDestination: boolean;
  setSelectingOrigin: (v: boolean) => void;
  setSelectingDestination: (v: boolean) => void;
}

const travelModes: { value: TravelMode; label: string; icon: React.ReactNode }[] = [
  { value: 'driving', label: 'Drive', icon: <Car className="w-4 h-4" /> },
  { value: 'walking', label: 'Walk', icon: <Footprints className="w-4 h-4" /> },
  { value: 'cycling', label: 'Cycle', icon: <Bike className="w-4 h-4" /> },
];

export default function DirectionsPanel({
  originLocation,
  destinationLocation,
  onDirectionsFound,
  onClear,
  isSelectingOrigin,
  isSelectingDestination,
  setSelectingOrigin,
  setSelectingDestination,
}: DirectionsPanelProps) {
  const [mode, setMode] = useState<TravelMode>('driving');
  const [loading, setLoading] = useState(false);
  const [directions, setDirections] = useState<DirectionsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  const getDirections = useCallback(async () => {
    if (!originLocation || !destinationLocation) {
      setError('Please select both origin and destination');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await mapAPI.getDirections(
        originLocation.lat,
        originLocation.lon,
        destinationLocation.lat,
        destinationLocation.lon,
        mode
      );
      setDirections(result);
      onDirectionsFound(result);
    } catch (err) {
      console.error('Directions error:', err);
      setError('Failed to get directions');
      setDirections(null);
    } finally {
      setLoading(false);
    }
  }, [originLocation, destinationLocation, mode, onDirectionsFound]);

  const handleClear = () => {
    setDirections(null);
    setError(null);
    onClear();
  };

  return (
    <div className="space-y-4">
      {/* Origin Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Starting Point</label>
        <button
          onClick={() => {
            setSelectingOrigin(true);
            setSelectingDestination(false);
          }}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
            isSelectingOrigin
              ? 'bg-green-500/20 border-green-500 text-green-400'
              : originLocation
              ? 'bg-dark-elevated border-dark-border text-white'
              : 'bg-dark-elevated border-dark-border text-gray-400 hover:border-green-500/50'
          }`}
        >
          <div className={`p-2 rounded-lg ${originLocation ? 'bg-green-500/20' : 'bg-dark-hover'}`}>
            <MapPin className={`w-4 h-4 ${originLocation ? 'text-green-400' : 'text-gray-400'}`} />
          </div>
          <span className="flex-1 text-left text-sm truncate">
            {isSelectingOrigin
              ? 'Click on map to select origin...'
              : originLocation?.name || 'Click to select origin'}
          </span>
        </button>
      </div>

      {/* Destination Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Destination</label>
        <button
          onClick={() => {
            setSelectingDestination(true);
            setSelectingOrigin(false);
          }}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
            isSelectingDestination
              ? 'bg-red-500/20 border-red-500 text-red-400'
              : destinationLocation
              ? 'bg-dark-elevated border-dark-border text-white'
              : 'bg-dark-elevated border-dark-border text-gray-400 hover:border-red-500/50'
          }`}
        >
          <div className={`p-2 rounded-lg ${destinationLocation ? 'bg-red-500/20' : 'bg-dark-hover'}`}>
            <Navigation className={`w-4 h-4 ${destinationLocation ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
          <span className="flex-1 text-left text-sm truncate">
            {isSelectingDestination
              ? 'Click on map to select destination...'
              : destinationLocation?.name || 'Click to select destination'}
          </span>
        </button>
      </div>

      {/* Travel Mode */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Travel Mode</label>
        <div className="grid grid-cols-3 gap-2">
          {travelModes.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-medium transition-all ${
                mode === m.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-dark-elevated text-gray-300 hover:bg-dark-hover border border-dark-border'
              }`}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Get Directions Button */}
      <div className="flex gap-2">
        <button
          onClick={getDirections}
          disabled={loading || !originLocation || !destinationLocation}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:from-dark-border disabled:to-dark-border disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Getting Route...
            </>
          ) : (
            <>
              <Route className="w-5 h-5" />
              Get Directions
            </>
          )}
        </button>
        {(originLocation || destinationLocation || directions) && (
          <button
            onClick={handleClear}
            className="px-4 py-3 bg-dark-elevated hover:bg-dark-hover border border-dark-border text-gray-300 rounded-xl transition-all"
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      {/* Directions Result */}
      {directions && (
        <div className="bg-dark-elevated border border-dark-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-blue-400">
                <Route className="w-5 h-5" />
                <span className="font-semibold">{directions.distance}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-5 h-5" />
                <span>{directions.duration}</span>
              </div>
            </div>
          </div>

          {/* Turn-by-turn steps */}
          {directions.steps && directions.steps.length > 0 && (
            <div>
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showSteps ? 'Hide' : 'Show'} turn-by-turn ({directions.steps.length} steps)
              </button>

              {showSteps && (
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                  {directions.steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex gap-3 p-2 bg-dark-hover rounded-lg text-sm"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-200">{step.instruction}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{step.distance} - {step.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
