import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { BellIcon, CheckCheckIcon, TrashIcon } from 'lucide-react';

import { useAuthed } from '@/modules/auth';
import {
  getNotificationLink,
  NOTIFICATIONS_QUERY_KEYS,
  notificationTypeColorMap,
  notificationTypeLabelMap
} from '@/modules/notifications';
import { deleteNotification } from '@/shared/api';
import { useConfirmAction } from '@/shared/hooks/use-confirm-action.ts';
import { formatLocaleDate } from '@/shared/lib/format';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog.tsx';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/shared/ui/context-menu';

interface Props {
  isMarkingAsRead?: boolean;
  notification: Notification;
  onMarkAsRead?: (notification: Notification) => void;
}

export const NotificationMessageItem = ({ isMarkingAsRead, notification, onMarkAsRead }: Props) => {
  const { t } = useLingui();
  const { user } = useAuthed();
  const sender = notification.user.full_name || notification.user.email;
  const title = notification.title;
  const description = notification.message;
  const isRead = notification.is_read;
  const color = notificationTypeColorMap[notification.notification_type];
  const redirectId = notification.redirect_id;

  const { loading, open, onOpenChange, onConfirm } = useConfirmAction({
    mutationFn: () => deleteNotification({ id: notification.id }),
    successMessage: t`Notification deleted`,
    invalidatesQuery: NOTIFICATIONS_QUERY_KEYS.base()
  });

  const to =
    redirectId && getNotificationLink(notification.notification_type, redirectId, user.role);

  const content = (
    <article className='rounded-xl border p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'>
      <div className='flex flex-col gap-3'>
        <div className='flex items-start gap-3'>
          <Avatar size='lg'>
            <AvatarFallback>{sender.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='min-w-0 flex-1'>
            <div className='mb-1 flex flex-wrap items-center gap-2'>
              <h3 className='font-heading text-foreground text-sm font-semibold'>{title}</h3>
              {!isRead && <span className='bg-primary size-2 rounded-full' />}
            </div>
            <p className='text-muted-foreground text-sm'>{description}</p>
          </div>
          <span className='text-muted-foreground text-xs'>
            {formatLocaleDate(notification.created_at, 'PP HH:mm')}
          </span>
        </div>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <Badge style={{ color, backgroundColor: `${color}20` }}>
              {t(notificationTypeLabelMap[notification.notification_type])}
            </Badge>
            <Badge variant='ghost'>
              <BellIcon className='size-3.5' />
              {sender}
            </Badge>
          </div>
          <div className='flex items-center gap-1'>
            {!isRead && (
              <Button
                aria-label={t`Mark notification as read`}
                disabled={isMarkingAsRead}
                size='xs'
                type='button'
                variant='ghost'
                onClick={() => onMarkAsRead?.(notification)}
              >
                <CheckCheckIcon className='size-3.5' />
                {t`Mark as read`}
              </Button>
            )}
            <Button
              disabled={loading}
              size='icon-xs'
              type='button'
              variant='destructive'
              onClick={() => onOpenChange(true)}
            >
              <TrashIcon className='size-3.5' />
            </Button>
          </div>
        </div>
      </div>
      <ConfirmDialog
        title={notification.title}
        description={t`Are you sure to delete this notification.`}
        loading={loading}
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
        open={open}
      />
    </article>
  );

  return (
    <ContextMenu>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => onMarkAsRead?.(notification)}>
          <CheckCheckIcon className='size-3.5' />
          {t`Mark as read`}
        </ContextMenuItem>
        <ContextMenuItem variant='destructive' onClick={() => onOpenChange(true)}>
          <TrashIcon />
          {t`Delete`}
        </ContextMenuItem>
      </ContextMenuContent>
      <ContextMenuTrigger
        render={
          to ? (
            <Link className='block w-full' to={to as any}>
              {content}
            </Link>
          ) : (
            <div className='block w-full'>{content}</div>
          )
        }
      />
    </ContextMenu>
  );
};
