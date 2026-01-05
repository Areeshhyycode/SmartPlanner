import {
  Calendar,
  ShoppingCart,
  CheckCircle,
  LogIn,
} from 'lucide-react';
import { formatImageUrl } from '../../utils/imageHelpers';
import { type ActivitySelection } from './ActivityCard';
import type { ApiActivity } from '../../api';
import LoadingSpinner from '../common/LoadingSpinner';
import { TravelAssistant } from './TravelAssistant';
import { WeatherWarningCard } from './WeatherWarningCard';
import { PackingListCard } from './PackingListCard';

interface BookingSidebarProps {
  startDate: string;
  onStartDateChange: (date: string) => void;
  selectedActivities: Map<string, ActivitySelection>;
  selectedActivitiesData: ApiActivity[];
  totalPrice: number;
  getActivityPrice: (activityId: string) => number;
  error: string | null;
  booking: boolean;
  isAuthenticated: boolean;
  onBookTrip: () => void;
  cityId?: string;
  cityName?: string;
  countryName?: string;
  latitude?: number;
  longitude?: number;
}

export const BookingSidebar = ({
  startDate,
  onStartDateChange,
  selectedActivities,
  selectedActivitiesData,
  totalPrice,
  getActivityPrice,
  error,
  booking,
  isAuthenticated,
  onBookTrip,
  cityId,
  cityName,
  countryName,
  latitude,
  longitude,
}: BookingSidebarProps) => {
  const selectedActivityNames = selectedActivitiesData.map((a) => a.name);

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-4 space-y-4">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">Your Trip</h3>
          </div>

          <div className="mb-6">
            <label className="block text-text-secondary text-sm mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 bg-dark-elevated border border-dark-border rounded-lg text-text-primary focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none"
            />
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-text-secondary mb-3">
              Selected Activities ({selectedActivities.size})
            </h4>
            {selectedActivities.size > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedActivitiesData.map((activity) => {
                  const selection = selectedActivities.get(activity.id);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between py-2 px-3 bg-dark-elevated rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 bg-dark-card">
                          <img
                            src={formatImageUrl(activity.imageUrl, 100)}
                            alt={activity.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.nextElementSibling) {
                                (target.nextElementSibling as HTMLElement).style.display = 'flex';
                              }
                            }}
                          />
                          <div className="w-full h-full items-center justify-center text-xs text-text-muted hidden">
                            {activity.name.charAt(0)}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <span className="text-text-primary text-sm truncate block">
                            {activity.name}
                          </span>
                          <span className="text-text-muted text-xs">
                            {selection?.durationValue}{' '}
                            {selection?.durationType === 'HOURS' ? 'hr' : 'day'}
                            {(selection?.durationValue || 0) > 1 ? 's' : ''} x{' '}
                            {selection?.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="text-text-muted text-sm flex-shrink-0 ml-2">
                        ${getActivityPrice(activity.id).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-text-muted text-sm py-4 text-center">
                No activities selected yet
              </p>
            )}
          </div>

          <div className="border-t border-dark-border pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Total</span>
              <span className="text-2xl font-bold text-blue-400">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={onBookTrip}
            disabled={selectedActivities.size === 0 || booking}
            className={`w-full py-4 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              selectedActivities.size > 0 && !booking
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-dark-elevated text-text-muted cursor-not-allowed'
            }`}
          >
            {booking ? (
              <>
                <LoadingSpinner />
                Booking...
              </>
            ) : selectedActivities.size > 0 ? (
              isAuthenticated ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Book Trip
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 text-white" />
                  Login to Book
                </>
              )
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Select Activities
              </>
            )}
          </button>

          <p className="text-text-muted text-xs text-center mt-3">
            {isAuthenticated
              ? 'Your trip will be saved to My Trips'
              : 'Login required to book your trip'}
          </p>
        </div>

        {/* Weather Alerts */}
        {(cityId || cityName) && (
          <WeatherWarningCard
            cityId={cityId}
            cityName={cityName}
            latitude={latitude}
            longitude={longitude}
          />
        )}

        {/* Packing Suggestions */}
        {(cityId || cityName) && (
          <PackingListCard
            cityId={cityId}
            cityName={cityName}
            latitude={latitude}
            longitude={longitude}
          />
        )}

        {/* Travel Assistant */}
        {cityName && countryName && (
          <TravelAssistant
            cityName={cityName}
            countryName={countryName}
            latitude={latitude}
            longitude={longitude}
            selectedActivityNames={selectedActivityNames}
          />
        )}
      </div>
    </div>
  );
};

export default BookingSidebar;