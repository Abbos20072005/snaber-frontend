type NotificationType = 'chat' | 'company' | 'order' | 'other' | 'product';

interface Notification {
  created_at: string;
  id: number;
  is_read: boolean;
  message: string;
  notification_type: NotificationType;
  redirect_id: number | string;
  title: string;
  user: {
    id: number;
    full_name: string;
    email: string;
  };
}

interface UnreadNotificationCount {
  unread_count: number;
}

type NotificationsResponse = Pagination<Notification>;
