import { useLingui } from '@lingui/react/macro';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';

import {
  getNotificationsInfiniteQueryOptions,
  getUnreadNotificationCountQueryOptions,
  NotificationEmpty,
  NotificationPreview,
  NOTIFICATIONS_QUERY_KEYS
} from '@/modules/notifications';
import { deleteNotifications, postReadAllNotifications } from '@/shared/api';
import { useConfirmAction } from '@/shared/hooks/use-confirm-action';
import { Button } from '@/shared/ui/button';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { Separator } from '@/shared/ui/separator';
import { Spinner } from '@/shared/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export const NotificationCard = () => {
  const { t } = useLingui();
  const queryClient = useQueryClient();
  const notificationInfiniteQuery = useInfiniteQuery(getNotificationsInfiniteQueryOptions());
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = notificationInfiniteQuery;

  const unreadCountQuery = useQuery(getUnreadNotificationCountQueryOptions());

  const markAllReadMutation = useMutation({
    mutationFn: postReadAllNotifications,
    onSuccess: () => {
      toast.success(t`Successfully updated.`);
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.base() });
    },
    onError: () => toast.error(t`Failed to update notifications.`)
  });

  const notifications = useMemo(
    () => notificationInfiniteQuery.data?.pages.flatMap((page) => page.data.results || []) ?? [],
    [notificationInfiniteQuery.data?.pages]
  );
  const unreadNotifications = notifications.filter((notification) => !notification.is_read);
  const unreadCount = unreadCountQuery.data?.data.unread_count ?? 0;
  const total = useMemo(
    () => notificationInfiniteQuery.data?.pages[0]?.data.count || 0,
    [notificationInfiniteQuery.data?.pages]
  );

  const { loading, open, onOpenChange, onConfirm } = useConfirmAction({
    mutationFn: () => deleteNotifications(),
    successMessage: t`Notifications deleted`,
    invalidatesQuery: NOTIFICATIONS_QUERY_KEYS.base()
  });

  const { ref, inView } = useInView({ rootMargin: '120px' });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  return (
    <div className='space-y-4'>
      <div>
        <p className='font-medium tracking-wide'>{t`Notifications`}</p>
        <p className='text-muted-foreground text-xs'>
          {unreadCount} {t`unread`} - {total} {t`total messages`}
        </p>
      </div>
      <Separator />
      <Tabs defaultValue='all'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <TabsList className='h-8'>
            <TabsTrigger className='h-6 text-xs' value='all'>
              {t`All`} ({total})
            </TabsTrigger>
            <TabsTrigger className='h-6 text-xs' value='unread'>
              {t`Unread`} ({unreadCount})
            </TabsTrigger>
          </TabsList>
          <Button
            className='text-xs font-medium'
            disabled={!unreadCount || markAllReadMutation.isPending}
            size='xs'
            type='button'
            variant='outline'
            onClick={() => markAllReadMutation.mutate()}
          >
            {t`Read all`}
          </Button>
          <Button
            disabled={!unreadCount || loading}
            size='sm'
            type='button'
            variant='destructive'
            onClick={() => onOpenChange(true)}
          >
            {t`Delete all`}
          </Button>
        </div>
        <TabsContent className='mt-3 space-y-2' value='all'>
          {notificationInfiniteQuery.isLoading ? (
            <p className='text-muted-foreground py-4 text-center text-xs'>{t`Loading...`}</p>
          ) : notifications.length ? (
            <div className='no-scrollbar flex h-100 flex-col gap-2 overflow-y-auto'>
              {notifications.map((notification) => (
                <NotificationPreview key={notification.id} notification={notification} />
              ))}
              {hasNextPage ? (
                <div ref={ref} className='flex min-h-8 shrink-0 items-center justify-center py-2'>
                  {isFetchingNextPage ? <Spinner className='size-4' /> : null}
                </div>
              ) : null}
            </div>
          ) : (
            <NotificationEmpty />
          )}
        </TabsContent>
        <TabsContent className='mt-3 space-y-2' value='unread'>
          {notificationInfiniteQuery.isLoading ? (
            <p className='text-muted-foreground py-4 text-center text-xs'>{t`Loading...`}</p>
          ) : unreadNotifications.length ? (
            unreadNotifications.map((notification) => (
              <NotificationPreview key={notification.id} notification={notification} />
            ))
          ) : (
            <NotificationEmpty />
          )}
        </TabsContent>
      </Tabs>
      <ConfirmDialog
        title={t`Delete notifications`}
        description={t`Are you sure to delete all notifications.`}
        loading={loading}
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
        open={open}
      />
    </div>
  );
};
