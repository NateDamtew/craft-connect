import { useState } from 'react';
import { Radio, ChevronRight, Clock, MapPin, TrendingUp, Users } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Badge, LiveBadge } from '../components/ui/Badge';
import { IntentBadge } from '../components/shared/IntentBadge';
import { navigate } from '../hooks/useRouter';
import { CURRENT_USER, WHISPER_MATCHES, SCHEDULE, PARTNERSHIPS } from '../lib/mockData';

export const HomePage = () => {
  const [currentIntent, setCurrentIntent] = useState(CURRENT_USER.currentIntent);
  const newMatches = WHISPER_MATCHES.filter((m) => m.status === 'new');
  const upcomingSessions = SCHEDULE.filter((s) => s.day === 1).slice(0, 3);
  const liveSession = SCHEDULE.find((s) => s.isHappeningNow);
  const unreadChats = PARTNERSHIPS.filter((p) => p.unreadCount > 0);

  return (
    <div className="px-4 py-5 space-y-6 animate-fade-in">
      <GreetingSection name={CURRENT_USER.name} />

      <IntentBadge
        intent={currentIntent}
        editable
        onUpdate={setCurrentIntent}
        size="lg"
      />

      {liveSession && (
        <LiveNowBanner session={liveSession} />
      )}

      {newMatches.length > 0 && (
        <MatchesSection matches={newMatches} />
      )}

      {unreadChats.length > 0 && (
        <UnreadChatsSection partnerships={unreadChats} />
      )}

      <UpcomingSection sessions={upcomingSessions} />

      <StatsRow />
    </div>
  );
};

const GreetingSection = ({ name }: { name: string }) => {
  const firstName = name.split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <p className="text-craft-gray-400 text-sm">{greeting}</p>
      <h1 className="text-2xl font-black text-craft-white tracking-tight">{firstName} ✦</h1>
      <p className="text-xs text-craft-gray-400 mt-0.5">CRAFT Addis 2026 · Day 1 of 3</p>
    </div>
  );
};

const LiveNowBanner = ({ session }: { session: typeof SCHEDULE[0] }) => (
  <button
    onClick={() => navigate('/stream')}
    className="w-full bg-craft-surface border border-craft-border rounded-xl p-4 flex items-center gap-3 hover:border-craft-red/50 hover:bg-craft-red-muted/30 transition-all duration-200 group"
  >
    <div className="w-10 h-10 rounded-xl bg-craft-red-muted border border-craft-red/30 flex items-center justify-center shrink-0">
      <Radio size={18} className="text-craft-red animate-pulse-dot" />
    </div>
    <div className="flex-1 text-left min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <LiveBadge />
        <span className="text-xs text-craft-gray-400">{session.stage}</span>
      </div>
      <p className="text-sm font-semibold text-craft-white truncate">{session.title}</p>
    </div>
    <ChevronRight size={16} className="text-craft-gray-400 group-hover:text-craft-white transition-colors shrink-0" />
  </button>
);

const MatchesSection = ({ matches }: { matches: typeof WHISPER_MATCHES }) => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <div>
        <h2 className="text-base font-bold text-craft-white">Whisper Matches</h2>
        <p className="text-xs text-craft-gray-400">{matches.length} new connections waiting</p>
      </div>
      <button
        onClick={() => navigate('/discover')}
        className="text-xs font-semibold text-craft-orange hover:text-craft-orange-light transition-colors flex items-center gap-1"
      >
        See all <ChevronRight size={12} />
      </button>
    </div>
    <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
      {matches.slice(0, 5).map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  </div>
);

