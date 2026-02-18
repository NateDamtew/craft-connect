import { useState, useEffect, useCallback } from 'react';
import type { AppRoute } from '../types';

const parseRoute = (hash: string): { route: AppRoute; params: Record<string, string> } => {
  const path = hash.replace('#', '') || '/';
  const parts = path.split('/').filter(Boolean);

  if (parts.length === 0) return { route: '/', params: {} };
  if (parts[0] === 'passport') return { route: '/passport', params: {} };
  if (parts[0] === 'discover') return { route: '/discover', params: {} };
  if (parts[0] === 'chat') return { route: '/chat', params: parts[1] ? { id: parts[1] } : {} };
  if (parts[0] === 'schedule') return { route: '/schedule', params: {} };
  if (parts[0] === 'stream') return { route: '/stream', params: {} };
  if (parts[0] === 'notifications') return { route: '/notifications', params: {} };
  if (parts[0] === 'settings') return { route: '/settings', params: {} };

  return { route: '/', params: {} };
};

export const useRouter = () => {
  const [{ route, params }, setLocation] = useState(() =>
    parseRoute(window.location.hash)
  );

  useEffect(() => {
    const onHashChange = () => setLocation(parseRoute(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
  }, []);

  return { route, params, navigate };
};

export const navigate = (path: string) => {
  window.location.hash = path;
};
