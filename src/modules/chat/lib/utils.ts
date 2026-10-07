import { ReadyState } from 'react-use-websocket';

import { COOKIES } from '@/shared/constants';
import { isomorphicCookie } from '@/shared/lib/isomorphic-cookie.ts';

export const getChatWebSocketUrl = (conversationId: number | null) => {
  if (!conversationId || typeof document === 'undefined') return null;

  const token = isomorphicCookie.get(COOKIES.ACCESS_TOKEN);

  if (!token) return null;

  return `wss://api-dev.market.adli.uz/ws/chat/${conversationId}/?token=${encodeURIComponent(token)}`;
};

export const getConnectionLabel = (readyState: ReadyState) => {
  if (readyState === ReadyState.OPEN) return 'Online';
  if (readyState === ReadyState.CONNECTING) return 'Connecting';
  if (readyState === ReadyState.CLOSING) return 'Disconnecting';

  return 'Offline';
};
