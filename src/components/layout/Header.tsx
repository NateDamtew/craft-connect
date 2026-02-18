import { Bell, Settings, Download } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { navigate } from '../../hooks/useRouter';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { CURRENT_USER, NOTIFICATIONS } from '../../lib/mockData';

interface HeaderProps {
  activeRoute: string;
}

const CraftLogo = () => (
  <button
    onClick={() => navigate('/')}
    className="flex flex-col items-start leading-none hover:opacity-80 transition-opacity"
  >
    <div className="flex items-baseline gap-0.5">
      <span className="text-lg font-bold tracking-tight text-craft-white">CRAFT</span>
      <span className="text-craft-orange text-lg font-bold">✦</span>
    </div>
    <span className="text-[9px] font-semibold tracking-[0.2em] text-craft-gray-400 uppercase -mt-0.5">
      CONNECT
    </span>
  </button>
);

export const Header = ({ activeRoute }: HeaderProps) => {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.isRead).length;
  const { isInstallable, isIOS, promptInstall } = usePWAInstall();

  const titles: Record<string, string> = {
    '/passport': 'Digital Passport',
    '/discover': 'Whisper Feed',
    '/chat': 'Partnerships',
    '/schedule': 'Schedule',
    '/stream': 'Live Stream',
    '/notifications': 'Notifications',
    '/settings': 'Settings',
  };

  const isHome = activeRoute === '/';

  const handleInstallClick = () => {
    if (isIOS) {
      navigate('/settings');
    } else {
      promptInstall();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-craft-black/90 backdrop-blur-md border-b border-craft-border flex items-center px-4 gap-3">
      {isHome ? (
        <CraftLogo />
      ) : (
        <div className="flex items-center gap-3 flex-1">
          <CraftLogo />
          <div className="w-px h-5 bg-craft-border" />
          <span className="text-sm font-semibold text-craft-white truncate">
            {titles[activeRoute] || ''}
          </span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => navigate('/notifications')}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl text-craft-gray-400 hover:text-craft-white hover:bg-craft-surface transition-all"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-craft-orange" />
          )}
        </button>

        {isInstallable && (
          <button
            onClick={handleInstallClick}
            title="Add to Home Screen"
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-craft-orange hover:text-craft-orange hover:bg-craft-orange/10 transition-all"
          >
            <Download size={17} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-craft-orange animate-pulse" />
          </button>
        )}

        <button
          onClick={() => navigate('/settings')}
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
            activeRoute === '/settings'
              ? 'text-craft-orange bg-craft-orange/10'
              : 'text-craft-gray-400 hover:text-craft-white hover:bg-craft-surface'
          }`}
        >
          <Settings size={18} />
        </button>

        <button
          onClick={() => navigate('/passport')}
          className="hover:opacity-80 transition-opacity"
        >
          <Avatar
            src={CURRENT_USER.avatarUrl}
            name={CURRENT_USER.name}
            size="sm"
            online={true}
          />
        </button>
      </div>
    </header>
  );
};
