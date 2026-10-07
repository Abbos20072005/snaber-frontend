interface ChatFile {
  id: string;
  link: string;
  name: string;
  type: 'Document' | 'Image' | 'Video';
}

interface ChatMessage {
  author: 'me' | 'other';
  content: string;
  files: ChatFile[];
  id: string;
  sentAt: string;
}

interface ChatThread {
  id: string;
  isOnline: boolean;
  lastMessage: string;
  messages: ChatMessage[];
  title: string;
  unreadCount: number;
  updatedAt: string;
}
