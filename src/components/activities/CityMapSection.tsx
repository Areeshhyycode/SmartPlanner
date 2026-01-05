import { useState, useCallback, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Car,
  Footprints,
  Bike,
  Loader2,
  Route as RouteIcon,
  ChevronDown,
  ChevronUp,
  X,
  LocateFixed,
  Info,
  ArrowRight,
  Compass
} from 'lucide-react';
import { mapAPI, type DirectionsResponse, type TravelMode } from '../../api/mapService';
import MapView from '../map/MapView';

interface LocationPoint {
  lat: number;
  lon: number;
  name?: string;
}

interface ActivityLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
}

interface CityMapSectionProps {
  cityName: string;
  cityLat?: number;
  cityLon?: number;
  activities?: ActivityLocation[];
  flyToActivityId?: string | null;
  onActivitySelect?: (activityId: string | null) => void;
}

const travelModes: { value: TravelMode; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'driving', label: 'Car', icon: <Car className="w-5 h-5" />, desc: 'By car' },
  { value: 'walking', label: 'Walk', icon: <Footprints className="w-5 h-5" />, desc: 'On foot' },
  { value: 'cycling', label: 'Bike', icon: <Bike className="w-5 h-5" />, desc: 'By bicycle' },
];

export default function CityMapSection({ cityName, cityLat, cityLon, activities = [], flyToActivityId, onActivitySelect }: CityMapSectionProps) {
  const [mode, setMode] = useState<TravelMode>('driving');
  const [loading, setLoading] = useState(false);
  const [directions, setDirections] = useState<DirectionsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  const [originLocation, setOriginLocation] = useState<LocationPoint | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<LocationPoint | null>(null);
  const [isSelectingOrigin, setIsSelectingOrigin] = useState(false);
  const [isSelectingDestination, setIsSelectingDestination] = useState(false);
  const [flyToPosition, setFlyToPosition] = useState<[number, number] | null>(null);

  // Filter activities with valid coordinates
  const activitiesWithLocation = activities.filter(a => a.latitude && a.longitude);

  // Handle activity click - fly to location
  const handleActivityClick = useCallback((activity: ActivityLocation) => {
    if (activity.latitude && activity.longitude) {
      setFlyToPosition([activity.latitude, activity.longitude]);
      setSelectedActivityId(activity.id);
      onActivitySelect?.(activity.id);
    }
  }, [onActivitySelect]);

  // Handle city center click
  const handleCityClick = useCallback(() => {
    if (cityLat && cityLon) {
      setFlyToPosition([cityLat, cityLon]);
      setSelectedActivityId(null);
      onActivitySelect?.(null);
    }
  }, [cityLat, cityLon, onActivitySelect]);

  // Handle external flyToActivityId changes (from ActivityList)
  useEffect(() => {
    if (flyToActivityId) {
      const activity = activitiesWithLocation.find(a => a.id === flyToActivityId);
      if (activity && activity.latitude && activity.longitude) {
        setFlyToPosition([activity.latitude, activity.longitude]);
        setSelectedActivityId(flyToActivityId);
        setShowActivities(true); // Open activities list to show selection
      }
    }
  }, [flyToActivityId, activitiesWithLocation]);

  const defaultCenter: [number, number] = cityLat && cityLon
    ? [cityLat, cityLon]
    : [24.8607, 67.0011];

  const handleMapClick = useCallback(async (lat: number, lon: number) => {
    const location: LocationPoint = { lat, lon };

    try {
      const result = await mapAPI.reverseGeocode(lat, lon);
      location.name = result.displayName;
    } catch {
      location.name = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }

    if (isSelectingOrigin) {
      setOriginLocation(location);
      setIsSelectingOrigin(false);
      setFlyToPosition([lat, lon]);
    } else if (isSelectingDestination) {
      setDestinationLocation(location);
      setIsSelectingDestination(false);
      setFlyToPosition([lat, lon]);
    }
  }, [isSelectingOrigin, isSelectingDestination]);

  const getDirections = useCallback(async () => {
    if (!originLocation || !destinationLocation) {
      setError('Please select both starting point and destination');
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
      setShowSteps(true);
    } catch (err) {
      console.error('Directions error:', err);
      setError('Could not find route. Please try different locations.');
      setDirections(null);
    } finally {
      setLoading(false);
    }
  }, [originLocation, destinationLocation, mode]);

  const handleClear = () => {
    setOriginLocation(null);
    setDestinationLocation(null);
    setDirections(null);
    setError(null);
    setIsSelectingOrigin(false);
    setIsSelectingDestination(false);
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location: LocationPoint = { lat: latitude, lon: longitude };

          try {
            const result = await mapAPI.reverseGeocode(latitude, longitude);
            location.name = result.displayName;
          } catch {
            location.name = 'My Current Location';
          }

          setOriginLocation(location);
          setFlyToPosition([latitude, longitude]);
        },
        () => {
          setError('Could not access your location. Please allow location access.');
        }
      );
    } else {
      setError('Location not supported in your browser');
    }
  };

  // Check current step
  const currentStep = !originLocation ? 1 : !destinationLocation ? 2 : 3;

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
      {/* Header with Purpose */}
      <div className="p-3 sm:p-4 md:p-5 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent border-b border-dark-border">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-blue-500/20 rounded-xl flex-shrink-0">
            <RouteIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 sm:mb-1 truncate">
              Plan Your Route in {cityName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
              Find the best way to travel between hotels, restaurants, beaches, and attractions
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Panel - Controls */}
        <div className="w-full lg:w-96 p-3 sm:p-4 md:p-5 border-b lg:border-b-0 lg:border-r border-dark-border bg-dark-elevated/30">

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-4 sm:mb-5 p-2.5 sm:p-3 bg-dark-card rounded-xl border border-dark-border">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <p className="text-xs text-gray-400">
              {currentStep === 1 && "Step 1: Select your starting point on the map"}
              {currentStep === 2 && "Step 2: Now select your destination on the map"}
              {currentStep === 3 && "Step 3: Choose travel mode and get directions!"}
            </p>
          </div>

          {/* Starting Point */}
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                <span className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">A</span>
                Starting Point
              </label>
              {!originLocation && (
                <span className="text-[10px] sm:text-xs text-green-400 animate-pulse">Click map to select</span>
              )}
            </div>

            <div
              className={`w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border-2 transition-all ${
                isSelectingOrigin
                  ? 'bg-green-500/20 border-green-500 ring-2 ring-green-500/30'
                  : originLocation
                  ? 'bg-dark-card border-green-500/50 hover:border-green-500'
                  : 'bg-dark-card border-dark-border hover:border-green-500/50'
              }`}
            >
              <button
                onClick={() => {
                  setIsSelectingOrigin(true);
                  setIsSelectingDestination(false);
                }}
                className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 text-left"
              >
                <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${originLocation ? 'bg-green-500/20' : 'bg-dark-hover'}`}>
                  <MapPin className={`w-4 h-4 sm:w-5 sm:h-5 ${originLocation ? 'text-green-400' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  {isSelectingOrigin ? (
                    <span className="text-green-400 font-medium text-sm">Click anywhere on the map...</span>
                  ) : originLocation ? (
                    <>
                      <p className="text-white font-medium truncate text-sm">{originLocation.name?.split(',')[0]}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">{originLocation.name?.split(',').slice(1).join(',')}</p>
                    </>
                  ) : (
                    <span className="text-gray-500 text-sm">Where are you starting from?</span>
                  )}
                </div>
              </button>
              {originLocation && (
                <button
                  onClick={() => {
                    setOriginLocation(null);
                    setDirections(null);
                  }}
                  className="p-1 sm:p-1.5 hover:bg-dark-hover rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                </button>
              )}
            </div>

            {/* Use My Location Button */}
            <button
              onClick={handleUseMyLocation}
              className="mt-2 w-full flex items-center justify-center gap-2 p-2 text-xs sm:text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors border border-transparent hover:border-blue-500/30"
            >
              <LocateFixed className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Use my current location
            </button>
          </div>

          {/* Arrow */}
          <div className="flex justify-center my-1.5 sm:my-2">
            <div className="p-1.5 sm:p-2 bg-dark-hover rounded-lg">
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 rotate-90" />
            </div>
          </div>

          {/* Destination */}
          <div className="mb-4 sm:mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                <span className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">B</span>
                Destination
              </label>
              {originLocation && !destinationLocation && (
                <span className="text-[10px] sm:text-xs text-red-400 animate-pulse">Click map to select</span>
              )}
            </div>

            <div
              className={`w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border-2 transition-all ${
                isSelectingDestination
                  ? 'bg-red-500/20 border-red-500 ring-2 ring-red-500/30'
                  : destinationLocation
                  ? 'bg-dark-card border-red-500/50 hover:border-red-500'
                  : 'bg-dark-card border-dark-border hover:border-red-500/50'
              }`}
            >
              <button
                onClick={() => {
                  setIsSelectingDestination(true);
                  setIsSelectingOrigin(false);
                }}
                className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 text-left"
              >
                <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${destinationLocation ? 'bg-red-500/20' : 'bg-dark-hover'}`}>
                  <Navigation className={`w-4 h-4 sm:w-5 sm:h-5 ${destinationLocation ? 'text-red-400' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  {isSelectingDestination ? (
                    <span className="text-red-400 font-medium text-sm">Click anywhere on the map...</span>
                  ) : destinationLocation ? (
                    <>
                      <p className="text-white font-medium truncate text-sm">{destinationLocation.name?.split(',')[0]}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">{destinationLocation.name?.split(',').slice(1).join(',')}</p>
                    </>
                  ) : (
                    <span className="text-gray-500 text-sm">Where do you want to go?</span>
                  )}
                </div>
              </button>
              {destinationLocation && (
                <button
                  onClick={() => {
                    setDestinationLocation(null);
                    setDirections(null);
                  }}
                  className="p-1 sm:p-1.5 hover:bg-dark-hover rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Travel Mode */}
          <div className="mb-4 sm:mb-5">
            <label className="block text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">How do you want to travel?</label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {travelModes.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  className={`flex flex-col items-center gap-1 sm:gap-1.5 p-2 sm:p-3 rounded-xl transition-all ${
                    mode === m.value
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-dark-card text-gray-400 hover:bg-dark-hover border border-dark-border hover:text-white'
                  }`}
                >
                  <span className="[&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">{m.icon}</span>
                  <span className="text-[10px] sm:text-xs font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Get Directions Button */}
          <button
            onClick={getDirections}
            disabled={loading || !originLocation || !destinationLocation}
            className="w-full flex items-center justify-center gap-2 p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 disabled:from-dark-border disabled:to-dark-border disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm sm:text-base transition-all shadow-lg shadow-blue-500/25 disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span className="hidden xs:inline">Finding best route...</span>
                <span className="xs:hidden">Finding...</span>
              </>
            ) : (
              <>
                <RouteIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                Get Directions
              </>
            )}
          </button>

          {/* Clear Button */}
          {(originLocation || destinationLocation) && (
            <button
              onClick={handleClear}
              className="w-full mt-2 p-2 text-xs sm:text-sm text-gray-400 hover:text-white hover:bg-dark-hover rounded-lg transition-colors"
            >
              Clear all & start over
            </button>
          )}

          {/* Quick Location Access - City & Activities */}
          {(cityLat && cityLon) || activitiesWithLocation.length > 0 ? (
            <div className="mt-4 sm:mt-5 bg-dark-card border border-dark-border rounded-xl overflow-hidden">
              <p className="px-3 py-2 text-[10px] sm:text-xs text-gray-400 font-medium border-b border-dark-border bg-dark-elevated/50">
                Quick Location Access
              </p>

              {/* City Center Button */}
              {cityLat && cityLon && (
                <button
                  onClick={handleCityClick}
                  className={`w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 hover:bg-dark-hover transition-colors text-left border-b border-dark-border/50 ${
                    selectedActivityId === null && flyToPosition?.[0] === cityLat && flyToPosition?.[1] === cityLon
                      ? 'bg-purple-500/10'
                      : ''
                  }`}
                >
                  <div className="p-1.5 bg-purple-500/20 rounded-lg flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-white truncate">{cityName}</p>
                    <p className="text-[10px] text-gray-500">City Center</p>
                  </div>
                </button>
              )}

              {/* Activities Dropdown */}
              {activitiesWithLocation.length > 0 && (
                <>
                  <button
                    onClick={() => setShowActivities(!showActivities)}
                    className="w-full flex items-center justify-between p-2.5 sm:p-3 hover:bg-dark-hover transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 bg-orange-500/20 rounded-lg flex-shrink-0">
                        <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs sm:text-sm font-medium text-white">Activities</p>
                        <p className="text-[10px] text-gray-500">{activitiesWithLocation.length} locations on map</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full">
                        {activitiesWithLocation.length}
                      </span>
                      {showActivities ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Activity List */}
                  {showActivities && (
                    <div className="max-h-32 sm:max-h-40 overflow-y-auto border-t border-dark-border/50">
                      {activitiesWithLocation.map((activity) => (
                        <button
                          key={activity.id}
                          onClick={() => handleActivityClick(activity)}
                          className={`w-full flex items-center gap-2 p-2 sm:p-2.5 hover:bg-dark-hover transition-colors text-left ${
                            selectedActivityId === activity.id
                              ? 'bg-orange-500/10 border-l-2 border-orange-500'
                              : 'border-l-2 border-transparent'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            selectedActivityId === activity.id ? 'bg-orange-400' : 'bg-orange-500/50'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs sm:text-sm truncate ${
                              selectedActivityId === activity.id ? 'text-orange-400 font-medium' : 'text-gray-300'
                            }`}>
                              {activity.name}
                            </p>
                            {activity.description && (
                              <p className="text-[10px] text-gray-500 truncate">{activity.description}</p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : null}

          {/* Error Message */}
          {error && (
            <div className="mt-3 p-2.5 sm:p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-xs sm:text-sm text-center">{error}</p>
            </div>
          )}

          {/* Results */}
          {directions && (
            <div className="mt-3 sm:mt-4 bg-dark-card border border-dark-border rounded-xl overflow-hidden">
              {/* Summary */}
              <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10">
                <p className="text-[10px] sm:text-xs text-gray-400 mb-1.5 sm:mb-2">Route Found!</p>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-white">{directions.distance}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400">Total Distance</p>
                  </div>
                  <div className="w-px h-8 sm:h-10 bg-dark-border" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-cyan-400">{directions.duration}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400">Estimated Time</p>
                  </div>
                </div>
              </div>

              {/* Turn by Turn */}
              {directions.steps && directions.steps.length > 0 && (
                <div className="border-t border-dark-border">
                  <button
                    onClick={() => setShowSteps(!showSteps)}
                    className="w-full flex items-center justify-between p-2.5 sm:p-3 hover:bg-dark-hover transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-medium text-gray-300">
                      Turn-by-turn directions
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-[10px] sm:text-xs bg-dark-hover px-1.5 sm:px-2 py-0.5 rounded-full text-gray-400">
                        {directions.steps.length} steps
                      </span>
                      {showSteps ? <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />}
                    </div>
                  </button>

                  {showSteps && (
                    <div className="p-2.5 sm:p-3 pt-0 max-h-40 sm:max-h-48 overflow-y-auto space-y-1.5 sm:space-y-2">
                      {directions.steps.map((step, index) => (
                        <div
                          key={index}
                          className="flex gap-2 sm:gap-3 p-1.5 sm:p-2 bg-dark-elevated rounded-lg"
                        >
                          <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-[10px] sm:text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-gray-200">{step.instruction || 'Continue straight'}</p>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                              {step.distance} • {step.duration}
                            </p>
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

        {/* Right Panel - Map */}
        <div className="flex-1 relative min-h-0">
          <div className="h-[300px] sm:h-[400px] lg:h-[550px]">
            <MapView
              center={defaultCenter}
              zoom={13}
              originLocation={originLocation}
              destinationLocation={destinationLocation}
              directions={directions}
              onMapClick={handleMapClick}
              flyToPosition={flyToPosition}
              cityLocation={cityLat && cityLon ? { lat: cityLat, lon: cityLon, name: cityName } : null}
              activities={activities}
            />
          </div>

          {/* Selection Mode Overlay */}
          {(isSelectingOrigin || isSelectingDestination) && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Top instruction bar */}
              <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 z-[40] w-[90%] sm:w-auto">
                <div className={`px-3 sm:px-5 py-2 sm:py-3 rounded-xl shadow-xl flex items-center gap-2 sm:gap-3 ${
                  isSelectingOrigin
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isSelectingOrigin ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {isSelectingOrigin ? <MapPin className="w-3 h-3 sm:w-4 sm:h-4" /> : <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm sm:text-base truncate">
                      {isSelectingOrigin ? 'Select Starting Point' : 'Select Destination'}
                    </p>
                    <p className="text-[10px] sm:text-xs opacity-80">
                      Click anywhere on the map
                    </p>
                  </div>
                </div>
              </div>

              {/* Pulsing border effect */}
              <div className={`absolute inset-0 border-2 sm:border-4 pointer-events-none ${
                isSelectingOrigin ? 'border-green-500' : 'border-red-500'
              } animate-pulse`} />
            </div>
          )}

          {/* Map Legend - Hidden on very small screens, compact on mobile */}
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-[40] bg-dark-card/95 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-dark-border max-w-[160px] sm:max-w-none">
            <p className="text-[10px] sm:text-xs text-gray-400 mb-1.5 sm:mb-2 font-medium">Map Legend</p>
            <div className="space-y-1 sm:space-y-1.5">
              {/* City Center - Clickable */}
              {cityLat && cityLon && (
                <button
                  onClick={handleCityClick}
                  className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs w-full hover:bg-dark-hover p-1 -m-1 rounded transition-colors group"
                >
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-500 rounded-full flex-shrink-0 group-hover:ring-2 group-hover:ring-purple-500/50" />
                  <span className="text-gray-300 truncate group-hover:text-purple-400">{cityName}</span>
                </button>
              )}
              {/* Activities - Clickable to toggle list */}
              {activitiesWithLocation.length > 0 && (
                <button
                  onClick={() => setShowActivities(!showActivities)}
                  className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs w-full hover:bg-dark-hover p-1 -m-1 rounded transition-colors group"
                >
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-orange-500 rounded-full flex-shrink-0 group-hover:ring-2 group-hover:ring-orange-500/50" />
                  <span className="text-gray-300 group-hover:text-orange-400">Activities ({activitiesWithLocation.length})</span>
                </button>
              )}
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full flex-shrink-0" />
                <span className="text-gray-300">Start (A)</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full flex-shrink-0" />
                <span className="text-gray-300">End (B)</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                <div className="w-5 sm:w-6 h-0.5 sm:h-1 bg-blue-500 rounded flex-shrink-0" />
                <span className="text-gray-300">Route</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
