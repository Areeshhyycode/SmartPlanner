import { X, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  variant = 'warning',
}: ConfirmDialogProps) {
  // Close dialog on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      icon: 'bg-red-500/20 text-red-300',
      border: 'border-red-500/30',
      confirmBg: 'bg-red-600',
      confirmHover: 'hover:bg-red-500 active:bg-red-600 focus:bg-red-600',
      confirmText: 'text-white',
    },
    warning: {
      icon: 'bg-amber-500/20 text-amber-300',
      border: 'border-amber-500/30',
      confirmBg: 'bg-amber-600',
      confirmHover: 'hover:bg-amber-500 active:bg-amber-600 focus:bg-amber-600',
      confirmText: 'text-white',
    },
    info: {
      icon: 'bg-blue-500/20 text-blue-300',
      border: 'border-blue-500/30',
      confirmBg: 'bg-blue-600',
      confirmHover: 'hover:bg-blue-500 active:bg-blue-600 focus:bg-blue-600',
      confirmText: 'text-white',
    },
  }[variant];

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-dark-card border border-dark-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-dark-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${variantConfig.icon}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <p className="text-text-primary text-base leading-relaxed mt-2">{message}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 bg-dark-elevated border-t border-dark-border">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-dark-card hover:bg-dark-hover active:bg-dark-card focus:bg-dark-card border border-dark-border rounded-xl text-text-primary font-semibold transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-6 py-3 ${variantConfig.confirmBg} ${variantConfig.confirmHover} ${variantConfig.confirmText} font-semibold rounded-xl shadow-lg transition-all`}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}

export default ConfirmDialog;
