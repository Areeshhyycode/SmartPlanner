import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck, Plane, Calendar, AlertCircle } from 'lucide-react';
import { notificationAPI, type Notification } from '../../api';
import { useAuth } from '../../context/AuthContext';

/**
 * NotificationBell - Bell icon with dropdown for notifications
 *
 * Features:
 * - Shows unread count badge
 * - Dropdown with notification list
 * - Mark individual as read
 * - Mark all as read
 * - Auto-refresh every 30 seconds
 */
export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications on mount and periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchNotifications = async () => {
      try {
        const [allNotifs, count] = await Promise.all([
          notificationAPI.getUnread(),
          notificationAPI.getUnreadCount(),
        ]);
        setNotifications(allNotifs);
        setUnreadCount(count);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        // Don't show error to user, just fail silently
      }
    };

    fetchNotifications();

    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      await notificationAPI.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'TRIP_REMINDER':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'TRIP_START':
        return <Plane className="w-4 h-4 text-emerald-400" />;
      case 'TRIP_END':
        return <Check className="w-4 h-4 text-purple-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-muted hover:text-text-primary hover:bg-dark-elevated rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="px-4 py-3 bg-dark-elevated/50 border-b border-dark-border flex items-center justify-between">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              Notifications
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </h3>

            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={loading}
                className="flex items-center gap-1 px-2 py-1 text-xs text-text-muted hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-50"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-dark-elevated rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-text-muted" />
                </div>
                <p className="text-text-muted text-sm">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-dark-border/50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 hover:bg-dark-elevated/50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="w-8 h-8 bg-dark-elevated rounded-lg flex items-center justify-center flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-text-muted/70 mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>

                      {/* Dismiss Button */}
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-1.5 text-text-muted hover:text-text-primary hover:bg-dark-elevated rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        aria-label="Dismiss"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-dark-elevated/30 border-t border-dark-border/50">
              <p className="text-[10px] text-text-muted text-center">
                Showing {notifications.length} unread notification{notifications.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-from-top-2 {
          from { transform: translateY(-8px); }
          to { transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.15s ease-out, slide-in-from-top-2 0.15s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
