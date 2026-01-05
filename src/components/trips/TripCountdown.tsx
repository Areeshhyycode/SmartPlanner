import { useState, useEffect } from 'react';
import { Clock, Plane, MapPin, Calendar } from 'lucide-react';
import type { TripCountdown as TripCountdownType } from '../../api';

interface TripCountdownProps {
  countdown: TripCountdownType;
  compact?: boolean;
}

/**
 * TripCountdown - Modern compact countdown timer
 */
export default function TripCountdown({ countdown, compact = false }: TripCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(countdown.countdown);

  useEffect(() => {
    if (countdown.isTripStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown.isTripStarted]);

  if (countdown.status === 'CANCELLED') return null;
  if (countdown.isTripStarted && countdown.status !== 'PLANNED') return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Compact version
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <Clock className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-xs font-medium text-blue-400">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
        </span>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-r from-dark-card to-dark-elevated border border-dark-border rounded-xl p-4 overflow-hidden group hover:border-blue-500/30 transition-colors">
      {/* Subtle glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />

      <div className="relative flex items-center gap-4">
        {/* Left: Trip Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
            <Plane className="w-5 h-5 text-white -rotate-45" />
          </div>

          {/* Info */}
          <div className="min-w-0">
            <h4 className="font-semibold text-text-primary truncate">
              {countdown.cityName}
            </h4>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{countdown.country}</span>
              <span className="text-dark-border">•</span>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(countdown.startDate)}</span>
            </div>
          </div>
        </div>

        {/* Right: Countdown */}
        <div className="flex items-center gap-1.5">
          <TimeBox value={timeLeft.days} label="D" />
          <span className="text-text-muted/50 text-lg font-light">:</span>
          <TimeBox value={timeLeft.hours} label="H" />
          <span className="text-text-muted/50 text-lg font-light">:</span>
          <TimeBox value={timeLeft.minutes} label="M" />
          <span className="text-text-muted/50 text-lg font-light hidden sm:block">:</span>
          <div className="hidden sm:block">
            <TimeBox value={timeLeft.seconds} label="S" isSeconds />
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeBox({ value, label, isSeconds = false }: { value: number; label: string; isSeconds?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`
        w-10 h-10 sm:w-11 sm:h-11
        bg-dark-bg/80 border border-dark-border/60
        rounded-lg flex items-center justify-center
        ${isSeconds ? 'border-blue-500/30' : ''}
      `}>
        <span className={`
          text-base sm:text-lg font-bold tabular-nums
          ${isSeconds ? 'text-blue-400' : 'text-text-primary'}
        `}>
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[9px] text-text-muted/60 mt-0.5 font-medium">{label}</span>
    </div>
  );
}
