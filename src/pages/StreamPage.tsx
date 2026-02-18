import { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, Send, Users, Radio } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Badge, LiveBadge } from '../components/ui/Badge';
import { CURRENT_USER, EVENT_CHAT, SCHEDULE } from '../lib/mockData';
import type { EventChatMessage } from '../types';

const YOUTUBE_EMBED = 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=0&rel=0&modestbranding=1';

const disciplineColors: Record<string, string> = {
  'Filmmaker': 'teal', 'Digital Artist': 'orange', 'Brand Strategist': 'amber',
  'Music Producer': 'green', 'UI/UX Designer': 'orange', 'UX Researcher': 'teal',
  'Product Manager': 'gray', 'Fashion Designer': 'amber', 'Creative Technologist': 'teal',
  'Graphic Designer': 'orange', 'Creative Director': 'amber', 'Game Developer': 'green',
};

export const StreamPage = () => {
  const [messages, setMessages] = useState<EventChatMessage[]>(EVENT_CHAT);
  const [input, setInput] = useState('');
  const [chatExpanded, setChatExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'stream' | 'chat'>('stream');
  const bottomRef = useRef<HTMLDivElement>(null);

  const liveSession = SCHEDULE.find((s) => s.isHappeningNow);

  useEffect(() => {
    if (activeTab === 'chat') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const msg: EventChatMessage = {
      id: `ec${Date.now()}`,
      sender: {
        id: CURRENT_USER.id,
        name: CURRENT_USER.name,
        discipline: CURRENT_USER.discipline,
        avatarUrl: CURRENT_USER.avatarUrl,
        isLocal: true,
      },
      text,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };
    setMessages((prev) => [...prev, msg]);
    setInput('');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-7rem)] animate-fade-in">
      <StreamHeader liveSession={liveSession} />

      <div className="flex gap-1 bg-craft-surface border-b border-craft-border px-4">
        {(['stream', 'chat'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-bold capitalize transition-all border-b-2 ${
              activeTab === tab
                ? 'border-craft-orange text-craft-orange'
                : 'border-transparent text-craft-gray-400'
            }`}
          >
            {tab === 'chat' ? `Chat (${messages.length})` : 'Live Stream'}
          </button>
        ))}
      </div>

      {activeTab === 'stream' && (
        <div className="flex-1 flex flex-col">
          <div className="relative bg-black aspect-video w-full">
            <iframe
              src={YOUTUBE_EMBED}
              title="CRAFT Addis 2026 Live Stream"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {liveSession && (
            <div className="px-4 py-3 border-b border-craft-border">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-craft-white leading-snug">{liveSession.title}</p>
                  <p className="text-xs text-craft-gray-400 mt-0.5">{liveSession.stage}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <LiveBadge />
                  <span className="flex items-center gap-1 text-xs text-craft-gray-400">
                    <Users size={12} />
                    <span>5,247</span>
                  </span>
                </div>
              </div>
              {liveSession.speakers.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex -space-x-1.5">
                    {liveSession.speakers.slice(0, 3).map((sp) => (
                      <Avatar key={sp.name} src={sp.avatarUrl} name={sp.name} size="xs" />
                    ))}
                  </div>
                  <p className="text-xs text-craft-gray-400">
                    {liveSession.speakers.map((s) => s.name.split(' ')[0]).join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            <p className="text-center text-xs text-craft-gray-400">Switch to Chat to join the conversation</p>
            {messages.slice(-5).map((msg) => (
              <MiniMessage key={msg.id} message={msg} />
            ))}
            <button
              onClick={() => setActiveTab('chat')}
              className="w-full text-center text-xs font-semibold text-craft-orange py-2"
            >
              See all messages →
            </button>
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="px-4 py-3 border-t border-craft-border bg-craft-black/90 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Avatar src={CURRENT_USER.avatarUrl} name={CURRENT_USER.name} size="sm" />
              <div className="flex-1 flex items-center gap-2">
                <input
                  className="craft-input text-sm py-2.5"
                  placeholder="Say something to the room..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-craft-orange hover:bg-craft-orange-dark text-white transition-all disabled:opacity-40 shrink-0"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StreamHeader = ({ liveSession }: { liveSession: typeof SCHEDULE[0] | undefined }) => (
  <div className="px-4 pt-4 pb-3 flex items-center justify-between">
    <div>
      <h1 className="text-xl font-black text-craft-white tracking-tight flex items-center gap-2">
        Live Stream
        <Radio size={16} className="text-craft-red animate-pulse-dot" />
      </h1>
      <p className="text-xs text-craft-gray-400">CRAFT Addis 2026 · Day 1</p>
    </div>
    <div className="flex items-center gap-2">
      <LiveBadge />
      <span className="flex items-center gap-1 text-xs text-craft-gray-400">
        <Users size={12} />5,247
      </span>
    </div>
  </div>
);

const MiniMessage = ({ message: msg }: { message: EventChatMessage }) => (
  <div className="flex items-start gap-2">
    <Avatar src={msg.sender.avatarUrl} name={msg.sender.name} size="xs" />
    <div className="flex-1 min-w-0">
      <span className="text-[10px] font-bold text-craft-gray-200 mr-1.5">{msg.sender.name.split(' ')[0]}</span>
      <span className="text-[10px] text-craft-gray-400">{msg.text}</span>
    </div>
  </div>
);

const ChatBubble = ({ message: msg }: { message: EventChatMessage }) => {
  const color = (disciplineColors[msg.sender.discipline] || 'gray') as 'orange' | 'teal' | 'amber' | 'gray' | 'green';

  return (
    <div className={`flex items-start gap-2.5 ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
      <Avatar src={msg.sender.avatarUrl} name={msg.sender.name} size="sm" />
      <div className={`flex-1 min-w-0 ${msg.isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`flex items-center gap-2 ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs font-bold text-craft-white">
            {msg.isOwn ? 'You' : msg.sender.name.split(' ')[0]}
          </span>
          <Badge variant={color} size="sm">{msg.sender.discipline.split('/')[0].trim()}</Badge>
          {msg.sender.isLocal && !msg.isOwn && (
            <span className="text-[9px] font-semibold text-craft-orange bg-craft-orange-muted border border-craft-orange/20 px-1.5 py-0.5 rounded-full">Local</span>
          )}
        </div>
        <div
          className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
            msg.isOwn
              ? 'bg-craft-orange text-white rounded-br-sm'
              : 'bg-craft-surface2 border border-craft-border text-craft-white rounded-bl-sm'
          }`}
        >
          {msg.text}
        </div>
        <span className="text-[10px] text-craft-gray-400">{msg.sentAt}</span>
      </div>
    </div>
  );
};
