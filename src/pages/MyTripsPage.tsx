import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plane,
  MapPin,
  Calendar,
  Compass,
  XCircle,
  Trash2,
  AlertCircle,
  RefreshCw,
  Clock,
  Sparkles,
  DollarSign,
  ChevronDown,
  Users,
  ArrowRight,
  Edit,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { tripAPI, countdownAPI, type ApiTrip, type CreateTripRequest, type TripCountdown } from '../api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EditTripModal from '../components/trips/EditTripModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Alert from '../components/common/Alert';
import TripStatusModal from '../components/trips/TripStatusModal';
import TripCountdownComponent from '../components/trips/TripCountdown';

function ExpandableContent({
  isExpanded,
  children
}: {
  isExpanded: boolean;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-out"
      style={{ height }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

// Trip card status badge with pulse animation
function StatusBadge({ status }: { status: ApiTrip['status'] | 'ONGOING' }) {
  const config = {
    PLANNED: { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400', label: 'Planned' },
    CONFIRMED: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Confirmed' },
    IN_PROGRESS: { bg: 'bg-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400', label: 'In Progress', pulse: true },
    ONGOING: { bg: 'bg-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400', label: 'Ongoing', pulse: true },
    COMPLETED: { bg: 'bg-slate-500/20', text: 'text-slate-400', dot: 'bg-slate-400', label: 'Completed' },
    CANCELLED: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400', label: 'Cancelled' },
  }[status] || { bg: 'bg-slate-500/20', text: 'text-slate-400', dot: 'bg-slate-400', label: status };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${config.bg} rounded-full`}>
      <span className={`relative flex h-2 w-2`}>
        {config.pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-75`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`}></span>
      </span>
      <span className={`text-xs font-semibold ${config.text}`}>{config.label}</span>
    </div>
  );
}

// Single trip card component
function TripCard({
  trip,
  isExpanded,
  onToggle,
  onCancel,
  onDelete,
  onEdit,
  isProcessing,
  index,
}: {
  trip: ApiTrip;
  isExpanded: boolean;
  onToggle: () => void;
  onCancel: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  isProcessing: boolean;
  index: number;
}) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateDays = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const total = trip.totalCost && trip.totalCost > 0
    ? trip.totalCost
    : trip.selectedActivities?.reduce((sum, a) => sum + (a.subtotal ?? 0), 0) || 0;

  const canEdit = trip.status !== 'CANCELLED' && trip.status !== 'COMPLETED';
  const canCancel = trip.status !== 'CANCELLED' && trip.status !== 'COMPLETED';
  const canDelete = trip.status === 'CANCELLED';

  return (
    <div
      className={`group bg-dark-card/80 backdrop-blur-sm border rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500 ${
        isExpanded
          ? 'border-blue-500/40 shadow-lg shadow-blue-500/10'
          : 'border-dark-border hover:border-blue-500/30'
      }`}
      style={{
        animationName: 'fadeInUp',
        animationDuration: '0.5s',
        animationTimingFunction: 'ease-out',
        animationFillMode: 'forwards',
        animationDelay: `${index * 100}ms`,
        opacity: 0,
      }}
    >
      {/* Main Card Header */}
      <div
        className="p-3 sm:p-5 cursor-pointer select-none"
        onClick={onToggle}
      >
        {/* Mobile Layout */}
        <div className="flex flex-col sm:hidden gap-3">
          <div className="flex items-start gap-3">
            {/* Location Icon with gradient */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              {trip.status === 'IN_PROGRESS' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-dark-card animate-pulse" />
              )}
            </div>

            {/* Trip Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-base font-bold text-text-primary truncate group-hover:text-blue-400 transition-colors">
                  {trip.cityName}
                </h3>
                <ArrowRight className="w-3 h-3 text-text-muted flex-shrink-0" />
                <span className="text-text-secondary text-xs truncate">{trip.country}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <div className="flex items-center gap-1 text-text-muted">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatShortDate(trip.startDate)}</span>
                  <span className="text-text-muted/50">•</span>
                  <span>{calculateDays()}d</span>
                </div>
                <div className="flex items-center gap-1 text-text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{trip.selectedActivities?.length || 0} act.</span>
                </div>
              </div>
            </div>

            {/* Expand button for mobile */}
            <div className={`p-1.5 text-text-muted transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>

          {/* Price & Actions Row for Mobile */}
          <div className="flex items-center justify-between pl-15">
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ${total.toFixed(2)}
              </p>
              <StatusBadge status={trip.status} />
            </div>
            <div className="flex items-center gap-2">
              {canEdit && (
                <button
                  onClick={onEdit}
                  className="p-2 bg-dark-elevated/80 hover:bg-blue-500/20 active:bg-[#1a9eff] focus:bg-[#1a9eff] border border-dark-border hover:border-blue-500/40 active:border-[#1a9eff] focus:border-[#1a9eff] rounded-lg text-text-muted hover:text-blue-400 active:text-white focus:text-white transition-all duration-200"
                  title="Edit Trip"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {canCancel && (
                <button
                  onClick={onCancel}
                  disabled={isProcessing}
                  className="p-2 bg-dark-elevated/80 hover:bg-amber-500/20 active:bg-[#1a9eff] focus:bg-[#1a9eff] border border-dark-border hover:border-amber-500/40 active:border-[#1a9eff] focus:border-[#1a9eff] rounded-lg text-text-muted hover:text-amber-400 active:text-white focus:text-white transition-all duration-200 disabled:opacity-50"
                  title="Cancel Trip"
                >
                  {isProcessing ? (
                    <LoadingSpinner />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                </button>
              )}
              {canDelete && (
                <button
                  onClick={onDelete}
                  disabled={isProcessing}
                  className="p-2 bg-dark-elevated/80 hover:bg-red-500/20 active:bg-[#1a9eff] focus:bg-[#1a9eff] border border-dark-border hover:border-red-500/40 active:border-[#1a9eff] focus:border-[#1a9eff] rounded-lg text-text-muted hover:text-red-400 active:text-white focus:text-white transition-all duration-200 disabled:opacity-50"
                  title="Delete Trip"
                >
                  {isProcessing ? (
                    <LoadingSpinner />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Location Icon with gradient */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow duration-300">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            {trip.status === 'IN_PROGRESS' && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-dark-card animate-pulse" />
            )}
          </div>

          {/* Trip Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-lg font-bold text-text-primary truncate group-hover:text-blue-400 transition-colors">
                {trip.cityName}
              </h3>
              <ArrowRight className="w-4 h-4 text-text-muted flex-shrink-0" />
              <span className="text-text-secondary text-sm truncate">{trip.country}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-text-muted">
                <Calendar className="w-4 h-4" />
                <span>{formatShortDate(trip.startDate)}</span>
                <span className="text-text-muted/50">•</span>
                <span>{calculateDays()} days</span>
              </div>
              <div className="flex items-center gap-1.5 text-text-muted">
                <Clock className="w-4 h-4" />
                <span>{trip.selectedActivities?.length || 0} activities</span>
              </div>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ${total.toFixed(2)}
              </p>
              <StatusBadge status={trip.status} />
            </div>

            {/* Edit, Cancel, Delete & Expand buttons */}
            <div className="flex items-center gap-2">
              {canEdit && (
                <button
                  onClick={onEdit}
                  className="p-2.5 bg-dark-elevated/80 hover:bg-blue-500/20 active:bg-[#1a9eff] focus:bg-[#1a9eff] border border-dark-border hover:border-blue-500/40 active:border-[#1a9eff] focus:border-[#1a9eff] rounded-xl text-text-muted hover:text-blue-400 active:text-white focus:text-white transition-all duration-200 hover:scale-105 active:scale-95"
                  title="Edit Trip"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {canCancel && (
                <button
                  onClick={onCancel}
                  disabled={isProcessing}
                  className="p-2.5 bg-dark-elevated/80 hover:bg-amber-500/20 active:bg-[#1a9eff] focus:bg-[#1a9eff] border border-dark-border hover:border-amber-500/40 active:border-[#1a9eff] focus:border-[#1a9eff] rounded-xl text-text-muted hover:text-amber-400 active:text-white focus:text-white transition-all duration-200 disabled:opacity-50 hover:scale-105 active:scale-95"
                  title="Cancel Trip"
                >
                  {isProcessing ? (
                    <LoadingSpinner />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                </button>
              )}
              {canDelete && (
                <button
                  onClick={onDelete}
                  disabled={isProcessing}
                  className="p-2.5 bg-dark-elevated/80 hover:bg-red-500/20 active:bg-[#1a9eff] focus:bg-[#1a9eff] border border-dark-border hover:border-red-500/40 active:border-[#1a9eff] focus:border-[#1a9eff] rounded-xl text-text-muted hover:text-red-400 active:text-white focus:text-white transition-all duration-200 disabled:opacity-50 hover:scale-105 active:scale-95"
                  title="Delete Trip"
                >
                  {isProcessing ? (
                    <LoadingSpinner />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              )}
              <div className={`p-2.5 text-text-muted transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      <ExpandableContent isExpanded={isExpanded}>
        <div className="px-3 sm:px-5 pb-3 sm:pb-5 border-t border-dark-border/50">
          {/* Trip Stats */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 py-3 sm:py-4">
            <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-lg sm:rounded-xl">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mx-auto mb-1 sm:mb-1.5" />
                                                                                                                                                                                                                                          <p className="text-[10px] sm:text-xs text-text-muted mb-0.5">Start Date</p>
              <p className="text-xs sm:text-sm font-semibold text-text-primary">{formatDate(trip.startDate)}</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-lg sm:rounded-xl">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mx-auto mb-1 sm:mb-1.5" />
              <p className="text-[10px] sm:text-xs text-text-muted mb-0.5">End Date</p>
              <p className="text-xs sm:text-sm font-semibold text-text-primary">{formatDate(trip.endDate)}</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-lg sm:rounded-xl">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mx-auto mb-1 sm:mb-1.5" />
              <p className="text-[10px] sm:text-xs text-text-muted mb-0.5">Duration</p>
              <p className="text-xs sm:text-sm font-semibold text-text-primary">{calculateDays()} Days</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-lg sm:rounded-xl">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mx-auto mb-1 sm:mb-1.5" />
              <p className="text-[10px] sm:text-xs text-text-muted mb-0.5">Activities</p>
              <p className="text-xs sm:text-sm font-semibold text-text-primary">{trip.selectedActivities?.length || 0}</p>
            </div>
          </div>

          {/* Activities List */}
          {trip.selectedActivities && trip.selectedActivities.length > 0 && (
            <div className="mt-1 sm:mt-2">
              <h4 className="text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                Booked Activities
              </h4>
              <div className="space-y-2">
                {trip.selectedActivities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 sm:p-3.5 bg-dark-elevated/60 hover:bg-dark-elevated/80 border border-dark-border/50 rounded-lg sm:rounded-xl transition-colors group/item"
                    style={isExpanded ? {
                      animationName: 'fadeInUp',
                      animationDuration: '0.3s',
                      animationTimingFunction: 'ease-out',
                      animationFillMode: 'forwards',
                      animationDelay: `${idx * 50}ms`,
                    } : undefined}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-text-primary group-hover/item:text-blue-400 transition-colors truncate">
                          {activity.activityName}
                        </p>
                        <p className="text-[10px] sm:text-xs text-text-muted">
                          {activity.durationValue} {activity.durationType.toLowerCase()}
                          {activity.durationValue > 1 ? 's' : ''} × {activity.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-blue-400 flex-shrink-0 ml-2">
                      ${(activity.subtotal ?? 0).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total Price */}
              <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-dark-border/50">
                <span className="text-xs sm:text-sm font-medium text-text-secondary">Total Trip Cost</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Booking info footer */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-dark-border/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] sm:text-xs text-text-muted">
            <span>Booked on {formatDate(trip.createdAt)}</span>
            <span className="px-2 py-1 bg-dark-elevated rounded-lg">Trip ID: {trip.id.slice(0, 8)}</span>
          </div>
        </div>
      </ExpandableContent>
    </div>
  );
}

// Pagination constants
const TRIPS_PER_PAGE = 6;

/**
 * Helper function to get today's date in ISO format (YYYY-MM-DD)
 * Used for date comparisons with trip start/end dates
 */
const getTodayISO = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Check if a trip should show the "Start Trip?" prompt
 * Business Rule: Show when currentDate === trip.startDate AND status === PLANNED
 */
const shouldShowStartPrompt = (trip: ApiTrip): boolean => {
  if (trip.status !== 'PLANNED') return false;
  const today = getTodayISO();
  const startDate = trip.startDate.split('T')[0]; // Handle ISO date strings
  return today === startDate;
};

/**
 * Check if a trip should show the "Complete Trip?" prompt
 * Business Rule: Show when currentDate > trip.endDate AND status is ONGOING or PLANNED
 */
const shouldShowCompletePrompt = (trip: ApiTrip): boolean => {
  const status = trip.status as string;
  if (status !== 'ONGOING' && status !== 'IN_PROGRESS' && status !== 'PLANNED') return false;
  const today = getTodayISO();
  const endDate = trip.endDate.split('T')[0]; // Handle ISO date strings
  return today > endDate;
};

function MyTripsPage() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [countdowns, setCountdowns] = useState<TripCountdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);
  const [editingTrip, setEditingTrip] = useState<ApiTrip | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'cancel' | 'delete';
    tripId: string;
    tripName: string;
  } | null>(null);

  // State for trip status modals (start/complete confirmations)
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: 'start' | 'complete';
    trip: ApiTrip;
  } | null>(null);

  // Track which trips have already shown their alerts (to avoid duplicates)
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Filter trips by status
  const filteredTrips = statusFilter === 'all'
    ? trips
    : trips.filter(trip => trip.status === statusFilter);

  // Paginate trips
  const totalPages = Math.ceil(filteredTrips.length / TRIPS_PER_PAGE);
  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * TRIPS_PER_PAGE,
    currentPage * TRIPS_PER_PAGE
  );

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const fetchTrips = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fetch trips and countdowns in parallel
      const [tripsData, countdownData] = await Promise.all([
        tripAPI.getAll(),
        countdownAPI.getMyTrips().catch(() => [] as TripCountdown[]), // Gracefully handle countdown API failure
      ]);
      setTrips(tripsData);
      setCountdowns(countdownData);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
      setError('Failed to load your trips. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Silent refresh without loading state - used after updates
  const refreshTripsSilently = async () => {
    console.log('🔄 [MyTripsPage] refreshTripsSilently called');
    if (!isAuthenticated) {
      console.log('⚠️ [MyTripsPage] Not authenticated, skipping refresh');
      return;
    }
    try {
      console.log('🔄 [MyTripsPage] Fetching trips...');
      const data = await tripAPI.getAll();
      console.log('✅ [MyTripsPage] Trips fetched:', data.length, 'trips');
      
      // Log activities for each trip
      data.forEach((trip, idx) => {
        if (trip.selectedActivities && trip.selectedActivities.length > 0) {
          console.log(`📊 [MyTripsPage] Trip ${idx + 1} (${trip.id}) activities:`, 
            trip.selectedActivities.map(a => ({
              name: a.activityName,
              type: a.durationType,
              value: a.durationValue,
              quantity: a.quantity,
            }))
          );
        }
      });
      
      console.log('🔄 [MyTripsPage] Updating trips state with fresh data...');
      setTrips(data);
      console.log('✅ [MyTripsPage] Trips state updated');
    } catch (err) {
      console.error('❌ [MyTripsPage] Failed to refresh trips:', err);
      // Don't set error state for silent refresh
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [isAuthenticated]);

  // Handle edit from URL parameter (e.g., /trips?edit=tripId)
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && trips.length > 0) {
      const tripToEdit = trips.find((t) => t.id === editId);
      if (tripToEdit) {
        setEditingTrip(tripToEdit);
        // Clear the URL parameter after opening the modal
        setSearchParams({});
      }
    }
  }, [searchParams, trips, setSearchParams]);

  // Check for trips that need status alerts (start/complete prompts)
  // This runs after trips are loaded and checks business rules
  useEffect(() => {
    if (trips.length === 0 || loading) return;

    // Find trips that need alerts (excluding already dismissed ones)
    for (const trip of trips) {
      // Skip cancelled trips - no alerts for them
      if (trip.status === 'CANCELLED') continue;

      // Skip if already dismissed
      if (dismissedAlerts.has(`start-${trip.id}`) || dismissedAlerts.has(`complete-${trip.id}`)) {
        continue;
      }

      // Check for "Complete Trip?" alert first (higher priority)
      if (shouldShowCompletePrompt(trip)) {
        setStatusModal({
          isOpen: true,
          type: 'complete',
          trip,
        });
        // Mark as shown to avoid duplicate
        setDismissedAlerts((prev) => new Set(prev).add(`complete-${trip.id}`));
        break; // Only show one alert at a time
      }

      // Check for "Start Trip?" alert
      if (shouldShowStartPrompt(trip)) {
        setStatusModal({
          isOpen: true,
          type: 'start',
          trip,
        });
        // Mark as shown to avoid duplicate
        setDismissedAlerts((prev) => new Set(prev).add(`start-${trip.id}`));
        break; // Only show one alert at a time
      }
    }
  }, [trips, loading, dismissedAlerts]);

  // Debug: Log trips state changes
  useEffect(() => {
    console.log('📊 [MyTripsPage] Trips state updated:', trips.length, 'trips');
    console.log('📊 [MyTripsPage] Trips:', trips);
  }, [trips]);

  const handleCancelTrip = (tripId: string, tripName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDialog({
      isOpen: true,
      type: 'cancel',
      tripId,
      tripName,
    });
  };

  const handleDeleteTrip = (tripId: string, tripName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDialog({
      isOpen: true,
      type: 'delete',
      tripId,
      tripName,
    });
  };

  const confirmAction = async () => {
    if (!confirmDialog) return;

    const { type, tripId } = confirmDialog;
    setProcessingId(tripId);
    setError(null);

    try {
      if (type === 'cancel') {
        // Cancel trip - update status to CANCELLED
        await tripAPI.cancel(tripId);
        // Update the trip status in state instead of removing it
        setTrips((prev) =>
          prev.map((t) =>
            t.id === tripId ? { ...t, status: 'CANCELLED' as ApiTrip['status'] } : t
          )
        );
      } else {
        // Delete trip - permanently remove it
        await tripAPI.cancel(tripId);
        // Remove from state
        setTrips((prev) => prev.filter((t) => t.id !== tripId));
      }
    } catch (err) {
      console.error(`Failed to ${type} trip:`, err);
      setError(`Failed to ${type} trip. Please try again.`);
    } finally {
      setProcessingId(null);
      setConfirmDialog(null);
    }
  };

  const handleEditTrip = (trip: ApiTrip, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('✏️ [MyTripsPage] Opening edit modal for trip:', trip.id);
    console.log('✏️ [MyTripsPage] Trip details:', trip);
    setEditingTrip(trip);
  };

  const handleUpdateTrip = async (
    tripId: string,
    startDate: string,
    durationDays: number,
    activities: any[]
  ) => {
    console.log('🔄 [MyTripsPage] handleUpdateTrip called');
    console.log('🔄 [MyTripsPage] Trip ID:', tripId);
    console.log('🔄 [MyTripsPage] Start Date:', startDate);
    console.log('🔄 [MyTripsPage] Duration Days:', durationDays);
    console.log('🔄 [MyTripsPage] Activities:', activities);

    const trip = trips.find((t) => t.id === tripId);
    if (!trip) {
      console.error('❌ [MyTripsPage] Trip not found:', tripId);
      throw new Error('Trip not found');
    }

    console.log('🔄 [MyTripsPage] Found trip:', trip);

    // Prepare the update request - same format as CREATE
    // PUT /api/v1/trips/{id} - Full update with all fields
    console.log('🔄 [MyTripsPage] Mapping activities for update request...');
    const mappedActivities = activities.map((activity, idx) => {
      const mapped = {
        activityId: activity.activityId,
        durationType: activity.durationType as 'HOURS' | 'DAYS',
        durationValue: activity.durationValue,
        quantity: activity.quantity,
        unitPrice: activity.unitPrice,
        // Optional fields (backend may calculate these, but we send them for consistency)
        totalPrice: activity.totalPrice,
        activityName: activity.activityName,
      };
      
      // Detailed logging for HOURS vs DAYS
      const isHours = mapped.durationType === 'HOURS';
      console.log(`🔄 [MyTripsPage] Activity ${idx + 1} (${isHours ? 'HOURS' : 'DAYS'}):`, {
        activityId: mapped.activityId,
        activityName: mapped.activityName,
        durationType: mapped.durationType,
        durationValue: mapped.durationValue,
        quantity: mapped.quantity,
        unitPrice: mapped.unitPrice,
        totalPrice: mapped.totalPrice,
        calculation: `${mapped.unitPrice} × ${mapped.durationValue} ${isHours ? 'hours' : 'days'} × ${mapped.quantity} = ${mapped.totalPrice}`,
      });
      
      // Warn if durationType is HOURS but unitPrice seems wrong
      if (isHours && mapped.unitPrice && mapped.unitPrice > 100) {
        console.warn(`⚠️ [MyTripsPage] Activity ${idx + 1} is HOURS but unitPrice (${mapped.unitPrice}) seems high. Might be DAYS price?`);
      }
      
      return mapped;
    });
    
    // Summary log
    const hoursCount = mappedActivities.filter(a => a.durationType === 'HOURS').length;
    const daysCount = mappedActivities.filter(a => a.durationType === 'DAYS').length;
    console.log(`📊 [MyTripsPage] Activities summary: ${hoursCount} HOURS, ${daysCount} DAYS`);

    const updateRequest: CreateTripRequest = {
      cityId: trip.cityId,
      startDate: startDate, // ISO date format: "2025-01-15"
      durationDays: durationDays,
      selectedActivities: mappedActivities,
    };

    console.log('🔄 [MyTripsPage] Update Request:', JSON.stringify(updateRequest, null, 2));
    console.log('🔄 [MyTripsPage] Calling tripAPI.update...');

    try {
      // PUT request to /api/v1/trips/{id}
      const updatedTrip = await tripAPI.update(tripId, updateRequest);
      console.log('✅ [MyTripsPage] API update successful');
      console.log('✅ [MyTripsPage] Updated Trip:', updatedTrip);
      
      // Verify activities in response
      if (updatedTrip.selectedActivities) {
        console.log('✅ [MyTripsPage] Response activities count:', updatedTrip.selectedActivities.length);
        updatedTrip.selectedActivities.forEach((activity, idx) => {
          console.log(`✅ [MyTripsPage] Response Activity ${idx + 1}:`, {
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
      
      // Update the trips list with the updated trip immediately
      console.log('🔄 [MyTripsPage] Updating trips state...');
      setTrips((prev) => {
        const updated = prev.map((t) => {
          if (t.id === tripId) {
            console.log('🔄 [MyTripsPage] Replacing trip:', t.id);
            console.log('🔄 [MyTripsPage] Old activities:', t.selectedActivities);
            console.log('🔄 [MyTripsPage] New activities:', updatedTrip.selectedActivities);
            return updatedTrip;
          }
          return t;
        });
        console.log('🔄 [MyTripsPage] Previous trips count:', prev.length);
        console.log('🔄 [MyTripsPage] Updated trips count:', updated.length);
        return updated;
      });
      
      console.log('🔄 [MyTripsPage] Closing edit modal...');
      setEditingTrip(null);
      
      // Silently refresh trips list to ensure all calculated fields are up to date
      console.log('🔄 [MyTripsPage] Refreshing trips silently...');
      await refreshTripsSilently();
      
      console.log('✅ [MyTripsPage] handleUpdateTrip completed successfully');
    } catch (err) {
      console.error('❌ [MyTripsPage] Failed to update trip:', err);
      if (err instanceof Error) {
        console.error('❌ [MyTripsPage] Error message:', err.message);
        console.error('❌ [MyTripsPage] Error stack:', err.stack);
      }
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any;
        console.error('❌ [MyTripsPage] Response status:', axiosError.response?.status);
        console.error('❌ [MyTripsPage] Response data:', axiosError.response?.data);
      }
      throw err; // Re-throw to be caught by the modal
    }
  };

  /**
   * Handle trip status update from TripStatusModal
   * Called when user confirms start or complete action
   */
  const handleStatusUpdate = (updatedTrip: ApiTrip) => {
    // Update the trip in state with new status
    setTrips((prev) =>
      prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
    );
    // Close the status modal
    setStatusModal(null);
    // Refresh to get updated countdown data
    refreshTripsSilently();
  };

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30"></div>
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative text-center max-w-md animate-fade-in px-4">
          <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl shadow-blue-500/30 animate-float">
            <Plane className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-text-primary mb-3 sm:mb-4">
            Your Adventures Await
          </h2>
          <p className="text-text-secondary text-base sm:text-lg mb-8 sm:mb-10">
            Sign in to view your booked trips and manage your travel plans.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white font-semibold rounded-xl sm:rounded-2xl shadow-xl shadow-blue-500/30 transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/40 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40"
          >
            <span className="text-sm sm:text-base">Sign In to Continue</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </Link>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-fade-in { animation: fadeIn 0.6s ease-out; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-8 px-3 sm:px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-30"></div>
      <div className="absolute top-20 right-1/4 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-blue-500/8 rounded-full blur-[80px] sm:blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-20 left-1/4 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-purple-500/8 rounded-full blur-[60px] sm:blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Trip Management</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-1.5 sm:mb-2">
                My <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Trips</span>
              </h1>
              <p className="text-text-secondary text-xs sm:text-sm md:text-base">
                {trips.length > 0
                  ? `You have ${trips.length} adventure${trips.length > 1 ? 's' : ''} planned`
                  : 'Your travel adventures will appear here'}
              </p>
            </div>
            <Link
              to="/explore"
              className="group inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40 transition-all hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-45 transition-transform duration-300 text-white" />
              <span className='text-white'>Plan New Trip</span>
            </Link>
          </div>
        </div>

        {/* Filter Tabs - Only show when there are trips */}
        {!loading && !error && trips.length > 0 && (
          <div className="mb-4 sm:mb-6 animate-fade-in">
            {/* Mobile: Stacked layout with Filter label on top */}
            <div className="flex flex-col gap-2 sm:hidden">
              <div className="flex items-center gap-1.5 text-text-muted">
                <Filter className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Filter by status:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { value: 'all', label: 'All', count: trips.length },
                  { value: 'PLANNED', label: 'Planned', count: trips.filter(t => t.status === 'PLANNED').length },
                  { value: 'CONFIRMED', label: 'Confirmed', count: trips.filter(t => t.status === 'CONFIRMED').length },
                  { value: 'IN_PROGRESS', label: 'Active', count: trips.filter(t => t.status === 'IN_PROGRESS').length },
                  { value: 'COMPLETED', label: 'Done', count: trips.filter(t => t.status === 'COMPLETED').length },
                  { value: 'CANCELLED', label: 'Cancelled', count: trips.filter(t => t.status === 'CANCELLED').length },
                ].filter(f => f.value === 'all' || f.count > 0).map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setStatusFilter(filter.value)}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      statusFilter === filter.value
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        : 'bg-dark-elevated/50 text-text-muted hover:text-text-primary border border-dark-border active:border-blue-500/40'
                    }`}
                  >
                    <span>{filter.label}</span>
                    <span className={`px-1 py-0.5 rounded text-[9px] ${
                      statusFilter === filter.value
                        ? 'bg-blue-500/30 text-blue-300'
                        : 'bg-dark-border text-text-muted'
                    }`}>
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop: Horizontal layout */}
            <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex items-center gap-1.5 mr-2 text-text-muted">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium whitespace-nowrap">Filter:</span>
              </div>
              {[
                { value: 'all', label: 'All', count: trips.length },
                { value: 'PLANNED', label: 'Planned', count: trips.filter(t => t.status === 'PLANNED').length },
                { value: 'CONFIRMED', label: 'Confirmed', count: trips.filter(t => t.status === 'CONFIRMED').length },
                { value: 'IN_PROGRESS', label: 'In Progress', count: trips.filter(t => t.status === 'IN_PROGRESS').length },
                { value: 'COMPLETED', label: 'Completed', count: trips.filter(t => t.status === 'COMPLETED').length },
                { value: 'CANCELLED', label: 'Cancelled', count: trips.filter(t => t.status === 'CANCELLED').length },
              ].filter(f => f.value === 'all' || f.count > 0).map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    statusFilter === filter.value
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'bg-dark-elevated/50 text-text-muted hover:text-text-primary border border-dark-border hover:border-dark-border/80'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-xs ${
                    statusFilter === filter.value
                      ? 'bg-blue-500/30 text-blue-300'
                      : 'bg-dark-border text-text-muted'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 animate-pulse">
              <Plane className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 animate-bounce" />
            </div>
            <p className="text-text-secondary text-base sm:text-lg">Loading your trips...</p>
            <div className="mt-3 sm:mt-4 flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center animate-fade-in">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 sm:mb-3">Unable to Load Trips</h3>
            <p className="text-text-secondary text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchTrips}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-dark-elevated hover:bg-dark-card border border-dark-border hover:border-red-500/50 text-text-primary text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              Try Again
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        {/* Upcoming Trip Countdown Section - Only show for upcoming PLANNED trips */}
        {!loading && !error && countdowns.length > 0 && (
          <div className="mb-6 space-y-4">
            {countdowns
              .filter((c) => !c.isTripStarted && c.status === 'PLANNED')
              .slice(0, 2) // Show max 2 countdown timers
              .map((countdown) => (
                <TripCountdownComponent
                  key={countdown.tripId}
                  countdown={countdown}
                />
              ))}
          </div>
        )}

        {/* Trips List */}
        {!loading && !error && (
          <div className="space-y-3 sm:space-y-4">
            {trips.length > 0 ? (
              <>
                {/* Show filtered empty state */}
                {filteredTrips.length === 0 ? (
                  <div className="text-center py-10 sm:py-16 animate-fade-in">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <Filter className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-2 sm:mb-3">
                      No {statusFilter !== 'all' ? statusFilter.toLowerCase().replace('_', ' ') : ''} trips
                    </h3>
                    <p className="text-text-secondary text-sm sm:text-base mb-4 sm:mb-6">
                      Try selecting a different filter to see your trips
                    </p>
                    <button
                      onClick={() => setStatusFilter('all')}
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-dark-elevated hover:bg-dark-card border border-dark-border hover:border-blue-500/50 text-text-primary text-sm sm:text-base font-medium rounded-lg sm:rounded-xl transition-all"
                    >
                      View all trips
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Trip Cards */}
                    {paginatedTrips.map((trip, index) => (
                      <TripCard
                        key={trip.id}
                        trip={trip}
                        index={index}
                        isExpanded={expandedTrip === trip.id}
                        onToggle={() => setExpandedTrip(expandedTrip === trip.id ? null : trip.id)}
                        onCancel={(e) => handleCancelTrip(trip.id, trip.cityName, e)}
                        onDelete={(e) => handleDeleteTrip(trip.id, trip.cityName, e)}
                        onEdit={(e) => handleEditTrip(trip, e)}
                        isProcessing={processingId === trip.id}
                      />
                    ))}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 mt-2 border-t border-dark-border/50">
                        <p className="text-xs sm:text-sm text-text-muted order-2 sm:order-1">
                          Showing {(currentPage - 1) * TRIPS_PER_PAGE + 1}-{Math.min(currentPage * TRIPS_PER_PAGE, filteredTrips.length)} of {filteredTrips.length} trips
                        </p>
                        <div className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2">
                          <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 sm:p-2.5 bg-dark-elevated hover:bg-dark-card border border-dark-border hover:border-blue-500/50 rounded-lg sm:rounded-xl text-text-muted hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            aria-label="Previous page"
                          >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>

                          {/* Page Numbers */}
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                              // Show first, last, current, and adjacent pages
                              const showPage = page === 1 || page === totalPages ||
                                Math.abs(page - currentPage) <= 1;
                              const showEllipsis = (page === 2 && currentPage > 3) ||
                                (page === totalPages - 1 && currentPage < totalPages - 2);

                              if (!showPage && !showEllipsis) return null;
                              if (showEllipsis && !showPage) {
                                return (
                                  <span key={page} className="px-1 sm:px-2 text-text-muted text-xs sm:text-sm">
                                    ...
                                  </span>
                                );
                              }

                              return (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2 sm:px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                                    currentPage === page
                                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                      : 'bg-dark-elevated hover:bg-dark-card border border-dark-border hover:border-blue-500/50 text-text-muted hover:text-text-primary'
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            })}
                          </div>

                          <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 sm:p-2.5 bg-dark-elevated hover:bg-dark-card border border-dark-border hover:border-blue-500/50 rounded-lg sm:rounded-xl text-text-muted hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            aria-label="Next page"
                          >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-12 sm:py-20 animate-fade-in">
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-5 sm:mb-8 animate-float">
                  <Plane className="w-10 h-10 sm:w-14 sm:h-14 text-blue-400" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-2 sm:mb-3">
                  No Trips Yet
                </h3>
                <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto mb-6 sm:mb-8 px-4">
                  Start exploring amazing destinations and book your first adventure!
                </p>
                <Link
                  to="/explore"
                  className="group inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-2.5 sm:py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl shadow-xl shadow-blue-500/30 transition-all transform hover:-translate-y-1 hover:shadow-2xl active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40"
                >
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-45 transition-transform duration-300 text-white" />
                  <span className='text-white'>Explore Destinations</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform text-white" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-fade-in { animation: fadeInUp 0.5s ease-out; }
      `}</style>

      {/* Edit Trip Modal */}
      {editingTrip && (
        <EditTripModal
          trip={editingTrip}
          isOpen={!!editingTrip}
          onClose={() => setEditingTrip(null)}
          onSave={handleUpdateTrip}
        />
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog(null)}
          onConfirm={confirmAction}
          title={confirmDialog.type === 'cancel' ? 'Cancel Trip?' : 'Delete Trip?'}
          message={
            confirmDialog.type === 'cancel'
              ? `Are you sure you want to cancel your trip to ${confirmDialog.tripName}? You can delete it later if needed.`
              : `Are you sure you want to permanently delete your trip to ${confirmDialog.tripName}? This action cannot be undone.`
          }
          confirmText="Yes"
          cancelText="No"
          variant={confirmDialog.type === 'cancel' ? 'warning' : 'danger'}
        />
      )}

      {/* Trip Status Modal - Start/Complete confirmations */}
      {statusModal && (
        <TripStatusModal
          isOpen={statusModal.isOpen}
          onClose={() => setStatusModal(null)}
          trip={statusModal.trip}
          type={statusModal.type}
          onStatusUpdated={handleStatusUpdate}
        />
      )}
    </div>
  );
}

export default MyTripsPage;
