import { Home, Compass, MessageCircle, Calendar, Radio } from 'lucide-react';
import { navigate } from '../../hooks/useRouter';
import { PARTNERSHIPS } from '../../lib/mockData';

interface BottomNavProps {
  activeRoute: string;
}

const tabs = [
  { route: '/', icon: Home, label: 'Home' },
  { route: '/discover', icon: Compass, label: 'Discover' },
  { route: '/stream', icon: Radio, label: 'Live' },
  { route: '/schedule', icon: Calendar, label: 'Schedule' },
  { route: '/chat', icon: MessageCircle, label: 'Chat' },
];

export const BottomNav = ({ activeRoute }: BottomNavProps) => {
  const totalUnread = PARTNERSHIPS.reduce((acc, p) => acc + p.unreadCount, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-craft-black/90 backdrop-blur-md border-t border-craft-border safe-bottom">
      <div className="flex items-stretch max-w-screen-sm mx-auto">
        {tabs.map(({ route, icon: Icon, label }) => {
          const isActive = activeRoute === route || (route === '/chat' && activeRoute === '/chat');
          const hasBadge = route === '/chat' && totalUnread > 0;

          return (
            <button
              key={route}
              onClick={() => navigate(route)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-all duration-200 ${
                isActive ? 'text-craft-orange' : 'text-craft-gray-600 hover:text-craft-gray-400'
              }`}
            >
              <div className="relative">
                <Icon
                  size={route === '/stream' ? 20 : 20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={route === '/stream' && isActive ? 'drop-shadow-[0_0_6px_rgba(242,100,25,0.7)]' : ''}
                />
                {hasBadge && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-0.5 flex items-center justify-center rounded-full text-[8px] font-bold bg-craft-orange text-white">
                    {totalUnread}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold ${isActive ? 'text-craft-orange' : ''}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
