import { Star, Mic2, Zap, Globe, Award, Handshake } from 'lucide-react';
import type { Stamp, StampType } from '../../types';

interface StampBadgeProps {
  stamp: Stamp;
  size?: 'sm' | 'md' | 'lg';
}

const stampConfig: Record<StampType, { icon: typeof Star; label: string; bg: string; iconColor: string }> = {
  attendance: { icon: Star, label: 'Attended', bg: 'bg-craft-orange-muted border-craft-orange/25', iconColor: 'text-craft-orange' },
  speaker: { icon: Mic2, label: 'Speaker', bg: 'bg-craft-amber-muted border-craft-amber/25', iconColor: 'text-craft-amber' },
  challenge: { icon: Zap, label: 'Challenge', bg: 'bg-craft-teal-muted border-craft-teal/25', iconColor: 'text-craft-teal' },
  presence: { icon: Globe, label: 'Presence', bg: 'bg-[rgba(168,85,247,0.1)] border-purple-500/25', iconColor: 'text-purple-400' },
  contribution: { icon: Award, label: 'Contributor', bg: 'bg-craft-green-muted border-craft-green/25', iconColor: 'text-craft-green' },
  partnership: { icon: Handshake, label: 'Connector', bg: 'bg-craft-teal-muted border-craft-teal/25', iconColor: 'text-craft-teal' },
};

export const StampBadge = ({ stamp, size = 'md' }: StampBadgeProps) => {
  const config = stampConfig[stamp.type];
  const Icon = config.icon;

  if (size === 'sm') {
    return (
      <div
        title={`${stamp.label} — ${stamp.eventName}`}
        className={`w-8 h-8 rounded-lg border flex items-center justify-center ${config.bg}`}
      >
        <Icon size={14} className={config.iconColor} />
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${config.bg}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bg}`}>
          <Icon size={24} className={config.iconColor} />
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-craft-white">{stamp.label}</p>
          <p className="text-[10px] text-craft-gray-400 mt-0.5">{stamp.eventName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${config.bg}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${config.bg}`}>
        <Icon size={16} className={config.iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-craft-white truncate">{stamp.label}</p>
        <p className="text-[10px] text-craft-gray-400 truncate">{stamp.eventName}</p>
      </div>
    </div>
  );
};

export const StampGrid = ({ stamps, max }: { stamps: Stamp[]; max?: number }) => {
  const displayed = max ? stamps.slice(0, max) : stamps;
  const remaining = max && stamps.length > max ? stamps.length - max : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {displayed.map((stamp) => (
        <StampBadge key={stamp.id} stamp={stamp} size="sm" />
      ))}
      {remaining > 0 && (
        <div className="w-8 h-8 rounded-lg border border-craft-border bg-craft-surface2 flex items-center justify-center text-[10px] font-bold text-craft-gray-400">
          +{remaining}
        </div>
      )}
    </div>
  );
};
