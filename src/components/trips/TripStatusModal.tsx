import { useState } from 'react';
import { X, Plane, CheckCircle, Calendar, MapPin, Clock, Loader2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tripAPI, type ApiTrip } from '../../api';

interface TripStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: ApiTrip;
  type: 'start' | 'complete';
  onStatusUpdated: (updatedTrip: ApiTrip) => void;
}

/**
 * TripStatusModal - Modal for confirming trip start/complete actions
 *
 * BUSINESS RULES:
 * - START: Shows when current date === trip.startDate AND status === PLANNED
 *   - YES: Calls PUT /api/v1/trips/{tripId}/start → Status becomes ONGOING
 *   - NO: Closes modal, status remains PLANNED
 *
 * - COMPLETE: Shows when current date > trip.endDate AND status is ONGOING or PLANNED
 *   - YES: Calls PUT /api/v1/trips/{tripId}/complete → Status becomes COMPLETED
 *   - NO: Redirects to /trips/{tripId}/edit to extend end date
 */
export default function TripStatusModal({
  isOpen,
  onClose,
  trip,
  type,
  onStatusUpdated,
}: TripStatusModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      let updatedTrip: ApiTrip;

      if (type === 'start') {
        // Call PUT /api/v1/trips/{tripId}/start
        updatedTrip = await tripAPI.start(trip.id);
      } else {
        // Call PUT /api/v1/trips/{tripId}/complete
        updatedTrip = await tripAPI.complete(trip.id);
      }

      // Show success state briefly
      setSuccess(true);
      setLoading(false);

      // Wait a moment to show success, then close
      setTimeout(() => {
        onStatusUpdated(updatedTrip);
        onClose();
      }, 800);
    } catch (err) {
      console.error(`Failed to ${type} trip:`, err);
      setError(`Failed to ${type === 'start' ? 'start' : 'complete'} trip. Please try again.`);
      setLoading(false);
    }
  };

  const handleDecline = () => {
    if (type === 'complete') {
      // Redirect to edit page to extend end date
      onClose();
      navigate(`/trips?edit=${trip.id}`);
    } else {
      // For start trip, just close the modal
      onClose();
    }
  };

  // Prevent body scroll when modal is open
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  // Loading/Success overlay
  if (loading || success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Loading/Success Modal */}
        <div className="relative w-full max-w-sm bg-dark-card border border-dark-border rounded-2xl shadow-2xl p-8 text-center">
          {success ? (
            // Success State
            <>
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                type === 'start'
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                  : 'bg-gradient-to-br from-emerald-500 to-teal-500'
              } animate-success-pop`}>
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                {type === 'start' ? 'Trip Started!' : 'Trip Completed!'}
              </h3>
              <p className="text-text-secondary text-sm">
                {type === 'start'
                  ? 'Have an amazing journey!'
                  : 'Hope you had a great trip!'}
              </p>
            </>
          ) : (
            // Loading State
            <>
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                type === 'start'
                  ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/40'
                  : 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/40'
              }`}>
                <Loader2 className={`w-10 h-10 animate-spin ${
                  type === 'start' ? 'text-blue-400' : 'text-emerald-400'
                }`} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                {type === 'start' ? 'Starting Your Trip...' : 'Completing Your Trip...'}
              </h3>
              <p className="text-text-secondary text-sm">
                Please wait a moment
              </p>

              {/* Progress bar animation */}
              <div className="mt-6 h-1.5 bg-dark-elevated rounded-full overflow-hidden">
                <div className={`h-full rounded-full animate-progress ${
                  type === 'start'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`} />
              </div>
            </>
          )}
        </div>

        <style>{`
          @keyframes success-pop {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-success-pop {
            animation: success-pop 0.4s ease-out forwards;
          }
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .animate-progress {
            animation: progress 1.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-2xl shadow-2xl animate-modal-in">
        {/* Header */}
        <div className="relative p-6 pb-4">
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary hover:bg-dark-elevated rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            type === 'start'
              ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
              : 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30'
          }`}>
            {type === 'start' ? (
              <Plane className="w-8 h-8 text-blue-400" />
            ) : (
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-text-primary text-center mb-2">
            {type === 'start'
              ? 'Your Trip Starts Today!'
              : 'Your Trip Has Ended'}
          </h2>

          {/* Message */}
          <p className="text-text-secondary text-center text-sm">
            {type === 'start'
              ? 'Is your trip to ' + trip.cityName + ' starting now?'
              : 'Has your trip to ' + trip.cityName + ' been completed?'}
          </p>
        </div>

        {/* Trip Info */}
        <div className="px-6 py-4 bg-dark-elevated/50 border-y border-dark-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">{trip.cityName}</p>
              <p className="text-sm text-text-muted">{trip.country}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-text-muted">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(trip.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <Clock className="w-4 h-4" />
              <span>{trip.durationDays} days</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 pt-4 flex gap-3">
          {/* No/Decline Button */}
          <button
            onClick={handleDecline}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-dark-elevated hover:bg-dark-card border border-dark-border hover:border-dark-border/80 text-text-primary font-medium rounded-xl transition-all disabled:opacity-50"
          >
            {type === 'complete' ? 'No, Extend Trip' : 'No'}
          </button>

          {/* Yes/Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-3 font-medium rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
              type === 'start'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white'
            }`}
          >
            <span>{type === 'start' ? 'Yes, Start Trip' : 'Yes, Complete'}</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-in {
          animation: modal-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
