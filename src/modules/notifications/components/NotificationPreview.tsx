import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { XIcon } from 'lucide-react';

import { useAuthed } from '@/modules/auth';
import {
  getNotificationLink,
  NOTIFICATIONS_QUERY_KEYS,
  notificationTypeColorMap,
  notificationTypeLabelMap
} from '@/modules/notifications';
import { deleteNotification } from '@/shared/api';
import { useConfirmAction } from '@/shared/hooks/use-confirm-action';
import { formatLocaleDate } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';

interface Props {
  notification: Notification;
}

export const NotificationPreview = ({ notification }: Props) => {
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
    <>
      <div
        className={cn(
          'hover:bg-muted/50 rounded-lg border px-2.5 py-2 transition-colors',
          !isRead && 'border-primary/30 bg-primary/5'
        )}
      >
        <div className='flex items-start gap-2'>
          <Avatar size='sm'>
            <AvatarFallback>{sender.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='min-w-0 flex-1'>
            <div className='flex items-center gap-1.5'>
              <p className='truncate text-xs font-medium'>{title}</p>
              {!isRead && <span className='bg-primary size-1.5 rounded-full' />}
            </div>
            <p className='text-muted-foreground mt-0.5 line-clamp-2 text-[11px]'>{description}</p>
            <div className='mt-1.5 flex items-center justify-between gap-2'>
              <Badge
                className='h-4 px-1.5 text-[10px]'
                style={{ color, backgroundColor: `${color}20` }}
              >
                {t(notificationTypeLabelMap[notification.notification_type])}
              </Badge>
              <span className='text-muted-foreground text-[10px]'>
                {formatLocaleDate(notification.created_at, 'PP HH:mm')}
              </span>
            </div>
          </div>
          <Button
            size='icon-xs'
            variant='destructive'
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onOpenChange(true);
            }}
          >
            <XIcon />
          </Button>
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
    </>
  );

  if (!to) {
    return <>{content}</>;
  }

  return (
    <Link className='block w-full' to={to}>
      {content}
    </Link>
  );
};
