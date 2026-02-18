import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: ReactNode;
  activeRoute: string;
  hideNav?: boolean;
}

export const AppShell = ({ children, activeRoute, hideNav = false }: AppShellProps) => {
  return (
    <div className="min-h-dvh bg-craft-black">
      <Header activeRoute={activeRoute} />
      <main className="pt-14 pb-20 min-h-dvh">
        <div className="max-w-screen-sm mx-auto w-full">
          {children}
        </div>
      </main>
      {!hideNav && <BottomNav activeRoute={activeRoute} />}
    </div>
  );
};
