import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Gavel,
  HandshakeIcon,
  Trophy,
} from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { notifications as initialNotifications } from '../../data/mockData';
import type { Notification, NotificationType } from '../../types';
import { relativeTime } from '../../utils/helpers';

const iconMap: Record<NotificationType, React.ReactNode> = {
  OUTBID: <Gavel size={18} className="text-danger-500" />,
  AUCTION_WON: <Trophy size={18} className="text-accent-500" />,
  AUCTION_ENDED: <Bell size={18} className="text-surface-500" />,
  SELLER_DECISION: <CheckCircle2 size={18} className="text-primary-500" />,
  HANDOVER_REMINDER: <HandshakeIcon size={18} className="text-accent-600" />,
  SALE_COMPLETED: <CheckCircle2 size={18} className="text-success-500" />,
};

const bgMap: Record<NotificationType, string> = {
  OUTBID: 'bg-danger-500/10',
  AUCTION_WON: 'bg-accent-500/10',
  AUCTION_ENDED: 'bg-surface-200',
  SELLER_DECISION: 'bg-primary-500/10',
  HANDOVER_REMINDER: 'bg-accent-500/10',
  SALE_COMPLETED: 'bg-success-500/10',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const markAllRead = () => {
    setNotifications(
      notifications.map((n) => ({
        ...n,
        readAt: n.readAt ?? new Date().toISOString(),
      }))
    );
  };

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-surface-900">Notifications</h1>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-sm font-medium text-primary-500 hover:text-primary-700 transition"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="flex flex-col gap-3 stagger-children">
            {notifications.length === 0 && (
              <div className="flex flex-col items-center py-20 text-surface-400">
                <Bell size={48} className="mb-3 opacity-40" />
                <p className="text-lg font-medium">No notifications yet</p>
              </div>
            )}

            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-4 rounded-2xl border p-4 transition hover:shadow-sm ${
                  n.readAt
                    ? 'border-surface-200 bg-white'
                    : 'border-primary-200 bg-primary-50/30'
                }`}
              >
                {/* Icon */}
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${bgMap[n.type]}`}
                >
                  {iconMap[n.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-800">{n.title}</p>
                  <p className="text-sm text-surface-500 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                </div>

                {/* Time */}
                <span className="flex-shrink-0 text-xs text-surface-400 whitespace-nowrap">
                  {relativeTime(n.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
