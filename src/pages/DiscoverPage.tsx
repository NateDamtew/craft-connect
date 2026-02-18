import { useState } from 'react';
import { Search, BellOff, Bell, MapPin, Globe, X, MessageCircle, ChevronRight, ExternalLink } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Modal';
import { Toggle } from '../components/ui/Toggle';
import { IntentBadge } from '../components/shared/IntentBadge';
import { navigate } from '../hooks/useRouter';
import { WHISPER_MATCHES, DISCIPLINES } from '../lib/mockData';
import type { WhisperMatch } from '../types';

const FILTER_LABELS = ['All', 'Designer', 'Filmmaker', 'Digital Artist', 'Developer', 'Brand', 'Music', 'Fashion'] as const;

export const DiscoverPage = () => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [dnd, setDnd] = useState(false);
  const [selected, setSelected] = useState<WhisperMatch | null>(null);

  const filtered = WHISPER_MATCHES.filter((m) => {
    const matchesSearch =
      !query ||
      m.user.name.toLowerCase().includes(query.toLowerCase()) ||
      m.user.discipline.toLowerCase().includes(query.toLowerCase()) ||
      m.theirIntent.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      activeFilter === 'All' ||
      m.user.discipline.toLowerCase().includes(activeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-[calc(100dvh-7rem)] animate-fade-in">
      <div className="px-4 pt-5 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-craft-white tracking-tight">Whisper Feed</h1>
            <p className="text-xs text-craft-gray-400">{WHISPER_MATCHES.length} intent matches found</p>
          </div>
          <button
            onClick={() => setDnd(!dnd)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              dnd
                ? 'bg-craft-surface3 border-craft-border2 text-craft-gray-400'
                : 'bg-craft-orange-muted border-craft-orange/30 text-craft-orange'
            }`}
          >
            {dnd ? <BellOff size={13} /> : <Bell size={13} />}
            {dnd ? 'DnD On' : 'Active'}
          </button>
        </div>

        {dnd && (
          <div className="flex items-center gap-2 px-3 py-2.5 bg-craft-surface2 border border-craft-border rounded-xl">
            <BellOff size={14} className="text-craft-gray-400 shrink-0" />
            <p className="text-xs text-craft-gray-400">Do Not Disturb is on. You won't appear in others' feeds.</p>
            <button onClick={() => setDnd(false)} className="ml-auto">
              <X size={12} className="text-craft-gray-400" />
            </button>
          </div>
        )}

        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-craft-gray-400" />
          <input
            className="craft-input pl-10"
            placeholder="Search by name, discipline, or intent..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
          {FILTER_LABELS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`chip shrink-0 ${activeFilter === f ? 'chip-active' : 'chip-inactive'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((match) => (
            <MatchCard key={match.id} match={match} onSelect={setSelected} />
          ))
        )}
      </div>

      <MatchDrawer
        match={selected}
        onClose={() => setSelected(null)}
        onConnect={() => { navigate('/chat'); setSelected(null); }}
      />
    </div>
  );
};

const MatchCard = ({ match, onSelect }: { match: WhisperMatch; onSelect: (m: WhisperMatch) => void }) => {
  const strengthColor =
    match.matchScore >= 85 ? 'bg-craft-orange' :
    match.matchScore >= 70 ? 'bg-craft-amber' : 'bg-craft-teal';

  return (
    <button
      onClick={() => onSelect(match)}
      className={`w-full craft-card p-4 flex flex-col gap-3 text-left hover:border-craft-border2 transition-all duration-200 ${
        match.status === 'new' ? 'border-craft-orange/30' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar
          src={match.user.avatarUrl}
          name={match.user.name}
          size="md"
          online={match.user.isOnline}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-craft-white">{match.user.name}</p>
                {match.status === 'new' && (
                  <span className="text-[9px] font-bold text-craft-orange bg-craft-orange-muted px-1.5 py-0.5 rounded-full border border-craft-orange/20">NEW</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="badge-discipline">{match.user.discipline}</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-lg font-black text-craft-orange">{match.matchScore}%</p>
              <p className="text-[10px] text-craft-gray-400">match</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-1 rounded-full bg-craft-border overflow-hidden">
        <div className={`h-full rounded-full ${strengthColor} transition-all`} style={{ width: `${match.matchScore}%` }} />
      </div>

      <div className="space-y-1.5">
        <IntentBadge intent={match.theirIntent} size="sm" />
        <div className="flex items-center gap-1.5 flex-wrap">
          {match.matchedKeywords.map((kw) => (
            <span key={kw} className="text-[10px] font-semibold text-craft-teal bg-craft-teal-muted border border-craft-teal/20 px-2 py-0.5 rounded-full">
              {kw}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-craft-gray-400">
          {match.user.isLocal ? (
            <><MapPin size={11} className="text-craft-orange" /><span className="text-craft-orange">In venue</span></>
          ) : (
            <><Globe size={11} />{match.user.location}</>
          )}
        </span>
        <span className="text-xs font-semibold text-craft-orange flex items-center gap-1">
          View profile <ChevronRight size={12} />
        </span>
      </div>
    </button>
  );
};

const MatchDrawer = ({ match, onClose, onConnect }: {
  match: WhisperMatch | null;
  onClose: () => void;
  onConnect: () => void;
}) => (
  <Drawer isOpen={!!match} onClose={onClose} title="Match Details">
    {match && (
      <div className="px-5 pb-8 space-y-5">
        <div className="flex items-center gap-4">
          <Avatar src={match.user.avatarUrl} name={match.user.name} size="xl" online={match.user.isOnline} />
          <div className="flex-1">
            <h3 className="text-lg font-black text-craft-white">{match.user.name}</h3>
            <span className="badge-discipline">{match.user.discipline}</span>
            <p className="flex items-center gap-1 text-xs text-craft-gray-400 mt-1">
              {match.user.isLocal ? <MapPin size={11} className="text-craft-orange" /> : <Globe size={11} />}
              {match.user.location}
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-craft-orange">{match.matchScore}%</p>
            <p className="text-[10px] text-craft-gray-400">match</p>
          </div>
        </div>

        <div>
          <p className="craft-label mb-2">About</p>
          <p className="text-sm text-craft-gray-200 leading-relaxed">{match.user.bio}</p>
        </div>

        <div>
          <p className="craft-label mb-2">Their Intent</p>
          <IntentBadge intent={match.theirIntent} size="sm" />
        </div>

        <div>
          <p className="craft-label mb-2">Your Intent</p>
          <IntentBadge intent={match.myIntent} size="sm" />
        </div>

        <div>
          <p className="craft-label mb-2">Matching Signals</p>
          <div className="flex flex-wrap gap-2">
            {match.matchedKeywords.map((kw) => (
              <span key={kw} className="text-xs font-semibold text-craft-teal bg-craft-teal-muted border border-craft-teal/20 px-3 py-1 rounded-full">
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" size="md" leftIcon={<ExternalLink size={14} />} onClick={onClose} className="flex-1">
            View Passport
          </Button>
          <Button size="md" leftIcon={<MessageCircle size={14} />} onClick={onConnect} className="flex-1">
            Start Partnership
          </Button>
        </div>
      </div>
    )}
  </Drawer>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-2xl bg-craft-surface2 border border-craft-border flex items-center justify-center mb-4">
      <Search size={24} className="text-craft-gray-400" />
    </div>
    <p className="text-sm font-semibold text-craft-white mb-1">No matches found</p>
    <p className="text-xs text-craft-gray-400">Try adjusting your search or filters.</p>
  </div>
);
