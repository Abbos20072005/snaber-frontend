import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { USERS_QUERY_KEYS } from '@/modules/users';
import { patchUser } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

import type { UserFormSchema } from './UserForm';

import { UserForm } from './UserForm';

interface Props {
  defaultValues?: Partial<User>;
  disableRole?: UserRole;
  editValues?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserFormDialog = ({
  open,
  onOpenChange,
  editValues,
  defaultValues,
  disableRole
}: Props) => {
  const { t } = useLingui();

  const patchUserMutation = useMutation({
    mutationFn: patchUser,
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Successfully updated.`);
    },
    onError: () => {
      toast.error(t`Failed to update user.`);
    },
    meta: {
      invalidatesQuery: [...USERS_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  const onSubmitForm = (values: UserFormSchema) => {
    const data: UserFormSchema = {
      ...values,
      role: disableRole ?? values.role
    };

    patchUserMutation.mutate({
      data,
      id: editValues!.id
    });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t`Update user`}</DialogTitle>
        </DialogHeader>
        <UserForm
          defaultValues={{
            ...(editValues ?? defaultValues),
            role: disableRole ?? editValues?.role ?? defaultValues?.role
          }}
          onSubmit={onSubmitForm}
          roleDisabled={!!disableRole}
        />
        <Button
          className='ml-auto w-fit'
          type='submit'
          form='user-form'
          loading={patchUserMutation.isPending}
        >
          {t`Save changes`}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
