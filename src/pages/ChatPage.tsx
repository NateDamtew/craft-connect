import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Archive, MapPin, Globe, MoreVertical } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { navigate } from '../hooks/useRouter';
import { PARTNERSHIPS, CHAT_MESSAGES } from '../lib/mockData';
import type { TrialPartnership, ChatMessage } from '../types';

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

interface ChatPageProps {
  partnershipId?: string;
}

export const ChatPage = ({ partnershipId }: ChatPageProps) => {
  if (partnershipId) {
    const partnership = PARTNERSHIPS.find((p) => p.id === partnershipId);
    if (partnership) return <ConversationView partnership={partnership} />;
  }
  return <ChatListView />;
};

const ChatListView = () => (
  <div className="px-4 pt-5 animate-fade-in">
    <div className="mb-5">
      <h1 className="text-xl font-black text-craft-white tracking-tight">Partnerships</h1>
      <p className="text-xs text-craft-gray-400">{PARTNERSHIPS.length} active trial partnerships</p>
    </div>

    <div className="space-y-2">
      {PARTNERSHIPS.map((p) => (
        <PartnershipRow key={p.id} partnership={p} />
      ))}
    </div>

    {PARTNERSHIPS.length === 0 && (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-craft-surface2 border border-craft-border flex items-center justify-center mb-4 text-2xl">
          🤝
        </div>
        <p className="text-sm font-semibold text-craft-white mb-1">No partnerships yet</p>
        <p className="text-xs text-craft-gray-400 mb-4">Connect with someone from your Whisper matches to start a trial partnership.</p>
        <Button size="sm" onClick={() => navigate('/discover')}>Browse Matches</Button>
      </div>
    )}
  </div>
);

const PartnershipRow = ({ partnership: p }: { partnership: TrialPartnership }) => (
  <button
    onClick={() => navigate(`/chat/${p.id}`)}
    className="w-full craft-card p-4 flex items-center gap-3 text-left hover:border-craft-border2 transition-all"
  >
    <Avatar src={p.partner.avatarUrl} name={p.partner.name} size="md" online={p.partner.isOnline} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-0.5">
        <p className="text-sm font-bold text-craft-white truncate">{p.partner.name}</p>
        <span className="text-[10px] text-craft-gray-400 shrink-0 ml-2">{formatDate(p.lastMessageAt)}</span>
      </div>
      <p className={`text-xs truncate ${p.unreadCount > 0 ? 'text-craft-white font-semibold' : 'text-craft-gray-400'}`}>
        {p.lastMessage}
      </p>
    </div>
    {p.unreadCount > 0 && (
      <span className="min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full text-[10px] font-bold bg-craft-orange text-white shrink-0">
        {p.unreadCount}
      </span>
    )}
  </button>
);

const ConversationView = ({ partnership }: { partnership: TrialPartnership }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(
    CHAT_MESSAGES[partnership.id] || []
  );
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'u0',
      text,
      sentAt: new Date().toISOString(),
      isOwn: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  const groupedMessages = messages.reduce<{ date: string; messages: ChatMessage[] }[]>((acc, msg) => {
    const date = formatDate(msg.sentAt);
    const last = acc[acc.length - 1];
    if (last && last.date === date) {
      last.messages.push(msg);
    } else {
      acc.push({ date, messages: [msg] });
    }
    return acc;
  }, []);

  return (
    <div className="flex flex-col h-[calc(100dvh-3.5rem)] animate-fade-in">
      <ConversationHeader partnership={partnership} />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        <ContextBanner partnership={partnership} />

        {groupedMessages.map(({ date, messages: msgs }) => (
          <div key={date}>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-craft-border" />
              <span className="text-[10px] font-semibold text-craft-gray-400">{date}</span>
              <div className="flex-1 h-px bg-craft-border" />
            </div>
            {msgs.map((msg) => (
              <MessageBubble key={msg.id} message={msg} partner={partnership.partner} />
            ))}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-craft-border bg-craft-black/90 backdrop-blur-md">
        <div className="flex items-end gap-2">
          <textarea
            className="craft-input flex-1 resize-none py-2.5 text-sm min-h-[42px] max-h-32"
            placeholder="Type a message..."
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-craft-orange hover:bg-craft-orange-dark text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ConversationHeader = ({ partnership }: { partnership: TrialPartnership }) => (
  <div className="flex items-center gap-3 px-4 py-3 border-b border-craft-border bg-craft-black/90 backdrop-blur-md">
    <button
      onClick={() => navigate('/chat')}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-craft-gray-400 hover:text-craft-white hover:bg-craft-surface transition-all shrink-0"
    >
      <ArrowLeft size={16} />
    </button>
    <Avatar src={partnership.partner.avatarUrl} name={partnership.partner.name} size="sm" online={partnership.partner.isOnline} />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-craft-white">{partnership.partner.name}</p>
      <p className="text-[10px] text-craft-gray-400 flex items-center gap-1">
        {partnership.partner.isLocal ? (
          <><MapPin size={9} className="text-craft-orange" /><span className="text-craft-orange">In venue</span></>
        ) : (
          <><Globe size={9} />{partnership.partner.location}</>
        )}
      </p>
    </div>
    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-craft-gray-400 hover:text-craft-white hover:bg-craft-surface transition-all">
      <MoreVertical size={16} />
    </button>
  </div>
);

const ContextBanner = ({ partnership }: { partnership: TrialPartnership }) => (
  <div className="mx-auto max-w-xs bg-craft-surface2 border border-craft-border rounded-xl p-3 text-center">
    <p className="text-[10px] font-bold text-craft-gray-400 uppercase tracking-wider mb-1">Partnership origin</p>
    <p className="text-xs text-craft-gray-200 leading-relaxed">
      You matched on intent overlap
    </p>
    <div className="mt-2 space-y-1">
      <div className="flex items-start gap-2 text-left text-[10px] text-craft-orange">
        <span className="shrink-0 mt-0.5">→</span>
        <span>{partnership.myIntent}</span>
      </div>
      <div className="flex items-start gap-2 text-left text-[10px] text-craft-teal">
        <span className="shrink-0 mt-0.5">←</span>
        <span>{partnership.partnerIntent}</span>
      </div>
    </div>
  </div>
);

const MessageBubble = ({ message: msg, partner }: { message: ChatMessage; partner: TrialPartnership['partner'] }) => (
  <div className={`flex items-end gap-2 mb-2 ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
    {!msg.isOwn && (
      <Avatar src={partner.avatarUrl} name={partner.name} size="xs" />
    )}
    <div
      className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
        msg.isOwn
          ? 'bg-craft-orange text-white rounded-br-sm'
          : 'bg-craft-surface2 border border-craft-border text-craft-white rounded-bl-sm'
      }`}
    >
      {msg.text}
      <p className={`text-[10px] mt-1 ${msg.isOwn ? 'text-white/60 text-right' : 'text-craft-gray-400'}`}>
        {formatTime(msg.sentAt)}
      </p>
    </div>
  </div>
);
