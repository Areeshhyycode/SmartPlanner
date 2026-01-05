import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, XCircle } from 'lucide-react';
import type { BookedTrip } from '../../types/booking';

interface BookedTripCardProps {
  trip: BookedTrip;
  onCancel?: (id: string) => void;
}

function BookedTripCard({ trip, onCancel }: BookedTripCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusStyles = (status: BookedTrip['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/10 text-blue-400';
      case 'ongoing':
        return 'bg-green-500/10 text-green-400';
      case 'completed':
        return 'bg-gray-500/10 text-gray-400';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden hover:border-dark-border/80 transition-colors">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-40 h-32 sm:h-auto flex-shrink-0">
          <img
            src={trip.coverImage}
            alt={trip.tripName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <Link
                to={`/trip/${trip.tripId}`}
                className="text-base font-medium text-text-primary hover:text-blue-400 transition-colors"
              >
                {trip.tripName}
              </Link>
              <div className="flex items-center gap-1 text-text-muted text-sm mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{trip.location.city}, {trip.location.country}</span>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusStyles(trip.status)}`}>
              {trip.status}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-text-muted" />
              <span>{formatDate(trip.startDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-text-muted" />
              <span>{trip.travelers} travelers</span>
            </div>
            <div className="ml-auto text-base font-semibold text-text-primary">
              ${trip.totalPrice.toLocaleString()}
            </div>
          </div>

          {/* Cancel Action */}
          {trip.status === 'upcoming' && onCancel && (
            <div className="mt-3 pt-3 border-t border-dark-border">
              <button
                onClick={() => onCancel(trip.id)}
                className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Cancel booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookedTripCard;
