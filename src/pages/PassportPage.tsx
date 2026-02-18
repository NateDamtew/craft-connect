import { useState } from 'react';
import { Share2, Edit3, MapPin, ExternalLink, Globe, Dribbble, Instagram, Github, Linkedin, Youtube, Check, Settings } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { StampBadge } from '../components/shared/StampBadge';
import { IntentBadge } from '../components/shared/IntentBadge';
import { Modal } from '../components/ui/Modal';
import { navigate } from '../hooks/useRouter';
import { CURRENT_USER } from '../lib/mockData';
import type { PortfolioLink } from '../types';

const linkIcons: Record<PortfolioLink['icon'], typeof Globe> = {
  website: Globe, dribbble: Dribbble, instagram: Instagram,
  github: Github, linkedin: Linkedin, youtube: Youtube, behance: Globe,
};

export const PassportPage = () => {
  const [intent, setIntent] = useState(CURRENT_USER.currentIntent);
  const [showEdit, setShowEdit] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/#/passport`)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div className="pb-8 animate-fade-in">
      <PassportHero
        intent={intent}
        onIntentUpdate={setIntent}
        onShare={handleShare}
        copied={copied}
        onEdit={() => setShowEdit(true)}
      />
      <div className="px-4 space-y-5 mt-5">
        <BioSection />
        <PortfolioSection />
        <StampsSection />
        <QRSection />
        <PrivacyLink />
      </div>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Passport">
        <EditForm onClose={() => setShowEdit(false)} />
      </Modal>
    </div>
  );
};

const PassportHero = ({ intent, onIntentUpdate, onShare, copied, onEdit }: {
  intent: string; onIntentUpdate: (v: string) => void;
  onShare: () => void; copied: boolean; onEdit: () => void;
}) => (
  <div className="relative">
    <div className="h-28 bg-gradient-to-br from-craft-orange/20 via-craft-surface to-craft-black" />
    <div className="px-4 -mt-14">
      <div className="flex items-end justify-between mb-4">
        <div className="ring-4 ring-craft-black rounded-full">
          <Avatar
            src={CURRENT_USER.avatarUrl}
            name={CURRENT_USER.name}
            size="2xl"
            online={true}
          />
        </div>
        <div className="flex gap-2 pb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            leftIcon={copied ? <Check size={14} /> : <Share2 size={14} />}
          >
            {copied ? 'Copied!' : 'Share'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onEdit}
            leftIcon={<Edit3 size={14} />}
          >
            Edit
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-black text-craft-white">{CURRENT_USER.name}</h1>
          <div className="w-1.5 h-1.5 rounded-full bg-craft-green" title="Online" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge-discipline">{CURRENT_USER.discipline}</span>
          <span className="flex items-center gap-1 text-xs text-craft-gray-400">
            <MapPin size={11} />
            {CURRENT_USER.location}
          </span>
          <Badge variant="teal" size="sm" dot>Local Attendee</Badge>
        </div>
      </div>

      <IntentBadge intent={intent} editable onUpdate={onIntentUpdate} />
    </div>
  </div>
);

const BioSection = () => (
  <div>
    <p className="craft-label mb-2">About</p>
    <p className="text-sm text-craft-gray-200 leading-relaxed">{CURRENT_USER.bio}</p>
  </div>
);

const PortfolioSection = () => (
  <div>
    <p className="craft-label mb-2">Portfolio & Links</p>
    <div className="flex flex-wrap gap-2">
      {CURRENT_USER.portfolioLinks.map((link) => {
        const Icon = linkIcons[link.icon];
        return (
          <a
            key={link.label}
            href={link.url}
            className="flex items-center gap-2 px-3 py-2 bg-craft-surface2 border border-craft-border rounded-lg text-sm font-semibold text-craft-gray-200 hover:text-craft-white hover:border-craft-border2 transition-all"
          >
            <Icon size={14} className="text-craft-orange" />
            {link.label}
            <ExternalLink size={10} className="text-craft-gray-400" />
          </a>
        );
      })}
    </div>
  </div>
);

