import { useState } from 'react';
import { useRouter } from './hooks/useRouter';
import { AppShell } from './components/layout/AppShell';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { PassportPage } from './pages/PassportPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ChatPage } from './pages/ChatPage';
import { SchedulePage } from './pages/SchedulePage';
import { StreamPage } from './pages/StreamPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  const { route, params } = useRouter();
  const [onboarded, setOnboarded] = useState(
    () => !!localStorage.getItem('craft_onboarded')
  );

  if (!onboarded) {
    return <OnboardingPage onComplete={() => setOnboarded(true)} />;
  }

  const renderPage = () => {
    switch (route) {
      case '/passport': return <PassportPage />;
      case '/discover': return <DiscoverPage />;
      case '/chat': return <ChatPage partnershipId={params.id} />;
      case '/schedule': return <SchedulePage />;
      case '/stream': return <StreamPage />;
      case '/notifications': return <NotificationsPage />;
      case '/settings': return <SettingsPage />;
      default: return <HomePage />;
    }
  };

  const isConversationView = route === '/chat' && !!params.id;

  return (
    <AppShell activeRoute={route} hideNav={isConversationView}>
      {renderPage()}
    </AppShell>
  );
}

export default App;
