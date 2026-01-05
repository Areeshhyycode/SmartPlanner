import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  type?: 'error' | 'success' | 'info' | 'warning';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

function Alert({
  type = 'error',
  title,
  message,
  onClose,
  className = '',
}: AlertProps) {
  const config = {
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: AlertCircle,
    },
    success: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      icon: CheckCircle,
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: Info,
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      icon: AlertTriangle,
    },
  }[type];

  const Icon = config.icon;

  return (
    <div
      className={`relative p-4 ${config.bg} border ${config.border} rounded-xl flex items-start gap-3 ${className} animate-slide-down`}
      role="alert"
    >
      <Icon className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-semibold ${config.text} mb-1`}>{title}</h4>
        )}
        <p className={`text-sm ${config.text} leading-relaxed`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`p-1 rounded-lg ${config.text} hover:bg-black/20 transition-colors flex-shrink-0`}
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Alert;