const StampsSection = () => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <p className="craft-label">Stamps Collected</p>
      <span className="text-xs text-craft-gray-400">{CURRENT_USER.stamps.length} total</span>
    </div>
    <div className="space-y-2">
      {CURRENT_USER.stamps.map((stamp) => (
        <StampBadge key={stamp.id} stamp={stamp} size="md" />
      ))}
    </div>
    {CURRENT_USER.stamps.length === 0 && (
      <div className="craft-card p-6 text-center">
        <p className="text-sm text-craft-gray-400">No stamps yet. Attend sessions and complete challenges to earn them.</p>
      </div>
    )}
  </div>
);

const QRSection = () => (
  <div>
    <p className="craft-label mb-3">QR Entry Code</p>
    <div className="craft-card p-5 flex flex-col items-center gap-4">
      <div className="w-40 h-40 bg-white rounded-xl p-3 flex items-center justify-center">
        <QRPlaceholder />
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-craft-white">Scan to connect</p>
        <p className="text-xs text-craft-gray-400 mt-0.5 font-mono">CC-{CURRENT_USER.id.toUpperCase()}-ADDIS26</p>
      </div>
    </div>
  </div>
);

const QRPlaceholder = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full" fill="black">
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((row) =>
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((col) => {
        const isCorner =
          (row < 4 && col < 4) || (row < 4 && col > 7) || (row > 7 && col < 4);
        const shouldFill =
          isCorner ||
          ((row === 0 || row === 11 || col === 0 || col === 11 ||
            (row >= 4 && row <= 7 && col >= 4 && col <= 7)) &&
            ((row + col) % 3 !== 0));
        return shouldFill ? (
          <rect key={`${row}-${col}`} x={row * 10} y={col * 10} width={9} height={9} rx={1} />
        ) : null;
      })
    )}
    <rect x={10} y={10} width={30} height={30} fill="none" stroke="black" strokeWidth={8} rx={2} />
    <rect x={80} y={10} width={30} height={30} fill="none" stroke="black" strokeWidth={8} rx={2} />
    <rect x={10} y={80} width={30} height={30} fill="none" stroke="black" strokeWidth={8} rx={2} />
    <rect x={22} y={22} width={8} height={8} rx={1} />
    <rect x={92} y={22} width={8} height={8} rx={1} />
    <rect x={22} y={92} width={8} height={8} rx={1} />
  </svg>
);

const PrivacyLink = () => (
  <button
    onClick={() => navigate('/settings')}
    className="w-full craft-card p-4 flex items-center gap-3 hover:border-craft-border2 transition-all group"
  >
    <div className="w-9 h-9 rounded-xl bg-craft-surface2 flex items-center justify-center">
      <Settings size={16} className="text-craft-gray-400" />
    </div>
    <div className="flex-1 text-left">
      <p className="text-sm font-semibold text-craft-white">Privacy & Settings</p>
      <p className="text-xs text-craft-gray-400 mt-0.5">Manage visibility, notifications and more</p>
    </div>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-craft-gray-600 group-hover:text-craft-gray-400 transition-colors">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </button>
);

const EditForm = ({ onClose }: { onClose: () => void }) => (
  <div className="space-y-4">
    <div>
      <label className="craft-label block mb-1.5">Display Name</label>
      <input className="craft-input" defaultValue={CURRENT_USER.name} />
    </div>
    <div>
      <label className="craft-label block mb-1.5">Bio</label>
      <textarea className="craft-input resize-none" rows={3} defaultValue={CURRENT_USER.bio} />
    </div>
    <div className="flex gap-2 pt-2">
      <Button variant="ghost" fullWidth onClick={onClose}>Cancel</Button>
      <Button fullWidth onClick={onClose}>Save Changes</Button>
    </div>
  </div>
);
