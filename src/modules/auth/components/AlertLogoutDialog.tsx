import type React from 'react';

import { useLingui } from '@lingui/react/macro';

import { useAuth } from '@/modules/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/shared/ui/alert-dialog';

interface Props {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AlertLogoutDialog = ({ children, open, onOpenChange }: Props) => {
  const { onLogout } = useAuth();
  const { t } = useLingui();

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogTrigger render={<div>{children}</div>}></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t`Are you sure to logout?`}</AlertDialogTitle>
          <AlertDialogDescription>
            {t`This action cannot be undone. This will permanently delete your account and remove your data from our servers.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            onClick={onLogout}
          >{t`Logout`}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
