import { useLingui } from '@lingui/react/macro';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SearchIcon, TrashIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';

import {
  getNotificationsInfiniteQueryOptions,
  getUnreadNotificationCountQueryOptions,
  NotificationEmpty,
  NotificationMessageItem,
  NOTIFICATIONS_QUERY_KEYS
} from '@/modules/notifications';
import {
  deleteNotifications,
  postMarkReadNotification,
  postReadAllNotifications
} from '@/shared/api';
import { useConfirmAction } from '@/shared/hooks/use-confirm-action.ts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog.tsx';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/shared/ui/input-group';
import { Spinner } from '@/shared/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

type NotificationTab = 'all' | 'system' | 'unread';

interface Props {
  className?: string;
  withPageContent?: boolean;
}

const filterNotifications = (
  notifications: Notification[],
  search: string,
  activeTab: NotificationTab
) => {
  const normalizedSearch = search.trim().toLowerCase();

  return notifications.filter((notification) => {
    const matchesSearch =
      !normalizedSearch ||
      notification.title.toLowerCase().includes(normalizedSearch) ||
      notification.message.toLowerCase().includes(normalizedSearch) ||
      notification.user.full_name.toLowerCase().includes(normalizedSearch) ||
      notification.user.email.toLowerCase().includes(normalizedSearch);

    if (!matchesSearch) return false;
    if (activeTab === 'unread') return !notification.is_read;
    if (activeTab === 'system') return notification.notification_type === 'other';

    return true;
  });
};

export const NotificationList = ({ className }: Props) => {
  const { t } = useLingui();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');
  const { inView, ref: loadMoreRef } = useInView({ rootMargin: '240px' });

  const notificationsQuery = useInfiniteQuery(getNotificationsInfiniteQueryOptions());
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = notificationsQuery;
  const unreadCountQuery = useQuery(getUnreadNotificationCountQueryOptions());

  const markAllReadMutation = useMutation({
    mutationFn: postReadAllNotifications,
    onSuccess: () => {
      toast.success(t`Successfully updated.`);
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.base() });
    },
    onError: () => toast.error(t`Failed to update notifications.`)
  });

  const markReadMutation = useMutation({
    mutationFn: postMarkReadNotification,
    onSuccess: () => {
      toast.success(t`Successfully updated.`);
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.base() });
    },
    onError: () => toast.error(t`Failed to update notifications.`)
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  const notifications = notificationsQuery.data?.pages.flatMap((page) => page.data.results) ?? [];
  const total = notificationsQuery.data?.pages[0]?.data.count ?? 0;
  const hasNotifications = total > 0;
  const unreadCount = unreadCountQuery.data?.data.unread_count ?? 0;
  const systemCount = notifications.filter(
    (notification) => notification.notification_type === 'other'
  ).length;

  const filteredNotifications = useMemo(
    () => filterNotifications(notifications, search, activeTab),
    [activeTab, notifications, search]
  );

  const { loading, open, onOpenChange, onConfirm } = useConfirmAction({
    mutationFn: () => deleteNotifications(),
    successMessage: t`Notifications deleted`,
    invalidatesQuery: NOTIFICATIONS_QUERY_KEYS.base()
  });

  return (
    <section className={className}>
      <div className='from-primary/8 to-background flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-linear-to-r p-4'>
        <div className='space-y-1'>
          <p className='font-heading text-lg leading-none font-semibold'>{t`Notifications`}</p>
          <p className='text-muted-foreground text-sm'>
            {total} {t`total messages`} - {unreadCount} {t`unread`}
          </p>
        </div>
        {hasNotifications ? (
          <div className='flex flex-col gap-2 md:flex-row md:items-center'>
            <Badge variant='secondary'>
              {unreadCount} {t`Unread`}
            </Badge>
            <Button
              disabled={!unreadCount || markAllReadMutation.isPending}
              size='sm'
              type='button'
              variant='outline'
              onClick={() => markAllReadMutation.mutate()}
            >
              {t`Mark all as read`}
            </Button>
            <Button
              disabled={loading}
              size='sm'
              type='button'
              variant='destructive'
              onClick={() => onOpenChange(true)}
            >
              <TrashIcon className='size-3.5' />
              {t`Delete all`}
            </Button>
          </div>
        ) : null}
      </div>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as NotificationTab)}>
        <div className='flex flex-col gap-3 pt-3 md:flex-row'>
          <InputGroup className='w-full md:max-w-sm'>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder={t`Search notifications`}
            />
          </InputGroup>
          <TabsList className='w-full' variant='line'>
            <TabsTrigger value='all'>
              {t`All`} ({total})
            </TabsTrigger>
            <TabsTrigger value='unread'>
              {t`Unread`} ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value='system'>
              {t`System`} ({systemCount})
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent className='space-y-3 pt-3' value={activeTab}>
          {notificationsQuery.isLoading ? (
            <p className='text-muted-foreground rounded-xl border p-6 text-center text-sm'>
              {t`Loading...`}
            </p>
          ) : filteredNotifications.length ? (
            filteredNotifications.map((notification) => (
              <NotificationMessageItem
                key={notification.id}
                isMarkingAsRead={
                  markReadMutation.isPending && markReadMutation.variables?.id === notification.id
                }
                notification={notification}
                onMarkAsRead={(item) => markReadMutation.mutate({ id: item.id })}
              />
            ))
          ) : (
            <NotificationEmpty />
          )}
        </TabsContent>
      </Tabs>
      <div ref={loadMoreRef} className='flex justify-center py-3' />
      {isFetchingNextPage && <Spinner className='size-4' />}
      <ConfirmDialog
        title={t`Delete notifications`}
        description={t`Are you sure to delete all notifications.`}
        loading={loading}
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
        open={open}
      />
    </section>
  );
};
