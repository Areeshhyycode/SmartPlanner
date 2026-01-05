import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  countryAPI,
  categoryAPI,
  tripAPI,
  type ApiCountry,
  type ApiCity,
  type ApiActivity,
  type CreateTripRequest,
} from '../api';
import { mapAPI } from '../api/mapService';
import { useAuth } from '../context/AuthContext';
import {
  CityHero,
  ActivityList,
  BookingSidebar,
  LoadingState,
  ErrorState,
  NotFoundState,
  SuccessState,
  type ActivitySelection,
} from '../components/activities';
import CityMapSection from '../components/activities/CityMapSection';

function ActivitiesPage() {
  const { countryId, cityId } = useParams<{ countryId: string; cityId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Data states
  const [country, setCountry] = useState<ApiCountry | null>(null);
  const [city, setCity] = useState<ApiCity | null>(null);
  const [activities, setActivities] = useState<ApiActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection states
  const [selectedActivities, setSelectedActivities] = useState<Map<string, ActivitySelection>>(
    new Map()
  );
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  });

  // UI states
  const [showSuccess, setShowSuccess] = useState(false);
  const [booking, setBooking] = useState(false);

  // Map state - activity to fly to on map
  const [mapFlyToActivity, setMapFlyToActivity] = useState<string | null>(null);

  // Fetch data
  const fetchData = async () => {
    if (!countryId || !cityId) return;

    setLoading(true);
    setError(null);
    try {
      const countryData = await countryAPI.getByIdFull(countryId);
      setCountry(countryData);

      const cityData = countryData.cities?.find((c) => c.id === cityId);
      let cityActivities: ApiActivity[] = [];

      if (cityData) {
        setCity(cityData);
        cityActivities = cityData.activities || [];
      } else {
        cityActivities = await categoryAPI.getByCity(cityId);
      }

      // Fetch activity locations from map API
      try {
        const mapData = await mapAPI.getCityMapData(Number(cityId));
        console.log('🗺️ [ActivitiesPage] Map API response:', mapData);

        // Merge location data from map API into activities
        if (mapData && mapData.activities) {
          const locationMap = new Map(
            mapData.activities.map(a => [String(a.id), { lat: a.latitude, lon: a.longitude }])
          );

          cityActivities = cityActivities.map(activity => {
            const location = locationMap.get(activity.id);
            if (location && location.lat && location.lon) {
              return {
                ...activity,
                latitude: location.lat,
                longitude: location.lon
              };
            }
            return activity;
          });

          console.log('🗺️ [ActivitiesPage] Activities with merged locations:',
            cityActivities.filter(a => a.latitude && a.longitude).length);
        }
      } catch (mapErr) {
        console.warn('🗺️ [ActivitiesPage] Could not fetch map data:', mapErr);
        // Continue without map data - activities just won't have locations
      }

      console.log('🗺️ [ActivitiesPage] Final activities:', cityActivities);
      setActivities(cityActivities);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load activities. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [countryId, cityId]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    let total = 0;
    selectedActivities.forEach((selection) => {
      const activity = activities.find((a) => a.id === selection.activityId);
      if (activity) {
        const unitPrice =
          selection.durationType === 'HOURS' ? activity.pricePerHour : activity.pricePerDay;
        total += unitPrice * selection.durationValue * selection.quantity;
      }
    });
    return total;
  }, [selectedActivities, activities]);

  // Get selected activities data
  const selectedActivitiesData = useMemo(() => {
    return activities.filter((a) => selectedActivities.has(a.id));
  }, [activities, selectedActivities]);

  // Toggle activity selection
  const toggleActivity = (activityId: string) => {
    setSelectedActivities((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(activityId)) {
        newMap.delete(activityId);
      } else {
        const activity = activities.find((a) => a.id === activityId);
        const defaultDurationType = activity && activity.pricePerHour > 0 ? 'HOURS' : 'DAYS';
        newMap.set(activityId, {
          activityId,
          durationType: defaultDurationType,
          durationValue: 1,
          quantity: 1,
        });
      }
      return newMap;
    });
  };

  // Update activity selection
  const updateActivitySelection = (activityId: string, updates: Partial<ActivitySelection>) => {
    setSelectedActivities((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(activityId);
      if (current) {
        newMap.set(activityId, { ...current, ...updates });
      }
      return newMap;
    });
  };

  // Get price for activity
  const getActivityPrice = useCallback(
    (activityId: string): number => {
      const selection = selectedActivities.get(activityId);
      const activity = activities.find((a) => a.id === activityId);
      if (!selection || !activity) return 0;

      const unitPrice =
        selection.durationType === 'HOURS' ? activity.pricePerHour : activity.pricePerDay;
      return unitPrice * selection.durationValue * selection.quantity;
    },
    [selectedActivities, activities]
  );

  // Handle book trip
  const handleBookTrip = async () => {
    if (selectedActivities.size === 0 || !cityId) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/country/${countryId}/city/${cityId}` } });
      return;
    }

    setBooking(true);
    try {
      const activitiesWithPrices = Array.from(selectedActivities.values()).map((selection) => {
        const activity = activities.find((a) => a.id === selection.activityId);
        const unitPrice =
          selection.durationType === 'HOURS'
            ? (activity?.pricePerHour ?? 0)
            : (activity?.pricePerDay ?? 0);
        const totalPrice = unitPrice * selection.durationValue * selection.quantity;

        return {
          ...selection,
          activityName: activity?.name ?? '',
          unitPrice,
          totalPrice,
        };
      });

      const tripData: CreateTripRequest = {
        cityId,
        startDate,
        durationDays: 1,
        selectedActivities: activitiesWithPrices,
      };

      await tripAPI.create(tripData);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/trips');
      }, 2000);
    } catch (err) {
      console.error('Failed to create trip:', err);
      setError('Failed to book trip. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error && !city) {
    return <ErrorState error={error} countryId={countryId} onRetry={fetchData} />;
  }

  // Not found state
  if (!country || !city) {
    return <NotFoundState />;
  }

  // Success state
  if (showSuccess) {
    return <SuccessState />;
  }

  return (
    <div className="min-h-screen pb-32 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-30"></div>
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      {/* Hero Section */}
      <CityHero city={city} country={country} countryId={countryId!} />

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Map Section */}
        <div className="mb-8">
          <CityMapSection
            cityName={city.name}
            cityLat={city.latitude}
            cityLon={city.longitude}
            activities={activities.map(a => ({
              id: a.id,
              name: a.name,
              latitude: a.latitude || 0,
              longitude: a.longitude || 0,
              description: a.description
            }))}
            flyToActivityId={mapFlyToActivity}
            onActivitySelect={setMapFlyToActivity}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Activities List */}
          <ActivityList
            activities={activities}
            cityName={city.name}
            selectedActivities={selectedActivities}
            onToggleActivity={toggleActivity}
            onUpdateSelection={updateActivitySelection}
            getActivityPrice={getActivityPrice}
            onShowOnMap={setMapFlyToActivity}
            highlightedActivityId={mapFlyToActivity}
          />

          {/* Booking Sidebar */}
          <BookingSidebar
            startDate={startDate}
            onStartDateChange={setStartDate}
            selectedActivities={selectedActivities}
            selectedActivitiesData={selectedActivitiesData}
            totalPrice={totalPrice}
            getActivityPrice={getActivityPrice}
            error={error}
            booking={booking}
            isAuthenticated={isAuthenticated}
            onBookTrip={handleBookTrip}
            cityId={cityId}
            cityName={city.name}
            countryName={country.name}
            latitude={city.latitude}
            longitude={city.longitude}
          />
        </div>
      </div>
    </div>
  );
}

export default ActivitiesPage;
