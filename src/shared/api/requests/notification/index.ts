import { api } from '@/shared/api';

export interface GetNotificationsRequest {
  params?: Partial<{
    page: number;
    page_size: number;
  }>;
}

export const getNotifications = (request?: GetNotificationsRequest) =>
  api.get<NotificationsResponse>('notifications/', request);

export const getUnreadNotificationCount = () =>
  api.get<UnreadNotificationCount>('notifications/unread-count/');

export const postReadAllNotifications = () => api.post('notifications/mark-all-read/');

interface PostMarkReadNotificationRequest {
  id: number;
}

export const postMarkReadNotification = ({ id }: PostMarkReadNotificationRequest) =>
  api.post(`notifications/${id}/mark-read/`);

export const deleteNotifications = () => api.delete('notifications/');

interface DeleteNotificationRequest {
  id: number;
}

export const deleteNotification = ({ id }: DeleteNotificationRequest) =>
  api.delete(`notifications/${id}/`);
