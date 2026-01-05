import type { ApiTrip } from '../../api';

interface StatusBadgeProps {
  status: ApiTrip['status'];
}

const STATUS_CONFIG = {
  PLANNED: { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400', label: 'Planned' },
  CONFIRMED: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Confirmed' },
  IN_PROGRESS: { bg: 'bg-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400', label: 'In Progress', pulse: true },
  COMPLETED: { bg: 'bg-slate-500/20', text: 'text-slate-400', dot: 'bg-slate-400', label: 'Completed' },
  CANCELLED: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400', label: 'Cancelled' },
} as const;

const DEFAULT_CONFIG = { bg: 'bg-slate-500/20', text: 'text-slate-400', dot: 'bg-slate-400', label: 'Unknown' };

function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { ...DEFAULT_CONFIG, label: status };
  const hasPulse = 'pulse' in config && config.pulse;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${config.bg} rounded-full`}>
      <span className="relative flex h-2 w-2">
        {hasPulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      <span className={`text-xs font-semibold ${config.text}`}>{config.label}</span>
    </div>
  );
}

export default StatusBadge;