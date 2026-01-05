import { Calendar, Users } from 'lucide-react';
import type { AvailableDate } from '../../types/booking';

interface DateSelectorProps {
  dates: AvailableDate[];
  selectedDateId: string;
  onDateSelect: (dateId: string) => void;
  basePrice: number;
}

function DateSelector({ dates, selectedDateId, onDateSelect, basePrice }: DateSelectorProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-primary mb-3">
        Select Travel Date
      </label>
      <div className="grid gap-3">
        {dates.map((date) => {
          const isSelected = date.id === selectedDateId;
          const adjustedPrice = Math.round(basePrice * date.priceModifier);
          const isPeakSeason = date.priceModifier > 1;

          return (
            <button
              key={date.id}
              onClick={() => onDateSelect(date.id)}
              disabled={date.spotsLeft === 0}
              className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                isSelected
                  ? 'bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/10'
                  : date.spotsLeft === 0
                  ? 'bg-dark-elevated/50 border-dark-border opacity-50 cursor-not-allowed'
                  : 'bg-dark-elevated border-dark-border hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Date Info */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-blue-500' : 'bg-dark-card'
                    }`}
                  >
                    <Calendar
                      className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-blue-400'}`}
                    />
                  </div>
                  <div>
                    <p className="text-text-primary font-medium">
                      {formatDate(date.startDate)} - {formatDate(date.endDate)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-3.5 h-3.5 text-text-muted" />
                      <span
                        className={`text-sm ${
                          date.spotsLeft <= 3 ? 'text-danger' : 'text-text-muted'
                        }`}
                      >
                        {date.spotsLeft === 0
                          ? 'Sold Out'
                          : date.spotsLeft <= 3
                          ? `Only ${date.spotsLeft} spots left!`
                          : `${date.spotsLeft} spots available`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-lg font-bold text-text-primary">${adjustedPrice}</p>
                  {isPeakSeason && (
                    <span className="text-xs text-warning">Peak Season</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DateSelector;