const MatchCard = ({ match }: { match: typeof WHISPER_MATCHES[0] }) => (
  <button
    onClick={() => navigate('/discover')}
    className="flex-shrink-0 w-36 bg-craft-surface border border-craft-border rounded-xl p-3 flex flex-col items-center gap-2 hover:border-craft-orange/50 hover:bg-craft-orange-muted/30 transition-all duration-200"
  >
    <Avatar src={match.user.avatarUrl} name={match.user.name} size="lg" online={match.user.isOnline} />
    <div className="text-center min-w-0">
      <p className="text-xs font-bold text-craft-white truncate">{match.user.name.split(' ')[0]}</p>
      <p className="text-[10px] text-craft-gray-400 truncate">{match.user.discipline}</p>
    </div>
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-craft-gray-400">Match</span>
        <span className="text-[10px] font-bold text-craft-orange">{match.matchScore}%</span>
      </div>
      <div className="h-1 rounded-full bg-craft-border overflow-hidden">
        <div
          className="h-full rounded-full bg-craft-orange"
          style={{ width: `${match.matchScore}%` }}
        />
      </div>
    </div>
  </button>
);

const UnreadChatsSection = ({ partnerships }: { partnerships: typeof PARTNERSHIPS }) => (
  <div>
    <h2 className="text-base font-bold text-craft-white mb-3">Active Partnerships</h2>
    <div className="space-y-2">
      {partnerships.map((p) => (
        <button
          key={p.id}
          onClick={() => navigate(`/chat/${p.id}`)}
          className="w-full craft-card p-3 flex items-center gap-3 hover:border-craft-border2 transition-all text-left"
        >
          <Avatar src={p.partner.avatarUrl} name={p.partner.name} size="md" online={p.partner.isOnline} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-craft-white">{p.partner.name}</p>
              {p.unreadCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold bg-craft-orange text-white">
                  {p.unreadCount}
                </span>
              )}
            </div>
            <p className="text-xs text-craft-gray-400 truncate">{p.lastMessage}</p>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const UpcomingSection = ({ sessions }: { sessions: typeof SCHEDULE }) => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-bold text-craft-white">Today's Schedule</h2>
      <button
        onClick={() => navigate('/schedule')}
        className="text-xs font-semibold text-craft-orange hover:text-craft-orange-light transition-colors flex items-center gap-1"
      >
        Full agenda <ChevronRight size={12} />
      </button>
    </div>
    <div className="space-y-2">
      {sessions.map((session) => (
        <div
          key={session.id}
          onClick={() => navigate('/schedule')}
          className={`craft-card p-3 flex gap-3 cursor-pointer hover:border-craft-border2 transition-all ${session.isHappeningNow ? 'border-craft-red/30 bg-craft-red-muted/20' : ''}`}
        >
          <div className="shrink-0 text-right min-w-[42px]">
            <p className="text-xs font-bold text-craft-white">{session.startTime}</p>
            <p className="text-[10px] text-craft-gray-400">{session.endTime}</p>
          </div>
          <div className="w-px bg-craft-border shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {session.isHappeningNow && <LiveBadge />}
              <Badge variant="gray" size="sm">{session.type}</Badge>
            </div>
            <p className="text-sm font-semibold text-craft-white leading-snug">{session.title}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-[10px] text-craft-gray-400">
                <MapPin size={10} />
                {session.stage}
              </span>
              {session.speakers.length > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-craft-gray-400">
                  <Users size={10} />
                  {session.speakers.map((s) => s.name.split(' ')[0]).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StatsRow = () => (
  <div className="grid grid-cols-3 gap-3 pb-4">
    {[
      { label: 'Attendees', value: '847', icon: Users, color: 'text-craft-orange' },
      { label: 'Matches Today', value: '234', icon: TrendingUp, color: 'text-craft-teal' },
      { label: 'Sessions Left', value: '8', icon: Clock, color: 'text-craft-amber' },
    ].map(({ label, value, icon: Icon, color }) => (
      <div key={label} className="craft-card p-3 text-center">
        <Icon size={16} className={`${color} mx-auto mb-1.5`} />
        <p className="text-lg font-black text-craft-white">{value}</p>
        <p className="text-[10px] text-craft-gray-400">{label}</p>
      </div>
    ))}
  </div>
);
