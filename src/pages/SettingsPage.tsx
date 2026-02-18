import { useState } from 'react';
import {
  ChevronRight, Download, Shield, Bell, Info, User,
  Share, Smartphone, Eye, EyeOff, BellOff, BellRing,
  MessageSquare, Calendar, Check, X
} from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Toggle } from '../components/ui/Toggle';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { navigate } from '../hooks/useRouter';
import { CURRENT_USER } from '../lib/mockData';

export const SettingsPage = () => {
  const { isInstallable, isIOS, promptInstall } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const [visibleToSponsors, setVisibleToSponsors] = useState(true);
  const [visibleToAttendees, setVisibleToAttendees] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(CURRENT_USER.doNotDisturb);

  const [notifyMatches, setNotifyMatches] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifySchedule, setNotifySchedule] = useState(true);

  const handleInstall = () => {
    if (isIOS) {
      setShowIOSGuide(true);
    } else {
      promptInstall();
    }
  };

  return (
    <div className="pb-10 animate-fade-in">
      <div className="px-4 pt-6 space-y-6">

        <ProfileRow />

        {isInstallable && (
          <Section icon={<Smartphone size={16} />} title="App">
            <SettingsRow
              icon={<Download size={16} className="text-craft-orange" />}
              label="Add to Home Screen"
              description="Install CRAFT Connect for quick access"
              onClick={handleInstall}
              accent
            />
            {showIOSGuide && isIOS && (
              <IOSInstallGuide onDismiss={() => setShowIOSGuide(false)} />
            )}
          </Section>
        )}

        <Section icon={<Shield size={16} />} title="Privacy">
          <div className="craft-card divide-y divide-craft-border">
            <div className="p-4">
              <Toggle
                checked={visibleToAttendees}
                onChange={setVisibleToAttendees}
                label="Visible to attendees"
                description="Other participants can find and view your passport"
              />
            </div>
            <div className="p-4">
              <Toggle
                checked={visibleToSponsors}
                onChange={setVisibleToSponsors}
                label="Visible to sponsors"
                description="Brand partners can view your professional profile"
              />
            </div>
            <div className="p-4">
              <Toggle
                checked={doNotDisturb}
                onChange={setDoNotDisturb}
                label="Do Not Disturb"
                description="Pause incoming connection requests while active"
              />
            </div>
          </div>
          <p className="text-xs text-craft-gray-500 mt-2 px-1">
            Your data is only used within the CRAFT Connect platform for event networking purposes.
          </p>
        </Section>

        <Section icon={<Bell size={16} />} title="Notifications">
          <div className="craft-card divide-y divide-craft-border">
            <div className="p-4">
              <Toggle
                checked={notifyMatches}
                onChange={setNotifyMatches}
                label="New matches"
                description="Get notified when Whisper finds a relevant connection"
              />
            </div>
            <div className="p-4">
              <Toggle
                checked={notifyMessages}
                onChange={setNotifyMessages}
                label="Partnership messages"
                description="Alerts for new messages from your partners"
              />
            </div>
            <div className="p-4">
              <Toggle
                checked={notifySchedule}
                onChange={setNotifySchedule}
                label="Session reminders"
                description="15-minute alerts before bookmarked sessions begin"
              />
            </div>
          </div>
        </Section>

        <Section icon={<Info size={16} />} title="About">
          <div className="craft-card divide-y divide-craft-border">
            <AboutRow label="App Version" value="1.0.0" />
            <AboutRow label="Event" value="CRAFT Addis 2026" />
            <AboutRow label="Platform" value="CRAFT Connect" />
            <AboutRow
              label="Privacy Policy"
              value=""
              chevron
            />
            <AboutRow
              label="Terms of Service"
              value=""
              chevron
            />
          </div>
        </Section>

        <footer className="pt-4 pb-2 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold tracking-[0.15em] text-craft-gray-600 uppercase">
              Powered by
            </span>
            <span className="text-[10px] font-bold tracking-[0.1em] text-craft-gray-500 uppercase">
              Circle Technologies
            </span>
          </div>
          <span className="text-[9px] text-craft-gray-600">© 2026 Circle Technologies. All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
};

