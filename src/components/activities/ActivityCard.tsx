import { Check, DollarSign, Minus, Plus, MapPin } from 'lucide-react';
import { formatImageUrl } from '../../utils/imageHelpers';
import type { ApiActivity } from '../../api';

export interface ActivitySelection {
  activityId: string;
  durationType: 'HOURS' | 'DAYS';
  durationValue: number;
  quantity: number;
}

interface ActivityCardProps {
  activity: ApiActivity;
  isSelected: boolean;
  selection?: ActivitySelection;
  activityPrice: number;
  onToggle: (activityId: string) => void;
  onUpdateSelection: (activityId: string, updates: Partial<ActivitySelection>) => void;
  onShowOnMap?: (activityId: string) => void;
  isHighlighted?: boolean;
}

export const ActivityCard = ({
  activity,
  isSelected,
  selection,
  activityPrice,
  onToggle,
  onUpdateSelection,
  onShowOnMap,
  isHighlighted,
}: ActivityCardProps) => {
  const hasLocation = activity.latitude && activity.longitude;
  return (
    <div
      className={`p-4 rounded-2xl border-2 transition-all ${
        isHighlighted
          ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/30'
          : isSelected
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-dark-border bg-dark-card'
      }`}
    >
      <button
        onClick={() => onToggle(activity.id)}
        className="w-full text-left flex gap-4"
      >
        {/* Activity Image */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-dark-elevated">
          <img
            src={formatImageUrl(activity.imageUrl, 400)}
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
          <div className="w-full h-full items-center justify-center text-4xl text-text-muted hidden">
            {activity.name.charAt(0)}
          </div>
        </div>

        {/* Activity Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold text-text-primary">{activity.name}</h3>

            {/* Selection Indicator */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                isSelected ? 'bg-blue-500' : 'bg-dark-border'
              }`}
            >
              <Check className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-transparent'}`} />
            </div>
          </div>

          <p className="text-text-muted text-sm line-clamp-2 mb-3">
            {activity.description || 'Enjoy this amazing activity'}
          </p>

          {/* Price Info & Map Button */}
          <div className="flex flex-wrap items-center gap-3">
            {activity.pricePerHour > 0 && (
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <DollarSign className="w-4 h-4" />
                <span>${activity.pricePerHour}/hr</span>
              </div>
            )}
            {activity.pricePerDay > 0 && (
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <DollarSign className="w-4 h-4" />
                <span>${activity.pricePerDay}/day</span>
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Show on Map Button */}
      {hasLocation && onShowOnMap && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShowOnMap(activity.id);
          }}
          className={`mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            isHighlighted
              ? 'bg-orange-500 text-white'
              : 'bg-dark-elevated hover:bg-orange-500/20 text-text-muted hover:text-orange-400 border border-dark-border hover:border-orange-500/50'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{isHighlighted ? 'Showing on Map' : 'Show on Map'}</span>
        </button>
      )}

      {/* Duration & Quantity Selection (when selected) */}
      {isSelected && selection && (
        <div className="mt-4 pt-4 border-t border-dark-border space-y-4">
          {/* Duration Type */}
          <div className="flex items-center gap-4">
            <span className="text-text-secondary text-sm w-24">Pricing:</span>
            <div className="flex gap-2">
              {activity.pricePerHour > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateSelection(activity.id, { durationType: 'HOURS' });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selection.durationType === 'HOURS'
                      ? 'bg-blue-500 text-white'
                      : 'bg-dark-elevated text-text-muted hover:text-text-primary'
                  }`}
                >
                  Per Hour (${activity.pricePerHour})
                </button>
              )}
              {activity.pricePerDay > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateSelection(activity.id, { durationType: 'DAYS' });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selection.durationType === 'DAYS'
                      ? 'bg-blue-500 text-white'
                      : 'bg-dark-elevated text-text-muted hover:text-text-primary'
                  }`}
                >
                  Per Day (${activity.pricePerDay})
                </button>
              )}
            </div>
          </div>

          {/* Duration Value */}
          <div className="flex items-center gap-4">
            <span className="text-text-secondary text-sm w-24">
              {selection.durationType === 'HOURS' ? 'Hours:' : 'Days:'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateSelection(activity.id, {
                    durationValue: Math.max(1, selection.durationValue - 1),
                  });
                }}
                className="w-8 h-8 rounded-lg bg-dark-elevated border border-dark-border flex items-center justify-center hover:border-blue-500/50 transition-colors"
              >
                <Minus className="w-4 h-4 text-text-muted" />
              </button>
              <span className="w-12 text-center text-text-primary font-semibold">
                {selection.durationValue}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateSelection(activity.id, {
                    durationValue: selection.durationValue + 1,
                  });
                }}
                className="w-8 h-8 rounded-lg bg-dark-elevated border border-dark-border flex items-center justify-center hover:border-blue-500/50 transition-colors"
              >
                <Plus className="w-4 h-4 text-text-muted" />
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-text-secondary text-sm w-24">Quantity:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateSelection(activity.id, {
                    quantity: Math.max(1, selection.quantity - 1),
                  });
                }}
                className="w-8 h-8 rounded-lg bg-dark-elevated border border-dark-border flex items-center justify-center hover:border-blue-500/50 transition-colors"
              >
                <Minus className="w-4 h-4 text-text-muted" />
              </button>
              <span className="w-12 text-center text-text-primary font-semibold">
                {selection.quantity}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateSelection(activity.id, {
                    quantity: selection.quantity + 1,
                  });
                }}
                className="w-8 h-8 rounded-lg bg-dark-elevated border border-dark-border flex items-center justify-center hover:border-blue-500/50 transition-colors"
              >
                <Plus className="w-4 h-4 text-text-muted" />
              </button>
            </div>
          </div>

          {/* Activity Total */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-text-secondary text-sm">Activity Total:</span>
            <span className="text-lg font-bold text-blue-400">
              ${activityPrice.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
