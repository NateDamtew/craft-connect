import { useState } from 'react';
import { Bookmark, Clock, MapPin, Users, ChevronDown } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Badge, LiveBadge } from '../components/ui/Badge';
import { Drawer } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { SCHEDULE } from '../lib/mockData';
import type { ScheduleSession, SessionType, Stage } from '../types';

const SESSION_TYPES: SessionType[] = ['Keynote', 'Panel', 'Workshop', 'Screening', 'Performance', 'Networking', 'Lab'];
const STAGES: Stage[] = ['Main Stage', 'Studio A', 'Lab', 'Cafe Stage', 'Gallery', 'Courtyard'];

const typeColors: Record<SessionType, string> = {
  Keynote: 'orange', Panel: 'teal', Workshop: 'amber',
  Screening: 'gray', Performance: 'green', Networking: 'gray', Lab: 'teal',
};

const DAY_DATES = ['Feb 28', 'Mar 1', 'Mar 2'];

export const SchedulePage = () => {
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);
  const [activeType, setActiveType] = useState<SessionType | 'All'>('All');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(
    new Set(SCHEDULE.filter((s) => s.isBookmarked).map((s) => s.id))
  );
  const [selected, setSelected] = useState<ScheduleSession | null>(null);

  const sessions = SCHEDULE.filter((s) => {
    if (s.day !== activeDay) return false;
    if (activeType !== 'All' && s.type !== activeType) return false;
    if (bookmarkedOnly && !bookmarks.has(s.id)) return false;
    return true;
  });

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col animate-fade-in">
      <div className="px-4 pt-5 pb-3 space-y-3 sticky top-14 bg-craft-black/90 backdrop-blur-md z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-craft-white tracking-tight">Schedule</h1>
          <button
            onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              bookmarkedOnly
                ? 'bg-craft-amber-muted border-craft-amber/30 text-craft-amber'
                : 'border-craft-border text-craft-gray-400 hover:text-craft-white'
            }`}
          >
            <Bookmark size={12} className={bookmarkedOnly ? 'fill-craft-amber' : ''} />
            Saved
          </button>
        </div>

        <div className="flex gap-1 bg-craft-surface rounded-xl p-1">
          {([1, 2, 3] as const).map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                activeDay === day
                  ? 'bg-craft-orange text-white shadow-orange-glow-sm'
                  : 'text-craft-gray-400 hover:text-craft-white'
              }`}
            >
              Day {day}
              <span className="block text-[9px] font-normal opacity-70">{DAY_DATES[day - 1]}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {(['All', ...SESSION_TYPES] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`chip shrink-0 ${activeType === type ? 'chip-active' : 'chip-inactive'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-6 space-y-2">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm font-semibold text-craft-white mb-1">No sessions found</p>
            <p className="text-xs text-craft-gray-400">Try changing your filters.</p>
          </div>
        ) : (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              isBookmarked={bookmarks.has(session.id)}
              onBookmark={() => toggleBookmark(session.id)}
              onSelect={setSelected}
            />
          ))
        )}
      </div>

      <SessionDrawer
        session={selected}
        isBookmarked={selected ? bookmarks.has(selected.id) : false}
        onBookmark={() => selected && toggleBookmark(selected.id)}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};

interface SessionCardProps {
  session: ScheduleSession;
  isBookmarked: boolean;
  onBookmark: () => void;
  onSelect: (s: ScheduleSession) => void;
}

const SessionCard = ({ session, isBookmarked, onBookmark, onSelect }: SessionCardProps) => (
  <div
    className={`craft-card flex gap-0 overflow-hidden ${session.isHappeningNow ? 'border-craft-red/30' : ''}`}
  >
    <div className={`w-1 shrink-0 ${session.isHappeningNow ? 'bg-craft-red' : 'bg-craft-border'}`} />
    <div className="flex-1 p-4">
      <div className="flex items-start gap-3">
        <div className="shrink-0 text-right min-w-[44px]">
          <p className="text-xs font-bold text-craft-white">{session.startTime}</p>
          <p className="text-[10px] text-craft-gray-400">{session.endTime}</p>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {session.isHappeningNow && <LiveBadge />}
            <Badge
              variant={(typeColors[session.type] as 'orange' | 'teal' | 'amber' | 'gray' | 'green') || 'gray'}
              size="sm"
            >
              {session.type}
            </Badge>
          </div>
          <button
            onClick={() => onSelect(session)}
            className="text-left w-full"
          >
            <p className="text-sm font-bold text-craft-white leading-snug hover:text-craft-orange transition-colors">
              {session.title}
            </p>
          </button>

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] text-craft-gray-400">
              <MapPin size={10} className="text-craft-orange" />
              {session.stage}
            </span>
            {session.speakers.length > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-craft-gray-400">
                <Users size={10} />
                {session.speakers.map((s) => s.name.split(' ')[0]).join(', ')}
              </span>
            )}
          </div>

          {session.speakers.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2.5">
              <div className="flex -space-x-2">
                {session.speakers.slice(0, 3).map((sp) => (
                  <Avatar key={sp.name} src={sp.avatarUrl} name={sp.name} size="xs" />
                ))}
              </div>
              {session.speakers.length > 3 && (
                <span className="text-[10px] text-craft-gray-400">+{session.speakers.length - 3}</span>
              )}
            </div>
          )}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onBookmark(); }}
          className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
            isBookmarked ? 'text-craft-amber' : 'text-craft-gray-400 hover:text-craft-white'
          }`}
        >
          <Bookmark size={14} className={isBookmarked ? 'fill-craft-amber' : ''} />
        </button>
      </div>
    </div>
  </div>
);

const SessionDrawer = ({ session, isBookmarked, onBookmark, onClose }: {
  session: ScheduleSession | null;
  isBookmarked: boolean;
  onBookmark: () => void;
  onClose: () => void;
}) => (
  <Drawer isOpen={!!session} onClose={onClose}>
    {session && (
      <div className="px-5 pb-8 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {session.isHappeningNow && <LiveBadge />}
              <Badge
                variant={(typeColors[session.type] as 'orange' | 'teal' | 'amber' | 'gray' | 'green') || 'gray'}
                size="sm"
              >
                {session.type}
              </Badge>
            </div>
            <h3 className="text-lg font-black text-craft-white leading-tight">{session.title}</h3>
          </div>
          <button
            onClick={onBookmark}
            className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all shrink-0 ${
              isBookmarked
                ? 'bg-craft-amber-muted border-craft-amber/30 text-craft-amber'
                : 'border-craft-border text-craft-gray-400 hover:text-craft-white'
            }`}
          >
            <Bookmark size={16} className={isBookmarked ? 'fill-craft-amber' : ''} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-sm text-craft-gray-200">
            <Clock size={14} className="text-craft-orange" />
            {session.startTime} – {session.endTime}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-craft-gray-200">
            <MapPin size={14} className="text-craft-orange" />
            {session.stage}
          </span>
        </div>

        <div>
          <p className="craft-label mb-2">About this session</p>
          <p className="text-sm text-craft-gray-200 leading-relaxed">{session.description}</p>
        </div>

        {session.speakers.length > 0 && (
          <div>
            <p className="craft-label mb-3">Speakers</p>
            <div className="space-y-3">
              {session.speakers.map((sp) => (
                <div key={sp.name} className="flex items-center gap-3">
                  <Avatar src={sp.avatarUrl} name={sp.name} size="md" />
                  <div>
                    <p className="text-sm font-bold text-craft-white">{sp.name}</p>
                    <p className="text-xs text-craft-gray-400">{sp.discipline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button fullWidth variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    )}
  </Drawer>
);
