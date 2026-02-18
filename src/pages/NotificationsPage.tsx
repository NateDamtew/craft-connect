import { useState } from 'react';
import { Bell, Target, Calendar, Award, MessageCircle, Info, CheckCheck } from 'lucide-react';
import { navigate } from '../hooks/useRouter';
import { NOTIFICATIONS } from '../lib/mockData';
import type { AppNotification, NotificationType } from '../types';

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string }> = {
  match: { icon: Target, color: 'text-craft-orange', bg: 'bg-craft-orange-muted border-craft-orange/25' },
  schedule: { icon: Calendar, color: 'text-craft-amber', bg: 'bg-craft-amber-muted border-craft-amber/25' },
  stamp: { icon: Award, color: 'text-craft-teal', bg: 'bg-craft-teal-muted border-craft-teal/25' },
  message: { icon: MessageCircle, color: 'text-craft-green', bg: 'bg-craft-green-muted border-craft-green/25' },
  system: { icon: Info, color: 'text-craft-gray-400', bg: 'bg-craft-surface2 border-craft-border' },
};

const formatRelativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const groupByTime = (notifs: AppNotification[]) => {
  const today: AppNotification[] = [];
  const earlier: AppNotification[] = [];
  const now = Date.now();

  notifs.forEach((n) => {
    const diff = now - new Date(n.createdAt).getTime();
    if (diff < 86400000) today.push(n);
    else earlier.push(n);
  });

  return [
    { label: 'Today', items: today },
    { label: 'Earlier', items: earlier },
  ].filter((g) => g.items.length > 0);
};

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const groups = groupByTime(notifications);

  return (
    <div className="px-4 pt-5 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-craft-white tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-xs text-craft-gray-400">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-craft-orange hover:text-craft-orange-light transition-colors"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6 pb-6">
          {groups.map(({ label, items }) => (
            <div key={label}>
              <p className="craft-label mb-3">{label}</p>
              <div className="space-y-2">
                {items.map((notif) => (
                  <NotificationRow
                    key={notif.id}
                    notification={notif}
                    onRead={() => markRead(notif.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const NotificationRow = ({
  notification: n,
  onRead,
}: {
  notification: AppNotification;
  onRead: () => void;
}) => {
  const config = typeConfig[n.type];
  const Icon = config.icon;

  const handleClick = () => {
    onRead();
    if (n.type === 'match') navigate('/discover');
    else if (n.type === 'message') navigate('/chat');
    else if (n.type === 'schedule') navigate('/schedule');
    else if (n.type === 'stamp') navigate('/passport');
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${
        n.isRead
          ? 'bg-craft-surface border-craft-border hover:border-craft-border2'
          : 'bg-craft-surface2 border-craft-border2 shadow-card'
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${config.bg}`}
      >
        <Icon size={16} className={config.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-semibold leading-snug ${n.isRead ? 'text-craft-gray-200' : 'text-craft-white'}`}>
            {n.title}
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            {!n.isRead && (
              <span className="w-2 h-2 rounded-full bg-craft-orange shrink-0" />
            )}
            <span className="text-[10px] text-craft-gray-400 whitespace-nowrap">
              {formatRelativeTime(n.createdAt)}
            </span>
          </div>
        </div>
        <p className="text-xs text-craft-gray-400 leading-relaxed mt-0.5">{n.body}</p>
      </div>
    </button>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-2xl bg-craft-surface2 border border-craft-border flex items-center justify-center mb-4">
      <Bell size={24} className="text-craft-gray-400" />
    </div>
    <p className="text-sm font-semibold text-craft-white mb-1">All caught up</p>
    <p className="text-xs text-craft-gray-400">You'll be notified about matches, messages, and upcoming sessions.</p>
  </div>
);