const ProfileRow = () => (
  <button
    onClick={() => navigate('/passport')}
    className="w-full flex items-center gap-3 p-4 bg-craft-surface border border-craft-border rounded-2xl hover:border-craft-border2 transition-all group"
  >
    <Avatar
      src={CURRENT_USER.avatarUrl}
      name={CURRENT_USER.name}
      size="md"
      online={true}
    />
    <div className="flex-1 text-left">
      <p className="text-sm font-bold text-craft-white">{CURRENT_USER.name}</p>
      <p className="text-xs text-craft-gray-400">{CURRENT_USER.discipline}</p>
    </div>
    <div className="flex items-center gap-1 text-xs text-craft-orange font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
      View Passport
      <ChevronRight size={14} />
    </div>
    <ChevronRight size={16} className="text-craft-gray-600 group-hover:text-craft-gray-400 transition-colors" />
  </button>
);

const Section = ({
  icon, title, children
}: {
  icon: React.ReactNode; title: string; children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <span className="text-craft-orange">{icon}</span>
      <h2 className="text-xs font-bold tracking-[0.12em] text-craft-gray-400 uppercase">{title}</h2>
    </div>
    {children}
  </div>
);

const SettingsRow = ({
  icon, label, description, onClick, chevron = true, accent = false
}: {
  icon: React.ReactNode; label: string; description?: string;
  onClick?: () => void; chevron?: boolean; accent?: boolean;
}) => (
  <button
    onClick={onClick}
    className="w-full craft-card p-4 flex items-center gap-3 hover:border-craft-border2 transition-all group"
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? 'bg-craft-orange/15' : 'bg-craft-surface2'}`}>
      {icon}
    </div>
    <div className="flex-1 text-left">
      <p className={`text-sm font-semibold ${accent ? 'text-craft-orange' : 'text-craft-white'}`}>{label}</p>
      {description && <p className="text-xs text-craft-gray-400 mt-0.5">{description}</p>}
    </div>
    {chevron && <ChevronRight size={16} className="text-craft-gray-600 group-hover:text-craft-gray-400 transition-colors" />}
  </button>
);

const AboutRow = ({
  label, value, chevron = false
}: {
  label: string; value: string; chevron?: boolean;
}) => (
  <div className={`px-4 py-3.5 flex items-center justify-between ${chevron ? 'cursor-pointer hover:bg-craft-surface2/50 transition-colors' : ''}`}>
    <span className="text-sm text-craft-gray-300">{label}</span>
    <div className="flex items-center gap-1">
      {value && <span className="text-sm text-craft-gray-500">{value}</span>}
      {chevron && <ChevronRight size={14} className="text-craft-gray-600" />}
    </div>
  </div>
);

const IOSInstallGuide = ({ onDismiss }: { onDismiss: () => void }) => (
  <div className="mt-3 p-4 bg-craft-surface2 border border-craft-border rounded-xl space-y-3 relative">
    <button
      onClick={onDismiss}
      className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-craft-gray-400 hover:text-craft-white hover:bg-craft-surface transition-all"
    >
      <X size={12} />
    </button>
    <p className="text-xs font-bold text-craft-white uppercase tracking-widest">Add to Home Screen</p>
    <ol className="space-y-2.5">
      {[
        { step: 1, text: 'Tap the Share button at the bottom of Safari', icon: <Share size={13} className="text-craft-orange flex-shrink-0" /> },
        { step: 2, text: 'Scroll down and tap "Add to Home Screen"', icon: <Smartphone size={13} className="text-craft-orange flex-shrink-0" /> },
        { step: 3, text: 'Tap "Add" in the top right corner', icon: <Check size={13} className="text-craft-orange flex-shrink-0" /> },
      ].map(({ step, text, icon }) => (
        <li key={step} className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-craft-orange/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-[9px] font-bold text-craft-orange">{step}</span>
          </div>
          <div className="flex items-start gap-2 flex-1">
            {icon}
            <p className="text-xs text-craft-gray-300 leading-relaxed">{text}</p>
          </div>
        </li>
      ))}
    </ol>
  </div>
);
